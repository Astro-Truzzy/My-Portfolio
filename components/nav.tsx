"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
} from "framer-motion";
import { site } from "@/lib/content";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import { LiveClock } from "@/components/live-clock";

const links = [
  { href: "/#about", id: "about", label: "About" },
  { href: "/skills", id: "skills", label: "Skills" },
  { href: "/#work", id: "work", label: "Work" },
  { href: "/#experience", id: "experience", label: "Experience" },
  { href: "/#contact", id: "contact", label: "Contact" },
] as const;

/** Map every homepage block onto a navbar item (including sections without their own link). */
const sectionToNav: Record<string, (typeof links)[number]["id"]> = {
  about: "about",
  capabilities: "about",
  work: "work",
  experience: "experience",
  toolkit: "experience",
  contact: "contact",
};

function readActiveSection() {
  const header = document.querySelector("header");
  const y = Math.min(
    window.innerHeight - 8,
    Math.round((header?.getBoundingClientRect().bottom ?? 72) + 16),
  );
  const x = Math.round(window.innerWidth / 2);
  const hits = document.elementsFromPoint(x, y);

  for (const node of hits) {
    if (!(node instanceof Element)) continue;
    if (node.closest("header")) continue;
    const id = node.closest("section[id]")?.id;
    if (id && sectionToNav[id]) return sectionToNav[id];
  }

  return "";
}

const easeOut = [0.16, 1, 0.3, 1] as const;

