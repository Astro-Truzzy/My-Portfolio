import { NextResponse } from "next/server";
import {
  detectCountry,
  detectOS,
  isBot,
  recordHit,
  toSnapshot,
} from "@/lib/analytics";
import { readAnalytics, updateAnalytics } from "@/lib/analytics-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const store = await readAnalytics();
  return NextResponse.json(toSnapshot(store), {
    headers: { "Cache-Control": "no-store" },
  });
}

export async function POST(req: Request) {
  const ua = req.headers.get("user-agent") ?? "";
  if (isBot(ua)) {
    return NextResponse.json(toSnapshot(await readAnalytics()));
  }

  const store = await updateAnalytics((current) =>
    recordHit(
      {
        ...current,
        countries: { ...current.countries },
        os: { ...current.os },
      },
      detectCountry(req.headers),
      detectOS(ua),
    ),
  );

  return NextResponse.json(toSnapshot(store), {
    headers: { "Cache-Control": "no-store" },
  });
}
