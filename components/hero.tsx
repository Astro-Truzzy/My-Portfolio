"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionStyle,
  type Variants,
} from "framer-motion";
import { hero, site, socials } from "@/lib/content";
import { LiveClock } from "@/components/live-clock";
import { HeroPortrait } from "@/components/hero-portrait";

const ParticleField = dynamic(
  () => import("@/components/particle-field").then((m) => m.ParticleField),
  { ssr: false },
);

const easeOut = [0.16, 1, 0.3, 1] as const;

const riseMotion: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.72, ease: easeOut },
  },
};

const riseStill: Variants = {
  hidden: { opacity: 1, y: 0 },
  show: { opacity: 1, y: 0 },
};

const lineMotion: Variants = {
  hidden: { y: "112%" },
  show: {
    y: "0%",
    transition: { duration: 1.08, ease: easeOut },
  },
};

const lineStill: Variants = {
  hidden: { y: "0%" },
  show: { y: "0%" },
};

const ruleMotion: Variants = {
  hidden: { scaleX: 0 },
  show: {
    scaleX: 1,
    transition: { duration: 0.9, ease: easeOut, delay: 0.18 },
  },
};

const ruleStill: Variants = {
  hidden: { scaleX: 1 },
  show: { scaleX: 1 },
};

function useIntroGate(reduce: boolean | null) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (reduce) {
      setReady(true);
      return;
    }

    const markReady = () => setReady(true);

    if (!document.querySelector("[data-preloader]")) {
      const id = window.setTimeout(markReady, 90);
      return () => window.clearTimeout(id);
    }

    window.addEventListener("tw:ready", markReady);
    return () => window.removeEventListener("tw:ready", markReady);
  }, [reduce]);

  return ready;
}

