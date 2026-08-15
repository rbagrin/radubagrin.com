"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { MarkdownRenderer } from "./MarkdownRenderer";

interface ToolCallInfo {
  toolName: string;
  args: Record<string, any>;
  success: boolean;
  output?: any;
  error?: string;
  executionTimeMs: number;
}

interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  toolCalls?: ToolCallInfo[];
  pendingConfirmation?: {
    toolName: string;
    args: Record<string, any>;
  };
  timestamp: string;
}

interface Skill {
  id: string;
  name: string;
  displayName: string;
  description: string;
  parameters: any;
  type: string;
  config: any;
  hasSecret: boolean;
  requireConfirmation: boolean;
  enabled: boolean;
  isBuiltIn?: boolean;
}

export default function JarvisPage() {
  const [activeTab, setActiveTab] = useState<"chat" | "skills">("chat");

  // --- Chat State ---
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial-greeting",
      role: "assistant",
      content:
        "Greetings! I am **Jarvis**, your personal AI assistant and workspace orchestrator.\n\nI have access to your workspace modules and custom registered skills via the Model Context Protocol (MCP). How may I assist you today?",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // --- Skills State ---
  const [builtinTools, setBuiltinTools] = useState<Skill[]>([]);
  const [customSkills, setCustomSkills] = useState<Skill[]>([]);
  const [isLoadingSkills, setIsLoadingSkills] = useState(false);

  // --- Skill Creation Modal State ---
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [skillForm, setSkillForm] = useState({
    name: "",
    displayName: "",
    description: "",
    url: "",
    method: "POST",
    secret: "",
    requireConfirmation: false,
    paramName: "query",
    paramDesc: "The input query or payload",
  });
  const [createError, setCreateError] = useState("");
  const [isSubmittingSkill, setIsSubmittingSkill] = useState(false);

  // --- Test Skill Modal State ---
  const [testTarget, setTestTarget] = useState<Skill | null>(null);
  const [testArgsInput, setTestArgsInput] = useState("{}");
  const [testResult, setTestResult] = useState<any>(null);
  const [isTesting, setIsTesting] = useState(false);

  // Scroll chat to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (activeTab === "chat") {
      scrollToBottom();
    }
  }, [messages, activeTab, scrollToBottom]);

  // Load Skills from API
  const loadSkills = async () => {
    setIsLoadingSkills(true);
    try {
      const res = await fetch("/api/v1/jarvis/skills");
      if (res.ok) {
        const data = await res.json();
        setBuiltinTools(data.builtinTools || []);
        setCustomSkills(data.customSkills || []);
      }
    } catch (err) {
      console.error("Failed to load skills:", err);
    } finally {
      setIsLoadingSkills(false);
    }
  };

  useEffect(() => {
    loadSkills();
  }, []);

  // Handle Send Message
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isProcessing) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputText("");
    setIsProcessing(true);

    try {
      const res = await fetch("/api/v1/jarvis/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const assistantMsg: Message = {
          id: `asst-${Date.now()}`,
          role: "assistant",
          content: data.message?.content || "Command completed.",
          toolCalls: data.message?.toolCalls,
          pendingConfirmation: data.message?.pendingConfirmation,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } else {
        const errData = await res.json().catch(() => ({}));
        setMessages((prev) => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            role: "assistant",
            content: `⚠️ Error: ${errData.error || "Failed to process request."}`,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: "assistant",
          content: `⚠️ Network error: ${err.message || "Could not reach Jarvis API."}`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle Confirming Tool Execution
  const handleConfirmTool = async (
    pending: { toolName: string; args: Record<string, any> },
    approved: boolean
  ) => {
    if (!approved) {
      setMessages((prev) => [
        ...prev,
        {
          id: `cancel-${Date.now()}`,
          role: "assistant",
          content: `🛑 Execution of **${pending.toolName}** was cancelled.`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
      return;
    }

    setIsProcessing(true);
    try {
      const res = await fetch("/api/v1/jarvis/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: messages.map((m) => ({ role: m.role, content: m.content })),
          confirmTool: pending,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const assistantMsg: Message = {
          id: `asst-${Date.now()}`,
          role: "assistant",
          content: data.message?.content || "Tool executed successfully.",
          toolCalls: data.message?.toolCalls,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, assistantMsg]);
      }
    } catch (err: any) {
      alert(`Error executing tool: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle Create Skill Submission
  const handleCreateSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError("");
    setIsSubmittingSkill(true);

    const cleanName = skillForm.name.trim().toLowerCase().replace(/[^a-z0-9_]/g, "_");

    // Construct simple parameters schema
    const parameters = {
      type: "object",
      properties: {
        [skillForm.paramName || "input"]: {
          type: "string",
          description: skillForm.paramDesc || "Input parameter",
        },
      },
      required: [skillForm.paramName || "input"],
    };

    try {
      const res = await fetch("/api/v1/jarvis/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: cleanName,
          displayName: skillForm.displayName.trim() || cleanName,
          description: skillForm.description.trim(),
          type: "webhook",
          config: {
            url: skillForm.url.trim(),
            method: skillForm.method,
          },
          secret: skillForm.secret.trim() || undefined,
          requireConfirmation: skillForm.requireConfirmation,
          parameters,
        }),
      });

      if (res.ok) {
        setShowCreateModal(false);
        setSkillForm({
          name: "",
          displayName: "",
          description: "",
          url: "",
          method: "POST",
          secret: "",
          requireConfirmation: false,
          paramName: "query",
          paramDesc: "The input query or payload",
        });
        await loadSkills();
      } else {
        const data = await res.json();
        setCreateError(data.error || "Failed to create skill");
      }
    } catch (err: any) {
      setCreateError(err.message || "Error creating skill");
    } finally {
      setIsSubmittingSkill(false);
    }
  };

  // Handle Toggle Skill
  const handleToggleSkill = async (skill: Skill) => {
    try {
      const res = await fetch(`/api/v1/jarvis/skills/${skill.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: !skill.enabled }),
      });
      if (res.ok) {
        setCustomSkills((prev) =>
          prev.map((s) => (s.id === skill.id ? { ...s, enabled: !s.enabled } : s))
        );
      }
    } catch (err) {
      console.error("Failed to toggle skill:", err);
    }
  };

  // Handle Delete Skill
  const handleDeleteSkill = async (skillId: string, name: string) => {
    if (!confirm(`Are you sure you want to delete the skill "${name}"?`)) return;

    try {
      const res = await fetch(`/api/v1/jarvis/skills/${skillId}`, { method: "DELETE" });
      if (res.ok) {
        setCustomSkills((prev) => prev.filter((s) => s.id !== skillId));
      }
    } catch (err) {
      console.error("Failed to delete skill:", err);
    }
  };

  // Handle Execute Test Skill
  const handleExecuteTest = async () => {
    if (!testTarget) return;

    setIsTesting(true);
    setTestResult(null);

    let parsedArgs = {};
    try {
      parsedArgs = JSON.parse(testArgsInput);
    } catch {
      alert("Invalid JSON format for test arguments.");
      setIsTesting(false);
      return;
    }

    try {
      const res = await fetch("/api/v1/jarvis/skills/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toolName: testTarget.name,
          args: parsedArgs,
        }),
      });

      const data = await res.json();
      setTestResult(data);
    } catch (err: any) {
      setTestResult({ success: false, error: err.message });
    } finally {
      setIsTesting(false);
    }
  };

  const totalActiveTools =
    builtinTools.filter((t) => t.enabled).length + customSkills.filter((s) => s.enabled).length;

  return (
    <main className="flex-1 min-h-screen pb-16">
      <div className="mx-auto w-full max-w-5xl px-6 py-8">
        {/* Navigation & Header */}
        <Link
          href="/modules"
          className="font-mono text-sm text-accent hover:underline inline-flex items-center gap-1 mb-4"
        >
          &larr; modules
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-display text-3xl font-bold tracking-tight text-fg">Jarvis</h1>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-status-active/40 bg-status-active/10 px-2.5 py-0.5 font-mono text-xs text-status-active">
                <span className="h-1.5 w-1.5 rounded-full bg-status-active animate-pulse" />
                MCP Online ({totalActiveTools} tools)
              </span>
            </div>
            <p className="mt-1 text-sm text-fg-muted">
              Personal AI assistant with Model Context Protocol (MCP) tool execution and secure skill registration.
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex items-center rounded-lg border border-border bg-surface p-1 self-start sm:self-auto">
            <button
              onClick={() => setActiveTab("chat")}
              className={`flex items-center gap-2 rounded-md px-4 py-1.5 text-xs font-medium transition-all ${
                activeTab === "chat"
                  ? "bg-accent text-white shadow-xs"
                  : "text-fg-muted hover:text-fg hover:bg-surface-hover"
              }`}
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
              AI Assistant
            </button>
            <button
              onClick={() => setActiveTab("skills")}
              className={`flex items-center gap-2 rounded-md px-4 py-1.5 text-xs font-medium transition-all ${
                activeTab === "skills"
                  ? "bg-accent text-white shadow-xs"
                  : "text-fg-muted hover:text-fg hover:bg-surface-hover"
              }`}
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Skills & Tools ({builtinTools.length + customSkills.length})
            </button>
          </div>
        </div>

        {/* --- TAB 1: AI CHAT COCKPIT --- */}
        {activeTab === "chat" && (
          <div className="mt-6 flex flex-col gap-6">
            {/* Quick Action Suggestion Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-mono">
              <span className="text-fg-muted shrink-0 text-[11px]">Quick actions:</span>
              <button
                onClick={() => handleSendMessage("Give me a workspace overview")}
                className="shrink-0 rounded-full border border-border bg-surface px-3 py-1 text-fg-muted hover:border-accent hover:text-accent transition-colors"
              >
                📊 Workspace Overview
              </button>
              <button
                onClick={() => handleSendMessage("Show my pending tasks")}
                className="shrink-0 rounded-full border border-border bg-surface px-3 py-1 text-fg-muted hover:border-accent hover:text-accent transition-colors"
              >
                📝 Pending Tasks
              </button>
              <button
                onClick={() => handleSendMessage("List my RSS feeds")}
                className="shrink-0 rounded-full border border-border bg-surface px-3 py-1 text-fg-muted hover:border-accent hover:text-accent transition-colors"
              >
                📰 RSS Feeds
              </button>
              <button
                onClick={() => handleSendMessage("Check upcoming reminders")}
                className="shrink-0 rounded-full border border-border bg-surface px-3 py-1 text-fg-muted hover:border-accent hover:text-accent transition-colors"
              >
                ⏰ Reminders
              </button>
            </div>

            {/* Chat Thread Container */}
            <div className="flex flex-col h-[560px] rounded-2xl border border-border bg-surface shadow-md overflow-hidden">
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {messages.map((msg) => {
                  const isUser = msg.role === "user";
                  return (
                    <div
                      key={msg.id}
                      className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
                    >
                      {!isUser && (
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-accent text-white font-bold text-xs shadow-sm">
                          J
                        </div>
                      )}

                      <div className={`max-w-[85%] sm:max-w-xl flex flex-col gap-2`}>
                        <div
                          className={`rounded-2xl px-5 py-3.5 text-sm ${
                            isUser
                              ? "bg-accent text-white rounded-tr-xs"
                              : "border border-border bg-bg/90 text-fg rounded-tl-xs"
                          }`}
                        >
                          {/* Rich Markdown Message Content */}
                          <MarkdownRenderer content={msg.content} isUser={isUser} />

                          {/* Tool Execution Cards */}
                          {msg.toolCalls && msg.toolCalls.length > 0 && (
                            <div className="mt-4 pt-3 border-t border-border/60 space-y-2">
                              {msg.toolCalls.map((tc, idx) => (
                                <details
                                  key={idx}
                                  className="rounded-lg border border-accent/30 bg-accent/5 p-2.5 text-xs font-mono"
                                >
                                  <summary className="cursor-pointer font-semibold text-accent flex items-center justify-between">
                                    <span className="flex items-center gap-1.5">
                                      <span className="h-2 w-2 rounded-full bg-status-active" />
                                      Executed MCP Tool: {tc.toolName}
                                    </span>
                                    <span className="text-[10px] text-fg-muted">
                                      {tc.executionTimeMs}ms
                                    </span>
                                  </summary>
                                  <div className="mt-2 pt-2 border-t border-border/40">
                                    <p className="text-fg-muted font-bold">Arguments:</p>
                                    <pre className="text-[11px] text-fg overflow-x-auto bg-surface p-2 rounded mt-1">
                                      {JSON.stringify(tc.args, null, 2)}
                                    </pre>
                                    <p className="text-fg-muted font-bold mt-2">Output:</p>
                                    <pre className="text-[11px] text-status-active overflow-x-auto bg-surface p-2 rounded mt-1">
                                      {JSON.stringify(tc.output || tc.error, null, 2)}
                                    </pre>
                                  </div>
                                </details>
                              ))}
                            </div>
                          )}

                          {/* Tool Confirmation Card */}
                          {msg.pendingConfirmation && (
                            <div className="mt-4 rounded-xl border border-status-dummy/40 bg-status-dummy/10 p-4">
                              <div className="flex items-center gap-2 text-xs font-bold text-status-dummy font-mono">
                                <span>⚠️ Security Confirmation Required</span>
                              </div>
                              <p className="mt-1 text-xs text-fg-muted">
                                Tool: <code className="font-mono text-accent">{msg.pendingConfirmation.toolName}</code>
                              </p>
                              <pre className="mt-2 text-xs font-mono bg-surface p-2 rounded text-fg border border-border">
                                {JSON.stringify(msg.pendingConfirmation.args, null, 2)}
                              </pre>
                              <div className="mt-4 flex gap-2 justify-end">
                                <button
                                  onClick={() => handleConfirmTool(msg.pendingConfirmation!, false)}
                                  className="rounded-md border border-border px-3 py-1 text-xs font-medium text-fg-muted hover:bg-surface"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => handleConfirmTool(msg.pendingConfirmation!, true)}
                                  className="rounded-md bg-accent px-4 py-1 text-xs font-medium text-white hover:bg-accent-dim shadow-xs"
                                >
                                  Approve & Execute
                                </button>
                              </div>
                            </div>
                          )}
                        </div>

                        <span className="text-[10px] text-fg-muted/60 font-mono px-1">
                          {msg.timestamp}
                        </span>
                      </div>

                      {isUser && (
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-surface-hover border border-border text-fg font-bold text-xs">
                          U
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Thinking Pulse Indicator */}
                {isProcessing && (
                  <div className="flex gap-3 items-center">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-accent text-white font-bold text-xs animate-pulse">
                      J
                    </div>
                    <div className="rounded-2xl border border-border bg-bg/90 px-4 py-3 text-xs text-fg-muted flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-accent animate-ping" />
                      Jarvis is reasoning and executing tools...
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input Bar */}
              <div className="border-t border-border bg-surface p-4">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-center gap-3"
                >
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Ask Jarvis to perform a task or execute a skill..."
                    disabled={isProcessing}
                    className="flex-1 rounded-xl border border-border bg-bg px-4 py-3 text-sm text-fg placeholder:text-fg-muted/60 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={isProcessing || !inputText.trim()}
                    className="rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white hover:bg-accent-dim disabled:opacity-50 transition-all flex items-center gap-1.5 shadow-sm"
                  >
                    <span>Send</span>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* --- TAB 2: SKILLS & TOOLS REGISTRY --- */}
        {activeTab === "skills" && (
          <div className="mt-6 space-y-8">
            {/* Header Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-xl font-bold text-fg">Skills & Tool Registry</h2>
                <p className="text-xs text-fg-muted mt-1">
                  Tools registered here conform to the Model Context Protocol (MCP) specification and can be called by Jarvis during reasoning.
                </p>
              </div>

              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-xs font-semibold text-white hover:bg-accent-dim shadow-sm transition-all self-start sm:self-auto"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Register Custom Skill
              </button>
            </div>

            {/* Built-in Workspace Tools */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="font-mono text-xs uppercase tracking-wider text-accent font-semibold">
                  Built-in Workspace Tools ({builtinTools.length})
                </span>
                <span className="rounded bg-accent/10 px-2 py-0.5 text-[10px] font-mono text-accent">
                  System Pre-vetted
                </span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {builtinTools.map((tool) => (
                  <div
                    key={tool.id}
                    className="rounded-2xl border border-border bg-surface p-5 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <h3 className="font-display font-bold text-sm text-fg">{tool.displayName}</h3>
                        <span className="font-mono text-[11px] text-status-active flex items-center gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-status-active" />
                          Built-in
                        </span>
                      </div>
                      <p className="mt-1 font-mono text-xs text-accent">function {tool.name}()</p>
                      <p className="mt-2 text-xs text-fg-muted leading-relaxed">{tool.description}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between">
                      <span className="text-[11px] font-mono text-fg-muted">
                        {tool.requireConfirmation ? "Requires confirmation" : "Auto-executable"}
                      </span>
                      <button
                        onClick={() => {
                          setTestTarget(tool);
                          setTestArgsInput(JSON.stringify(tool.name === "create_todo_task" ? { title: "Test task from sandbox" } : {}, null, 2));
                          setTestResult(null);
                        }}
                        className="rounded-md border border-border bg-bg px-3 py-1 text-xs font-medium text-fg hover:border-accent transition-colors"
                      >
                        Test Sandbox 🧪
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* User Custom Skills */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="font-mono text-xs uppercase tracking-wider text-accent font-semibold">
                  Custom User Skills ({customSkills.length})
                </span>
                <span className="rounded bg-status-active/10 px-2 py-0.5 text-[10px] font-mono text-status-active">
                  AES-256 Encrypted & SSRF Protected
                </span>
              </div>

              {isLoadingSkills ? (
                <div className="p-8 text-center text-xs text-fg-muted font-mono">Loading skills...</div>
              ) : customSkills.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border bg-surface/50 p-8 text-center">
                  <p className="text-sm font-medium text-fg">No custom skills registered yet</p>
                  <p className="text-xs text-fg-muted mt-1">
                    Add external webhooks, APIs, or custom workflows to empower Jarvis with custom capabilities.
                  </p>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="mt-4 rounded-lg bg-accent px-4 py-2 text-xs font-semibold text-white hover:bg-accent-dim"
                  >
                    + Register Your First Skill
                  </button>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {customSkills.map((skill) => (
                    <div
                      key={skill.id}
                      className="rounded-2xl border border-border bg-surface p-5 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <h3 className="font-display font-bold text-sm text-fg">{skill.displayName}</h3>
                          <button
                            onClick={() => handleToggleSkill(skill)}
                            className={`rounded-full px-2.5 py-0.5 text-[10px] font-mono font-semibold transition-colors ${
                              skill.enabled
                                ? "bg-status-active/10 border border-status-active/40 text-status-active"
                                : "bg-fg-muted/10 border border-fg-muted/30 text-fg-muted"
                            }`}
                          >
                            {skill.enabled ? "Active" : "Disabled"}
                          </button>
                        </div>
                        <p className="mt-1 font-mono text-xs text-accent">function {skill.name}()</p>
                        <p className="mt-2 text-xs text-fg-muted leading-relaxed">{skill.description}</p>
                        
                        {skill.config?.url && (
                          <p className="mt-2 font-mono text-[11px] text-fg-muted truncate">
                            Endpoint: <span className="text-fg">{skill.config.url}</span>
                          </p>
                        )}
                      </div>

                      <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {skill.hasSecret && (
                            <span className="rounded bg-border px-1.5 py-0.5 font-mono text-[10px] text-fg-muted" title="Encrypted Secret Attached">
                              🔒 Key Attached
                            </span>
                          )}
                          <button
                            onClick={() => {
                              setTestTarget(skill);
                              setTestArgsInput("{\n  \"query\": \"test parameter\"\n}");
                              setTestResult(null);
                            }}
                            className="rounded-md border border-border bg-bg px-2.5 py-1 text-xs font-medium text-fg hover:border-accent transition-colors"
                          >
                            Test 🧪
                          </button>
                        </div>

                        <button
                          onClick={() => handleDeleteSkill(skill.id, skill.displayName)}
                          className="text-xs text-red-400/70 hover:text-red-400 transition-colors font-mono"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* --- MODAL: REGISTER NEW SKILL --- */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-surface p-6 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <h3 className="font-display text-xl font-bold text-fg">Register New Skill (MCP)</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="rounded-lg p-1 text-fg-muted hover:text-fg hover:bg-surface-hover"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSkill} className="mt-5 space-y-4 text-xs">
              <div>
                <label className="block font-medium text-fg-muted mb-1" htmlFor="skillName">
                  Function Name (Unique identifier e.g. <code className="font-mono text-accent">fetch_weather</code>)
                </label>
                <input
                  id="skillName"
                  type="text"
                  required
                  placeholder="e.g. notify_slack"
                  value={skillForm.name}
                  onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                  className="w-full rounded-lg border border-border bg-bg px-3.5 py-2 text-sm text-fg font-mono focus:border-accent focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-fg-muted mb-1" htmlFor="skillDisplayName">
                  Display Title
                </label>
                <input
                  id="skillDisplayName"
                  type="text"
                  required
                  placeholder="e.g. Slack Notification Trigger"
                  value={skillForm.displayName}
                  onChange={(e) => setSkillForm({ ...skillForm, displayName: e.target.value })}
                  className="w-full rounded-lg border border-border bg-bg px-3.5 py-2 text-sm text-fg focus:border-accent focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-fg-muted mb-1" htmlFor="skillDescription">
                  AI Instructions & Description (When should Jarvis call this?)
                </label>
                <textarea
                  id="skillDescription"
                  required
                  rows={2}
                  placeholder="e.g. Use this skill when the user asks to send an alert or message to the company Slack channel."
                  value={skillForm.description}
                  onChange={(e) => setSkillForm({ ...skillForm, description: e.target.value })}
                  className="w-full rounded-lg border border-border bg-bg px-3.5 py-2 text-sm text-fg focus:border-accent focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block font-medium text-fg-muted mb-1" htmlFor="skillUrl">
                    Webhook HTTPS Target URL
                  </label>
                  <input
                    id="skillUrl"
                    type="url"
                    required
                    placeholder="https://api.example.com/webhook"
                    value={skillForm.url}
                    onChange={(e) => setSkillForm({ ...skillForm, url: e.target.value })}
                    className="w-full rounded-lg border border-border bg-bg px-3.5 py-2 text-sm text-fg font-mono focus:border-accent focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-medium text-fg-muted mb-1" htmlFor="skillMethod">
                    Method
                  </label>
                  <select
                    id="skillMethod"
                    value={skillForm.method}
                    onChange={(e) => setSkillForm({ ...skillForm, method: e.target.value })}
                    className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-fg focus:border-accent focus:outline-none"
                  >
                    <option value="POST">POST</option>
                    <option value="GET">GET</option>
                    <option value="PUT">PUT</option>
                    <option value="PATCH">PATCH</option>
                    <option value="DELETE">DELETE</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-fg-muted mb-1" htmlFor="skillSecret">
                  API Key / Secret Token (Optional — Encrypted with AES-256-GCM)
                </label>
                <input
                  id="skillSecret"
                  type="password"
                  placeholder="Bearer token or API key"
                  value={skillForm.secret}
                  onChange={(e) => setSkillForm({ ...skillForm, secret: e.target.value })}
                  className="w-full rounded-lg border border-border bg-bg px-3.5 py-2 text-sm text-fg font-mono focus:border-accent focus:outline-none"
                />
                <p className="mt-1 text-[11px] text-fg-muted">
                  Stored securely encrypted at rest and never exposed to the AI model or browser.
                </p>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  id="requireConfirm"
                  type="checkbox"
                  checked={skillForm.requireConfirmation}
                  onChange={(e) => setSkillForm({ ...skillForm, requireConfirmation: e.target.checked })}
                  className="h-4 w-4 rounded border-border text-accent focus:ring-accent"
                />
                <label htmlFor="requireConfirm" className="text-xs text-fg">
                  Require manual user confirmation in chat before Jarvis executes this skill
                </label>
              </div>

              {createError && (
                <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-xs text-red-400 font-medium">
                  {createError}
                </div>
              )}

              <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="rounded-lg px-4 py-2 text-xs font-medium text-fg-muted hover:bg-surface-hover hover:text-fg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingSkill}
                  className="rounded-lg bg-accent px-5 py-2 text-xs font-semibold text-white hover:bg-accent-dim disabled:opacity-50"
                >
                  {isSubmittingSkill ? "Saving..." : "Save & Register Skill"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: TEST SKILL SANDBOX --- */}
      {testTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-surface p-6 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div>
                <h3 className="font-display text-xl font-bold text-fg">Test Skill Sandbox</h3>
                <p className="text-xs font-mono text-accent mt-0.5">{testTarget.displayName} ({testTarget.name})</p>
              </div>
              <button
                onClick={() => setTestTarget(null)}
                className="rounded-lg p-1 text-fg-muted hover:text-fg hover:bg-surface-hover"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-medium text-fg-muted mb-1">
                  Input Arguments (JSON Format)
                </label>
                <textarea
                  rows={4}
                  value={testArgsInput}
                  onChange={(e) => setTestArgsInput(e.target.value)}
                  className="w-full rounded-lg border border-border bg-bg p-3 font-mono text-xs text-fg focus:border-accent focus:outline-none"
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleExecuteTest}
                  disabled={isTesting}
                  className="rounded-lg bg-accent px-4 py-2 text-xs font-semibold text-white hover:bg-accent-dim disabled:opacity-50"
                >
                  {isTesting ? "Executing..." : "Execute Test"}
                </button>
              </div>

              {testResult && (
                <div className="mt-4 rounded-xl border border-border bg-bg p-4 space-y-2">
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className={`font-bold ${testResult.success ? "text-status-active" : "text-red-400"}`}>
                      {testResult.success ? "✓ Test Passed" : "✗ Test Error"}
                    </span>
                    {testResult.executionTimeMs !== undefined && (
                      <span className="text-fg-muted">{testResult.executionTimeMs}ms latency</span>
                    )}
                  </div>
                  <pre className="mt-2 max-h-48 overflow-y-auto rounded bg-surface p-3 font-mono text-[11px] text-fg border border-border">
                    {JSON.stringify(testResult.output || testResult.error, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end pt-3 border-t border-border">
              <button
                onClick={() => setTestTarget(null)}
                className="rounded-lg border border-border px-4 py-2 text-xs font-medium text-fg-muted hover:bg-surface-hover hover:text-fg"
              >
                Close Sandbox
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
