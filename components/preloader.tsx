"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { site } from "@/lib/content";

function subscribeEmpty() {
  return () => undefined;
}

function shouldShowPreloader() {
  try {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return false;
    }
    return sessionStorage.getItem("tw-preloader") !== "1";
  } catch {
    return false;
  }
}

export function Preloader() {
  const show = useSyncExternalStore(
    subscribeEmpty,
    shouldShowPreloader,
    () => false,
  );
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!show) return;

    const start = performance.now();
    const duration = 620;
    let frame = 0;
    let hideTimer = 0;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      setCount(Math.round(t * 100));
      if (t < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        hideTimer = window.setTimeout(() => {
          window.dispatchEvent(new Event("tw:ready"));
          setDone(true);
          try {
            sessionStorage.setItem("tw-preloader", "1");
          } catch {
            /* ignore */
          }
        }, 120);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(hideTimer);
    };
  }, [show]);

  if (!show || done) return null;

  return (
    <div
      data-preloader=""
      className="fixed inset-0 z-[100] flex items-end justify-between bg-canvas px-6 py-8 md:px-10"
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <p className="font-sans text-2xl tracking-tight text-ink md:text-4xl">
        {site.firstName} <span className="text-ink-soft">{site.lastName}</span>
      </p>
      <p className="font-mono text-sm tabular-nums text-accent">
        {String(count).padStart(3, "0")}
      </p>
    </div>
  );
}
