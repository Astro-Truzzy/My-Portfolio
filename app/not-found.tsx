import Link from "next/link";
import { site } from "@/lib/content";

export default function NotFound() {
  return (
    <main className="flex min-h-svh flex-col items-start justify-center px-8">
      <p className="font-mono text-[11px] tracking-[0.2em] text-accent uppercase">
        404
      </p>
      <h1 className="mt-4 font-sans text-5xl tracking-tight">No such page.</h1>
      <Link
        href="/"
        className="mt-8 font-mono text-[11px] tracking-[0.16em] text-ink-soft uppercase hover:text-ink"
      >
        Back to {site.firstName} →
      </Link>
    </main>
  );
}
