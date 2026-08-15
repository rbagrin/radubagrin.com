"use client";

import React, { useState } from "react";

interface MarkdownRendererProps {
  content: string;
  isUser?: boolean;
}

/**
 * Parses inline formatting: **bold**, *italic*, `code`, and [link](url).
 */
export function parseInlineMarkdown(text: string): React.ReactNode[] {
  if (!text) return [];

  // Match: `code`, **bold**, *italic*, and [link](url)
  const regex = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g;
  const parts = text.split(regex);

  return parts.map((part, idx) => {
    if (!part) return null;

    // Inline Code: `code`
    if (part.startsWith("`") && part.endsWith("`") && part.length >= 2) {
      return (
        <code
          key={idx}
          className="rounded bg-surface-hover/90 border border-border/80 px-1.5 py-0.5 font-mono text-[12px] text-accent font-medium"
        >
          {part.slice(1, -1)}
        </code>
      );
    }

    // Bold Text: **text**
    if (part.startsWith("**") && part.endsWith("**") && part.length >= 4) {
      return (
        <strong key={idx} className="font-bold text-fg">
          {parseInlineMarkdown(part.slice(2, -2))}
        </strong>
      );
    }

    // Italic Text: *text*
    if (part.startsWith("*") && part.endsWith("*") && part.length >= 2) {
      return (
        <em key={idx} className="italic text-fg-muted">
          {parseInlineMarkdown(part.slice(1, -1))}
        </em>
      );
    }

    // Link: [text](url)
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      const [, linkText, url] = linkMatch;
      return (
        <a
          key={idx}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent underline hover:text-accent-dim transition-colors inline-flex items-center gap-0.5 font-medium"
        >
          {linkText}
          <span className="text-[10px]" aria-hidden="true">↗</span>
        </a>
      );
    }

    // Plain text
    return <span key={idx}>{part}</span>;
  });
}

