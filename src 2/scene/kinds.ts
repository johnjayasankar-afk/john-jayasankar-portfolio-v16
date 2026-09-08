import type { ArtifactKind } from "./visual";

export const kindBySlug: Record<string, ArtifactKind> = {
  iport: "iport",
  coco: "coco",
  "cross-currency": "cross-currency",
  valuation: "valuation",
  "fx-compression": "fx-compression",
  platform: "platform",
  "margin-simulator": "margin-simulator",
  agentfit: "agentfit",
  "opportunity-os": "opportunity",
};

export function kindForSlug(slug: string): ArtifactKind {
  return kindBySlug[slug] ?? "systems-core";
}
