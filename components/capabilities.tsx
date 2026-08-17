import { capabilities } from "@/lib/content";
import { CopyCommand } from "@/components/copy-command";
import { SectionLabel } from "@/components/section-label";

export function Capabilities() {
  return (
    <section id="capabilities" className="px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionLabel index="02" title="What I build" />
        <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <h2 className="max-w-md font-sans text-3xl tracking-tight text-ink md:text-5xl">
            Capabilities, not just past projects.
          </h2>
          <p className="max-w-sm text-sm leading-relaxed text-ink-soft">
            What I am hired to do — drawn from products I have already shipped,
            not a wish list.
          </p>
        </div>

        <ul className="grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-3">
          {capabilities.map((cap, i) => (
            <li
              key={cap.title}
              className="flex flex-col bg-canvas p-6 md:p-8"
            >
              <p className="font-mono text-[11px] text-ink-faint">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-4 font-sans text-xl tracking-tight text-ink">
                {cap.title}
              </h3>
              <p className="mt-3 mb-6 text-sm leading-relaxed text-ink-soft">
                {cap.description}
              </p>
              <ul className="mb-6 flex flex-wrap gap-2">
                {cap.stack.map((t) => (
                  <li
                    key={t}
                    className="border border-line px-2 py-1 font-mono text-[10px] tracking-[0.08em] text-ink-soft uppercase"
                  >
                    {t}
                  </li>
                ))}
              </ul>
              <CopyCommand command={cap.command} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
