import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cases, featuredHomeSlugs, metrics, person, principles, writing } from "@/data/content";
import type { CaseStudy } from "@/data/content";
import { Reveal } from "@/components/Reveal";
import { SiteFooter } from "@/components/Layout";
import { SystemStage } from "@/components/SystemStage";
import { VisibleMount } from "@/components/VisibleMount";
import { ProductVisual } from "@/artifacts/ProductVisual";
import { ContinueReading } from "@/components/ContinueReading";
import { CopyEmail } from "@/components/CopyEmail";
import { ExternalLink } from "@/components/ExternalLink";
import { MetricValue } from "@/components/MetricValue";
import { prefetchRoute } from "@/util/prefetch";
import { usePaletteShortcut } from "@/util/usePaletteShortcut";
import { useOrientId } from "@/util/useOrientId";
import { visitedCaseSlugs } from "@/util/visited";
import {
  bindSectionSpy,
  chromeScrollOffset,
  isInteractiveTarget,
  isTypingTarget,
  replaceHash,
  scrollToId,
} from "@/util/scroll";

const bySlug = Object.fromEntries(cases.map((c) => [c.slug, c])) as Record<string, CaseStudy>;

const FEATURED_SLUGS = featuredHomeSlugs;
const FEATURED_SET = new Set<string>(FEATURED_SLUGS);
const SUPPORTING = cases.filter((c) => !FEATURED_SET.has(c.slug));

const SYSTEM_SLUGS = FEATURED_SLUGS;

/** Coarse bands with featured systems expanded between work and approach. */
const HOME_LADDER = [
  "hero",
  "work",
  ...FEATURED_SLUGS,
  "ledger",
  "build",
  "writing",
  "contact",
] as const;

const STAGE_TONES: Record<(typeof FEATURED_SLUGS)[number], { tone: "chamber" | "sheet"; flip?: boolean }> = {
  iport: { tone: "chamber" },
  coco: { tone: "sheet", flip: true },
  "cross-currency": { tone: "chamber" },
  ridelens: { tone: "sheet", flip: true },
  raildrop: { tone: "chamber" },
};

