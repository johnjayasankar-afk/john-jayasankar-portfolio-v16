import { listRecents } from "@/util/recents";

/** Case paths (`/work/:slug`) the visitor has opened - from palette recents. */
export function visitedCasePaths(): string[] {
  return listRecents()
    .map((row) => row.path.split("#")[0])
    .filter((path) => /^\/work\/[^/]+$/.test(path));
}

/** Unique case slugs visited. */
export function visitedCaseSlugs(): string[] {
  const slugs = new Set<string>();
  for (const path of visitedCasePaths()) {
    const slug = path.split("/")[2];
    if (slug) slugs.add(slug);
  }
  return [...slugs];
}
