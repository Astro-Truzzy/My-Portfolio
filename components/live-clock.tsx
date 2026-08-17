"use client";

import { useSyncExternalStore } from "react";
import { site } from "@/lib/content";

const formatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: site.timezone,
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

let snapshot = 0;
const listeners = new Set<() => void>();
let intervalId = 0;

function emit() {
  snapshot = Math.floor(Date.now() / 1000);
  for (const listener of listeners) listener();
}

function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  if (listeners.size === 1) {
    emit();
    intervalId = window.setInterval(emit, 1000);
  }
  return () => {
    listeners.delete(onStoreChange);
    if (listeners.size === 0) {
      window.clearInterval(intervalId);
      intervalId = 0;
    }
  };
}

function getSnapshot() {
  return snapshot;
}

function getServerSnapshot() {
  return 0;
}

function formatClock(epochSeconds: number) {
  if (epochSeconds === 0) return "--:--:--";
  return formatter.format(new Date(epochSeconds * 1000));
}

export function LiveClock({ className = "" }: { className?: string }) {
  const seconds = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <span className={className}>
      <span className="font-mono tabular-nums">{formatClock(seconds)}</span>
      <span className="text-ink-faint"> {site.timezoneAbbr}</span>
    </span>
  );
}
