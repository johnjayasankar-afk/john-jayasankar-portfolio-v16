import { Link } from "react-router-dom";
import { principles } from "@/data/content";
import { Reveal } from "@/components/Reveal";
import { SiteFooter } from "@/components/Layout";
import { ProductVisual } from "@/artifacts/ProductVisual";

const ladder = [
  { n: "01", t: "Assist", d: "Retrieve and summarize. Human executes." },
  { n: "02", t: "Copilot", d: "Recommend actions. Human decides." },
  { n: "03", t: "Supervised", d: "Act with approval. Human remains the gate." },
  { n: "04", t: "Bounded", d: "Act inside policy. Evals decide the next inch." },
];

const layers = [
  { id: "MCP", note: "domain context" },
  { id: "Retrieval", note: "only what the run needs" },
  { id: "Domain APIs", note: "authorized surfaces" },
  { id: "Pydantic actions", note: "typed, bounded" },
  { id: "HITL", note: "consequential gate" },
  { id: "Evaluation", note: "quality bar" },
  { id: "QA", note: "path to production" },
];

export function ApproachPage() {
  return (
    <>
      <section className="chamber page approach-hero">
        <div className="wrap-wide">
          <Reveal className="page-hero">
            <p className="sys">Build</p>
            <h1 className="display">Model capability is only one layer.</h1>
            <p className="lede">
              Consequential workflows need context, bounded tools, deterministic services, human
              control, and evidence that the system deserves more scope. That is the product.
            </p>
          </Reveal>
          <div className="arch">
            <div className="arch-visual">
              <ProductVisual kind="architecture" />
            </div>
            <ul className="layer-keys">
              {layers.map((l) => (
                <li key={l.id}>
                  <b>{l.id}</b>
                  <span>{l.note}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <section className="sheet section">
        <div className="wrap-wide">
          <div className="principle-list approach-principles">
            {principles.map((p) => (
              <article key={p.num}>
                <p className="sys">{p.num}</p>
                <h3>{p.title}</h3>
                <p>{p.body}</p>
              </article>
            ))}
          </div>
          <div className="control-band">
            <div>
              <p className="sys">Autonomy ladder</p>
              <h2 className="display">Scope expands when the evidence says it should.</h2>
              <p className="lede">
                I standardized this pattern across five enterprise systems: reusable MCP servers,
                domain APIs, Pydantic-typed actions, deterministic services, human approval, and
                evaluation baselines.
              </p>
              <p className="follow-link">
                <Link to="/work/platform" className="text-link">
                  Platform case →
                </Link>
              </p>
            </div>
            <ul className="ladder">
              {ladder.map((l) => (
                <li key={l.n}>
                  <small>{l.n}</small>
                  {l.t}
                  <span>{l.d}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <SiteFooter />
    </>
  );
}