function CodeBlock({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-3 rounded-xl border border-border bg-bg overflow-hidden shadow-xs">
      <div className="flex items-center justify-between border-b border-border bg-surface px-3.5 py-1.5 text-xs font-mono text-fg-muted">
        <span>{language || "code"}</span>
        <button
          onClick={handleCopy}
          className="rounded px-2 py-0.5 text-[11px] text-fg-muted hover:text-fg hover:bg-surface-hover transition-colors"
        >
          {copied ? "✓ Copied" : "Copy"}
        </button>
      </div>
      <pre className="p-3.5 overflow-x-auto font-mono text-xs text-fg leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}

/**
 * Full Markdown block parser for messages.
 */
export function MarkdownRenderer({ content, isUser = false }: MarkdownRendererProps) {
  if (!content) return null;

  if (isUser) {
    return (
      <div className="leading-relaxed whitespace-pre-wrap break-words font-sans">
        {content}
      </div>
    );
  }

  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];

  let inCodeBlock = false;
  let codeBuffer: string[] = [];
  let codeLanguage = "";

  let listBuffer: { type: "bullet" | "number" | "check"; text: string; checked?: boolean }[] = [];

  const flushList = () => {
    if (listBuffer.length === 0) return;

    elements.push(
      <ul key={`list-${elements.length}`} className="my-2 space-y-1 pl-1">
        {listBuffer.map((item, idx) => {
          if (item.type === "check") {
            return (
              <li key={idx} className="flex items-start gap-2 text-sm text-fg leading-relaxed">
                <span
                  className={`mt-1 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded border text-[9px] font-bold ${
                    item.checked
                      ? "border-status-active bg-status-active/20 text-status-active"
                      : "border-border bg-surface text-transparent"
                  }`}
                >
                  ✓
                </span>
                <span className={item.checked ? "text-fg-muted line-through" : "text-fg"}>
                  {parseInlineMarkdown(item.text)}
                </span>
              </li>
            );
          }

          return (
            <li key={idx} className="flex items-start gap-2 text-sm text-fg leading-relaxed">
              <span className="text-accent mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              <span>{parseInlineMarkdown(item.text)}</span>
            </li>
          );
        })}
      </ul>
    );
    listBuffer = [];
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // 1. Code Block start / end
    if (trimmed.startsWith("```")) {
      if (inCodeBlock) {
        // End of code block
        elements.push(
          <CodeBlock
            key={`code-${elements.length}`}
            code={codeBuffer.join("\n")}
            language={codeLanguage}
          />
        );
        codeBuffer = [];
        codeLanguage = "";
        inCodeBlock = false;
      } else {
        // Start of code block
        flushList();
        inCodeBlock = true;
        codeLanguage = trimmed.slice(3).trim();
      }
      continue;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      continue;
    }

    // 2. Checklist items: "- [ ] " or "- [x] "
    const checkMatch = line.match(/^(\s*)[-*]\s*\[([ xX])\]\s*(.*)$/);
    if (checkMatch) {
      const isChecked = checkMatch[2].toLowerCase() === "x";
      listBuffer.push({ type: "check", text: checkMatch[3], checked: isChecked });
      continue;
    }

    // 3. Bullet list: "- ", "* "
    const bulletMatch = line.match(/^(\s*)[-*]\s+(.*)$/);
    if (bulletMatch) {
      listBuffer.push({ type: "bullet", text: bulletMatch[2] });
      continue;
    }

    // 4. Numbered list: "1. "
    const numberMatch = line.match(/^(\s*)\d+\.\s+(.*)$/);
    if (numberMatch) {
      listBuffer.push({ type: "number", text: numberMatch[2] });
      continue;
    }

    // If not a list item, flush any pending list
    flushList();

    // 5. Empty line (Paragraph break)
    if (!trimmed) {
      elements.push(<div key={`space-${i}`} className="h-2" />);
      continue;
    }

    // 6. Headers
    if (trimmed.startsWith("### ")) {
      elements.push(
        <h3 key={`h3-${i}`} className="font-display font-bold text-base text-fg mt-3.5 mb-1.5 tracking-tight">
          {parseInlineMarkdown(trimmed.slice(4))}
        </h3>
      );
      continue;
    }
    if (trimmed.startsWith("## ")) {
      elements.push(
        <h2 key={`h2-${i}`} className="font-display font-bold text-lg text-fg mt-4 mb-2 tracking-tight">
          {parseInlineMarkdown(trimmed.slice(3))}
        </h2>
      );
      continue;
    }
    if (trimmed.startsWith("# ")) {
      elements.push(
        <h1 key={`h1-${i}`} className="font-display font-bold text-xl text-fg mt-5 mb-2.5 tracking-tight">
          {parseInlineMarkdown(trimmed.slice(2))}
        </h1>
      );
      continue;
    }

    // 7. Blockquotes: "> "
    if (trimmed.startsWith("> ")) {
      elements.push(
        <blockquote
          key={`quote-${i}`}
          className="my-2 border-l-2 border-accent bg-accent/5 rounded-r-md px-3.5 py-1.5 text-xs italic text-fg-muted"
        >
          {parseInlineMarkdown(trimmed.slice(2))}
        </blockquote>
      );
      continue;
    }

    // 8. Horizontal rule: "---" or "***"
    if (trimmed === "---" || trimmed === "***") {
      elements.push(<hr key={`hr-${i}`} className="my-3 border-border" />);
      continue;
    }

    // 9. Standard Paragraph
    elements.push(
      <p key={`p-${i}`} className="text-sm leading-relaxed text-fg my-1 break-words">
        {parseInlineMarkdown(line)}
      </p>
    );
  }

  // Flush any trailing list
  flushList();

  // If unclosed code block at the end
  if (inCodeBlock && codeBuffer.length > 0) {
    elements.push(
      <CodeBlock
        key={`code-end`}
        code={codeBuffer.join("\n")}
        language={codeLanguage}
      />
    );
  }

  return <div className="space-y-0.5">{elements}</div>;
}
