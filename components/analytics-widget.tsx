"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { countryFlag, type AnalyticsSnapshot } from "@/lib/analytics";
import { cn } from "@/lib/utils";

const empty: AnalyticsSnapshot = {
  month: 0,
  allTime: 0,
  countries: [],
  os: [],
};

const osAccent: Record<string, string> = {
  Windows: "#a78bfa",
  Mac: "#fb923c",
  Android: "#4ade80",
  iOS: "#94a3b8",
  "GNU/Linux": "#94a3b8",
  Ubuntu: "#94a3b8",
  "Chrome OS": "#94a3b8",
};

function formatCount(n: number) {
  return new Intl.NumberFormat("en-US").format(n);
}

export function AnalyticsWidget() {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const still = Boolean(reduce);
  const root = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<AnalyticsSnapshot>(empty);
  const [loaded, setLoaded] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    try {
      const key = `tw-pv:${pathname}`;
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {
      /* private mode */
    }
    void fetch("/api/analytics", { method: "POST", keepalive: true }).catch(
      () => undefined,
    );
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    let ignore = false;
    setLoaded(false);
    void fetch("/api/analytics", { cache: "no-store" })
      .then((res) => res.json())
      .then((json: AnalyticsSnapshot) => {
        if (!ignore) {
          setData(json);
          setLoaded(true);
        }
      })
      .catch(() => {
        if (!ignore) setLoaded(true);
      });
    return () => {
      ignore = true;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    function onPointer(event: PointerEvent) {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  useEffect(() => {
    if (!open) setExpanded(false);
  }, [open]);

  const visibleCountries = expanded
    ? data.countries
    : data.countries.slice(0, 5);
  const hiddenCountries = Math.max(0, data.countries.length - 5);
  const osRows = data.os.slice(0, 6);

  return (
    <div
      ref={root}
      className="pointer-events-none fixed right-4 bottom-4 z-[80] flex flex-col items-end gap-3 md:right-6 md:bottom-6"
    >
      <AnimatePresence>
        {open ? (
          <motion.aside
            id="analytics-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="analytics-title"
            initial={still ? false : { opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={still ? { opacity: 1 } : { opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: still ? 0 : 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-auto w-[min(22.5rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-line-strong bg-canvas-2/95 shadow-[0_24px_64px_color-mix(in_srgb,var(--invert)_28%,transparent)] backdrop-blur-xl"
          >
            <div className="max-h-[min(36rem,calc(100svh-7rem))] overflow-y-auto p-4">
              <h2 id="analytics-title" className="sr-only">
                Site analytics
              </h2>
              <div className="grid grid-cols-2 gap-2.5">
                <StatCard
                  label="This month"
                  value={loaded ? data.month : "—"}
                  hint="page views"
                  tone="month"
                />
                <StatCard
                  label="All time"
                  value={loaded ? data.allTime : "—"}
                  hint="total views"
                  tone="all"
                />
              </div>

              <SectionHead icon={<GlobeIcon />} label="Audience · Countries" />
              <ol className="space-y-2.5">
                {loaded && visibleCountries.length === 0 ? (
                  <li className="font-mono text-[11px] text-ink-faint">
                    Waiting on the first visits.
                  </li>
                ) : (
                  visibleCountries.map((row, index) => (
                    <li
                      key={row.code}
                      className="grid grid-cols-[1.1rem_1.1rem_minmax(0,1fr)_2.4rem] items-center gap-2"
                    >
                      <span className="font-mono text-[11px] text-ink-faint">
                        {index + 1}
                      </span>
                      <span
                        className="text-[15px] leading-none"
                        aria-hidden="true"
                      >
                        {countryFlag(row.code)}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-[13px] text-ink">
                          {row.name}
                        </p>
                        <Bar
                          pct={row.pct}
                          color={
                            index === 0
                              ? "#5eead4"
                              : index === 1
                                ? "#b6f000"
                                : "color-mix(in srgb, var(--ink) 28%, transparent)"
                          }
                        />
                      </div>
                      <span className="text-right font-mono text-[11px] text-ink-soft">
                        {row.pct}%
                      </span>
                    </li>
                  ))
                )}
              </ol>
              {hiddenCountries > 0 ? (
                <button
                  type="button"
                  onClick={() => setExpanded((v) => !v)}
                  className="mt-3 inline-flex items-center gap-1 font-mono text-[11px] tracking-[0.04em] text-accent"
                >
                  {expanded
                    ? "Show less"
                    : `+ ${hiddenCountries} more countries`}
                  <span aria-hidden="true">{expanded ? "⌃" : "⌄"}</span>
                </button>
              ) : null}

              <SectionHead icon={<MonitorIcon />} label="Devices · OS" />
              <ul className="grid grid-cols-2 gap-2">
                {loaded && osRows.length === 0 ? (
                  <li className="col-span-2 font-mono text-[11px] text-ink-faint">
                    No device data yet.
                  </li>
                ) : (
                  osRows.map((row) => (
                    <li
                      key={row.name}
                      className="rounded-xl border border-line bg-canvas/50 px-2.5 py-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="flex min-w-0 items-center gap-1.5 text-[12px] text-ink">
                          <OsGlyph name={row.name} />
                          <span className="truncate">{row.name}</span>
                        </span>
                        <span className="font-mono text-[10px] text-ink-soft">
                          {row.pct}%
                        </span>
                      </div>
                      <Bar
                        className="mt-2"
                        pct={row.pct}
                        color={
                          osAccent[row.name] ??
                          "color-mix(in srgb, var(--ink) 28%, transparent)"
                        }
                      />
                    </li>
                  ))
                )}
              </ul>
            </div>
          </motion.aside>
        ) : null}
      </AnimatePresence>

      <button
        type="button"
        aria-expanded={open}
        aria-controls="analytics-panel"
        onClick={() => setOpen((v) => !v)}
        className="pointer-events-auto grid size-12 place-items-center rounded-2xl border border-line-strong bg-canvas-2/90 text-ink shadow-[0_12px_32px_color-mix(in_srgb,var(--invert)_22%,transparent)] backdrop-blur-xl transition-colors hover:border-accent hover:text-accent"
        title={open ? "Close analytics" : "Site analytics"}
        aria-label={open ? "Close analytics" : "Open site analytics"}
      >
        {open ? <CloseIcon /> : <ChartIcon />}
      </button>
    </div>
  );
}

function StatCard({
  label,
  value,
  hint,
  tone,
}: {
  label: string;
  value: number | string;
  hint: string;
  tone: "month" | "all";
}) {
  return (
    <div className="rounded-xl border border-line bg-canvas/60 px-3 py-3">
      <p className="font-mono text-[10px] tracking-[0.16em] text-ink-faint uppercase">
        {label}
      </p>
      <p
        className="mt-2 font-sans text-[2rem] leading-none tracking-tight"
        style={{
          color:
            tone === "month"
              ? "var(--analytics-month)"
              : "var(--analytics-all)",
        }}
      >
        {typeof value === "number" ? formatCount(value) : value}
      </p>
      <p className="mt-1 text-[12px] text-ink-faint">{hint}</p>
    </div>
  );
}

function SectionHead({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <div className="mt-5 mb-3 flex items-center gap-2">
      <span className="text-ink-soft">{icon}</span>
      <p className="shrink-0 font-mono text-[10px] tracking-[0.16em] text-ink-faint uppercase">
        {label}
      </p>
      <span className="h-px flex-1 bg-line" />
    </div>
  );
}

function Bar({
  pct,
  color,
  className,
}: {
  pct: number;
  color: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "mt-1 block h-[3px] overflow-hidden rounded-full bg-line",
        className,
      )}
    >
      <span
        className="block h-full rounded-full"
        style={{
          width: `${Math.max(pct, pct > 0 ? 4 : 0)}%`,
          background: color,
        }}
      />
    </span>
  );
}

function ChartIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 19V10M10 19V5M16 19v-7M22 19H2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M6 6l12 12M18 6 6 18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M3 12h18M12 3c2.8 3.2 2.8 14.8 0 18M12 3c-2.8 3.2-2.8 14.8 0 18"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}

function MonitorIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="3"
        y="4"
        width="18"
        height="13"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M8 21h8M12 17v4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function OsGlyph({ name }: { name: string }) {
  const className = "size-3.5 shrink-0 text-ink-soft";
  if (name === "Windows") {
    return (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M3 5.5 11 4.3v7.2H3V5.5Zm8.8-.3L21 3.7v7.8h-9.2V5.2ZM3 13.5h8V20.8L3 19.5v-6Zm8.8 0H21V20.3l-9.2-1.3v-5.5Z" />
      </svg>
    );
  }
  if (name === "Mac" || name === "iOS") {
    return (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M16.4 12.6c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.2-2.8.9-3.5.9s-1.8-1-3-.9c-1.5 0-2.9.9-3.7 2.3-1.6 2.7-.4 6.8 1.1 9 .8 1.1 1.7 2.3 2.9 2.2 1.2 0 1.6-.7 3-.7s1.8.7 3 .7 2-.1 2.9-2.2c.6-1.1 1.1-2.2 1.1-2.3-.1 0-2.1-.8-2.1-3.7Zm-2-5.8c.6-.8 1.1-1.9.9-3-1 .1-2.1.7-2.8 1.5-.6.7-1.2 1.8-1 2.9 1.1.1 2.2-.6 2.9-1.4Z" />
      </svg>
    );
  }
  if (name === "Android") {
    return (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M7.2 8.5h9.6v8.2a2 2 0 0 1-2 2H9.2a2 2 0 0 1-2-2V8.5Zm-2.4 1.2h1.2v6.2H4.8V9.7Zm13.2 0h1.2v6.2h-1.2V9.7ZM9 4.8l-.8-1.3.9-.5.8 1.3A6.4 6.4 0 0 1 12 4.1c.8 0 1.5.1 2.1.2l.8-1.3.9.5-.8 1.3A5 5 0 0 1 17 7.2H7A5 5 0 0 1 9 4.8Zm.8 1.6a.6.6 0 1 0 0-1.2.6.6 0 0 0 0 1.2Zm4.4 0a.6.6 0 1 0 0-1.2.6.6 0 0 0 0 1.2Z" />
      </svg>
    );
  }
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12.2 2C7.4 2 5 6.2 5 9.8c0 2.6 1.2 4.3 2.3 5.5.4.4.7.8.7 1.3v1.6c0 .8.6 1.4 1.4 1.4h1.1v1.1c0 .7.6 1.3 1.3 1.3h1.4c.7 0 1.3-.6 1.3-1.3v-1.1h1.1c.8 0 1.4-.6 1.4-1.4v-1.4c0-.6.3-1 .7-1.5 1-1.2 2.3-2.9 2.3-5.6C20 5.6 16.8 2 12.2 2Z" />
    </svg>
  );
}
