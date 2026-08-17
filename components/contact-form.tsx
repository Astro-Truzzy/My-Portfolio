"use client";

import { FormEvent, useState } from "react";
import { site } from "@/lib/content";
import { isValidEmail, mailtoHref } from "@/lib/utils";

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "sent" }
  | { kind: "mailto"; href: string }
  | { kind: "error"; message: string };

export function ContactForm() {
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    const company = String(data.get("company") ?? "").trim();

    if (company) return;

    if (!name || !email || !message) {
      setStatus({ kind: "error", message: "Name, email, and a note are required." });
      return;
    }
    if (!isValidEmail(email)) {
      setStatus({ kind: "error", message: "That email doesn’t look valid." });
      return;
    }

    setStatus({ kind: "submitting" });

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      const json = (await res.json()) as {
        ok?: boolean;
        channel?: string;
        mailto?: string;
        error?: string;
      };

      if (json.ok && json.channel === "resend") {
        setStatus({ kind: "sent" });
        form.reset();
        return;
      }

      if (json.ok && json.channel === "formspree") {
        setStatus({ kind: "sent" });
        form.reset();
        return;
      }

      const href =
        json.mailto || mailtoHref(site.email, name, email, message);

      if (json.channel === "mailto" || !json.ok) {
        window.location.href = href;
        setStatus({
          kind: "mailto",
          href,
        });
        return;
      }

      setStatus({
        kind: "error",
        message: json.error || "Could not send. Use email instead.",
      });
    } catch {
      const href = mailtoHref(site.email, name, email, message);
      window.location.href = href;
      setStatus({ kind: "mailto", href });
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-8" noValidate>
      <label className="sr-only" htmlFor="company">
        Company
      </label>
      <input
        id="company"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
      />

      <label className="block">
        <span className="font-mono text-[11px] tracking-[0.16em] text-ink-faint uppercase">
          Name
        </span>
        <input
          name="name"
          type="text"
          required
          autoComplete="name"
          className="mt-2 w-full border-0 border-b border-line-strong bg-transparent py-3 text-lg text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-accent"
          placeholder="Your name"
        />
      </label>

      <label className="block">
        <span className="font-mono text-[11px] tracking-[0.16em] text-ink-faint uppercase">
          Email
        </span>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          className="mt-2 w-full border-0 border-b border-line-strong bg-transparent py-3 text-lg text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-accent"
          placeholder="you@studio.com"
        />
      </label>

      <label className="block">
        <span className="font-mono text-[11px] tracking-[0.16em] text-ink-faint uppercase">
          What are you working on?
        </span>
        <textarea
          name="message"
          required
          rows={4}
          className="mt-2 w-full resize-y border-0 border-b border-line-strong bg-transparent py-3 text-lg text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-accent"
          placeholder="Role, product, or problem."
        />
      </label>

      <button
        type="submit"
        disabled={status.kind === "submitting"}
        className="bg-ink px-6 py-4 font-mono text-[12px] tracking-[0.2em] text-invert uppercase transition-opacity hover:opacity-80 disabled:opacity-50"
      >
        {status.kind === "submitting" ? "Sending…" : "Send"}
      </button>

      <div aria-live="polite" className="min-h-[1.5rem] text-sm">
        {status.kind === "sent" ? (
          <p className="text-accent">Sent. I’ll reply from {site.email}.</p>
        ) : null}
        {status.kind === "mailto" ? (
          <p className="text-ink-soft">
            Message was not sent from this site — your email client should open
            with a draft. If it doesn’t, write directly to{" "}
            <a className="text-accent underline-offset-4 hover:underline" href={`mailto:${site.email}`}>
              {site.email}
            </a>
            .
          </p>
        ) : null}
        {status.kind === "error" ? (
          <p className="text-accent">{status.message}</p>
        ) : null}
      </div>
    </form>
  );
}
