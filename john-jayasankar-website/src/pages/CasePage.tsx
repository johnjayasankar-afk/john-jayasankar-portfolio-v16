import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { cases, type CaseStudy } from "@/data/content";
import { SiteFooter } from "@/components/Layout";
import { ProductLink } from "@/components/ProductLink";
import { CopyEmail } from "@/components/CopyEmail";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { ProductVisual } from "@/artifacts/ProductVisual";
import { visual } from "@/scene/visual";
import { kindForSlug } from "@/scene/kinds";
import { MetricValue } from "@/components/MetricValue";
import { prefetchRoute } from "@/util/prefetch";
import { prefersReducedMotion } from "@/util/motion";
import { bindProgress, isInteractiveTarget, isTypingTarget, markSoftLocus, replaceHash, scrollToId, shouldSkipHashScroll, shouldSkipHashSpy } from "@/util/scroll";
import { caseToc } from "@/util/caseToc";
import { hudKeysHint } from "@/util/hudHint";
import { copyText } from "@/util/clipboard";
import { absoluteUrl, siteOrigin } from "@/lib/site";
import { caseBriefText, caseReadingMinutes } from "@/util/caseBrief";
import { ContinueReading } from "@/components/ContinueReading";
import { flashCopied, flashToast } from "@/util/toast";
import { visitedCaseSlugs } from "@/util/visited";

const LEGACY_CASE: Record<string, string> = {
  agentfit: "ridelens",
  "opportunity-os": "raildrop",
};

type StoryBeat = "broken" | "decision" | "control" | "impact";

export function CasePage() {
  const { slug } = useParams();
  if (slug && LEGACY_CASE[slug]) {
    return <Navigate to={`/work/${LEGACY_CASE[slug]}`} replace />;
  }
  const index = cases.findIndex((c) => c.slug === slug);
  const study = cases[index];
  if (!study) return <NotFoundPage />;
  return <CaseStudyView study={study} index={index} />;
}

function relatedFor(study: CaseStudy): CaseStudy[] {
  const same = cases.filter((c) => c.company === study.company && c.slug !== study.slug);
  if (same.length) return same.slice(0, 3);
  return cases
    .filter((c) => c.slug !== study.slug && (c.productHref || c.slug === "platform"))
    .slice(0, 3);
}

