import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cases, metrics, person, principles, writing } from "@/data/content";
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

const SYSTEM_SLUGS = [
  "iport",
  "coco",
  "cross-currency",
  "valuation",
  "fx-compression",
  "platform",
  "margin-simulator",
  "ridelens",
  "raildrop",
] as const;

/** Coarse bands with systems expanded between work and build. */
const HOME_LADDER = [
  "hero",
  "work",
  ...SYSTEM_SLUGS,
  "build",
  "writing",
  "contact",
] as const;

export function HomePage() {
  const navigate = useNavigate();
  const { pathname, hash } = useLocation();
  const activeId = useOrientId(hash);
  const shortcut = usePaletteShortcut();
  const [seenSlugs, setSeenSlugs] = useState(() => new Set(visitedCaseSlugs()));

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
        <Reveal className="hero-copy">
          <p className="sys">Production systems · 2026</p>
          <h1 className="display">
            AI that can act.
            <br />
            Financial systems that can scale.
          </h1>
          <p className="lede">
            Lead Product Manager building production AI agents and 0→1 financial infrastructure
            for high-stakes workflows.
          </p>
          <div className="hero-actions">
            <Link className="btn btn-solid" to="/work" onMouseEnter={() => prefetchRoute("/work")}>
              Selected systems
            </Link>
            <ExternalLink className="btn btn-ghost" href={person.resume} mark>
              Résumé
            </ExternalLink>
          </div>
          <ContinueReading className="continue-read-hero" />
        </Reveal>
        <div className="hero-stage">
          <ProductVisual kind="systems-core" />
          <span className="cal cal-tl" />
          <span className="cal cal-br" />
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
                  <MetricValue value={m.value} />
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
            <p className="sys">Selected systems</p>
            {SYSTEM_SLUGS.includes(activeId as (typeof SYSTEM_SLUGS)[number]) ? (
              <p className="sys work-locus" aria-live="polite">
                {String(SYSTEM_SLUGS.indexOf(activeId as (typeof SYSTEM_SLUGS)[number]) + 1).padStart(2, "0")}
                <i>/</i>
                {String(SYSTEM_SLUGS.length).padStart(2, "0")}
                <span>· {bySlug[activeId]?.alias ?? activeId}</span>
              </p>
            ) : seenSlugs.size > 0 ? (
              <p className="sys work-locus" aria-live="polite">
                {String(seenSlugs.size).padStart(2, "0")}
                <i>/</i>
                {String(SYSTEM_SLUGS.length).padStart(2, "0")}
                <span>· seen</span>
              </p>
            ) : (
              <p className="sys work-locus" aria-hidden="true">
                09 systems
              </p>
            )}
          </div>
          <h2 className="display">Nine products. Measured change.</h2>
          <p className="lede">
            Production AI inside live operations. 0→1 infrastructure in rates, FX, and
            cross-currency. Then two independent products (rides and rail) built end-to-end
            and shipped live.
          </p>
        </div>
      </section>

      <SystemStage study={bySlug.iport} tone="chamber" eager seen={seenSlugs.has("iport")} />
      <SystemStage study={bySlug.coco} tone="chamber" flip eager seen={seenSlugs.has("coco")} />
      <SystemStage
        study={bySlug["cross-currency"]}
        tone="sheet"
        eager
        seen={seenSlugs.has("cross-currency")}
      />
      <SystemStage
        study={bySlug.valuation}
        tone="chamber"
        flip
        eager
        seen={seenSlugs.has("valuation")}
      />
      <SystemStage
        study={bySlug["fx-compression"]}
        tone="sheet"
        eager
        seen={seenSlugs.has("fx-compression")}
      />
      <SystemStage
        study={bySlug.platform}
        tone="chamber"
        flip
        eager
        seen={seenSlugs.has("platform")}
      />
      <SystemStage
        study={bySlug["margin-simulator"]}
        tone="sheet"
        eager
        seen={seenSlugs.has("margin-simulator")}
      />
      <SystemStage study={bySlug.ridelens} tone="chamber" eager seen={seenSlugs.has("ridelens")} />
      <SystemStage
        study={bySlug.raildrop}
        tone="sheet"
        flip
        eager
        seen={seenSlugs.has("raildrop")}
      />

      <section className={`chamber build-band${activeId === "build" ? " is-target" : ""}`} id="build">
        <div className="wrap-wide">
          <Reveal>
            <div className="section-head">
              <p className="sys">How I build</p>
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
                  Control model →
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
              <p className="sys">Writing</p>
              <h2 className="display">Product theses.</h2>
              <p className="lede">
                Short notes on AI product economics, autonomy, and infrastructure. Longer notes land
                on Substack.
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
          <h2 className="display">Building something hard that should feel obvious?</h2>
          <p className="lede">
            Production AI and financial infrastructure for teams that treat craft as a competitive
            advantage.
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
