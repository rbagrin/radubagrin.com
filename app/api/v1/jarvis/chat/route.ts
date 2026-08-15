import { NextResponse } from "next/server";
import { authenticate } from "@/lib/auth";
import { db } from "@/lib/db";
import { getActiveToolsForUser, executeToolCall, ToolCallResult, RegisteredSkill } from "@/lib/skills";

async function getAuthUser(request: Request) {
  const auth = await authenticate(request);
  if (auth) return auth;

  // Local dev mode fallback
  if (process.env.NODE_ENV === "development") {
    let devUser = await db.user.findFirst({ where: { email: "dev@localhost" } });
    if (!devUser) {
      devUser = await db.user.create({
        data: { email: "dev@localhost", name: "Developer" },
      });
    }
    return { userId: devUser.id, email: devUser.email };
  }

  return null;
}

export interface ChatMessage {
  id?: string;
  role: "user" | "assistant" | "system";
  content: string;
  toolCalls?: ToolCallResult[];
  pendingConfirmation?: {
    toolName: string;
    args: Record<string, any>;
  };
}

/**
 * POST /api/v1/jarvis/chat
 * Primary conversational endpoint for Jarvis with MCP tool execution.
 */
export async function POST(request: Request) {
  const user = await getAuthUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => null);
    if (!body || !Array.isArray(body.messages) || body.messages.length === 0) {
      return NextResponse.json({ error: "Messages array is required" }, { status: 400 });
    }

    const { messages, confirmTool } = body;
    const lastUserMessage = [...messages].reverse().find((m) => m.role === "user")?.content || "";

    // 1. Fetch all active tools (built-in + user custom skills)
    const activeTools = await getActiveToolsForUser(user.userId);
    const enabledTools = activeTools.filter((t) => t.enabled);

    // 2. Handle user approving a previously flagged confirmation tool
    if (confirmTool && confirmTool.toolName) {
      const result = await executeToolCall(user.userId, confirmTool.toolName, confirmTool.args || {});
      const toolOutputStr = JSON.stringify(result.output || result.error, null, 2);

      return NextResponse.json({
        message: {
          role: "assistant",
          content: result.success
            ? `✅ Successfully executed **${confirmTool.toolName}**:\n\`\`\`json\n${toolOutputStr}\n\`\`\``
            : `❌ Failed to execute **${confirmTool.toolName}**: ${result.error}`,
          toolCalls: [result],
        },
      });
    }

    // 3. Priority 1: Google Gemini API
    const geminiKey = process.env.GEMINI_API_KEY;
    if (geminiKey) {
      return await handleGeminiToolCalling(geminiKey, user.userId, messages, enabledTools);
    }

    // 4. Priority 2: OpenAI API (if configured)
    const openAiKey = process.env.OPENAI_API_KEY;
    if (openAiKey) {
      return await handleOpenAiToolCalling(openAiKey, user.userId, messages, enabledTools);
    }

    // 5. Fallback: Autonomous Intelligent Tool Matcher & Workspace Engine (Built-in)
    return await handleAutonomousWorkspaceEngine(user.userId, lastUserMessage, enabledTools);
  } catch (err: any) {
    console.error("Jarvis chat error:", err);
    return NextResponse.json(
      { error: err.message || "An error occurred while processing Jarvis chat." },
      { status: 500 }
    );
  }
}

/**
 * Handle Google Gemini API with Native Function Calling / MCP Tool Calling.
 */