export function Hero() {
  const reduce = useReducedMotion();
  const ready = useIntroGate(reduce);
  const wrapRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start start", "end start"],
  });

  const cardScale = useTransform(scrollYProgress, [0, 0.62], [1, 0.9]);
  const cardRadius = useTransform(scrollYProgress, [0, 0.28], [0, 28]);
  const cardDim = useTransform(scrollYProgress, [0, 0.55], [0, 1]);
  const contentY = useTransform(scrollYProgress, [0.02, 0.32], [0, -72]);
  const contentOpacity = useTransform(scrollYProgress, [0.02, 0.26], [1, 0]);

  const still = Boolean(reduce);
  const rise = still ? riseStill : riseMotion;
  const line = still ? lineStill : lineMotion;
  const rule = still ? ruleStill : ruleMotion;

  const cardStyle = still
    ? undefined
    : ({
        scale: cardScale,
        borderRadius: cardRadius,
        "--stack-dim": cardDim,
      } as MotionStyle);

  const contentStyle = still
    ? undefined
    : { y: contentY, opacity: contentOpacity };

  const inner = (
    <motion.div
      initial="hidden"
      animate={ready ? "show" : "hidden"}
      variants={{
        show: {
          transition: {
            staggerChildren: still ? 0 : 0.09,
            delayChildren: still ? 0 : 0.06,
          },
        },
      }}
      style={contentStyle}
      className="relative z-1 flex h-full min-h-0 flex-col justify-between will-change-transform"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <motion.div
          variants={rise}
          className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[11px] tracking-[0.12em] text-ink-soft uppercase"
        >
          <LiveClock />
          <span>
            {site.city} · {site.timezoneAbbr}
          </span>
        </motion.div>

        <div className="grid items-end gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(240px,20.5rem)] lg:grid-rows-[auto_1fr] lg:gap-x-12">
          <div className="lg:col-start-1 lg:row-start-1">
            <h1 className="font-sans text-[clamp(2.7rem,8.4vw,7.2rem)] leading-[0.82] tracking-tightest">
              <span className="block overflow-hidden">
                <motion.span variants={line} className="block">
                  {site.firstName}
                </motion.span>
              </span>
              <span className="block overflow-hidden">
                <motion.span variants={line} className="block text-ink-soft">
                  {site.lastName}
                </motion.span>
              </span>
            </h1>

            <motion.span
              variants={rule}
              aria-hidden="true"
              className="mt-5 block h-px w-full max-w-xl origin-left bg-accent"
            />

            <motion.p
              variants={rise}
              className="mt-5 max-w-xl font-mono text-xs tracking-[0.2em] text-accent uppercase"
            >
              {site.shortRole}
            </motion.p>
          </div>

          <motion.div
            variants={rise}
            className="mx-auto w-full max-w-66 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:mx-0 lg:max-w-none lg:self-end"
          >
            <HeroPortrait reduceMotion={still} />
          </motion.div>

          <div className="lg:col-start-1 lg:row-start-2">
            <motion.p
              variants={rise}
              className="max-w-2xl text-base leading-relaxed text-ink-soft md:text-lg"
            >
              {hero.valueProposition}
            </motion.p>

            <motion.div
              variants={rise}
              className="mt-6 flex flex-wrap items-center gap-3"
            >
              <a
                href="#contact"
                className="inline-flex items-center bg-ink px-5 py-3 font-mono text-[11px] tracking-[0.16em] text-invert uppercase transition-opacity hover:opacity-80"
              >
                {hero.primaryCta} →
              </a>
              <a
                href="#work"
                className="inline-flex items-center border border-line px-5 py-3 font-mono text-[11px] tracking-[0.16em] text-ink uppercase transition-colors hover:border-ink"
              >
                {hero.secondaryCta}
              </a>
            </motion.div>

            <motion.ul
              variants={rise}
              className="mt-6 flex flex-wrap gap-x-6 gap-y-2"
            >
              {socials.map((s) => (
                <li key={s.label}>
                  {s.placeholder || !s.href ? (
                    <span
                      className="font-mono text-[11px] tracking-[0.14em] text-ink-faint uppercase"
                      title="URL missing from résumé — add it in lib/content.ts"
                    >
                      {s.label}{" "}
                      <span className="normal-case tracking-normal">
                        {/* [add URL] */}
                      </span>
                    </span>
                  ) : (
                    <a
                      href={s.href}
                      {...(s.href.startsWith("http")
                        ? { target: "_blank", rel: "noreferrer" }
                        : {})}
                      className="font-mono text-[11px] tracking-[0.14em] text-ink-soft uppercase hover:text-ink"
                    >
                      {s.label}
                    </a>
                  )}
                </li>
              ))}
            </motion.ul>
          </div>
        </div>
      </div>

      <motion.div
        variants={rise}
        className="mx-auto mt-10 w-full max-w-6xl border-t border-line pt-5"
      >
        <dl className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div>
            <dt className="font-mono text-[10px] tracking-[0.18em] text-ink-faint uppercase">
              Experience
            </dt>
            <dd className="mt-1 font-mono text-sm text-ink">
              {hero.microBar.years.value} {hero.microBar.years.label}
            </dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] tracking-[0.18em] text-ink-faint uppercase">
              Stack
            </dt>
            <dd className="mt-1 font-mono text-sm text-ink">
              {hero.microBar.stack.join(" · ")}
            </dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] tracking-[0.18em] text-ink-faint uppercase">
              Education
            </dt>
            <dd className="mt-1 font-mono text-sm text-ink">
              {hero.microBar.education}
            </dd>
          </div>
        </dl>
      </motion.div>
    </motion.div>
  );

  if (still) {
    return (
      <section
        id="top"
        className="relative z-1 isolate flex h-svh flex-col justify-between overflow-hidden bg-canvas px-5 pb-8 pt-[calc(var(--nav-h)+0.5rem)] md:px-8 md:pt-[calc(var(--nav-h)+1rem)]"
      >
        {ready ? <ParticleField /> : null}
        {inner}
      </section>
    );
  }

  return (
    <div
      ref={wrapRef}
      className="relative z-1 mb-[-100svh] h-[200svh] bg-stack-gutter"
    >
      <motion.section
        id="top"
        style={cardStyle}
        data-hero-surface=""
        className="sticky top-0 isolate flex h-svh origin-top flex-col justify-between overflow-hidden bg-canvas px-5 pb-8 pt-[calc(var(--nav-h)+0.5rem)] will-change-transform md:px-8 md:pt-[calc(var(--nav-h)+1rem)]"
      >
        {ready ? <ParticleField /> : null}
        {inner}
      </motion.section>
    </div>
  );
}
