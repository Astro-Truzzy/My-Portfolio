import { NextResponse } from "next/server";
import { Resend } from "resend";
import { site } from "@/lib/content";
import { isValidEmail, mailtoHref } from "@/lib/utils";

export const runtime = "nodejs";

const SANDBOX_FROM = "Trust Williams <onboarding@resend.dev>";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

type Payload = {
  name?: unknown;
  email?: unknown;
  message?: unknown;
};

function clip(value: unknown, max: number) {
  return String(value ?? "").trim().slice(0, max);
}

function formspreeId(raw: string | undefined) {
  if (!raw) return null;
  const trimmed = raw.trim();
  const fromUrl = trimmed.match(/formspree\.io\/f\/([^/?#]+)/i);
  if (fromUrl) return fromUrl[1];
  if (/^https?:\/\//i.test(trimmed)) return null;
  return trimmed;
}

function isUnverifiedDomain(message: string) {
  return /not verified|domain is not verified|domain mismatch/i.test(message);
}

function isSandboxRecipient(message: string) {
  return /only send testing emails|you can only send to|own email/i.test(message);
}

export async function POST(req: Request) {
  let body: Payload;
  try {
    body = (await req.json()) as Payload;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON." }, { status: 400 });
  }

  const name = clip(body.name, 120);
  const email = clip(body.email, 200);
  const message = clip(body.message, 5000);

  if (!name || !email || !message) {
    return NextResponse.json(
      { ok: false, error: "Name, email, and a note are required." },
      { status: 400 },
    );
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ ok: false, error: "Invalid email." }, { status: 400 });
  }

  const mailto = mailtoHref(site.email, name, email, message);
  const to = process.env.CONTACT_TO ?? site.email;
  const text = `${message}\n\n— ${name} (${email})`;
  const fingerprint = Buffer.from(`${email}|${name}|${message}`)
    .toString("base64url")
    .slice(0, 100);

  if (resend) {
    const attempts: Array<{ from: string; to: string; label: string }> = [];
    const seen = new Set<string>();

    function enqueue(from: string, recipient: string, label: string) {
      const id = `${from}|${recipient}|${label}`;
      if (seen.has(id)) return;
      seen.add(id);
      attempts.push({ from, to: recipient, label });
    }

    enqueue(process.env.RESEND_FROM ?? SANDBOX_FROM, to, "configured");

    async function sendAttempt(from: string, recipient: string, label: string) {
      return resend!.emails.send(
        {
          from,
          to: [recipient],
          replyTo: email,
          subject: `Portfolio — note from ${name}`,
          text,
        },
        { idempotencyKey: `portfolio-contact/${fingerprint}/${label}`.slice(0, 256) },
      );
    }

    let lastError: string | undefined;
    for (let i = 0; i < attempts.length; i++) {
      const attempt = attempts[i];
      const { error } = await sendAttempt(attempt.from, attempt.to, attempt.label);
      if (!error) {
        return NextResponse.json({ ok: true, channel: "resend" });
      }

      lastError = error.message;
      console.error("Resend contact send failed:", error.message);

      if (isUnverifiedDomain(error.message) && attempt.from !== SANDBOX_FROM) {
        enqueue(SANDBOX_FROM, attempt.to, "sandbox");
      }
      if (
        (isUnverifiedDomain(error.message) || isSandboxRecipient(error.message)) &&
        attempt.to.toLowerCase() !== site.email.toLowerCase()
      ) {
        enqueue(SANDBOX_FROM, site.email, "sandbox-account");
      }
    }

    const formId = formspreeId(process.env.FORMSPREE_FORM_ID);
    if (formId) {
      const sent = await sendFormspree(formId, name, email, message);
      if (sent) return NextResponse.json({ ok: true, channel: "formspree" });
    }

    return NextResponse.json({
      ok: false,
      channel: "mailto",
      mailto,
      error: lastError,
    });
  }

  const formId = formspreeId(process.env.FORMSPREE_FORM_ID);
  if (formId) {
    const sent = await sendFormspree(formId, name, email, message);
    if (sent) return NextResponse.json({ ok: true, channel: "formspree" });
    return NextResponse.json({
      ok: false,
      channel: "mailto",
      mailto,
      error: "Formspree rejected the request.",
    });
  }

  return NextResponse.json({
    ok: false,
    channel: "mailto",
    mailto,
  });
}

async function sendFormspree(
  formId: string,
  name: string,
  email: string,
  message: string,
) {
  const res = await fetch(`https://formspree.io/f/${formId}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, message, _replyto: email }),
  });
  return res.ok;
}