async function handleGeminiToolCalling(
  apiKey: string,
  userId: string,
  messages: ChatMessage[],
  tools: RegisteredSkill[]
) {
  const model = process.env.GEMINI_MODEL || "gemini-2.0-flash";
  const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  // 1. Format MCP tools into Gemini function declarations
  const functionDeclarations = tools.map((t) => ({
    name: t.name,
    description: t.description,
    parameters: t.parameters && typeof t.parameters === "object" ? t.parameters : { type: "object", properties: {} },
  }));

  const geminiTools = functionDeclarations.length > 0 ? [{ functionDeclarations }] : undefined;

  const systemInstruction = {
    parts: [
      {
        text: `You are Jarvis, Radu Bagrin's personal AI assistant and workspace orchestrator running on radubagrin.com. You have access to tools across his personal workspace (Documents, Todo lists, RSS feeds, Reminders) and custom skills via MCP. Proactively use tools when relevant. Be helpful, concise, structured, and polite.`,
      },
    ],
  };

  // Convert conversation to Gemini contents format
  const contents = messages
    .filter((m) => m.content && m.content.trim())
    .map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

  // Initial call to Gemini
  const response = await fetch(geminiEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction,
      contents,
      tools: geminiTools,
      generationConfig: {
        temperature: 0.3,
      },
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Google Gemini API error (${response.status}): ${errText}`);
  }

  const data = await response.json();
  const candidate = data.candidates?.[0];
  const parts: any[] = candidate?.content?.parts || [];

  // Check if Gemini invoked any function calls
  const functionCalls = parts.filter((p) => Boolean(p.functionCall));

  if (functionCalls.length > 0) {
    const executedCalls: ToolCallResult[] = [];
    const functionResponseParts: any[] = [];

    for (const fc of functionCalls) {
      const toolName = fc.functionCall.name;
      const args = fc.functionCall.args || {};
      const targetTool = tools.find((t) => t.name === toolName);

      // Check confirmation guardrail
      if (targetTool?.requireConfirmation) {
        return NextResponse.json({
          message: {
            role: "assistant",
            content: `Jarvis wants to execute **${targetTool.displayName}** with arguments:\n\`\`\`json\n${JSON.stringify(args, null, 2)}\n\`\`\`\nPlease confirm to run this tool:`,
            pendingConfirmation: {
              toolName,
              args,
            },
          },
          requiresConfirmation: true,
        });
      }

      // Execute tool
      const execResult = await executeToolCall(userId, toolName, args);
      executedCalls.push(execResult);

      functionResponseParts.push({
        functionResponse: {
          name: toolName,
          response: {
            success: execResult.success,
            output: execResult.output || execResult.error,
          },
        },
      });
    }

    // Follow-up request to Gemini with tool outputs so it generates the final answer
    try {
      const followUpContents = [
        ...contents,
        {
          role: "model",
          parts: parts,
        },
        {
          role: "user",
          parts: functionResponseParts,
        },
      ];

      const followUpRes = await fetch(geminiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction,
          contents: followUpContents,
          tools: geminiTools,
          generationConfig: {
            temperature: 0.3,
          },
        }),
      });

      if (followUpRes.ok) {
        const followUpData = await followUpRes.json();
        const finalCandidate = followUpData.candidates?.[0];
        const finalParts = finalCandidate?.content?.parts || [];
        const textParts = finalParts.map((p: any) => p.text || "").filter(Boolean);
        const finalContent = textParts.join("\n\n");

        return NextResponse.json({
          message: {
            role: "assistant",
            content: finalContent || `Executed ${executedCalls.length} tool(s).`,
            toolCalls: executedCalls,
          },
        });
      }
    } catch (followUpErr) {
      console.error("Gemini follow-up synthesis error:", followUpErr);
    }

    // Fallback if follow-up synthesis failed
    return NextResponse.json({
      message: {
        role: "assistant",
        content: `Executed tool **${executedCalls[0]?.toolName}**:\n\`\`\`json\n${JSON.stringify(executedCalls[0]?.output || executedCalls[0]?.error, null, 2)}\n\`\`\``,
        toolCalls: executedCalls,
      },
    });
  }

  // Pure text answer (no tool call)
  const textParts = parts.map((p) => p.text || "").filter(Boolean);
  const textContent = textParts.join("\n\n") || "No response received from Gemini.";

  return NextResponse.json({
    message: {
      role: "assistant",
      content: textContent,
    },
  });
}

/**
 * Built-in Intelligent Tool Matcher for workspace tasks when no LLM API key is set.
 */
