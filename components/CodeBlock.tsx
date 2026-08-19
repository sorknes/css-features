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
      <div className="mb-1 flex items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</p>
        <button
          type="button"
          onClick={handleCopy}
          aria-live="polite"
          className="inline-flex items-center gap-1 rounded-full border border-border bg-white px-2.5 py-1 text-xs font-medium text-foreground hover:bg-surface"
        >
          {copied ? <BiCheck aria-hidden="true" className="h-3.5 w-3.5" /> : <BiCopy aria-hidden="true" className="h-3.5 w-3.5" />}
          {copied ? "Copied!" : "Copy"}
          <span className="sr-only"> {label} code</span>
        </button>
      </div>
      <pre className="overflow-x-auto rounded-md bg-surface p-2.5 text-xs leading-relaxed">
        <code className="font-mono">{code}</code>
      </pre>
    </div>
  );
}
