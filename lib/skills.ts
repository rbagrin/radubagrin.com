import { db } from "@/lib/db";
import { decryptSecret } from "@/lib/encryption";
import type { Prisma } from "@prisma/client";

export interface SkillParameterSchema {
  type: "object";
  properties: Record<
    string,
    {
      type: string;
      description?: string;
      enum?: string[];
      default?: any;
    }
  >;
  required?: string[];
}

export interface SkillConfig {
  url?: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  headers?: Record<string, string>;
  authHeaderName?: string; // e.g. "Authorization" or "x-api-key"
  authHeaderPrefix?: string; // e.g. "Bearer " or empty
  timeoutMs?: number;
}

export interface RegisteredSkill {
  id: string;
  name: string;
  displayName: string;
  description: string;
  parameters: SkillParameterSchema;
  type: "webhook" | "internal";
  config: SkillConfig;
  hasSecret: boolean;
  requireConfirmation: boolean;
  enabled: boolean;
  isBuiltIn?: boolean;
}

export interface ToolCallResult {
  toolName: string;
  args: Record<string, any>;
  success: boolean;
  output?: any;
  error?: string;
  executionTimeMs: number;
  requireConfirmation?: boolean;
}

// --- SSRF Protection --------------------------------------------------------

const BLOCKED_HOST_PATTERNS = [
  /^localhost$/i,
  /^127\./,
  /^10\./,
  /^192\.168\./,
  /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
  /^169\.254\./, // AWS / Cloud metadata
  /^0\.0\.0\.0$/,
  /^::1$/,
  /\.local$/i,
  /\.internal$/i,
];

export function validateSafeUrl(urlStr: string): { safe: boolean; error?: string; parsedUrl?: URL } {
  try {
    const parsed = new URL(urlStr);

    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
      return { safe: false, error: "Only HTTP and HTTPS protocols are supported." };
    }

    const hostname = parsed.hostname;

    // Check against forbidden private/loopback hosts
    for (const pattern of BLOCKED_HOST_PATTERNS) {
      if (pattern.test(hostname)) {
        return {
          safe: false,
          error: `Access to private or local network host (${hostname}) is blocked for security.`,
        };
      }
    }

    return { safe: true, parsedUrl: parsed };
  } catch (err: any) {
    return { safe: false, error: `Invalid URL: ${err.message}` };
  }
}

// --- Built-in Workspace Tools -----------------------------------------------

export const BUILTIN_WORKSPACE_TOOLS: RegisteredSkill[] = [
  {
    id: "builtin-workspace-stats",
    name: "get_workspace_stats",
    displayName: "Workspace Overview & Telemetry",
    description: "Get real-time statistics and summary of all documents, todo lists, RSS feeds, and reminders in the user's workspace.",
    parameters: {
      type: "object",
      properties: {},
    },
    type: "internal",
    config: {},
    hasSecret: false,
    requireConfirmation: false,
    enabled: true,
    isBuiltIn: true,
  },
  {
    id: "builtin-list-todos",
    name: "list_todo_tasks",
    displayName: "List Todo Tasks",
    description: "Fetch all todo lists and tasks for the user. Optionally filter by active or completed status.",
    parameters: {
      type: "object",
      properties: {
        filter: {
          type: "string",
          enum: ["all", "active", "completed"],
          description: "Filter tasks by completion status.",
        },
      },
    },
    type: "internal",
    config: {},
    hasSecret: false,
    requireConfirmation: false,
    enabled: true,
    isBuiltIn: true,
  },
  {
    id: "builtin-create-todo",
    name: "create_todo_task",
    displayName: "Create Todo Task",
    description: "Create a new task in the user's todo list. If listName is not provided, adds to the first available list.",
    parameters: {
      type: "object",
      properties: {
        title: {
          type: "string",
          description: "The title of the task to add.",
        },
        listName: {
          type: "string",
          description: "Optional name of the target list (creates it if not found).",
        },
      },
      required: ["title"],
    },
    type: "internal",
    config: {},
    hasSecret: false,
    requireConfirmation: true,
    enabled: true,
    isBuiltIn: true,
  },
  {
    id: "builtin-list-rss",
    name: "list_rss_feeds",
    displayName: "List RSS Feeds",
    description: "Retrieve all saved RSS news feeds registered in the user's RSS Aggregator.",
    parameters: {
      type: "object",
      properties: {},
    },
    type: "internal",
    config: {},
    hasSecret: false,
    requireConfirmation: false,
    enabled: true,
    isBuiltIn: true,
  },
  {
    id: "builtin-list-reminders",
    name: "list_reminders",
    displayName: "List Upcoming Reminders",
    description: "Retrieve upcoming reminders and expiry dates (MOT, renewals, etc.).",
    parameters: {
      type: "object",
      properties: {},
    },
    type: "internal",
    config: {},
    hasSecret: false,
    requireConfirmation: false,
    enabled: true,
    isBuiltIn: true,
  },
];

