import type { ReactNode } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { cases } from "@/data/content";
import { SiteFooter } from "@/components/Layout";
import { ProductLink } from "@/components/ProductLink";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { ProductVisual } from "@/artifacts/ProductVisual";
import { visual } from "@/scene/visual";
import { kindForSlug } from "@/scene/kinds";

const LEGACY_CASE: Record<string, string> = {
  agentfit: "ridelens",
  "opportunity-os": "raildrop",
};

export function CasePage() {
  const { slug } = useParams();
  if (slug && LEGACY_CASE[slug]) {
    return <Navigate to={`/work/${LEGACY_CASE[slug]}`} replace />;
  }
  const index = cases.findIndex((c) => c.slug === slug);
  const study = cases[index];
  if (!study) return <NotFoundPage />;
  const prev = cases[(index - 1 + cases.length) % cases.length];
  const next = cases[(index + 1) % cases.length];
  const controlN = String(3 + study.blocks.length).padStart(2, "0");
  const impactN = String(4 + study.blocks.length).padStart(2, "0");

  return (
    <>
      <section className="case-hero chamber">
        <div className="wrap-wide">
          <div>
            <p className="sys">
              JJ-SYS-{study.number} / {study.kicker}
            </p>
            <h1 className="display">{study.title}</h1>
            <p className="lede">{study.summary}</p>
            {study.productHref ? (
              <div className="hero-actions case-hero-actions">
                <ProductLink className="btn btn-solid" href={study.productHref}>
                  {study.productLabel ?? "Open product"} ↗
                </ProductLink>
                <Link className="btn btn-ghost" to="/work">
                  All systems
                </Link>
              </div>
            ) : null}
          </div>
          <div className="case-metrics">
            {study.metrics.map((m) => (
              <div key={m.label}>
                <strong>{m.value}</strong>
                <span>{m.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      <div className="case-visual-band chamber">
        <ProductVisual kind={kindForSlug(study.slug)} />
      </div>
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
          </dl>
          <div className="case-article">
            <StorySection slug={study.slug} story="broken" title="01 / What was broken">
              <p>{study.problem}</p>
            </StorySection>
            <StorySection slug={study.slug} story="decision" title="02 / Product decision">
              <p>{study.decision}</p>
            </StorySection>
            {study.flow && (
              <div className="flow">
                {study.flow.map((f) => (
                  <article key={f.stage}>
                    <small>{f.stage}</small>
                    <strong>{f.title}</strong>
                    <p>{f.note}</p>
                  </article>
                ))}
              </div>
            )}
            {study.blocks.map((b, i) => (
              <section key={b.title}>
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
            <StorySection slug={study.slug} story="control" title={`${controlN} / Control`}>
              <p>{study.role}</p>
              <p className="chip-row">{study.chips.join(" · ")}</p>
            </StorySection>
            <StorySection slug={study.slug} story="impact" title={`${impactN} / Impact`}>
              <p>{study.outcome}</p>
            </StorySection>
            {study.productHref ? (
              <section className="case-live">
                <h2>Try the live product</h2>
                <p>
                  The working app is live — not a mock. Open it, use it, then come back to the case
                  if you want the product decisions behind it.
                </p>
                <div className="hero-actions">
                  <ProductLink className="btn btn-ink" href={study.productHref}>
                    {study.productLabel ?? "Open product"} ↗
                  </ProductLink>
                </div>
              </section>
            ) : null}
            <nav className="case-nav">
              <Link to={`/work/${prev.slug}`}>
                <small>Previous</small>
                <strong>{prev.alias}</strong>
              </Link>
              <Link to={`/work/${next.slug}`}>
                <small>Next</small>
                <strong>{next.alias}</strong>
              </Link>
            </nav>
          </div>
        </div>
        <SiteFooter />
      </article>
    </>
  );
}

function StorySection({
  slug,
  story,
  title,
  children,
}: {
  slug: string;
  story: "broken" | "decision" | "control" | "impact";
  title: string;
  children: ReactNode;
}) {
  return (
    <section
      tabIndex={0}
      onMouseEnter={() => applyStory(slug, story)}
      onMouseLeave={() => applyStory(slug, "rest")}
      onFocus={() => applyStory(slug, story)}
      onBlur={() => applyStory(slug, "rest")}
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
