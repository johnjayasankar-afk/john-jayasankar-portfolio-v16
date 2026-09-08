import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { cases } from "@/data/content";
import { Reveal } from "@/components/Reveal";
import { SiteFooter } from "@/components/Layout";
import { ContinueReading } from "@/components/ContinueReading";
import { ProductLink } from "@/components/ProductLink";
import { MetricValue } from "@/components/MetricValue";
import { CopyLocus } from "@/components/CopyLocus";
import { prefersReducedMotion } from "@/util/motion";
import { prefetchRoute } from "@/util/prefetch";
import { copyText } from "@/util/clipboard";
import { absoluteUrl, siteOrigin } from "@/lib/site";
import { flashCopied } from "@/util/toast";
import { bindSectionSpy, isTypingTarget, replaceHash } from "@/util/scroll";
import { usePaletteShortcut } from "@/util/usePaletteShortcut";
import { useOrientId } from "@/util/useOrientId";
import { visitedCasePaths } from "@/util/visited";

type DomainFacet = "all" | "agents" | "markets" | "independent" | "quantile" | "opengamma";

const AGENT_SLUGS = new Set(["iport", "coco", "platform"]);
const MARKET_SLUGS = new Set(["cross-currency", "valuation", "fx-compression", "margin-simulator"]);

const FACETS: {
  id: DomainFacet;
  label: string;
  match: (c: (typeof cases)[number]) => boolean;
  toolbar?: boolean;
}[] = [
  { id: "all", label: "All", match: () => true },
  { id: "agents", label: "Agents", match: (c) => AGENT_SLUGS.has(c.slug) },
  { id: "markets", label: "Markets", match: (c) => MARKET_SLUGS.has(c.slug) },
  { id: "independent", label: "Independent", match: (c) => /independent/i.test(c.company) },
 // Legacy query aliases (?d=quantile|opengamma) - not shown in the toolbar.
  { id: "quantile", label: "Quantile", match: (c) => /quantile/i.test(c.company), toolbar: false },
  { id: "opengamma", label: "OpenGamma", match: (c) => /opengamma/i.test(c.company), toolbar: false },
];

const TOOLBAR_FACETS = FACETS.filter((f) => f.toolbar !== false);

function parseFacet(raw: string | null): DomainFacet {
  if (
    raw === "agents" ||
    raw === "markets" ||
    raw === "independent" ||
    raw === "quantile" ||
    raw === "opengamma"
  ) {
    return raw;
  }
  return "all";
}