// --- Built-in Tool Handlers -------------------------------------------------

async function executeBuiltinTool(
  userId: string,
  toolName: string,
  args: Record<string, any>
): Promise<any> {
  switch (toolName) {
    case "get_workspace_stats": {
      const [docCount, todoListCount, todoItemCount, rssCount, reminderCount] = await Promise.all([
        db.document.count().catch(() => 0),
        db.todoList.count({ where: { userId } }).catch(() => 0),
        db.todoItem.count({ where: { userId } }).catch(() => 0),
        db.rssFeed.count({ where: { userId } }).catch(() => 0),
        db.reminder.count({ where: { userId } }).catch(() => 0),
      ]);

      const pendingTodos = await db.todoItem.count({
        where: { userId, completed: false },
      }).catch(() => 0);

      return {
        documentsStored: docCount,
        todoLists: todoListCount,
        totalTasks: todoItemCount,
        pendingTasks: pendingTodos,
        savedRssFeeds: rssCount,
        activeReminders: reminderCount,
        status: "All systems operating normally.",
      };
    }

    case "list_todo_tasks": {
      const filter = args.filter || "all";
      const whereCondition: any = { userId };
      if (filter === "active") whereCondition.completed = false;
      if (filter === "completed") whereCondition.completed = true;

      const lists = await db.todoList.findMany({
        where: { userId },
        include: {
          items: {
            where: filter === "all" ? undefined : { completed: filter === "completed" },
            orderBy: { createdAt: "desc" },
          },
        },
      });

      return lists.map((l) => ({
        listId: l.id,
        listName: l.name,
        taskCount: l.items.length,
        tasks: l.items.map((i) => ({
          id: i.id,
          title: i.title,
          completed: i.completed,
          createdAt: i.createdAt.toISOString(),
        })),
      }));
    }

    case "create_todo_task": {
      const { title, listName } = args;
      if (!title || typeof title !== "string") {
        throw new Error("Task title is required");
      }

      let targetList = await db.todoList.findFirst({
        where: {
          userId,
          ...(listName ? { name: { equals: listName, mode: "insensitive" } } : {}),
        },
      });

      if (!targetList) {
        targetList = await db.todoList.create({
          data: {
            userId,
            name: listName || "General Tasks",
          },
        });
      }

      const item = await db.todoItem.create({
        data: {
          userId,
          listId: targetList.id,
          title: title.trim(),
          completed: false,
        },
      });

      return {
        success: true,
        message: `Task "${item.title}" created in list "${targetList.name}".`,
        taskId: item.id,
        listName: targetList.name,
      };
    }

    case "list_rss_feeds": {
      const feeds = await db.rssFeed.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
      });
      return feeds.map((f) => ({
        id: f.id,
        name: f.name,
        url: f.url,
        addedAt: f.createdAt.toISOString(),
      }));
    }

    case "list_reminders": {
      const reminders = await db.reminder.findMany({
        where: { userId },
        orderBy: { dueDate: "asc" },
      });
      return reminders.map((r) => ({
        id: r.id,
        title: r.title,
        dueDate: r.dueDate.toISOString(),
        notifyBy: r.notifyBy,
      }));
    }

    default:
      throw new Error(`Unknown built-in tool: ${toolName}`);
  }
}

// --- Custom Webhook / API Skill Execution ------------------------------------

