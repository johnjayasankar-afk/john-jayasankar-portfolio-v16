import { person, writing } from "@/data/content";
import { Reveal } from "@/components/Reveal";
import { SiteFooter } from "@/components/Layout";

export function WritingPage() {
  return (
    <div className="sheet page">
      <section className="section">
        <div className="wrap-wide">
          <Reveal className="page-hero">
            <p className="sys">Writing</p>
            <h1 className="display">Notes on agents, markets, and product economics.</h1>
            <p className="lede">
              Short theses on AI product economics, autonomy, and why the hardest AI products are
              often infrastructure products. Longer notes land on Substack.
            </p>
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
            <a className="text-link" href={person.substack} target="_blank" rel="noreferrer">
              Notes in progress — follow on Substack ↗
            </a>
          </p>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
