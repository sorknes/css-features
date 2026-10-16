"use client";

import { useState } from "react";
import { BiCopy, BiCheck } from "react-icons/bi";

export default function CodeBlock({ label, code }: { label: string; code: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API unavailable or permission denied — button just won't confirm.
    }
  }

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <p className="label text-muted">{label}</p>
        <button
          type="button"
          onClick={handleCopy}
          className="label relative inline-flex items-center gap-1.5 border border-foreground px-2 py-1 transition-colors after:absolute after:-inset-2 after:content-[''] hover:bg-forest hover:text-forest-foreground"
        >
          {copied ? <BiCheck aria-hidden="true" className="h-3.5 w-3.5" /> : <BiCopy aria-hidden="true" className="h-3.5 w-3.5" />}
          {copied ? "Copied" : "Copy"}
          <span className="sr-only"> {label} code</span>
        </button>
        <span aria-live="polite" className="sr-only">
          {copied ? `${label} code copied` : ""}
        </span>
      </div>
      <pre className="bg-surface p-3 text-xs leading-relaxed break-words whitespace-pre-wrap">
        <code className="font-mono">{code}</code>
      </pre>
    </div>
  );
}
