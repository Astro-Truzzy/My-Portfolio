export type AnalyticsTotals = {
  allTime: number;
  monthKey: string;
  monthCount: number;
  countries: Record<string, number>;
  os: Record<string, number>;
};

export type CountryRow = {
  code: string;
  name: string;
  count: number;
  pct: number;
};

export type OsRow = {
  name: string;
  count: number;
  pct: number;
};

export type AnalyticsSnapshot = {
  month: number;
  allTime: number;
  countries: CountryRow[];
  os: OsRow[];
};

export function emptyTotals(): AnalyticsTotals {
  return {
    allTime: 0,
    monthKey: monthKey(),
    monthCount: 0,
    countries: {},
    os: {},
  };
}

export function monthKey(date = new Date()) {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
}

export function detectOS(ua: string) {
  const u = ua.toLowerCase();
  if (/android/.test(u)) return "Android";
  if (/iphone|ipad|ipod/.test(u)) return "iOS";
  if (/mac os x|macintosh/.test(u)) return "Mac";
  if (/ubuntu/.test(u)) return "Ubuntu";
  if (/cros/.test(u)) return "Chrome OS";
  if (/linux/.test(u)) return "GNU/Linux";
  if (/windows/.test(u)) return "Windows";
  return "Other";
}

export function detectCountry(headers: Headers) {
  const raw =
    headers.get("x-vercel-ip-country") ||
    headers.get("cf-ipcountry") ||
    headers.get("x-country-code") ||
    headers.get("x-appengine-country") ||
    "";
  const code = raw.trim().toUpperCase();
  if (code && code !== "XX" && code !== "T1" && code !== "ZZ" && /^[A-Z]{2}$/.test(code)) {
    return code;
  }
  const lang = headers.get("accept-language") ?? "";
  const fromLang = lang.match(/^[a-z]{2,3}-([A-Z]{2})/i)?.[1];
  if (fromLang) return fromLang.toUpperCase();
  return "UN";
}

export function countryName(code: string) {
  if (code === "UN") return "Unknown";
  try {
    return new Intl.DisplayNames(["en"], { type: "region" }).of(code) ?? code;
  } catch {
    return code;
  }
}

export function countryFlag(code: string) {
  if (!/^[A-Z]{2}$/.test(code) || code === "UN") return "🌐";
  return String.fromCodePoint(
    ...[...code].map((char) => 127397 + char.charCodeAt(0)),
  );
}

export function recordHit(store: AnalyticsTotals, country: string, os: string) {
  const key = monthKey();
  if (store.monthKey !== key) {
    store.monthKey = key;
    store.monthCount = 0;
  }
  store.allTime += 1;
  store.monthCount += 1;
  store.countries[country] = (store.countries[country] ?? 0) + 1;
  store.os[os] = (store.os[os] ?? 0) + 1;
  return store;
}

function ranked(
  map: Record<string, number>,
  total: number,
): { name: string; count: number; pct: number }[] {
  const sum = total || 1;
  return Object.entries(map)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([name, count]) => ({
      name,
      count,
      pct: Math.round((count / sum) * 100),
    }));
}

export function toSnapshot(store: AnalyticsTotals): AnalyticsSnapshot {
  const allTime = store.allTime;
  const countries = ranked(store.countries, allTime).map((row) => ({
    code: row.name,
    name: countryName(row.name),
    count: row.count,
    pct: row.pct,
  }));
  return {
    month: store.monthKey === monthKey() ? store.monthCount : 0,
    allTime,
    countries,
    os: ranked(store.os, allTime),
  };
}

export function isBot(ua: string) {
  return /bot|crawl|spider|slurp|preview|monitor|headless|lighthouse|pagespeed|facebookexternalhit|whatsapp|telegram|discord/i.test(
    ua,
  );
}