export function HomePage() {
  const navigate = useNavigate();
  const { pathname, hash } = useLocation();
  const activeId = useOrientId(hash);
  const shortcut = usePaletteShortcut();
  const [seenSlugs, setSeenSlugs] = useState(() => new Set(visitedCaseSlugs()));
  const featuredCount = FEATURED_SLUGS.length;
  const totalCount = cases.length;

  const featuredStudies = useMemo(
    () => FEATURED_SLUGS.map((slug) => bySlug[slug]).filter(Boolean),
    [],
  );

  useEffect(() => {
    setSeenSlugs(new Set(visitedCaseSlugs()));
  }, [pathname, hash]);

  useEffect(() => bindSectionSpy(HOME_LADDER, { clearHashAtTop: true }), []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (isTypingTarget(event.target)) return;
      if (isInteractiveTarget(event.target)) return;

      if (event.key === "Enter") {
        const slug = activeId || "";
        if (!SYSTEM_SLUGS.includes(slug as (typeof SYSTEM_SLUGS)[number])) return;
        event.preventDefault();
        navigate(`/work/${slug}`);
        return;
      }

      if (event.key !== "j" && event.key !== "k") return;
      event.preventDefault();
      const probe = window.scrollY + chromeScrollOffset() + 8;
      let at = 0;
      HOME_LADDER.forEach((id, i) => {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= probe) at = i;
      });
      const next =
        event.key === "j"
          ? Math.min(HOME_LADDER.length - 1, at + 1)
          : Math.max(0, at - 1);
      const id = HOME_LADDER[next];
      scrollToId(id);
      replaceHash(id === "hero" ? null : id);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeId, navigate]);

  return (
    <>
      <section className={`hero chamber${activeId === "hero" ? " is-target" : ""}`} id="hero">
        <Reveal className="hero-copy" immediate>
          <p className="sys">
            {person.role} · {person.location}
          </p>
          <div className="hero-identity">
            <figure className="hero-portrait">
              <img
                className="portrait"
                src={person.photo}
                alt={person.name}
                width={768}
                height={768}
                sizes="(max-width: 980px) 96px, 120px"
                fetchPriority="high"
                decoding="async"
              />
            </figure>
            <div className="hero-identity-text">
              <h1 className="display hero-name">{person.name}</h1>
              <p className="hero-career">{person.careerLine}</p>
            </div>
          </div>
          <p className="lede">
            I build production AI agents and 0→1 financial infrastructure for high-stakes
 workflows, and ship independent products end-to-end. At Quantile (LSEG), that means
            agents that cut expert work from hours to minutes and market systems that make large
            books executable. Outside work: RideLens, RailDrop, and Daylight.
          </p>
          <div className="hero-actions">
            <Link className="btn btn-solid" to="/work" onMouseEnter={() => prefetchRoute("/work")}>
              Selected work
            </Link>
            <ExternalLink className="btn btn-ghost" href={person.resume} mark>
              Résumé
            </ExternalLink>
            <Link className="btn btn-ghost" to="/about" onMouseEnter={() => prefetchRoute("/about")}>
              About
            </Link>
          </div>
          <div className="hero-email">
            <CopyEmail tone="dark" />
          </div>
          <ContinueReading className="continue-read-hero" />
        </Reveal>
        <div className="hero-stage">
          <ProductVisual kind="systems-core" />
        </div>
      </section>

      <section className="proof sheet" aria-label="Measured outcomes">
        <div className="wrap-wide proof-grid">
          {metrics.map((m, i) => (
            <Reveal key={m.value} inView delay={0.04 * i} className="proof-metric-wrap">
              <Link
                className="proof-metric"
                to={m.href}
                aria-label={`${m.value}: ${m.label}`}
                onMouseEnter={() => prefetchRoute(m.href)}
                onFocus={() => prefetchRoute(m.href)}
              >
                <b>
                  <MetricValue value={m.value} animate={false} />
                </b>
                <span>{m.label}</span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className={`sheet work-intro${activeId === "work" ? " is-target" : ""}`} id="work">
        <div className="wrap-wide">
          <div className="work-intro-head">
            <p className="sys">Featured evidence</p>
            {SYSTEM_SLUGS.includes(activeId as (typeof SYSTEM_SLUGS)[number]) ? (
              <p className="sys work-locus" aria-live="polite">
                {String(SYSTEM_SLUGS.indexOf(activeId as (typeof SYSTEM_SLUGS)[number]) + 1).padStart(2, "0")}
                <i>/</i>
                {String(featuredCount).padStart(2, "0")}
                <span>· {bySlug[activeId]?.alias ?? activeId}</span>
              </p>
            ) : seenSlugs.size > 0 ? (
              <p className="sys work-locus" aria-live="polite">
                {String(Math.min(seenSlugs.size, featuredCount)).padStart(2, "0")}
                <i>/</i>
                {String(featuredCount).padStart(2, "0")}
                <span>· featured seen</span>
              </p>
            ) : (
              <p className="sys work-locus" aria-hidden="true">
                {String(featuredCount).padStart(2, "0")} featured · {String(totalCount).padStart(2, "0")} total
              </p>
            )}
          </div>
          <h2 className="display">Five systems that show the range.</h2>
          <p className="lede">
            Two production AI agents inside live operations. Market infrastructure that unlocked
 previously ineligible notional. Then two independent products (rides and rail) designed,
            built, and shipped live. Daylight and the rest live in the full ledger.
          </p>
        </div>
      </section>

      {featuredStudies.map((study) => {
        const stage = STAGE_TONES[study.slug as (typeof FEATURED_SLUGS)[number]];
        return (
          <SystemStage
            key={study.slug}
            study={study}
            tone={stage.tone}
            flip={stage.flip}
            eager
            seen={seenSlugs.has(study.slug)}
          />
        );
      })}

      <section className={`sheet ledger-band${activeId === "ledger" ? " is-target" : ""}`} id="ledger">
        <div className="wrap-wide">
          <Reveal>
            <div className="section-head">
              <p className="sys">Full ledger</p>
              <h2 className="display">Also shipped.</h2>
              <p className="lede">
                Supporting systems from Quantile and OpenGamma. Compact here; full case studies on
                Work.
              </p>
            </div>
          </Reveal>
          <ul className="ledger-compact">
            {SUPPORTING.map((study) => (
              <li key={study.slug}>
                <Link
                  className="ledger-compact-link"
                  to={`/work/${study.slug}`}
                  onMouseEnter={() => prefetchRoute(`/work/${study.slug}`)}
                  onFocus={() => prefetchRoute(`/work/${study.slug}`)}
                >
                  <span className="sys">
                    JJ-SYS-{study.number}
                    {seenSlugs.has(study.slug) ? (
                      <i className="ledger-seen" aria-hidden="true" />
                    ) : null}
                  </span>
                  <strong>{study.alias}</strong>
                  <em>{study.kicker}</em>
                  {study.metrics[0] ? (
                    <span className="ledger-compact-metric">
                      <b>
                        <MetricValue value={study.metrics[0].value} animate={false} />
                      </b>{" "}
                      {study.metrics[0].label}
                    </span>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
          <p>
            <Link className="text-link" to="/work" onMouseEnter={() => prefetchRoute("/work")}>
              All systems on Work →
            </Link>
          </p>
        </div>
      </section>

      <section className={`chamber build-band${activeId === "build" ? " is-target" : ""}`} id="build">
        <div className="wrap-wide">
          <Reveal>
            <div className="section-head">
              <p className="sys">Approach</p>
              <h2 className="display">Agents should earn autonomy.</h2>
            </div>
          </Reveal>
          <div className="arch">
            <div className="arch-visual">
              <VisibleMount eager>
                <ProductVisual kind="architecture" />
              </VisibleMount>
            </div>
            <div className="principle-list">
              {principles.map((p, i) => (
                <Reveal key={p.num} inView delay={Math.min(0.18, i * 0.05)} className="principle-reveal">
                  <article>
                    <p className="sys">{p.num}</p>
                    <h3>{p.title}</h3>
                    <p>{p.body}</p>
                    {p.related?.length ? (
                      <p className="principle-related sys">
                        In the work
                        <span aria-hidden="true"> · </span>
                        {p.related.map((item, j) => (
                          <span key={item.slug}>
                            {j > 0 ? <span className="follow-sep" aria-hidden="true"> · </span> : null}
                            <Link
                              className="text-link"
                              to={`/work/${item.slug}`}
                              onMouseEnter={() => prefetchRoute(`/work/${item.slug}`)}
                              onFocus={() => prefetchRoute(`/work/${item.slug}`)}
                            >
                              {item.label}
                            </Link>
                          </span>
                        ))}
                      </p>
                    ) : null}
                  </article>
                </Reveal>
              ))}
              <p>
                <Link
                  className="text-link"
                  to="/approach"
                  onMouseEnter={() => prefetchRoute("/approach")}
                  onFocus={() => prefetchRoute("/approach")}
                >
                  Full approach →
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className={`sheet writing-band${activeId === "writing" ? " is-target" : ""}`} id="writing">
        <div className="wrap-wide">
          <Reveal>
            <div className="section-head">
              <p className="sys">Writing · short theses</p>
              <h2 className="display">Notes, not essays.</h2>
              <p className="lede">
                Three short theses on AI product economics, autonomy, and infrastructure. Longer
                notes land on Substack when they exist.
              </p>
            </div>
          </Reveal>
          <div className="writing-list">
            {writing.map((w, i) => (
              <article key={w.id}>
                <span className="sys sys-num">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <p className="sys">{w.tag}</p>
                  <h3>
                    <Link
                      className="writing-title-link"
                      to={w.to ?? `/writing#${w.id}`}
                      onMouseEnter={() => prefetchRoute(w.to ?? "/writing")}
                      onFocus={() => prefetchRoute(w.to ?? "/writing")}
                    >
                      {w.title}
                    </Link>
                  </h3>
                  <p>{w.dek}</p>
                </div>
              </article>
            ))}
          </div>
          <p>
            <Link className="text-link" to="/writing" onMouseEnter={() => prefetchRoute("/writing")}>
              All notes →
            </Link>
          </p>
        </div>
      </section>

      <section className={`contact chamber${activeId === "contact" ? " is-target" : ""}`} id="contact">
        <div className="wrap-wide">
          <p className="sys">Contact</p>
          <h2 className="display">Hiring for production AI or market infrastructure?</h2>
          <p className="lede">
            I ship agents that change real operations and systems that make large books
 executable, and I build independent products end-to-end. If that is the bar for your
            team, email me.
          </p>
          <CopyEmail tone="dark" />
          <div className="hero-actions">
            <a className="btn btn-solid" href={`mailto:${person.email}`}>
              Email me
            </a>
            <ExternalLink className="btn btn-ghost" href={person.linkedin} mark>
              LinkedIn
            </ExternalLink>
            <ExternalLink className="btn btn-ghost" href={person.resume} mark>
              Résumé
            </ExternalLink>
          </div>
          <p className="case-nav-hint sys home-nav-hint">
            {`j / k sections & systems · ${
              SYSTEM_SLUGS.includes(activeId as (typeof SYSTEM_SLUGS)[number])
                ? "Enter opens case"
                : "Enter on a system"
            } · y link · t top · e email · ${shortcut} jump`}
          </p>
        </div>
      </section>
      <SiteFooter night />
    </>
  );
}