function CaseStudyView({ study, index }: { study: CaseStudy; index: number }) {
  const navigate = useNavigate();
  const progressRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef("broken");
  const [activeId, setActiveId] = useState(() => {
    const hash = typeof window !== "undefined" ? window.location.hash.replace(/^#/, "") : "";
    return hash || "broken";
  });
  const prev = cases[(index - 1 + cases.length) % cases.length];
  const next = cases[(index + 1) % cases.length];
  const related = useMemo(() => relatedFor(study), [study.slug, study.company]);
  const toc = useMemo(() => caseToc(study), [study]);
  const controlN = toc.find((t) => t.id === "control")?.label.slice(0, 2) ?? "04";
  const impactN = toc.find((t) => t.id === "impact")?.label.slice(0, 2) ?? "05";
  const machineKind = kindForSlug(study.slug);
  const keysHint = hudKeysHint(machineKind);
  const scrubRef = useRef<HTMLElement>(null);
  const [linkFlash, setLinkFlash] = useState("");
  const [briefFlash, setBriefFlash] = useState("");
  const readingMins = useMemo(() => caseReadingMinutes(study), [study]);
  const seenSlugs = useMemo(() => new Set(visitedCaseSlugs()), [study.slug, activeId]);
  const activeBeatLabel = useMemo(() => {
    const beat = toc.find((item) => item.id === activeId);
    return beat?.label.replace(/^\d+\s+/, "") ?? "section";
  }, [toc, activeId]);
  const copyLabel = `Copy · ${activeBeatLabel}`;

  const setBeat = (id: string, opts?: { story?: StoryBeat; writeHash?: boolean }) => {
    activeRef.current = id;
    setActiveId(id);
    if (opts?.story) applyStory(study.slug, opts.story);
    if (opts?.writeHash !== false) replaceHash(id);
  };

  useEffect(() => {
    prefetchRoute(`/work/${prev.slug}`);
    prefetchRoute(`/work/${next.slug}`);
    for (const c of related) prefetchRoute(`/work/${c.slug}`);
  }, [prev.slug, next.slug, related]);

  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, "");
    const valid = toc.some((t) => t.id === hash);
    const id = valid ? hash : "broken";
    const el = document.getElementById(id);
    const story = el?.dataset.story as StoryBeat | undefined;
    // Empty hash stays clean; invalid hash is sanitized to #broken.
    setBeat(id, { story, writeHash: Boolean(hash) });
  }, [study.slug, toc]);

  useEffect(() => bindProgress(progressRef.current), [study.slug]);

  useEffect(() => {
    const reduce = prefersReducedMotion();
    const behavior: ScrollBehavior = reduce ? "auto" : "smooth";
    const chip =
      scrubRef.current?.querySelector<HTMLElement>('[aria-current="location"]') ??
      document.querySelector<HTMLElement>('.case-toc [aria-current="location"]');
    chip?.scrollIntoView({ inline: "nearest", block: "nearest", behavior });
  }, [activeId]);

  async function copySectionLink(id: string) {
    const path = `/work/${study.slug}#${id}`;
    const url = absoluteUrl(path, siteOrigin()) || `${window.location.origin}${path}`;
    const ok = await copyText(url);
    const beat = toc.find((item) => item.id === id);
    const label = beat?.label.replace(/^\d+\s+/, "") ?? id;
    setLinkFlash(ok ? `Copied · ${label}` : url);
    flashCopied(label, ok);
    window.setTimeout(() => setLinkFlash(""), 1600);
  }

  async function copyBrief() {
    const path = `/work/${study.slug}`;
    const url = absoluteUrl(path, siteOrigin()) || `${window.location.origin}${path}`;
    const text = caseBriefText(study, url);
    const ok = await copyText(text);
    setBriefFlash(ok ? "Brief copied" : "Could not copy");
    flashToast(ok ? `Brief · ${study.alias}` : "Could not copy brief");
    window.setTimeout(() => setBriefFlash(""), 1600);
  }


  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (isTypingTarget(event.target)) return;
      if (isInteractiveTarget(event.target)) return;

      const beatPath = (slug: string) => {
        const beat = activeRef.current;
        const neighbor = cases.find((c) => c.slug === slug);
        if (!neighbor || !beat) return `/work/${slug}`;
        return caseToc(neighbor).some((item) => item.id === beat)
          ? `/work/${slug}#${beat}`
          : `/work/${slug}`;
      };

      if (event.key === "ArrowLeft" || event.key === "[") {
        event.preventDefault();
        navigate(beatPath(prev.slug));
        return;
      }
      if (event.key === "ArrowRight" || event.key === "]") {
        event.preventDefault();
        navigate(beatPath(next.slug));
        return;
      }
      if (event.key === "y") {
        event.preventDefault();
        void copySectionLink(activeRef.current);
        return;
      }
      if (event.key === "b") {
        event.preventDefault();
        void copyBrief();
        return;
      }
      if (/^[1-9]$/.test(event.key)) {
        const item = toc[Number(event.key) - 1];
        if (!item) return;
        event.preventDefault();
        const el = document.getElementById(item.id);
        scrollToId(item.id);
        setBeat(item.id, { story: el?.dataset.story as StoryBeat | undefined });
        return;
      }
      if (event.key === "j" || event.key === "k") {
        event.preventDefault();
        const ids = toc.map((item) => item.id);
        const here = ids.indexOf(activeRef.current);
        const at = here < 0 ? 0 : here;
        const nextIndex =
          event.key === "j" ? Math.min(ids.length - 1, at + 1) : Math.max(0, at - 1);
        const id = ids[nextIndex];
        if (!id) return;
        const el = document.getElementById(id);
        scrollToId(id);
        setBeat(id, { story: el?.dataset.story as StoryBeat | undefined });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate, prev.slug, next.slug, toc, study.slug]);

  useEffect(() => {
    const nodes = [...document.querySelectorAll<HTMLElement>("[data-case-beat]")];
    if (nodes.length === 0) return;
    const slug = study.slug;

    const writeBeat = (id: string, story?: StoryBeat) => {
      if (id === activeRef.current) return;
      activeRef.current = id;
      setActiveId(id);
      if (story) applyStory(slug, story);
      // Esc-cleared locus: keep scrub orientation, leave the URL clean.
      if (shouldSkipHashSpy() || shouldSkipHashScroll()) {
        markSoftLocus(id);
        return;
      }
      replaceHash(id);
    };

    const lockBottom = () => {
      if (shouldSkipHashSpy() || shouldSkipHashScroll()) return false;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max > 0 && window.scrollY >= max - 72) {
        const last = nodes[nodes.length - 1];
        const id = last.dataset.caseBeat;
        if (id) writeBeat(id, last.dataset.story as StoryBeat | undefined);
        return true;
      }
      return false;
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (shouldSkipHashSpy()) {
          // Still advance scrub/active UI without touching the URL.
          const visible = entries
            .filter((e) => e.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
          const top = visible[0]?.target as HTMLElement | undefined;
          const id = top?.dataset.caseBeat;
          if (id && id !== activeRef.current) {
            activeRef.current = id;
            setActiveId(id);
            markSoftLocus(id);
            const story = top.dataset.story as StoryBeat | undefined;
            if (story) applyStory(slug, story);
          }
          return;
        }
        if (shouldSkipHashScroll()) return;
        if (lockBottom()) return;
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        const top = visible[0]?.target as HTMLElement | undefined;
        if (!top) return;
        const id = top.dataset.caseBeat;
        if (!id) return;
        writeBeat(id, top.dataset.story as StoryBeat | undefined);
      },
      { rootMargin: "-20% 0px -55% 0px", threshold: [0.15, 0.35, 0.6] },
    );
    nodes.forEach((n) => io.observe(n));
    const onScroll = () => {
      lockBottom();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [study.slug, study.blocks.length]);

  return (
    <>
      <div className="case-progress-wrap">
        <div className="case-progress" ref={progressRef} aria-hidden="true" />
        <div className="case-progress-beats" role="navigation" aria-label="Case beats">
          {(() => {
            const activeIndex = Math.max(0, toc.findIndex((row) => row.id === activeId));
            return toc.map((item, i) => {
              const on = activeId === item.id;
              return (
                <button
                  type="button"
                  key={item.id}
                  className={on ? "on" : undefined}
                  data-passed={!on && i < activeIndex ? "true" : undefined}
                  style={{ left: `${((i + 0.5) / toc.length) * 100}%` }}
                  title={item.label}
                  aria-label={item.label}
                  aria-current={on ? "location" : undefined}
                  onClick={() => {
                    const el = document.getElementById(item.id);
                    scrollToId(item.id);
                    setBeat(item.id, { story: el?.dataset.story as StoryBeat | undefined });
                  }}
                />
              );
            });
          })()}
        </div>
      </div>
      <section className="case-hero chamber">
        <div className="wrap-wide">
          <div>
            <nav className="case-crumb" aria-label="Breadcrumb">
              <Link to="/" onMouseEnter={() => prefetchRoute("/")} onFocus={() => prefetchRoute("/")}>
                Home
              </Link>
              <span aria-hidden="true"> / </span>
              <Link to="/work" onMouseEnter={() => prefetchRoute("/work")} onFocus={() => prefetchRoute("/work")}>
                Work
              </Link>
              <span aria-hidden="true"> / </span>
              <span aria-current="page">
                JJ-SYS-{study.number}
                <i aria-hidden="true"> · </i>
                {study.alias}
              </span>
            </nav>
            <p className="sys">
              JJ-SYS-{study.number} / {study.kicker}
              <span className="case-read-est" aria-label={`${readingMins} minute read`}>
                {" "}
                · {readingMins} min
              </span>
            </p>
            <h1 className="display">{study.title}</h1>
            <p className="lede">{study.summary}</p>
            <div className="hero-actions case-hero-actions">
              {study.productHref ? (
                <ProductLink className="btn btn-solid" href={study.productHref}>
                  {study.productLabel ?? "Open product"} ↗
                </ProductLink>
              ) : null}
              <Link
                className={study.productHref ? "btn btn-ghost" : "btn btn-solid"}
                to="/work"
                onMouseEnter={() => prefetchRoute("/work")}
              >
                All systems
              </Link>
              <Link
                className="btn btn-ghost"
                to={`/work/${next.slug}`}
                onMouseEnter={() => prefetchRoute(`/work/${next.slug}`)}
              >
                Next: {next.alias}
                {seenSlugs.has(next.slug) ? <i className="ledger-seen" aria-hidden="true" /> : null}
              </Link>
            </div>
          </div>
          <div className="case-metrics">
            {study.metrics.map((m) => (
              <button
                type="button"
                key={m.label}
                className="case-metric"
                aria-label={`${m.value}: ${m.label}. Jump to impact.`}
                onClick={() => {
                  scrollToId("impact");
                  setBeat("impact", { story: "impact" });
                }}
              >
                <strong>
                  <MetricValue value={m.value} />
                </strong>
                <span>{m.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>
      <div className="case-visual-band chamber">
        <ProductVisual kind={machineKind} />
      </div>
      <nav className="case-scrub" ref={scrubRef} aria-label="Case sections">
        <span className="case-scrub-mark" aria-hidden="true">
          <b>{study.alias}</b>
          {(() => {
            const beat =
              toc.find((item) => item.id === activeId) ?? toc[0];
            const name = beat?.label.replace(/^\d+\s+/, "") ?? "";
            return name ? <span className="case-scrub-beat">{name}</span> : null;
          })()}
          <span className="case-scrub-index">
            {Math.max(1, toc.findIndex((item) => item.id === activeId) + 1)
              .toString()
              .padStart(2, "0")}
            <i>/</i>
            {toc.length.toString().padStart(2, "0")}
          </span>
        </span>
        {toc.map((item, i) => {
          const activeIndex = Math.max(0, toc.findIndex((row) => row.id === activeId));
          const on = activeId === item.id;
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              aria-current={on ? "location" : undefined}
              data-passed={!on && i < activeIndex ? "true" : undefined}
              onClick={(event) => {
                event.preventDefault();
                const el = document.getElementById(item.id);
                scrollToId(item.id);
                setBeat(item.id, { story: el?.dataset.story as StoryBeat | undefined });
              }}
            >
              {item.label}
            </a>
          );
        })}
      </nav>
      <article className="case-body">
        <div className="wrap-wide case-layout">
          <dl className="case-side">
            <dt>Status</dt>
            <dd>{study.stage}</dd>
            <dt>Domain</dt>
            <dd>{study.company}</dd>
            <dt>Role</dt>
            <dd>{study.role.split(".")[0]}.</dd>
            <dt>Internal</dt>
            <dd>{study.alias}</dd>
            <dt>Year</dt>
            <dd>{study.year}</dd>
            {study.productHref && (
              <>
                <dt>Live</dt>
                <dd>
                  <ProductLink href={study.productHref} className="text-link">
                    {study.productLabel ?? "Open product"} ↗
                  </ProductLink>
                </dd>
              </>
            )}
            <dt>On this page</dt>
            <dd>
              <nav className="case-toc" aria-label="Case sections">
                {toc.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    aria-current={activeId === item.id ? "location" : undefined}
                    onClick={(event) => {
                      event.preventDefault();
                      const el = document.getElementById(item.id);
                      scrollToId(item.id);
                      setBeat(item.id, { story: el?.dataset.story as StoryBeat | undefined });
                    }}
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
              <div className="case-side-tools">
                <button
                  type="button"
                  className="case-copy-link"
                  onClick={() => void copySectionLink(activeId)}
                >
                  {linkFlash || copyLabel}
                </button>
                <button
                  type="button"
                  className="case-copy-link"
                  onClick={() => void copyBrief()}
                >
                  {briefFlash || "Copy brief"}
                </button>
              </div>
              <span className="sr-only" role="status" aria-live="polite">
                {linkFlash || briefFlash}
              </span>
            </dd>
          </dl>
          <div className="case-article">
            <StorySection
              id="broken"
              slug={study.slug}
              story="broken"
              title="01 / What was broken"
              active={activeId === "broken"}
            >
              <p>{study.problem}</p>
            </StorySection>
            <StorySection
              id="decision"
              slug={study.slug}
              story="decision"
              title="02 / Product decision"
              active={activeId === "decision"}
            >
              <p>{study.decision}</p>
            </StorySection>
            {study.flow && (
              <div
                className={`flow${activeId === "flow" ? " is-target" : ""}`}
                id="flow"
                data-case-beat="flow"
                data-story="decision"
                tabIndex={-1}
                aria-label="Flow"
              >
                {study.flow.map((f, i) => (
                  <article key={f.stage}>
                    <small>
                      {String(i + 1).padStart(2, "0")}
                      <i aria-hidden="true"> / </i>
                      {f.stage}
                    </small>
                    <strong>{f.title}</strong>
                    <p>{f.note}</p>
                  </article>
                ))}
              </div>
            )}
            {study.blocks.map((b, i) => (
              <section
                key={b.title}
                id={`block-${i}`}
                data-case-beat={`block-${i}`}
                data-story="control"
                tabIndex={-1}
                className={activeId === `block-${i}` ? "is-target" : undefined}
                aria-label={`${String(i + 3).padStart(2, "0")} / ${b.title}`}
              >
                <h2>
                  {String(i + 3).padStart(2, "0")} / {b.title}
                </h2>
                {Array.isArray(b.body) ? (
                  <ul>
                    {b.body.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p>{b.body}</p>
                )}
              </section>
            ))}
            <StorySection
              id="control"
              slug={study.slug}
              story="control"
              title={`${controlN} / Control`}
              active={activeId === "control"}
            >
              <p>{study.role}</p>
              <p className="chip-row">{study.chips.join(" · ")}</p>
            </StorySection>
            <StorySection
              id="impact"
              slug={study.slug}
              story="impact"
              title={`${impactN} / Impact`}
              active={activeId === "impact"}
            >
              <p>{study.outcome}</p>
            </StorySection>
            {study.productHref ? (
              <section
                className={`case-live${activeId === "live" ? " is-target" : ""}`}
                id="live"
                data-case-beat="live"
                data-story="impact"
                tabIndex={-1}
                aria-label="Try the live product"
              >
                <h2>Try the live product</h2>
                <p>
                  The working app is live, not a mock. Open it, use it, then come back to the case
                  if you want the product decisions behind it.
                </p>
                <div className="hero-actions">
                  <ProductLink className="btn btn-ink" href={study.productHref}>
                    {study.productLabel ?? "Open product"} ↗
                  </ProductLink>
                </div>
              </section>
            ) : null}
            <div className="case-closeout">
              <ContinueReading className="continue-read-case" />
              <div className="case-closeout-ramp">
                <Link
                  className="case-closeout-next"
                  to={`/work/${next.slug}`}
                  onMouseEnter={() => prefetchRoute(`/work/${next.slug}`)}
                  onFocus={() => prefetchRoute(`/work/${next.slug}`)}
                >
                  <small>Next system</small>
                  <strong>{next.alias}</strong>
                  {next.metrics[0] ? (
                    <em>
                      {next.metrics[0].value}
                      <span> · {next.metrics[0].label}</span>
                    </em>
                  ) : null}
                </Link>
                <div className="case-closeout-tools">
                  <button type="button" className="case-copy-link" onClick={() => void copyBrief()}>
                    {briefFlash || "Copy brief"}
                  </button>
                  <Link
                    className="case-copy-link"
                    to="/work"
                    onMouseEnter={() => prefetchRoute("/work")}
                    onFocus={() => prefetchRoute("/work")}
                  >
                    All systems
                  </Link>
                  <Link
                    className="case-copy-link"
                    to="/approach"
                    onMouseEnter={() => prefetchRoute("/approach")}
                    onFocus={() => prefetchRoute("/approach")}
                  >
                    Build model
                  </Link>
                </div>
              </div>
              <CopyEmail tone="light" />
              {related.length > 0 ? (
                <p className="exp-related">
                  Also see{" "}
                  {related.map((item, i) => (
                    <span key={item.slug}>
                      {i > 0 ? <span className="follow-sep" aria-hidden="true"> · </span> : null}
                      <Link
                        className="text-link"
                        to={`/work/${item.slug}`}
                        onMouseEnter={() => prefetchRoute(`/work/${item.slug}`)}
                        onFocus={() => prefetchRoute(`/work/${item.slug}`)}
                      >
                        {item.alias}
                        {seenSlugs.has(item.slug) ? (
                          <i className="ledger-seen" aria-hidden="true" />
                        ) : null}
                      </Link>
                    </span>
                  ))}
                </p>
              ) : null}
            </div>
            <nav className="case-nav" aria-label="Adjacent cases">
              <Link
                to={`/work/${prev.slug}`}
                onMouseEnter={() => prefetchRoute(`/work/${prev.slug}`)}
                onFocus={() => prefetchRoute(`/work/${prev.slug}`)}
                data-visited={seenSlugs.has(prev.slug) ? "true" : undefined}
              >
                <small>Previous</small>
                <strong>
                  {prev.alias}
                  {seenSlugs.has(prev.slug) ? <i className="ledger-seen" aria-hidden="true" /> : null}
                </strong>
                {prev.metrics[0] ? (
                  <em className="case-nav-metric">
                    {prev.metrics[0].value}
                    <span> · {prev.metrics[0].label}</span>
                  </em>
                ) : (
                  <em className="case-nav-metric">{prev.kicker}</em>
                )}
              </Link>
              <Link
                to={`/work/${next.slug}`}
                onMouseEnter={() => prefetchRoute(`/work/${next.slug}`)}
                onFocus={() => prefetchRoute(`/work/${next.slug}`)}
                data-visited={seenSlugs.has(next.slug) ? "true" : undefined}
              >
                <small>Next</small>
                <strong>
                  {next.alias}
                  {seenSlugs.has(next.slug) ? <i className="ledger-seen" aria-hidden="true" /> : null}
                </strong>
                {next.metrics[0] ? (
                  <em className="case-nav-metric">
                    {next.metrics[0].value}
                    <span> · {next.metrics[0].label}</span>
                  </em>
                ) : (
                  <em className="case-nav-metric">{next.kicker}</em>
                )}
              </Link>
            </nav>
            <p className="case-nav-hint sys">
              1–{Math.min(9, toc.length)} beats · j / k · ← → adjacent · y link · b brief · {keysHint}
              {toc.length > 1 ? (
                <span className="case-beat-depth" aria-hidden="true">
                  {" "}
                  · {Math.max(1, toc.findIndex((t) => t.id === activeId) + 1)}/{toc.length} ·{" "}
                  {activeBeatLabel}
                </span>
              ) : null}
            </p>
          </div>
        </div>
        <SiteFooter />
      </article>
    </>
  );
}

function StorySection({
  id,
  slug,
  story,
  title,
  active = false,
  children,
}: {
  id: string;
  slug: string;
  story: StoryBeat;
  title: string;
  active?: boolean;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      data-case-beat={id}
      data-story={story}
      tabIndex={-1}
      className={active ? "is-target" : undefined}
      aria-label={title}
      aria-current={active ? "location" : undefined}
      onMouseEnter={() => applyStory(slug, story)}
      onMouseLeave={() => applyStory(slug, "rest")}
      onFocus={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          applyStory(slug, story);
        }
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          applyStory(slug, "rest");
        }
      }}
    >
      <h2>{title}</h2>
      {children}
    </section>
  );
}

function applyStory(slug: string, story: typeof visual.story) {
  visual.story = story;
  const t =
    story === "broken" ? 0 : story === "decision" ? 0.42 : story === "control" ? 0.72 : story === "impact" ? 1 : -1;
  if (t < 0) {
    if (slug === "iport") visual.iport = 0;
    if (slug === "coco") visual.coco = 0;
    if (slug === "valuation") visual.reconcile = 0;
    if (slug === "fx-compression") visual.fx = 0;
    if (slug === "cross-currency") visual.compressTarget = 0;
    if (slug === "ridelens") visual.ride = 0;
    if (slug === "raildrop") visual.rail = 0;
    if (slug === "platform") visual.stack = 2;
    if (slug === "margin-simulator") visual.capitalMode = "baseline";
    return;
  }
  if (slug === "iport") visual.iport = t;
  if (slug === "coco") visual.coco = t;
  if (slug === "valuation") visual.reconcile = t;
  if (slug === "fx-compression") visual.fx = t;
  if (slug === "cross-currency") visual.compressTarget = t;
  if (slug === "ridelens") visual.ride = t;
  if (slug === "raildrop") visual.rail = t;
  if (slug === "platform") {
    visual.stack = story === "broken" ? 0 : story === "decision" ? 1 : story === "control" ? 3 : 4;
  }
  if (slug === "margin-simulator") {
    visual.capitalMode = t < 0.25 ? "baseline" : t < 0.5 ? "proposed" : t < 0.8 ? "simulate" : "compare";
  }
}
