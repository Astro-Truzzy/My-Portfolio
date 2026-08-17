import Image from "next/image";
import { projects, type Project } from "@/lib/content";
import { SectionLabel } from "@/components/section-label";

export function SelectedWork() {
  return (
    <section id="work" className="bg-canvas-2 px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionLabel index="03" title="Selected Work" />
        <h2 className="mb-12 max-w-lg font-sans text-3xl tracking-tight md:text-5xl">
          Shipped products, not mock case studies.
        </h2>

        <ul className="border-t border-line">
          {projects.map((project, i) => (
            <li key={project.id} className="border-b border-line">
              <a
                href={`#case-${project.id}`}
                className="group grid grid-cols-[auto_1fr_auto] items-start gap-4 py-5 md:gap-8 md:py-6"
              >
                <span className="pt-1 font-mono text-[11px] text-ink-faint">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0">
                  <span className="flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between md:gap-8">
                    <span className="font-sans text-xl tracking-tight text-ink md:text-3xl">
                      {project.title}
                    </span>
                    <span className="shrink-0 font-mono text-[11px] tracking-[0.08em] text-ink-faint uppercase">
                      {project.category} / {project.language}
                    </span>
                  </span>
                  <span className="grid grid-rows-[1fr] md:grid-rows-[0fr] md:transition-[grid-template-rows] md:duration-300 md:ease-out md:group-hover:grid-rows-[1fr] md:group-focus-visible:grid-rows-[1fr]">
                    <span className="overflow-hidden">
                      <span className="mt-2 block font-serif text-base italic leading-relaxed text-ink-soft md:pt-2">
                        {project.hoverLine}
                      </span>
                    </span>
                  </span>
                </span>
                <span
                  className="pt-1 font-mono text-sm text-ink-faint transition-colors group-hover:text-accent"
                  aria-hidden="true"
                >
                  ↗
                </span>
              </a>
            </li>
          ))}
        </ul>

        <div className="mt-24 space-y-24 md:space-y-32">
          {projects.map((project, i) => (
            <article
              key={project.id}
              id={`case-${project.id}`}
              className="scroll-mt-24 grid items-stretch gap-10 lg:grid-cols-2 lg:gap-16"
            >
              <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                <p className="font-mono text-[11px] tracking-[0.16em] text-ink-faint uppercase">
                  {project.type} · {project.date}
                </p>
                <h3 className="mt-3 font-sans text-3xl tracking-tight md:text-4xl">
                  {project.title}
                </h3>
                <p className="mt-6 font-serif text-lg leading-relaxed text-ink-soft">
                  {project.story}
                </p>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {project.stack.map((t) => (
                    <li
                      key={t}
                      className="px-2 py-1 font-mono text-[10px] tracking-[0.08em] uppercase"
                      style={{
                        color: project.accent,
                        border: `1px solid ${project.accent}55`,
                      }}
                    >
                      {t}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex flex-wrap gap-4">
                  {project.links.length > 0 ? (
                    project.links.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        className="font-mono text-[11px] tracking-[0.14em] text-accent uppercase underline-offset-4 hover:underline"
                      >
                        {link.label} ↗
                      </a>
                    ))
                  ) : (
                    <p className="font-mono text-[11px] text-ink-faint">
                      Live / GitHub URLs not on résumé — placeholder.
                    </p>
                  )}
                </div>
              </div>

              <WorkVisual project={project} flipped={i % 2 === 1} />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function WorkVisual({
  project,
  flipped,
}: {
  project: Project;
  flipped: boolean;
}) {
  return (
    <div
      className={`group/visual relative flex min-h-[280px] flex-col justify-between overflow-hidden border border-line p-8 md:min-h-[340px] md:p-10 ${
        flipped ? "lg:order-1" : ""
      }`}
    >
      <Image
        src={project.image}
        alt={`${project.title} product still`}
        fill
        sizes="(min-width: 1024px) 28rem, 100vw"
        className="object-cover object-top transition-transform duration-700 ease-out group-hover/visual:scale-[1.04]"
      />
      <span
        className="pointer-events-none absolute inset-0"
        style={{
          background: `linear-gradient(180deg, color-mix(in srgb, ${project.accent} 22%, rgba(7, 8, 10, 0.42)) 0%, rgba(7, 8, 10, 0.5) 42%, rgba(7, 8, 10, 0.86) 100%)`,
        }}
      />

      <p
        className="relative z-10 font-mono text-[11px] tracking-[0.2em] uppercase drop-shadow-[0_1px_8px_rgba(0,0,0,0.55)]"
        style={{ color: project.accent }}
      >
        {project.category}
      </p>
      <p className="relative z-10 font-sans text-[clamp(2.4rem,6vw,4.5rem)] leading-[0.9] tracking-[-0.04em] text-[#f3efe6] drop-shadow-[0_2px_16px_rgba(0,0,0,0.55)]">
        {project.title}
      </p>
      <div className="relative z-10 flex items-end justify-between gap-4">
        <p className="font-mono text-[11px] text-[#f3efe6]/75">
          {project.stack.slice(0, 3).join(" · ")}
        </p>
        {project.metric ? (
          <p className="text-right">
            <span className="block font-sans text-3xl tracking-tight text-[#f3efe6]">
              {project.metric.value}
            </span>
            <span className="font-mono text-[10px] text-[#f3efe6]/55">
              {project.metric.label}
            </span>
          </p>
        ) : null}
      </div>
    </div>
  );
}
