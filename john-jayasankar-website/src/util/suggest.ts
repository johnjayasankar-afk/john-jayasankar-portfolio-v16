import { cases, type CaseStudy } from "@/data/content";

const LEGACY: Record<string, string> = {
  agentfit: "ridelens",
  "opportunity-os": "raildrop",
  "ride-lens": "ridelens",
  "rail-drop": "raildrop",
};

/** Levenshtein distance — shared by 404 suggest and ⌘K typo tolerance. */
export function editDistance(a: string, b: string) {
  if (a === b) return 0;
  const m = a.length;
  const n = b.length;
  if (!m) return n;
  if (!n) return m;
  const row = Array.from({ length: n + 1 }, (_, i) => i);
  for (let i = 1; i <= m; i += 1) {
    let prev = row[0];
    row[0] = i;
    for (let j = 1; j <= n; j += 1) {
      const tmp = row[j];
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + cost);
      prev = tmp;
    }
  }
  return row[n];
}

const distance = editDistance;

/** Compact alphanumeric form for fuzzy id/alias matching. */
export function compactKey(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

/** Closest case studies for a mistyped /work/:slug (or bare slug). */
export function suggestCases(pathname: string, limit = 3): CaseStudy[] {
  const parts = pathname.split("/").filter(Boolean);
  const raw = (parts[0] === "work" ? parts[1] : parts[parts.length - 1]) ?? "";
  const needle = decodeURIComponent(raw).toLowerCase().trim();
  if (!needle) return cases.slice(0, limit);

  const legacy = LEGACY[needle];
  if (legacy) {
    const hit = cases.find((c) => c.slug === legacy);
    return hit ? [hit] : [];
  }

  const exact = cases.find((c) => c.slug === needle);
  if (exact) return [exact];

  return cases
    .map((study) => {
      const slug = study.slug.toLowerCase();
      const alias = study.alias.toLowerCase().replace(/[^a-z0-9]+/g, "");
      const compact = needle.replace(/[^a-z0-9]+/g, "");
      let score = 0;
      if (slug.includes(needle) || needle.includes(slug)) score += 40;
      if (alias.includes(compact) || compact.includes(alias)) score += 30;
      const d = distance(needle, slug);
      score += Math.max(0, 18 - d * 4);
      if (study.title.toLowerCase().includes(needle)) score += 12;
      return { study, score };
    })
    .filter((row) => row.score >= 10)
    .sort((a, b) => b.score - a.score || a.study.number.localeCompare(b.study.number))
    .slice(0, limit)
    .map((row) => row.study);
}
