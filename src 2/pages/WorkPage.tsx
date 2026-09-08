import { Link } from "react-router-dom";
import { cases } from "@/data/content";
import { Reveal } from "@/components/Reveal";
import { SiteFooter } from "@/components/Layout";

export function WorkPage() {
  return (
    <div className="sheet page">
      <section className="section">
        <div className="wrap-wide">
          <Reveal className="page-hero">
            <p className="sys">Work</p>
            <h1 className="display">What I shipped, and what it changed.</h1>
            <p className="lede">
              Production AI inside live operations. 0→1 infrastructure in rates, FX, and
              cross-currency. Independent products for workflow fit and the search itself.
            </p>
          </Reveal>
          <div className="ledger">
            {cases.map((c) => (
              <Link to={`/work/${c.slug}`} key={c.slug}>
                <span className="sys">JJ-SYS-{c.number}</span>
                <div>
                  <h3>{c.title}</h3>
                  <p className="lede">
                    {c.summary}
                  </p>
                  <div className="sys-meta">
                    {c.metrics.map((m) => (
                      <span key={m.label}>
                        <b>{m.value}</b>
                        {m.label}
                      </span>
                    ))}
                  </div>
                </div>
                <span className="sys">{c.company}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
