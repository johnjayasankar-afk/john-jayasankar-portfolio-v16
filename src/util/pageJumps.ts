import { cases, experience, earlier, writing } from "@/data/content";
import { CONTROL_LAYERS } from "@/artifacts/ControlStack";

export const HOME_JUMPS = [
  { id: "hero", label: "Hero" },
  { id: "work", label: "Featured evidence" },
  { id: "ledger", label: "Full ledger" },
  { id: "build", label: "Approach" },
  { id: "writing", label: "Writing" },
  { id: "contact", label: "Contact" },
] as const;

export const SIMPLE_JUMPS = [
  { id: "dhead", label: "Top" },
  { id: "history", label: "History" },
  { id: "bio", label: "Bio" },
  { id: "selected-systems", label: "Selected systems" },
  { id: "build", label: "Build" },
  { id: "writing", label: "Writing" },
  { id: "pet-projects", label: "Pet projects" },
  { id: "outcomes", label: "Outcomes" },
  { id: "misc", label: "Misc" },
] as const;

export const APPROACH_JUMPS = [
  { id: "layers", label: "Control layers" },
  { id: "ladder", label: "Autonomy ladder" },
  ...CONTROL_LAYERS.map((layer, index) => ({
    id: `layer-${index + 1}`,
    label: `Layer ${index + 1}: ${layer.label}`,
  })),
] as const;

/** Stable about anchors for experience + earlier blocks. */
export function aboutAnchorId(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function aboutJumps() {
  return [
    ...experience.map((e) => ({ id: aboutAnchorId(e.company), label: e.company })),
    ...earlier.map((x) => ({ id: aboutAnchorId(x.org), label: x.org })),
    { id: "skills", label: "Skills" },
    { id: "skills-ai", label: "Skills · AI" },
    { id: "skills-product", label: "Skills · Product" },
    { id: "skills-domain", label: "Skills · Domain" },
    { id: "skills-build", label: "Skills · Build" },
    { id: "context", label: "Institutional context" },
  ];
}

export function writingJumps() {
  return writing.map((note) => ({
    id: note.id,
    label: note.title,
    path: note.to ?? `/writing#${note.id}`,
  }));
}

export function workJumps() {
  return cases.map((study) => ({
    id: study.slug,
    label: study.alias,
    path: `/work/${study.slug}`,
  }));
}
