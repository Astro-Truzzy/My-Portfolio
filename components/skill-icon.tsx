"use client";

import { useState } from "react";
import type { Skill } from "@/lib/skills";
import { cn } from "@/lib/utils";

export function SkillIcon({
  skill,
  size = 16,
}: {
  skill: Skill;
  size?: number;
}) {
  const [failed, setFailed] = useState(false);
  const initial = skill.name.charAt(0).toUpperCase();

  if (!skill.slug || failed) {
    return (
      <span
        className="inline-flex shrink-0 items-center justify-center rounded-sm bg-accent/15 font-mono text-[10px] font-semibold text-accent"
        style={{ width: size, height: size }}
        aria-hidden="true"
      >
        {initial}
      </span>
    );
  }

  const hex = skill.hex ?? "2ee6c5";

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://cdn.simpleicons.org/${skill.slug}/${hex}`}
      alt=""
      width={size}
      height={size}
      decoding="async"
      className="shrink-0"
      onError={() => setFailed(true)}
    />
  );
}

export function SkillPill({
  skill,
  className,
}: {
  skill: Skill;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-line bg-canvas/80 px-2.5 py-1 text-[12px] text-ink shadow-[0_0_0_1px_rgba(0,0,0,0.2)] backdrop-blur-sm",
        className,
      )}
    >
      <SkillIcon skill={skill} size={14} />
      <span className="whitespace-nowrap font-sans tracking-tight">{skill.name}</span>
    </span>
  );
}
