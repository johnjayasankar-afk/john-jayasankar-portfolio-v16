import { useEffect, useState } from "react";
import { getSoftLocus, subscribeSoftLocus } from "@/util/scroll";

/**
 * URL hash when present; after Esc, the soft locus so orientation chrome
 * (is-target, ladders) stays while the address bar stays clean.
 */
export function useOrientId(hash: string): string {
  const hashId = hash.replace(/^#/, "");
  const [, bump] = useState(0);
  useEffect(() => subscribeSoftLocus(() => bump((n) => n + 1)), []);
  if (hashId) return hashId;
  return getSoftLocus() ?? "";
}
