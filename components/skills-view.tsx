"use client";

import dynamic from "next/dynamic";
import { useReducedMotion } from "framer-motion";
import { useMemo, useState, useSyncExternalStore } from "react";
import type { DeskTheme } from "@/components/skill-globe";
import { SkillIcon, SkillPill } from "@/components/skill-icon";
import { skillCategories, skillsIn, type SkillCategoryId } from "@/lib/skills";
import { cn } from "@/lib/utils";

const SkillGlobe = dynamic(
  () => import("@/components/skill-globe").then((m) => m.SkillGlobe),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[min(78vh,720px)] items-center justify-center font-mono text-[11px] tracking-[0.16em] text-ink-faint uppercase">
        Loading desk
      </div>
    ),
  },
);

function subscribeTheme(onStoreChange: () => void) {
  window.addEventListener("tw-theme", onStoreChange);
  return () => window.removeEventListener("tw-theme", onStoreChange);
}

const defaultTheme: DeskTheme = {
  accent: "#2ee6c5",
  canvas: "#07080a",
  ink: "#f3efe6",
  light: false,
};

let themeSnapshot = defaultTheme;

function readTheme(): DeskTheme {
  const root = document.documentElement;
  const styles = getComputedStyle(root);
  const next: DeskTheme = {
    accent: styles.getPropertyValue("--accent").trim() || "#2ee6c5",
    canvas: styles.getPropertyValue("--canvas").trim() || "#07080a",
    ink: styles.getPropertyValue("--ink").trim() || "#f3efe6",
    light: root.getAttribute("data-theme") === "light",
  };
  if (
    themeSnapshot.accent === next.accent &&
    themeSnapshot.canvas === next.canvas &&
    themeSnapshot.ink === next.ink &&
    themeSnapshot.light === next.light
  ) {
    return themeSnapshot;
  }
  themeSnapshot = next;
  return themeSnapshot;
}

export function SkillsView() {
  const [tab, setTab] = useState<SkillCategoryId | "all">("all");
  const theme = useSyncExternalStore(
    subscribeTheme,
    readTheme,
    () => defaultTheme,
  );
  const reduceMotion = useReducedMotion();
  const items = useMemo(() => skillsIn(tab), [tab]);
  const meta = skillCategories.find((c) => c.id === tab) ?? skillCategories[0];
  const showOrbit = !reduceMotion;

  return (
    <div className="px-5 pt-[calc(var(--nav-h)+1.5rem)] pb-24 md:px-8 md:pt-[calc(var(--nav-h)+2rem)] md:pb-32">
      <div className="mx-auto max-w-6xl text-center">
        <p className="font-mono text-[11px] tracking-[0.28em] text-accent uppercase">
          Expertise
        </p>
        <h1 className="mt-4 font-sans text-[clamp(2.4rem,7vw,5.5rem)] leading-[0.95] tracking-[-0.04em]">
          Technical Expertise
        </h1>

        <div
          role="tablist"
          aria-label="Skill categories"
          className="mt-10 flex flex-wrap items-center justify-center gap-2"
        >
          {skillCategories.map((c) => (
            <button
              key={c.id}
              type="button"
              role="tab"
              aria-selected={tab === c.id}
              onClick={() => setTab(c.id)}
              className={cn(
                "border px-4 py-2 font-mono text-[11px] tracking-[0.14em] uppercase transition-colors",
                tab === c.id
                  ? "border-accent bg-accent text-invert"
                  : "border-line text-ink-soft hover:border-ink hover:text-ink",
              )}
            >
              {c.title}
            </button>
          ))}
        </div>
      </div>

      {showOrbit ? (
        <SkillGlobe
          items={items}
          theme={theme}
          reduceMotion={Boolean(reduceMotion)}
        />
      ) : (
        <ul className="mx-auto mt-16 flex max-w-4xl flex-wrap justify-center gap-2">
          {items.map((skill) => (
            <li key={skill.name}>
              <SkillPill skill={skill} />
            </li>
          ))}
        </ul>
      )}

      <section className="mx-auto mt-8 max-w-6xl">
        <div className="flex flex-col gap-3 border-t border-line pt-12 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="font-sans text-3xl tracking-tight md:text-4xl">
              {meta.heading}
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-soft">
              {meta.description}
            </p>
          </div>
          <p className="font-mono text-[11px] tracking-[0.16em] text-ink-faint uppercase">
            {items.length} {items.length === 1 ? "skill" : "skills"}
          </p>
        </div>

        <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((skill) => (
            <li
              key={skill.name}
              className="flex items-center gap-3 border border-line bg-canvas-2 px-4 py-3"
            >
              <SkillIcon skill={skill} size={20} />
              <span className="text-sm text-ink">{skill.name}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
