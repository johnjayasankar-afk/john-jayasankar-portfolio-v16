import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cases } from "@/data/content";
import { caseToc } from "@/util/caseToc";
import { locusLabel, pageChromeLabel } from "@/util/locus";
import { listRecents, type RecentItem } from "@/util/recents";
import { prefetchRoute } from "@/util/prefetch";
import { relativeAt } from "@/util/relativeTime";

/** Prefer a still-valid case beat hash; fall back to the case root. */
function resumePath(row: RecentItem): string {
  const [base, beat] = row.path.split("#");
  if (!/^\/work\/[^/]+$/.test(base)) return row.path;
  if (!beat) return base;
  const slug = base.split("/")[2];
  const study = cases.find((c) => c.slug === slug);
  if (!study) return base;
  return caseToc(study).some((item) => item.id === beat) ? row.path : base;
}

/** Compact resume label: Alias · Beat (falls back to stored label). */
export function resumeLabel(row: RecentItem, path = row.path): string {
  const [base, beat] = path.split("#");
  if (/^\/work\/[^/]+$/.test(base)) {
    const slug = base.split("/")[2];
    const study = cases.find((c) => c.slug === slug);
    if (!study) return row.label;
    if (!beat) return study.alias;
    const tocItem = caseToc(study).find((item) => item.id === beat);
    const name = tocItem?.label.replace(/^\d+\s+/, "") ?? beat;
    return `${study.alias} · ${name}`;
  }
  if (beat) {
    const soft = locusLabel(base, `#${beat}`);
    if (soft) {
      const page = pageChromeLabel(base);
      return page === soft ? soft : `${page} · ${soft}`;
    }
  }
  return row.label;
}

/** Quiet resume link from palette recents — any deep locus off this page. */
export function ContinueReading({ className = "" }: { className?: string }) {
  const { pathname } = useLocation();
  const [item, setItem] = useState<RecentItem | null>(null);
  const [, tick] = useState(0);

  useEffect(() => {
    const recent = listRecents().find((row) => {
      const path = row.path.split("#")[0];
      if (path === pathname) return false;
      // Skip bare noise; prefer anything with a destination worth resuming.
      return path !== "/" || row.path.includes("#");
    });
    setItem(recent ?? null);
  }, [pathname]);

  useEffect(() => {
    if (!item) return;
    const id = window.setInterval(() => tick((n) => n + 1), 30_000);
    return () => window.clearInterval(id);
  }, [item]);

  if (!item) return null;
  const path = resumePath(item);
  const base = path.split("#")[0];
  const label = resumeLabel(item, path);

  return (
    <Link
      className={`continue-read${className ? ` ${className}` : ""}`}
      to={path}
      onMouseEnter={() => prefetchRoute(base)}
      onFocus={() => prefetchRoute(base)}
    >
      <span className="sys">Continue</span>
      <span className="continue-read-label">{label}</span>
      <span className="continue-read-when" aria-hidden="true">
        {relativeAt(item.at)}
      </span>
    </Link>
  );
}
