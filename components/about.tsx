import { about, proof } from "@/lib/content";
import { SectionLabel } from "@/components/section-label";

export function About() {
  return (
    <section id="about" className="bg-canvas-2 px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionLabel index="01" title="About" />

        <div className="grid gap-14 lg:grid-cols-[1.2fr_0.8fr] lg:gap-20">
          <div>
            <h2 className="sr-only">About</h2>
            <div className="space-y-5 text-lg leading-relaxed text-ink-soft md:text-xl">
              {about.bio.map((p) => (
                <p key={p.slice(0, 24)} className="text-pretty">
                  {p}
                </p>
              ))}
            </div>
            <p className="mt-8 font-mono text-[11px] tracking-[0.16em] text-ink-faint uppercase">
              Core stack{" "}
              <span className="text-ink-soft">
                {about.overlayTags.join(" · ")}
              </span>
            </p>
          </div>

          <div>
            <ul className="grid grid-cols-2 border border-line">
              {proof.map((stat, i) => (
                <li
                  key={stat.label}
                  className={`flex flex-col justify-between gap-6 p-5 md:p-6 ${
                    i % 2 === 0 ? "border-r border-line" : ""
                  } ${i < 2 ? "border-b border-line" : ""}`}
                >
                  <p className="font-sans text-4xl tracking-tight text-ink md:text-5xl">
                    {stat.value}
                  </p>
                  <p className="font-mono text-[11px] leading-snug text-ink-soft">
                    {stat.label}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <ul className="mt-16 grid gap-8 border-t border-line pt-10 md:grid-cols-3">
          {about.values.map((v) => (
            <li key={v.title}>
              <p className="font-mono text-[11px] tracking-[0.18em] text-accent uppercase">
                {v.title}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                {v.body}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
