import fs from "node:fs/promises";
import path from "node:path";
import {
  emptyTotals,
  type AnalyticsTotals,
} from "@/lib/analytics";

const KEY = "tw-analytics";
const FILE = path.join(process.cwd(), "data", "analytics.json");
const TMP = path.join("/tmp", "tw-analytics.json");

type GlobalStore = typeof globalThis & {
  __twAnalytics?: AnalyticsTotals;
  __twAnalyticsLock?: Promise<unknown>;
};

function memory(): AnalyticsTotals {
  const g = globalThis as GlobalStore;
  if (!g.__twAnalytics) g.__twAnalytics = emptyTotals();
  return g.__twAnalytics;
}

function parseStore(value: unknown): AnalyticsTotals | null {
  if (!value || typeof value !== "object") return null;
  const row = value as Partial<AnalyticsTotals>;
  if (typeof row.allTime !== "number" || typeof row.monthKey !== "string") {
    return null;
  }
  return {
    allTime: row.allTime,
    monthKey: row.monthKey,
    monthCount: typeof row.monthCount === "number" ? row.monthCount : 0,
    countries: row.countries ?? {},
    os: row.os ?? {},
  };
}

async function redisGet(): Promise<AnalyticsTotals | null> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  const res = await fetch(`${url}/get/${KEY}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) return null;
  const json = (await res.json()) as { result?: string | null };
  if (!json.result) return null;
  try {
    return parseStore(JSON.parse(json.result));
  } catch {
    return null;
  }
}

async function redisSet(store: AnalyticsTotals) {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return false;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(["SET", KEY, JSON.stringify(store)]),
  });
  return res.ok;
}

async function readFile(file: string) {
  try {
    const raw = await fs.readFile(file, "utf8");
    return parseStore(JSON.parse(raw));
  } catch {
    return null;
  }
}

async function writeFile(file: string, store: AnalyticsTotals) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, JSON.stringify(store), "utf8");
}

async function load(): Promise<AnalyticsTotals> {
  const fromRedis = await redisGet();
  if (fromRedis) {
    (globalThis as GlobalStore).__twAnalytics = fromRedis;
    return fromRedis;
  }
  const fromDisk = (await readFile(FILE)) ?? (await readFile(TMP));
  if (fromDisk) {
    (globalThis as GlobalStore).__twAnalytics = fromDisk;
    return fromDisk;
  }
  return memory();
}

async function persist(store: AnalyticsTotals) {
  (globalThis as GlobalStore).__twAnalytics = store;
  const redis = await redisSet(store);
  if (redis) return;
  try {
    await writeFile(FILE, store);
  } catch {
    try {
      await writeFile(TMP, store);
    } catch {
      /* memory only */
    }
  }
}

export async function readAnalytics() {
  return load();
}

export async function updateAnalytics(
  fn: (store: AnalyticsTotals) => AnalyticsTotals,
) {
  const g = globalThis as GlobalStore;
  const run = (g.__twAnalyticsLock ?? Promise.resolve()).then(async () => {
    const next = fn(await load());
    await persist(next);
    return next;
  });
  g.__twAnalyticsLock = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}