export function Nav() {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [section, setSection] = useState<string>("");
  const [open, setOpen] = useState(false);
  const active = pathname === "/skills" ? "skills" : section;
  const still = Boolean(reduce);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 28,
    restDelta: 0.001,
  });

  useLayoutEffect(() => {
    if (pathname !== "/") {
      setSection("");
      return;
    }

    let frame = 0;
    const update = () => {
      frame = 0;
      const next = readActiveSection();
      setSection((prev) => (prev === next ? prev : next));
    };
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    const later = window.setTimeout(update, 320);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.clearTimeout(later);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50">
      <div className="pointer-events-auto mx-auto max-w-6xl px-4 pt-3 md:px-6">
        <div className="nav-island relative z-50 flex items-center gap-3 overflow-hidden rounded-2xl border border-line-strong bg-canvas-2/80 px-2.5 py-2 backdrop-blur-xl md:px-3">
          <Link
            href="/"
            className="flex min-w-0 shrink-0 items-center gap-2.5 rounded-xl pr-1 pl-0.5"
            onClick={() => {
              setOpen(false);
              setSection("");
            }}
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-xl border border-line bg-canvas-2 font-mono text-[11px] tracking-[0.08em] text-ink">
              TW
            </span>
            <span className="hidden min-w-0 leading-tight md:block">
              <span className="block font-sans text-[13px] tracking-tight text-ink">
                {site.firstName}{" "}
                <span className="text-ink-soft">{site.lastName}</span>
              </span>
              <span className="block font-mono text-[9px] tracking-[0.16em] text-ink-faint uppercase">
                {site.city}
              </span>
            </span>
          </Link>

          <nav
            className="hidden min-w-0 flex-1 justify-center md:flex"
            aria-label="Primary"
          >
            <div className="flex items-center gap-0.5 rounded-full border border-line bg-canvas/50 p-1">
              {links.map((l, i) => {
                const isActive = active === l.id;
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    aria-current={isActive ? "page" : undefined}
                    onClick={() => {
                      if (l.id !== "skills") setSection(l.id);
                    }}
                    className={cn(
                      "relative rounded-full px-2.5 py-1.5 font-mono text-[10px] tracking-[0.14em] uppercase transition-colors lg:px-3",
                      isActive ? "text-ink" : "text-ink-soft hover:text-ink",
                    )}
                  >
                    {isActive ? (
                      <motion.span
                        layoutId="nav-active-pill"
                        className="absolute inset-0 rounded-full bg-accent/20 shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--accent)_55%,transparent)]"
                        transition={
                          still
                            ? { duration: 0 }
                            : { type: "spring", stiffness: 420, damping: 34 }
                        }
                      />
                    ) : null}
                    <span className="relative z-10 inline-flex items-center gap-1.5">
                      <span
                        className={cn(
                          "hidden tabular-nums xl:inline",
                          isActive ? "text-accent" : "text-ink-faint",
                        )}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {l.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </nav>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <LiveClock className="hidden text-[11px] text-ink-soft xl:inline" />
            <ThemeToggle />
            <a
              href={site.resumeHref}
              download={site.resumeFilename}
              className="hidden font-mono text-[10px] tracking-[0.16em] text-ink-soft uppercase transition-colors hover:text-ink xl:inline"
            >
              Résumé
            </a>
            <Link
              href="/#contact"
              className="group hidden items-center gap-2 rounded-full bg-ink px-3 py-1.5 font-mono text-[10px] tracking-[0.14em] text-invert uppercase md:inline-flex"
            >
              Let’s talk
              <span
                aria-hidden="true"
                className="grid size-4 place-items-center rounded-full bg-invert/15 text-[11px] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              >
                ↗
              </span>
            </Link>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl border border-line px-2.5 py-1.5 md:hidden"
              aria-expanded={open}
              aria-controls="mobile-nav"
              onClick={() => setOpen((v) => !v)}
            >
              <span className="font-mono text-[10px] tracking-[0.18em] text-ink uppercase">
                {open ? "Close" : "Menu"}
              </span>
              <span className="relative block size-3.5" aria-hidden="true">
                <motion.span
                  className="absolute top-1.25 left-0 h-px w-3.5 origin-center bg-ink"
                  animate={{ rotate: open ? 45 : 0, y: open ? 0 : -3 }}
                  transition={
                    still ? { duration: 0 } : { duration: 0.28, ease: easeOut }
                  }
                />
                <motion.span
                  className="absolute top-1.25 left-0 h-px w-3.5 origin-center bg-ink"
                  animate={{ rotate: open ? -45 : 0, y: open ? 0 : 3 }}
                  transition={
                    still ? { duration: 0 } : { duration: 0.28, ease: easeOut }
                  }
                />
              </span>
            </button>
          </div>

          <motion.span
            aria-hidden="true"
            className="absolute right-4 bottom-0 left-4 h-px origin-left bg-accent"
            style={{ scaleX: still ? 0 : progress }}
          />
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-nav"
            className="pointer-events-auto fixed inset-0 z-40 flex flex-col bg-canvas md:hidden"
            initial={still ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={still ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: still ? 0 : 0.28 }}
          >
            <div className="h-(--nav-h) shrink-0" />
            <nav
              className="flex min-h-0 flex-1 flex-col justify-between px-6 pb-8"
              aria-label="Mobile"
            >
              <motion.ul
                className="flex flex-col gap-1"
                initial="hidden"
                animate="show"
                variants={{
                  show: {
                    transition: {
                      staggerChildren: still ? 0 : 0.06,
                      delayChildren: still ? 0 : 0.08,
                    },
                  },
                }}
              >
                {links.map((l, i) => {
                  const isActive = active === l.id;
                  return (
                    <motion.li
                      key={l.href}
                      variants={{
                        hidden: { opacity: still ? 1 : 0, y: still ? 0 : 16 },
                        show: {
                          opacity: 1,
                          y: 0,
                          transition: { duration: 0.5, ease: easeOut },
                        },
                      }}
                    >
                      <Link
                        href={l.href}
                        aria-current={isActive ? "page" : undefined}
                        className="group flex items-baseline gap-4 border-b border-line py-3"
                        onClick={() => {
                          if (l.id !== "skills") setSection(l.id);
                          setOpen(false);
                        }}
                      >
                        <span
                          className={cn(
                            "font-mono text-[11px] tracking-[0.18em] tabular-nums",
                            isActive ? "text-accent" : "text-ink-faint",
                          )}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span
                          className={cn(
                            "font-serif text-[2.35rem] leading-none tracking-tight italic transition-colors",
                            isActive
                              ? "text-accent"
                              : "text-ink group-hover:text-accent",
                          )}
                        >
                          {l.label}
                        </span>
                      </Link>
                    </motion.li>
                  );
                })}
              </motion.ul>

              <div className="flex items-end justify-between gap-4 pt-8">
                <div>
                  <p className="font-mono text-[10px] tracking-[0.18em] text-ink-faint uppercase">
                    {site.city} · {site.timezoneAbbr}
                  </p>
                  <LiveClock className="mt-1 block text-sm text-ink-soft" />
                  <a
                    href={site.resumeHref}
                    download={site.resumeFilename}
                    className="mt-4 inline-block font-mono text-[11px] tracking-[0.16em] text-ink uppercase"
                  >
                    Download résumé
                  </a>
                </div>
                <Link
                  href="/#contact"
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2.5 font-mono text-[11px] tracking-[0.14em] text-invert uppercase"
                >
                  Let’s talk ↗
                </Link>
              </div>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
