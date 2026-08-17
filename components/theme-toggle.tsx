"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useSyncExternalStore, type MouseEvent } from "react";
import { getTheme, setTheme } from "@/lib/theme";

function subscribe(onStoreChange: () => void) {
  window.addEventListener("tw-theme", onStoreChange);
  return () => window.removeEventListener("tw-theme", onStoreChange);
}

const spring = { type: "spring" as const, stiffness: 280, damping: 32 };

export function ThemeToggle({ className = "" }: { className?: string }) {
  const theme = useSyncExternalStore(
    subscribe,
    getTheme,
    () => "dark" as const,
  );
  const reduce = useReducedMotion();
  const night = theme === "dark";
  const next = night ? "light" : "dark";
  const motionOff = Boolean(reduce);

  function toggle(event: MouseEvent<HTMLButtonElement>) {
    const knob = event.currentTarget.getBoundingClientRect();
    void setTheme(next, {
      x: knob.left + knob.width / 2,
      y: knob.top + knob.height / 2,
      radius: Math.max(knob.width, knob.height) * 0.45,
    });
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className={`group relative isolate h-9 w-[3.65rem] shrink-0 overflow-hidden rounded-full border border-line focus-visible:outline-offset-4 ${className}`}
      aria-label={`Switch to ${next} theme`}
      title={`${night ? "Night" : "Day"} — switch to ${next}`}
    >
      <span className="sr-only">{night ? "Night mode" : "Day mode"}</span>

      <motion.span
        aria-hidden="true"
        className="absolute inset-0"
        initial={false}
        animate={{
          background: night
            ? "linear-gradient(180deg, #0a1220 0%, #152033 100%)"
            : "linear-gradient(180deg, #7eb6e4 0%, #f3d7a4 55%, #f7ead0 100%)",
        }}
        transition={
          motionOff
            ? { duration: 0 }
            : { duration: 0.55, ease: [0.16, 1, 0.3, 1] }
        }
      />

      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-40 mix-blend-overlay"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.35), transparent 38%)",
        }}
      />

      <motion.span
        aria-hidden="true"
        className="absolute inset-0"
        initial={false}
        animate={{ opacity: night ? 1 : 0 }}
        transition={motionOff ? { duration: 0 } : { duration: 0.35 }}
      >
        <span className="theme-star absolute top-[7px] left-[8px] size-[2px] rounded-full bg-white" />
        <span className="theme-star absolute top-[18px] left-[14px] size-[1.5px] rounded-full bg-white/90" />
        <span className="theme-star absolute top-[9px] left-[22px] size-px rounded-full bg-white/80" />
        <span className="theme-star absolute top-[22px] left-[7px] size-px rounded-full bg-white/70" />
      </motion.span>

      <motion.span
        aria-hidden="true"
        className="absolute top-[11px] right-[7px] h-[5px] w-[11px] rounded-full bg-white/70"
        initial={false}
        animate={{
          opacity: night ? 0 : 0.85,
          x: night ? 8 : 0,
          scale: night ? 0.6 : 1,
        }}
        transition={motionOff ? { duration: 0 } : { duration: 0.4 }}
      />
      <motion.span
        aria-hidden="true"
        className="absolute top-[16px] right-[12px] h-[4px] w-[8px] rounded-full bg-white/55"
        initial={false}
        animate={{
          opacity: night ? 0 : 0.7,
          x: night ? 10 : 0,
          scale: night ? 0.5 : 1,
        }}
        transition={
          motionOff
            ? { duration: 0 }
            : { duration: 0.45, delay: motionOff ? 0 : 0.04 }
        }
      />

      <motion.span
        aria-hidden="true"
        className="absolute top-[3px] left-[3px] grid size-[30px] place-items-center"
        initial={false}
        animate={{ x: night ? 22 : 0 }}
        transition={motionOff ? { duration: 0 } : spring}
      >
        <motion.span
          className="absolute inset-[-3px]"
          initial={false}
          animate={{
            opacity: night ? 0 : 1,
            scale: night ? 0.45 : 1,
          }}
          transition={motionOff ? { duration: 0 } : { duration: 0.45 }}
        >
          <svg
            viewBox="0 0 36 36"
            className="theme-sun-rays size-full text-[#f3c34a]"
          >
            {Array.from({ length: 8 }, (_, i) => (
              <rect
                key={i}
                x="17.1"
                y="1.2"
                width="1.8"
                height="6.2"
                rx="0.9"
                fill="currentColor"
                transform={`rotate(${i * 45} 18 18)`}
              />
            ))}
          </svg>
        </motion.span>

        <motion.span
          className="relative size-[18px] overflow-hidden rounded-full shadow-[0_0_12px_rgba(255,196,80,0.45)]"
          initial={false}
          animate={{
            backgroundColor: night ? "#e9e4d6" : "#ffce47",
            boxShadow: night
              ? "0 0 10px rgba(233,228,214,0.25)"
              : "0 0 14px rgba(255,196,80,0.55)",
          }}
          transition={motionOff ? { duration: 0 } : { duration: 0.4 }}
        >
          <motion.span
            className="absolute size-[14px] rounded-full"
            style={{ backgroundColor: "#0c1422" }}
            initial={false}
            animate={{
              x: night ? 6 : 14,
              y: night ? -3 : -8,
              opacity: night ? 1 : 0,
            }}
            transition={motionOff ? { duration: 0 } : spring}
          />
          <motion.span
            className="absolute top-[7px] left-[4px] size-[3px] rounded-full bg-[#c9c2b0]"
            initial={false}
            animate={{ opacity: night ? 0.7 : 0 }}
          />
          <motion.span
            className="absolute top-[11px] left-[9px] size-[2px] rounded-full bg-[#c9c2b0]"
            initial={false}
            animate={{ opacity: night ? 0.5 : 0 }}
          />
        </motion.span>
      </motion.span>
    </button>
  );
}
