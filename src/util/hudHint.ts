import type { ArtifactKind } from "@/scene/visual";

/** Footer / hint copy that matches ArtifactHud digit shortcuts for a case kind. */
export function hudKeysHint(kind: ArtifactKind): string {
 if (kind === "margin-simulator") return "1-4 capital modes";
 if (kind === "platform" || kind === "architecture") return "1-5 layers";
 if (kind === "systems-core") return "1-3 phases";
 if (kind === "cross-currency") return "1-4 compress";
 return "1-3 phases";
}
