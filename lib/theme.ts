"use client";

import { flushSync } from "react-dom";

export type Theme = "dark" | "light";

type ViewTransition = {
  ready: Promise<void>;
  finished: Promise<void>;
};

type DocumentWithViewTransition = Document & {
  startViewTransition?: (update: () => void) => ViewTransition;
};

let busy = false;

export function getTheme(): Theme {
  return document.documentElement.getAttribute("data-theme") === "light"
    ? "light"
    : "dark";
}

export function applyTheme(next: Theme) {
  document.documentElement.setAttribute("data-theme", next);
  try {
    localStorage.setItem("theme", next);
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new Event("tw-theme"));
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export async function setTheme(
  next: Theme,
  origin?: { x: number; y: number; radius?: number },
) {
  if (busy || getTheme() === next) return;
  busy = true;

  const root = document.documentElement;
  const doc = document as DocumentWithViewTransition;
  const paint = () => {
    flushSync(() => {
      applyTheme(next);
    });
  };

  if (prefersReducedMotion()) {
    paint();
    busy = false;
    return;
  }

  const canReveal = typeof doc.startViewTransition === "function";

  if (!canReveal) {
    root.classList.add("theme-fade");
    paint();
    window.setTimeout(() => {
      root.classList.remove("theme-fade");
      busy = false;
    }, 900);
    return;
  }

  const x = origin?.x ?? window.innerWidth - 48;
  const y = origin?.y ?? 28;
  const startRadius = origin?.radius ?? 18;
  const endRadius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y),
  );

  root.classList.add("theme-switching");
  const transition = doc.startViewTransition!(paint);

  try {
    await transition.ready;
    root.animate(
      {
        clipPath: [
          `circle(${startRadius}px at ${x}px ${y}px)`,
          `circle(${endRadius}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration: 1250,
        easing: "cubic-bezier(0.65, 0, 0.35, 1)",
        fill: "both",
        pseudoElement: "::view-transition-new(root)",
      },
    );
    await transition.finished;
  } catch {
    /* skipped or interrupted */
  } finally {
    root.classList.remove("theme-switching");
    busy = false;
  }
}
