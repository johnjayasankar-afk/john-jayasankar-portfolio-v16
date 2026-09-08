import type { CaseStudy } from "@/data/content";

/** Rough reading time from case copy — quiet chrome, not a blog gimmick. */
export function caseReadingMinutes(study: CaseStudy): number {
  const parts = [
    study.title,
    study.summary,
    study.role,
    study.problem,
    study.decision,
    study.outcome,
    ...study.blocks.flatMap((b) => [b.title, Array.isArray(b.body) ? b.body.join(" ") : b.body]),
  ];
  const words = parts
    .join(" ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(3, Math.min(14, Math.round(words / 220)));
}

/** Plain-text brief for clipboard — case name, one-liner, metrics, URL. */
export function caseBriefText(study: CaseStudy, url: string): string {
  const metrics = study.metrics.map((m) => `${m.value} ${m.label}`).join("; ");
  return [
    `${study.alias} — ${study.title}`,
    study.summary,
    metrics ? `Impact: ${metrics}` : null,
    url,
  ]
    .filter(Boolean)
    .join("\n\n");
}