async function handleAutonomousWorkspaceEngine(
  userId: string,
  userPrompt: string,
  tools: RegisteredSkill[]
) {
  const lower = userPrompt.toLowerCase();
  let matchedToolName: string | null = null;
  let toolArgs: Record<string, any> = {};

  // Intent Detection
  if (lower.includes("stats") || lower.includes("overview") || lower.includes("health") || lower.includes("telemetry") || lower.includes("status")) {
    matchedToolName = "get_workspace_stats";
  } else if (lower.includes("todo") || lower.includes("task") || lower.includes("tasks")) {
    if (lower.startsWith("add ") || lower.startsWith("create ") || lower.includes("create task") || lower.includes("add task") || lower.includes("new task")) {
      matchedToolName = "create_todo_task";
      // Extract task title
      const titleMatch = userPrompt.replace(/^(jarvis,?\s*)?(please\s*)?(add|create)\s+(a\s+)?(new\s+)?(todo|task)(\s+named|\s+called|\s+to)?\s*[:"-]?\s*/i, "");
      toolArgs = { title: titleMatch.replace(/["]+/g, "").trim() || "New Task from Jarvis" };
    } else {
      matchedToolName = "list_todo_tasks";
      toolArgs = {
        filter: lower.includes("pending") || lower.includes("active") ? "active" : lower.includes("completed") ? "completed" : "all",
      };
    }
  } else if (lower.includes("rss") || lower.includes("feed") || lower.includes("news")) {
    matchedToolName = "list_rss_feeds";
  } else if (lower.includes("reminder") || lower.includes("remind") || lower.includes("due")) {
    matchedToolName = "list_reminders";
  } else {
    // Check if user specifically mentioned a custom skill name
    for (const tool of tools) {
      if (!tool.isBuiltIn && (lower.includes(tool.name.toLowerCase()) || lower.includes(tool.displayName.toLowerCase()))) {
        matchedToolName = tool.name;
        break;
      }
    }
  }

  // If a tool was matched
  if (matchedToolName) {
    const targetTool = tools.find((t) => t.name === matchedToolName);

    if (targetTool) {
      // Check confirmation guardrail
      if (targetTool.requireConfirmation) {
        return NextResponse.json({
          message: {
            role: "assistant",
            content: `I'm ready to execute **${targetTool.displayName}** with the following arguments. Please confirm to proceed:`,
            pendingConfirmation: {
              toolName: targetTool.name,
              args: toolArgs,
            },
          },
          requiresConfirmation: true,
        });
      }

      const executionResult = await executeToolCall(userId, matchedToolName, toolArgs);

      let naturalResponse = "";
      if (matchedToolName === "get_workspace_stats" && executionResult.success) {
        const stats = executionResult.output;
        naturalResponse = `### 📊 Workspace Overview\n\n- **Documents Stored**: ${stats.documentsStored}\n- **Todo Lists**: ${stats.todoLists} (${stats.pendingTasks} active tasks, ${stats.totalTasks} total)\n- **RSS Feeds**: ${stats.savedRssFeeds} subscriptions\n- **Reminders**: ${stats.activeReminders} active\n\n*${stats.status}*`;
      } else if (matchedToolName === "list_todo_tasks" && executionResult.success) {
        const lists = executionResult.output as any[];
        if (lists.length === 0) {
          naturalResponse = "You don't have any todo lists yet. You can ask me to create a task!";
        } else {
          naturalResponse = `### 📝 Your Tasks\n\n` + lists.map((l) => `**${l.listName}** (${l.taskCount} tasks):\n` + l.tasks.map((t: any) => `  - [${t.completed ? "x" : " "}] ${t.title}`).join("\n")).join("\n\n");
        }
      } else if (matchedToolName === "list_rss_feeds" && executionResult.success) {
        const feeds = executionResult.output as any[];
        naturalResponse = `### 📰 Subscribed RSS Feeds (${feeds.length})\n\n` + (feeds.length > 0 ? feeds.map((f: any) => `- **${f.name}**: \`${f.url}\``).join("\n") : "No RSS feeds saved yet.");
      } else if (matchedToolName === "list_reminders" && executionResult.success) {
        const reminders = executionResult.output as any[];
        naturalResponse = `### ⏰ Upcoming Reminders (${reminders.length})\n\n` + (reminders.length > 0 ? reminders.map((r: any) => `- **${r.title}** (Due: ${new Date(r.dueDate).toLocaleDateString("en-GB")})`).join("\n") : "No active reminders.");
      } else {
        naturalResponse = executionResult.success
          ? `Executed tool **${targetTool.displayName}** successfully:\n\`\`\`json\n${JSON.stringify(executionResult.output, null, 2)}\n\`\`\``
          : `Error executing **${targetTool.displayName}**: ${executionResult.error}`;
      }

      return NextResponse.json({
        message: {
          role: "assistant",
          content: naturalResponse,
          toolCalls: [executionResult],
        },
      });
    }
  }

  // General assistant greeting & prompt to plug in GEMINI_API_KEY
  return NextResponse.json({
    message: {
      role: "assistant",
      content: `Hello Radu! I'm **Jarvis**, your personal workspace AI orchestrator.\n\nI have access to **${tools.length} active skills & tools** via the Model Context Protocol (MCP).\n\n💡 **To enable full live Gemini AI reasoning & chat**: Add your \`GEMINI_API_KEY\` to your \`.env\` file.\n\n### Quick workspace commands available right now:\n- *"Give me a workspace overview"*\n- *"Show my pending tasks"*\n- *"Add a task to buy coffee"*\n- *"List my RSS feeds"*\n- Or test your custom tools in the *Skills & Tools* tab!`,
    },
  });
}

/**
 * Handle OpenAI / Compatible Function Calling.
 */
async function handleOpenAiToolCalling(
  apiKey: string,
  userId: string,
  messages: ChatMessage[],
  tools: RegisteredSkill[]
) {
  const openAiTools = tools.map((t) => ({
    type: "function",
    function: {
      name: t.name,
      description: t.description,
      parameters: t.parameters || { type: "object", properties: {} },
    },
  }));

  const systemPrompt = {
    role: "system",
    content: `You are Jarvis, Radu Bagrin's high-tech personal AI assistant and workspace orchestrator. You are running inside radubagrin.com. You have direct access to tools for managing Radu's personal workspace (Documents, Todo lists, RSS feeds, Reminders) and any custom user-registered skills. Use tools proactively when relevant. Be concise, precise, and polite.`,
  };

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [systemPrompt, ...messages.map((m) => ({ role: m.role, content: m.content }))],
      tools: openAiTools.length > 0 ? openAiTools : undefined,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`OpenAI API error (${response.status}): ${errText}`);
  }

  const data = await response.json();
  const choice = data.choices?.[0]?.message;

  if (choice?.tool_calls && choice.tool_calls.length > 0) {
    const executedCalls: ToolCallResult[] = [];

    for (const toolCall of choice.tool_calls) {
      const toolName = toolCall.function.name;
      let args = {};
      try {
        args = JSON.parse(toolCall.function.arguments || "{}");
      } catch {
        args = {};
      }

      const targetTool = tools.find((t) => t.name === toolName);

      // Check confirmation guardrail
      if (targetTool?.requireConfirmation) {
        return NextResponse.json({
          message: {
            role: "assistant",
            content: `Jarvis wants to execute **${targetTool.displayName}** with arguments:\n\`\`\`json\n${JSON.stringify(args, null, 2)}\n\`\`\`\nPlease confirm to run this tool:`,
            pendingConfirmation: {
              toolName,
              args,
            },
          },
          requiresConfirmation: true,
        });
      }

      const execResult = await executeToolCall(userId, toolName, args);
      executedCalls.push(execResult);
    }

    return NextResponse.json({
      message: {
        role: "assistant",
        content: choice.content || `Executed ${executedCalls.length} tool(s).`,
        toolCalls: executedCalls,
      },
    });
  }

  return NextResponse.json({
    message: {
      role: "assistant",
      content: choice?.content || "No response received.",
    },
  });
}
