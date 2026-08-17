import Link from "next/link";
import { spokenLanguages, toolkit } from "@/lib/content";
import { SectionLabel } from "@/components/section-label";

const groups = [
  { title: "Languages", items: toolkit.languages },
  { title: "Frontend & UI", items: toolkit.frontend },
  { title: "Backend & Data", items: toolkit.backend },
  { title: "Tools & Env", items: toolkit.tools },
] as const;

export function Toolkit() {
  return (
    <section id="toolkit" className="bg-canvas-2 px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionLabel index="05" title="Toolkit" />
        <div className="mb-14 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <h2 className="font-sans text-3xl tracking-tight md:text-5xl">
            What I actually use.
          </h2>
          <Link
            href="/skills"
            className="font-mono text-[11px] tracking-[0.16em] text-accent uppercase hover:underline"
          >
            Open skills →
          </Link>
        </div>

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {groups.map((g) => (
            <div key={g.title}>
              <h3 className="border-b border-line pb-3 font-mono text-[11px] tracking-[0.18em] text-accent uppercase">
                {g.title}
              </h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {g.items.map((item) => (
                  <li
                    key={item}
                    className="border border-line px-2.5 py-1 font-mono text-[11px] text-ink-soft"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="mt-12 font-mono text-[11px] tracking-[0.08em] text-ink-faint uppercase">
          Spoken{" "}
          <span className="text-ink-soft">
            {spokenLanguages.map((l) => `${l.name} (${l.level})`).join(" · ")}
          </span>
        </p>
      </div>
    </section>
  );
}
