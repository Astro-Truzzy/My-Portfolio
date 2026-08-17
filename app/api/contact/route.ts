import { NextResponse } from "next/server";
import { Resend } from "resend";
import { site } from "@/lib/content";
import { isValidEmail, mailtoHref } from "@/lib/utils";

export const runtime = "nodejs";

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

  if (resend) {
    const from = process.env.RESEND_FROM ?? "Portfolio <onboarding@resend.dev>";
    const key = `portfolio-contact/${Buffer.from(`${email}|${name}|${message}`).toString("base64url").slice(0, 120)}`;
    const { error } = await resend.emails.send(
      {
        from,
        to: [to],
        replyTo: email,
        subject: `Portfolio — note from ${name}`,
        text,
      },
      { idempotencyKey: key },
    );

    if (error) {
      return NextResponse.json({
        ok: false,
        channel: "mailto",
        mailto,
        error: error.message,
      });
    }

    return NextResponse.json({ ok: true, channel: "resend" });
  }

  const formspree = process.env.FORMSPREE_FORM_ID;
  if (formspree) {
    const res = await fetch(`https://formspree.io/f/${formspree}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, message, _replyto: email }),
    });

    if (!res.ok) {
      return NextResponse.json({
        ok: false,
        channel: "mailto",
        mailto,
        error: "Formspree rejected the request.",
      });
    }

    return NextResponse.json({ ok: true, channel: "formspree" });
  }

  return NextResponse.json({
    ok: false,
    channel: "mailto",
    mailto,
  });
}
