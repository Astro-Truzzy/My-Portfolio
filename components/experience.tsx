"use client";

import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useRef, useState } from "react";
import {
  award,
  certifications,
  education,
  experience,
  otherExperience,
} from "@/lib/content";
import { SectionLabel } from "@/components/section-label";
import { cn } from "@/lib/utils";

export function Experience() {
  const reduce = useReducedMotion();
  const listRef = useRef<HTMLOListElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [litThrough, setLitThrough] = useState(-1);

  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start 0.72", "end 0.4"],
  });
  const smooth = useSpring(scrollYProgress, {
    stiffness: 70,
    damping: 24,
    mass: 0.35,
  });
  const glowTop = useTransform(smooth, (v) => `${v * 100}%`);

  useMotionValueEvent(smooth, "change", (v) => {
    const list = listRef.current;
    if (!list) return;
    const y = v * list.offsetHeight;
    let next = -1;
    for (let i = 0; i < itemRefs.current.length; i++) {
      const item = itemRefs.current[i];
      if (item && item.offsetTop + 6 <= y) next = i;
    }
    setLitThrough((prev) => (prev === next ? prev : next));
  });

  return (
    <section id="experience" className="px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionLabel index="04" title="Experience" />
        <h2 className="mb-14 font-sans text-3xl tracking-tight md:text-5xl">
          Roles, newest first.
        </h2>

        <ol ref={listRef} className="relative">
          <div
            className="pointer-events-none absolute inset-y-0 left-1.25 w-px"
            aria-hidden="true"
          >
            <div className="absolute inset-0 bg-line" />
            {reduce ? (
              <div className="absolute inset-0 bg-accent/70" />
            ) : (
              <>
                <motion.div
                  className="absolute top-0 left-0 h-full w-full origin-top bg-accent"
                  style={{
                    scaleY: smooth,
                    boxShadow:
                      "0 0 10px color-mix(in srgb, var(--accent) 70%, transparent)",
                  }}
                />
                <motion.div
                  className="absolute left-1/2 z-2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent"
                  style={{
                    top: glowTop,
                    boxShadow:
                      "0 0 0 4px color-mix(in srgb, var(--accent) 28%, transparent), 0 0 18px 5px var(--accent)",
                  }}
                />
              </>
            )}
          </div>

          {experience.map((role, i) => {
            const lit = reduce || i <= litThrough;
            return (
              <motion.li
                key={`${role.company}-${role.start}`}
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                initial={reduce ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="relative mb-14 pl-8 last:mb-0 md:pl-12"
              >
                <span
                  className={cn(
                    "absolute top-1.5 left-1.25 z-1 size-2.5 -translate-x-1/2 rounded-full border-2 transition-[background-color,border-color,box-shadow] duration-200",
                    lit
                      ? "border-accent bg-accent shadow-[0_0_12px_var(--accent)]"
                      : "border-ink-faint bg-canvas",
                  )}
                  aria-hidden="true"
                />
                <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] tracking-[0.08em] text-ink-faint uppercase">
                  <span>
                    {role.start} – {role.end ?? "Present"}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{role.duration}</span>
                  {role.current ? (
                    <span className="border border-accent/40 px-2 py-0.5 text-accent">
                      Current
                    </span>
                  ) : null}
                </div>
                <h3 className="mt-3 font-sans text-2xl tracking-tight text-ink">
                  {role.title}
                </h3>
                <p className="mt-1 text-sm text-ink-soft">
                  {role.company}
                  <span className="text-ink-faint"> · {role.location}</span>
                </p>
                <ul className="mt-4 space-y-2">
                  {role.bullets.map((b) => (
                    <li
                      key={b}
                      className="text-sm leading-relaxed text-ink-soft before:mr-2 before:text-accent before:content-['—']"
                    >
                      {b}
                    </li>
                  ))}
                </ul>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {role.skills.map((s) => (
                    <li
                      key={s}
                      className="border border-line px-2 py-0.5 font-mono text-[10px] text-ink-faint uppercase"
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              </motion.li>
            );
          })}
        </ol>

        <p className="mt-12 max-w-3xl border-t border-line pt-8 text-sm leading-relaxed text-ink-soft">
          <span className="font-mono text-[11px] tracking-[0.16em] text-ink-faint uppercase">
            Also ·{" "}
          </span>
          {otherExperience}
        </p>

        <div className="mt-16 grid gap-10 border-t border-line pt-12 md:grid-cols-2">
          <div>
            <h3 className="font-mono text-[11px] tracking-[0.18em] text-accent uppercase">
              Education
            </h3>
            <ul className="mt-6 space-y-8">
              {education.map((ed) => (
                <li key={ed.credential}>
                  <p className="font-sans text-xl tracking-tight">
                    {ed.credential}
                  </p>
                  <p className="mt-1 text-sm text-ink-soft">
                    {ed.org} · {ed.location}
                  </p>
                  <p className="mt-1 font-mono text-[11px] text-ink-faint">
                    {ed.dates}
                  </p>
                  <ul className="mt-3 space-y-1">
                    {ed.notes.map((n) => (
                      <li key={n} className="text-sm text-ink-soft">
                        {n}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-mono text-[11px] tracking-[0.18em] text-accent uppercase">
              Certifications & award
            </h3>
            <p className="mt-6 font-sans text-xl tracking-tight">
              {award.title}
            </p>
            <p className="mt-1 font-mono text-[11px] text-ink-faint">
              {award.year}
            </p>
            <p className="mt-2 text-sm text-ink-soft">{award.detail}</p>
            <ul className="mt-8 space-y-3">
              {certifications.map((c) => (
                <li key={c.name} className="flex flex-col">
                  <span className="text-sm text-ink">{c.name}</span>
                  <span className="font-mono text-[11px] text-ink-faint">
                    {c.detail}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
