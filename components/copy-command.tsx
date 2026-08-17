"use client";

import { useState } from "react";

export function CopyCommand({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      const el = document.createElement("textarea");
      el.value = command;
      el.setAttribute("readonly", "");
      el.style.position = "absolute";
      el.style.left = "-9999px";
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="group mt-auto flex w-full items-center justify-between gap-3 border border-line bg-canvas/40 px-3 py-2 font-mono text-[11px] text-ink-soft transition-colors hover:border-accent/50 hover:text-ink"
      aria-label={copied ? "Command copied" : `Copy command: ${command}`}
    >
      <span className="truncate">
        <span className="text-accent">$</span> {command}
      </span>
      <span className="shrink-0 text-[10px] tracking-[0.14em] uppercase">
        {copied ? "copied" : "copy"}
      </span>
    </button>
  );
}
