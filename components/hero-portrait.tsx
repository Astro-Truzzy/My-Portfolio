"use client";

import Image from "next/image";
import { useRef, type PointerEvent } from "react";
import { site } from "@/lib/content";

export function HeroPortrait({
  className,
  reduceMotion,
}: {
  className?: string;
  reduceMotion?: boolean;
}) {
  const live = !reduceMotion;
  const stage = useRef<HTMLDivElement>(null);

  function onMove(event: PointerEvent<HTMLDivElement>) {
    if (!live) return;
    const el = stage.current;
    if (!el) return;
    const box = el.getBoundingClientRect();
    el.style.setProperty(
      "--px",
      String((event.clientX - box.left) / box.width),
    );
    el.style.setProperty(
      "--py",
      String((event.clientY - box.top) / box.height),
    );
  }

  function onLeave() {
    const el = stage.current;
    if (!el) return;
    el.style.setProperty("--px", "0.5");
    el.style.setProperty("--py", "0.5");
  }

  return (
    <div
      ref={stage}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={`hero-portrait group ${live ? "is-live" : ""} ${className ?? ""}`.trim()}
    >
      <div className="hero-portrait-frame relative">
        <span className="hero-portrait-corner left-3 top-3" />
        <span className="hero-portrait-corner top-3 right-3 rotate-90" />
        <span className="hero-portrait-corner bottom-3 left-3 -rotate-90" />
        <span className="hero-portrait-corner right-3 bottom-3 rotate-180" />

        <div className="relative overflow-hidden rounded-[1.15rem] bg-canvas-2">
          <div className="relative aspect-3/4">
            <Image
              src="/portrait.jpg"
              alt={`Portrait of ${site.name}`}
              fill
              fetchPriority="high"
              loading="eager"
              sizes="(min-width: 1024px) 328px, 236px"
              className="object-cover object-[center_18%] grayscale-[0.12] transition-[filter,transform] duration-700 ease-out group-hover:grayscale-0 group-hover:scale-[1.035]"
            />
          </div>
          <span className="hero-portrait-shine pointer-events-none absolute inset-0" />
        </div>
      </div>
    </div>
  );
}
