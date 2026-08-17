"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

function navOffset() {
  const header = document.querySelector("header");
  return header?.getBoundingClientRect().height || 57;
}

export function StackEngine({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        ScrollTrigger.config({ ignoreMobileResize: true });

        const pages = gsap.utils.toArray<HTMLElement>("[data-stack-page]");

        pages.forEach((page, index) => {
          const next = pages[index + 1];
          const surface = page.querySelector<HTMLElement>(
            "[data-stack-surface]",
          );
          if (!next || !surface) return;

          const nav = () => navOffset();

          gsap.set(surface, {
            transformOrigin: "50% 80%",
            willChange: "transform",
            "--stack-dim": 0,
          });

          ScrollTrigger.create({
            trigger: page,
            start: () => {
              const n = nav();
              const compact = page.offsetHeight <= window.innerHeight - n + 24;
              return compact ? `top ${n}px` : "bottom bottom";
            },
            endTrigger: next,
            end: () => `top ${nav()}px`,
            pin: true,
            pinSpacing: false,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          });

          gsap.fromTo(
            surface,
            {
              scale: 1,
              borderRadius: "28px 28px 0px 0px",
              "--stack-dim": 0,
            },
            {
              scale: 0.9,
              borderRadius: "28px",
              "--stack-dim": 1,
              ease: "none",
              scrollTrigger: {
                trigger: next,
                start: "top bottom",
                end: () => `top ${nav()}px`,
                scrub: true,
                invalidateOnRefresh: true,
              },
            },
          );
        });

        const refresh = () => ScrollTrigger.refresh();
        const id = window.setTimeout(refresh, 250);
        window.addEventListener("load", refresh);

        return () => {
          window.clearTimeout(id);
          window.removeEventListener("load", refresh);
        };
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root} className="relative isolate bg-stack-gutter">
      {children}
    </div>
  );
}
