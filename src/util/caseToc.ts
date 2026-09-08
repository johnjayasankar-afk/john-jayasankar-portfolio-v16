import type { CaseStudy } from "@/data/content";

export type CaseTocItem = { id: string; label: string };

/** Shared case section list for TOC, scrubber, and command palette. */
export function caseToc(study: CaseStudy): CaseTocItem[] {
  const items: CaseTocItem[] = [
    { id: "broken", label: "01 Broken" },
    { id: "decision", label: "02 Decision" },
  ];
  let n = 3;
  if (study.flow?.length) {
    items.push({ id: "flow", label: `${String(n).padStart(2, "0")} Flow` });
    n += 1;
  }
  for (let i = 0; i < study.blocks.length; i++) {
    items.push({
      id: `block-${i}`,
      label: `${String(n).padStart(2, "0")} ${study.blocks[i].title}`,
    });
    n += 1;
  }
  items.push({ id: "control", label: `${String(n).padStart(2, "0")} Role & tags` });
  n += 1;
  items.push({ id: "impact", label: `${String(n).padStart(2, "0")} Impact` });
  if (study.productHref) {
    items.push({ id: "live", label: "Live" });
  }
  return items;
}
