"use client";

import { useState } from "react";
import { faq } from "@/lib/content";

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="mt-20 border-t border-line pt-12">
      <h3 className="font-mono text-[11px] tracking-[0.18em] text-ink-faint uppercase">
        FAQ
      </h3>
      <ul className="mt-6 divide-y divide-line border-y border-line">
        {faq.map((item, i) => {
          const isOpen = open === i;
          return (
            <li key={item.q}>
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-start justify-between gap-6 py-5 text-left"
              >
                <span className="font-sans text-lg tracking-tight text-ink">
                  {item.q}
                </span>
                <span className="font-mono text-sm text-ink-faint" aria-hidden="true">
                  {isOpen ? "–" : "+"}
                </span>
              </button>
              <div
                className={
                  isOpen
                    ? "grid grid-rows-[1fr] transition-[grid-template-rows] duration-300"
                    : "grid grid-rows-[0fr] transition-[grid-template-rows] duration-300"
                }
              >
                <div className="overflow-hidden">
                  <p className="pb-5 font-serif text-base leading-relaxed text-ink-soft">
                    {item.a}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
