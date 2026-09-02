import { Link, Navigate, useParams } from "react-router-dom";
import { cases } from "@/data/content";
import { SiteFooter } from "@/components/Layout";
import { ProductVisual } from "@/artifacts/ProductVisual";
import { visual } from "@/scene/visual";
import { kindForSlug } from "@/scene/kinds";

export function CasePage() {
  const { slug } = useParams();
  const index = cases.findIndex((c) => c.slug === slug);
  const study = cases[index];
  if (!study) return <Navigate to="/work" replace />;
  const prev = cases[(index - 1 + cases.length) % cases.length];
  const next = cases[(index + 1) % cases.length];

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
            <dd>{study.role.split(".")[0]}</dd>
            <dt>Internal</dt>
            <dd>{study.alias}</dd>
            <dt>Year</dt>
            <dd>{study.year}</dd>
            {study.productHref && (
              <>
                <dt>Live</dt>
                <dd>
                  <Link to={study.productHref} reloadDocument className="text-link">
                    {study.productLabel ?? "Open product"} →
                  </Link>
                </dd>
              </>
            )}
          </dl>
          <div className="case-article">
            <section
              onMouseEnter={() => applyStory(study.slug, "broken")}
              onMouseLeave={() => applyStory(study.slug, "rest")}
            >
              <h2>01 / What was broken</h2>
              <p>{study.problem}</p>
            </section>
            <section
              onMouseEnter={() => applyStory(study.slug, "decision")}
              onMouseLeave={() => applyStory(study.slug, "rest")}
            >
              <h2>02 / Product decision</h2>
              <p>{study.decision}</p>
            </section>
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
            {study.blocks.map((b) => (
              <section key={b.title}>
                <h2>03 / {b.title}</h2>
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
            <section
              onMouseEnter={() => applyStory(study.slug, "control")}
              onMouseLeave={() => applyStory(study.slug, "rest")}
            >
              <h2>04 / Control</h2>
              <p>{study.role}</p>
              <p className="chip-row">{study.chips.join(" · ")}</p>
            </section>
            <section
              onMouseEnter={() => applyStory(study.slug, "impact")}
              onMouseLeave={() => applyStory(study.slug, "rest")}
            >
              <h2>05 / Impact</h2>
              <p>{study.outcome}</p>
            </section>
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

function applyStory(slug: string, story: typeof visual.story) {
  visual.story = story;
  const t =
    story === "broken" ? 0 : story === "decision" ? 0.42 : story === "control" ? 0.72 : story === "impact" ? 1 : -1;
  if (t < 0) return;
  if (slug === "iport") visual.iport = t;
  if (slug === "coco") visual.coco = t;
  if (slug === "valuation") visual.reconcile = t;
  if (slug === "fx-compression") visual.fx = t;
  if (slug === "cross-currency") visual.compressTarget = t;
  if (slug === "agentfit") visual.fit = 30 + t * 58;
  if (slug === "opportunity-os") visual.os = t;
  if (slug === "margin-simulator") {
    visual.capitalMode = t < 0.25 ? "baseline" : t < 0.5 ? "proposed" : t < 0.8 ? "simulate" : "compare";
  }
}