export async function executeCustomSkill(
  skill: {
    name: string;
    config: Prisma.JsonValue;
    encryptedSecret?: string | null;
  },
  args: Record<string, any>
): Promise<any> {
  const config = (skill.config as SkillConfig) || {};
  const rawUrl = config.url?.trim();

  if (!rawUrl) {
    throw new Error(`Skill ${skill.name} has no URL endpoint configured.`);
  }

  // Parameter string interpolation in URL (e.g. https://api.com/items/{{id}})
  let finalUrl = rawUrl;
  for (const [key, val] of Object.entries(args)) {
    if (typeof val === "string" || typeof val === "number") {
      finalUrl = finalUrl.replace(new RegExp(`{{\\s*${key}\\s*}}`, "g"), encodeURIComponent(String(val)));
    }
  }

  const urlValidation = validateSafeUrl(finalUrl);
  if (!urlValidation.safe) {
    throw new Error(urlValidation.error || "Forbidden URL target.");
  }

  const method = (config.method || "POST").toUpperCase();
  const headers: Record<string, string> = {
    "User-Agent": "Jarvis-MCP-Agent/1.0",
    Accept: "application/json, text/plain, */*",
    ...(config.headers || {}),
  };

  // Inject decrypted secret into configured auth header
  if (skill.encryptedSecret) {
    const plainSecret = decryptSecret(skill.encryptedSecret);
    if (plainSecret) {
      const authHeaderName = config.authHeaderName || "Authorization";
      const authPrefix = config.authHeaderPrefix !== undefined ? config.authHeaderPrefix : "Bearer ";
      headers[authHeaderName] = `${authPrefix}${plainSecret}`;
    }
  }

  const timeoutMs = config.timeoutMs || 10000;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const fetchOptions: RequestInit = {
      method,
      headers,
      signal: controller.signal,
    };

    if (method !== "GET" && method !== "HEAD") {
      headers["Content-Type"] = headers["Content-Type"] || "application/json";
      fetchOptions.body = JSON.stringify(args);
    }

    const response = await fetch(finalUrl, fetchOptions);
    const contentType = response.headers.get("content-type") || "";

    let responseData: any;
    if (contentType.includes("application/json")) {
      responseData = await response.json().catch(() => ({}));
    } else {
      const text = await response.text();
      responseData = { text: text.slice(0, 4000) }; // cap length
    }

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${JSON.stringify(responseData)}`);
    }

    return responseData;
  } finally {
    clearTimeout(timeoutId);
  }
}

// --- Unified Skill Dispatcher -----------------------------------------------

export async function executeToolCall(
  userId: string,
  toolName: string,
  args: Record<string, any>
): Promise<ToolCallResult> {
  const startTime = Date.now();

  try {
    // 1. Check if it's a built-in workspace tool
    const isBuiltin = BUILTIN_WORKSPACE_TOOLS.some((t) => t.name === toolName);
    if (isBuiltin) {
      const output = await executeBuiltinTool(userId, toolName, args);
      return {
        toolName,
        args,
        success: true,
        output,
        executionTimeMs: Date.now() - startTime,
      };
    }

    // 2. Look up custom user skill in DB
    const skill = await db.skill.findUnique({
      where: {
        userId_name: {
          userId,
          name: toolName,
        },
      },
    });

    if (!skill) {
      throw new Error(`Tool "${toolName}" is not registered or not found.`);
    }

    if (!skill.enabled) {
      throw new Error(`Tool "${toolName}" is currently disabled in your Skills settings.`);
    }

    const output = await executeCustomSkill(skill, args);
    return {
      toolName,
      args,
      success: true,
      output,
      executionTimeMs: Date.now() - startTime,
      requireConfirmation: skill.requireConfirmation,
    };
  } catch (err: any) {
    return {
      toolName,
      args,
      success: false,
      error: err.message || "Execution error",
      executionTimeMs: Date.now() - startTime,
    };
  }
}

// --- MCP / JSON Schema Tool Definitions Provider ----------------------------

export async function getActiveToolsForUser(userId: string): Promise<RegisteredSkill[]> {
  const customSkills = await db.skill.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  const formattedCustom: RegisteredSkill[] = customSkills.map((s) => ({
    id: s.id,
    name: s.name,
    displayName: s.displayName,
    description: s.description,
    parameters: s.parameters as unknown as SkillParameterSchema,
    type: (s.type as any) || "webhook",
    config: s.config as unknown as SkillConfig,
    hasSecret: Boolean(s.encryptedSecret),
    requireConfirmation: s.requireConfirmation,
    enabled: s.enabled,
    isBuiltIn: false,
  }));

  return [...BUILTIN_WORKSPACE_TOOLS, ...formattedCustom];
}
