import { Link } from "react-router-dom";
import { cases } from "@/data/content";
import { Reveal } from "@/components/Reveal";
import { SiteFooter } from "@/components/Layout";
import { ProductLink } from "@/components/ProductLink";

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
              cross-currency. Then RideLens and RailDrop — independent products built
              end-to-end and shipped live.
            </p>
          </Reveal>
          <div className="ledger">
            {cases.map((c) => (
              <article className="ledger-row" key={c.slug}>
                <Link className="ledger-main" to={`/work/${c.slug}`}>
                  <span className="sys">JJ-SYS-{c.number}</span>
                  <div>
                    <h3>{c.title}</h3>
                    <p className="lede">{c.summary}</p>
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
                {c.productHref ? (
                  <ProductLink className="text-link ledger-live" href={c.productHref}>
                    {c.productLabel ?? "Open product"} ↗
                  </ProductLink>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
