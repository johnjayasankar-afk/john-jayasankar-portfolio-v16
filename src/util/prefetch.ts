import type { ArtifactKind } from "@/scene/visual";
import { kindForSlug } from "@/scene/kinds";

let caseChunkPrefetched = false;
const planeWarm = new Set<string>();

/** Warm lazy route chunks so navigation feels instant. */
export function prefetchRoute(path: string) {
  if (path.startsWith("/work/")) {
    if (!caseChunkPrefetched) {
      caseChunkPrefetched = true;
      void import("@/pages/CasePage");
    }
    const slug = path.slice("/work/".length).split(/[?#]/)[0];
    if (slug) prefetchPlane(kindForSlug(slug));
    return;
  }
  if (path === "/work") void import("@/pages/WorkPage");
  if (path === "/approach") void import("@/pages/ApproachPage");
  if (path === "/writing") void import("@/pages/WritingPage");
  if (path === "/about") void import("@/pages/AboutPage");
  if (path === "/simple") void import("@/pages/SimplePage");
  if (path === "/") void import("@/pages/HomePage");
}

/** Warm the SVG plane chunk for a product machine before the case opens. */
export function prefetchPlane(kind: ArtifactKind) {
  if (planeWarm.has(kind)) return;
  planeWarm.add(kind);
  if (kind === "iport") void import("@/artifacts/IPortPlane");
  else if (kind === "coco") void import("@/artifacts/CocoTrace");
  else if (kind === "cross-currency") void import("@/artifacts/CompressNet");
  else if (kind === "valuation") void import("@/artifacts/ReconcilePlane");
  else if (kind === "fx-compression") void import("@/artifacts/FxMatrix");
  else if (kind === "margin-simulator") void import("@/artifacts/WhatIfEngine");
  else if (kind === "ridelens") void import("@/artifacts/RideLensPlane");
  else if (kind === "raildrop") void import("@/artifacts/RailDropPlane");
  else if (kind === "daylight") void import("@/artifacts/DaylightPlane");
  else if (kind === "platform" || kind === "architecture" || kind === "systems-core") {
 // Eagerly bundled with ProductVisual - nothing to warm.
  }
}
