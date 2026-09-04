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
              Résumé ↗
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
            cross-currency. Then two independent products — rides and rail — built end-to-end
            and shipped live.
          </p>
        </div>
      </section>

      <SystemStage study={bySlug.iport} tone="chamber" eager />
      <SystemStage study={bySlug.coco} tone="chamber" flip />
      <SystemStage study={bySlug["cross-currency"]} tone="sheet" />
      <SystemStage study={bySlug.valuation} tone="chamber" flip />
      <SystemStage study={bySlug["fx-compression"]} tone="sheet" />
      <SystemStage study={bySlug["margin-simulator"]} tone="chamber" flip />
      <SystemStage study={bySlug.ridelens} tone="sheet" />
      <SystemStage study={bySlug.raildrop} tone="chamber" flip />

      <section className="sheet compact-ledger">
        <div className="wrap-wide ledger">
          <Link to={`/work/${bySlug.platform.slug}`}>
            <span className="sys">JJ-SYS-{bySlug.platform.number}</span>
            <div>
              <h3>{bySlug.platform.title}</h3>
              <p className="lede">{bySlug.platform.summary}</p>
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
              <p className="lede">
                Short notes on AI product economics, autonomy, and infrastructure. Longer pieces land
                on Substack.
              </p>
            </div>
          </Reveal>
          <div className="writing-list">
            {writing.map((w, i) => (
              <article key={w.title}>
                <span className="sys sys-num">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <p className="sys">{w.tag}</p>
                  <h3>{w.title}</h3>
                  <p>{w.dek}</p>
                </div>
              </article>
            ))}
          </div>
          <p className="follow-link">
            <Link className="text-link" to="/writing">
              All theses →
            </Link>
            <span className="follow-sep" aria-hidden="true">
              ·
            </span>
            <a className="text-link" href={person.substack} target="_blank" rel="noreferrer">
              Notes in progress — follow on Substack ↗
            </a>
          </p>
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
