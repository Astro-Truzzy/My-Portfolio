import { site } from "@/lib/content";

export function Footer() {
  return (
    <footer className="relative z-8 overflow-hidden rounded-t-(--stack-radius) border-t border-line bg-canvas-2 px-5 py-8 shadow-(--stack-shadow) md:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 text-ink-faint sm:flex-row sm:items-center sm:justify-between">
        <p className="font-mono text-[11px] tracking-[0.12em] uppercase">
          © {new Date().getFullYear()} {site.name}
        </p>
        <p className="font-mono text-[11px] tracking-[0.08em]">
          {site.city} · {site.timezoneAbbr} · Built as the work itself
        </p>
      </div>
    </footer>
  );
}