export function WorkPage() {
  const listRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { hash, pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const activeSlug = useOrientId(hash);
  const shortcut = usePaletteShortcut();
  const facet = parseFacet(searchParams.get("d"));
  const [visited, setVisited] = useState(() => new Set<string>());

  const setFacet = (next: DomainFacet) => {
    const search = next === "all" ? "" : `?d=${next}`;
    navigate(
      { pathname, search, hash: activeSlug ? `#${activeSlug}` : "" },
      { replace: true },
    );
  };

  const visible = useMemo(() => {
    const rule = FACETS.find((f) => f.id === facet) ?? FACETS[0];
    return cases.filter((c) => rule.match(c));
  }, [facet]);

  const workIds = useMemo(() => visible.map((c) => c.slug), [visible]);

  const locus = useMemo(() => {
    const preferred = activeSlug && visible.some((c) => c.slug === activeSlug) ? activeSlug : null;
    const study = visible.find((c) => c.slug === preferred) ?? visible[0];
    if (!study) return null;
    const index = visible.findIndex((c) => c.slug === study.slug);
    const n = String(Math.max(1, index + 1)).padStart(2, "0");
    const total = String(visible.length).padStart(2, "0");
    return `${n}/${total} · ${study.alias}`;
  }, [activeSlug, visible]);

  useEffect(() => {
    setVisited(new Set(visitedCasePaths()));
  }, [activeSlug]);

  useEffect(() => bindSectionSpy(workIds), [workIds]);

  useEffect(() => {
    if (!activeSlug) return;
    if (visible.some((c) => c.slug === activeSlug)) return;
 // Active hash filtered out - clear so j/k starts clean.
    replaceHash(null);
  }, [facet, activeSlug, visible]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (isTypingTarget(event.target)) return;

      const digit = /^[1-4]$/.test(event.key) ? Number(event.key) - 1 : -1;
      if (digit >= 0 && digit < TOOLBAR_FACETS.length) {
        event.preventDefault();
        setFacet(TOOLBAR_FACETS[digit].id);
        return;
      }
      if (event.key === "[" || event.key === "]") {
        event.preventDefault();
        const at = TOOLBAR_FACETS.findIndex((f) => f.id === facet);
        const base = at < 0 ? 0 : at;
        const next =
          event.key === "]"
            ? (base + 1) % TOOLBAR_FACETS.length
            : (base - 1 + TOOLBAR_FACETS.length) % TOOLBAR_FACETS.length;
        setFacet(TOOLBAR_FACETS[next].id);
        return;
      }

      const links = [
        ...(listRef.current?.querySelectorAll<HTMLAnchorElement>("a.ledger-main") ?? []),
      ];
      if (links.length === 0 && event.key !== "y") return;

      if (event.key === "y") {
        const slug = activeSlug || visible[0]?.slug;
        if (!slug) return;
        event.preventDefault();
        const path = `/work${facet !== "all" ? `?d=${facet}` : ""}#${slug}`;
        const url = absoluteUrl(path, siteOrigin()) || `${window.location.origin}${path}`;
        void copyText(url).then((ok) => {
          const alias = cases.find((c) => c.slug === slug)?.alias ?? slug;
          flashCopied(alias, ok);
        });
        return;
      }

      if (event.key === "Enter") {
        const active = document.activeElement as HTMLElement | null;
        const focused = links.find((link) => link === active || link.contains(active));
        if (!focused) return;
        event.preventDefault();
        const href = focused.getAttribute("href");
        if (href) navigate(href);
        return;
      }

      if (event.key !== "j" && event.key !== "k") return;
      if (links.length === 0) return;
      event.preventDefault();
      const active = document.activeElement as HTMLElement | null;
      const here = links.findIndex((link) => link === active || link.contains(active));
      const at = here < 0 ? (event.key === "j" ? -1 : 0) : here;
      const next =
        event.key === "j" ? Math.min(links.length - 1, at + 1) : Math.max(0, at - 1);
      const link = links[next];
      if (!link) return;
      link.focus();
      link.scrollIntoView({
        block: "nearest",
        behavior: prefersReducedMotion() ? "auto" : "smooth",
      });
      const slug = visible[next]?.slug;
      if (slug) replaceHash(slug);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate, activeSlug, visible, facet, pathname]);

  const focusedHash = useRef<string | null>(null);

  useEffect(() => {
    if (!activeSlug) return;
    if (focusedHash.current === activeSlug) return;
    const active = document.activeElement as HTMLElement | null;
    const links = listRef.current?.querySelectorAll<HTMLAnchorElement>("a.ledger-main");
    const already = [...(links ?? [])].some((link) => link === active || link.contains(active));
    if (already) {
      focusedHash.current = activeSlug;
      return;
    }
    const link = listRef.current?.querySelector<HTMLAnchorElement>(
      `a.ledger-main[href="/work/${activeSlug}"]`,
    );
    if (!link) return;
    if (focusedHash.current !== null && window.scrollY > 40) {
      focusedHash.current = activeSlug;
      return;
    }
    focusedHash.current = activeSlug;
    link.focus({ preventScroll: true });
  }, [activeSlug]);

  const facetLabel = FACETS.find((f) => f.id === facet)?.label ?? "All";

  return (
    <div className="sheet page">
      <section className="section">
        <div className="wrap-wide">
          <Reveal className="page-hero">
            <p className="sys">Work</p>
            <h1 className="display">What I shipped, and what it changed.</h1>
            <p className="lede">
              Production AI inside live operations. 0→1 infrastructure in rates, FX, and
              cross-currency. Then RideLens, RailDrop, and Daylight: independent products built
              end-to-end and shipped live. Filter by Agents, Markets, or Independent for the path
              that matches the role you are hiring for.
            </p>
            <ContinueReading className="continue-read-page" />
            {locus ? (
              <p className="sys work-locus" aria-live="polite">
                {facet !== "all" ? (
                  <>
                    {facetLabel}
                    <i aria-hidden="true"> · </i>
                  </>
                ) : null}
                {locus}
              </p>
            ) : facet !== "all" ? (
              <p className="sys work-locus" aria-live="polite">
                {facetLabel}
              </p>
            ) : null}
          </Reveal>
          <div className="ledger-facets" role="toolbar" aria-label="Filter by capability">
            {TOOLBAR_FACETS.map((f, i) => {
              const count =
                f.id === "all" ? cases.length : cases.filter((c) => f.match(c)).length;
              return (
                <button
                  key={f.id}
                  type="button"
                  className={facet === f.id ? "on" : undefined}
                  aria-pressed={facet === f.id}
                  aria-keyshortcuts={`${i + 1}`}
                  onClick={() => setFacet(f.id)}
                >
                  <span className="ledger-facet-num" aria-hidden="true">
                    {i + 1}
                  </span>
                  {f.label}
                  <i aria-hidden="true">{String(count).padStart(2, "0")}</i>
                </button>
              );
            })}
          </div>
          <div className="ledger" ref={listRef}>
            {visible.length === 0 ? (
              <div className="ledger-empty" role="status">
                <p className="sys">No systems in this facet</p>
                <p className="lede">Reset the filter to see the full ledger.</p>
                <button type="button" className="case-copy-link" onClick={() => setFacet("all")}>
                  Show all
                </button>
              </div>
            ) : (
              visible.map((c) => {
                const here = activeSlug === c.slug;
                const seen = visited.has(`/work/${c.slug}`);
                return (
                  <Reveal key={c.slug} immediate className="ledger-reveal">
                    <article
                      id={c.slug}
                      tabIndex={-1}
                      className={`ledger-row${here ? " is-target" : ""}`}
                      data-visited={seen ? "true" : undefined}
                      aria-current={here ? "location" : undefined}
                    >
                      <Link
                        className="ledger-main"
                        to={`/work/${c.slug}`}
                        onMouseEnter={() => prefetchRoute(`/work/${c.slug}`)}
                        onFocus={() => {
                          prefetchRoute(`/work/${c.slug}`);
                          replaceHash(c.slug);
                        }}
                      >
                        <span className="sys">
                          JJ-SYS-{c.number}
                          {seen ? <i className="ledger-seen" aria-hidden="true" /> : null}
                        </span>
                        <div>
                          <h3>{c.title}</h3>
                          <p className="sys ledger-role">{c.role.split(".")[0]}.</p>
                          <p className="lede">{c.summary}</p>
                          <div className="sys-meta">
                            {c.metrics.map((m) => (
                              <span key={m.label}>
                                <b>
                                  <MetricValue value={m.value} animate={false} />
                                </b>
                                {m.label}
                              </span>
                            ))}
                          </div>
                        </div>
                        <span className="sys ledger-company">
                          {c.company}
                          <i aria-hidden="true"> · </i>
                          {c.year}
                        </span>
                      </Link>
                      {c.productHref ? (
                        <ProductLink className="text-link ledger-live" href={c.productHref}>
                          {c.productLabel ?? "Open product"} ↗
                        </ProductLink>
                      ) : null}
                    </article>
                  </Reveal>
                );
              })
            )}
          </div>
          <p className="case-nav-hint sys">
            {visible.length === 0
              ? `Empty facet · 1 or All · ${shortcut} jump`
 : `1-4 facets · j / k ledger · Enter opens · y link · ${shortcut} jump`}
          </p>
          {visible.length > 0 ? (
            <div className="page-locus-tools">
              <CopyLocus
                path={
                  activeSlug
                    ? `/work${facet !== "all" ? `?d=${facet}` : ""}#${activeSlug}`
                    : `/work${facet !== "all" ? `?d=${facet}` : ""}`
                }
                label={activeSlug ? "Copy locus" : "Copy page"}
                toastLabel={locus ?? (facet !== "all" ? facetLabel : "Work")}
              />
            </div>
          ) : null}
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
