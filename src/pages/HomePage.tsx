import { Link } from "react-router-dom";
import { cases, metrics, person, principles, writing } from "@/data/content";
import type { CaseStudy } from "@/data/content";
import { Reveal } from "@/components/Reveal";
import { SiteFooter } from "@/components/Layout";
import { SystemStage } from "@/components/SystemStage";
import { VisibleMount } from "@/components/VisibleMount";
import { ProductVisual } from "@/artifacts/ProductVisual";

const bySlug = Object.fromEntries(cases.map((c) => [c.slug, c])) as Record<string, CaseStudy>;

export function HomePage() {
  return (
    <>
      <section className="hero chamber" id="hero">
        <div className="hero-copy">
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
            <Link className="btn btn-solid" to="/work">
              Selected systems
            </Link>
            <a className="btn btn-ghost" href={person.resume} target="_blank" rel="noreferrer">
              Résumé
            </a>
          </div>
        </div>
        <div className="hero-stage">
          <ProductVisual kind="systems-core" />
          <span className="cal cal-tl" />
          <span className="cal cal-br" />
        </div>
      </section>

      <section className="proof sheet" aria-label="Measured outcomes">
        <div className="wrap-wide proof-grid">
          {metrics.map((m) => (
            <div key={m.value}>
              <b>{m.value}</b>
              <span>{m.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="sheet work-intro" id="work">
        <div className="wrap-wide">
          <p className="sys">Selected systems</p>
          <h2 className="display">Nine products. Measured change.</h2>
          <p className="lede">
            Production AI inside live operations. 0→1 infrastructure in rates, FX, and
            cross-currency. Independent products for workflow fit and the search itself.
          </p>
        </div>
      </section>

      <SystemStage study={bySlug.iport} tone="chamber" />
      <SystemStage study={bySlug.coco} tone="chamber" flip />
      <SystemStage
        study={bySlug.agentfit}
        tone="sheet"
        extra={
          <Link className="btn btn-ink" to="/apps/agentfit/" reloadDocument>
            Open AgentFit
          </Link>
        }
      />
      <SystemStage study={bySlug["cross-currency"]} tone="chamber" flip />
      <SystemStage study={bySlug.valuation} tone="sheet" />
      <SystemStage study={bySlug["fx-compression"]} tone="chamber" flip />
      <SystemStage study={bySlug["margin-simulator"]} tone="sheet" />
      <SystemStage
        study={bySlug["opportunity-os"]}
        tone="chamber"
        flip
        extra={
          <Link className="btn btn-ghost" to="/apps/opportunity-os/" reloadDocument>
            Open Opportunity OS
          </Link>
        }
      />

      <section className="sheet compact-ledger">
        <div className="wrap-wide ledger">
          <Link to={`/work/${bySlug.platform.slug}`}>
            <span className="sys">JJ-SYS-{bySlug.platform.number}</span>
            <div>
              <h3>{bySlug.platform.title}</h3>
              <p className="lede">
                {bySlug.platform.summary}
              </p>
            </div>
            <span className="sys">
              {bySlug.platform.metrics.map((m) => m.value).join(" · ")}
            </span>
          </Link>
        </div>
      </section>

      <section className="chamber build-band" id="build">
        <div className="wrap-wide">
          <Reveal>
            <div className="section-head">
              <p className="sys">How I build</p>
              <h2 className="display">Agents should earn autonomy.</h2>
            </div>
          </Reveal>
          <div className="arch">
            <div className="arch-visual">
              <VisibleMount>
                <ProductVisual kind="architecture" />
              </VisibleMount>
            </div>
            <div className="principle-list">
              {principles.map((p) => (
                <article key={p.num}>
                  <p className="sys">{p.num}</p>
                  <h3>{p.title}</h3>
                  <p>{p.body}</p>
                </article>
              ))}
              <p>
                <Link className="text-link" to="/approach">
                  Control model →
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="sheet writing-band" id="writing">
        <div className="wrap-wide">
          <Reveal>
            <div className="section-head">
              <p className="sys">Writing</p>
              <h2 className="display">Product theses.</h2>
            </div>
          </Reveal>
          <div className="writing-list">
            {writing.map((w, i) => (
              <a key={w.title} href={person.substack} target="_blank" rel="noreferrer">
                <span className="sys sys-num">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <p className="sys">{w.tag}</p>
                  <h3>{w.title}</h3>
                  <p>{w.dek}</p>
                </div>
                <span className="sys" aria-hidden="true">
                  ↗
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="contact chamber" id="contact">
        <div className="wrap-wide">
          <p className="sys">Contact</p>
          <h2 className="display">Building something hard that should feel obvious?</h2>
          <p className="lede">
            Production AI and financial infrastructure for teams that treat craft as a competitive
            advantage.
          </p>
          <div className="hero-actions">
            <a className="btn btn-solid" href={`mailto:${person.email}`}>
              Email me
            </a>
            <a className="btn btn-ghost" href={person.linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          </div>
        </div>
      </section>
      <SiteFooter night />
    </>
  );
}
