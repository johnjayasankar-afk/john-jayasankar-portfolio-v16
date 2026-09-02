import { earlier, experience, person, skills } from "@/data/content";
import { Reveal } from "@/components/Reveal";
import { SiteFooter } from "@/components/Layout";
import { CompanyLogo } from "@/components/CompanyLogos";

export function AboutPage() {
  return (
    <div className="sheet page">
      <section className="section about-section">
        <div className="wrap-wide about-grid">
          <Reveal className="about-intro">
            <h1 className="sys">About</h1>
            <figure className="portrait-plate">
              <img
                className="portrait"
                src={person.photo}
                alt={person.name}
                width={1024}
                height={1024}
                fetchPriority="high"
                decoding="async"
              />
            </figure>
            <div className="about-copy">
              <p className="lede">
                I build AI agents and financial infrastructure for complex, high-stakes workflows.
                Lead PM at Quantile (LSEG), shipping production agents and 0→1 products used by
                global banks. The work has cut expert workflows from hours to minutes, scaled
                operations without added headcount, and generated $3M+ in new and expansion ARR.
              </p>
              <p className="lede">
                Previously I originated a pre-trade margin simulator at OpenGamma. I trained in
                markets where precision is not optional, then brought that standard to agents.
              </p>
              <p className="lede">
                I want to do this at AI-native startups and in big tech alike — teams that treat
                product craft as a competitive advantage. Most of my domain expertise is in
                fintech, though I am open to any challenging application of AI. If that is a
                problem you want to tackle, get in touch.
              </p>
              <div className="hero-actions">
                <a className="btn btn-ink" href={`mailto:${person.email}`}>
                  Email me
                </a>
                <a className="btn btn-line" href={person.resume} target="_blank" rel="noreferrer">
                  Résumé
                </a>
              </div>
            </div>
            <div className="edu-block">
              <CompanyLogo name="haverford" />
              <h3>{person.education.school}</h3>
              <p className="parent">{person.education.degree}</p>
              <p className="sys">
                {person.education.detail} · {person.education.year}
              </p>
            </div>
          </Reveal>
          <div className="about-exp">
            <p className="sys">Financial systems → product ownership → production AI</p>
            {experience.map((e) => (
              <article className="exp-block" key={e.company}>
                <div className="exp-top">
                  <div>
                    <CompanyLogo name={e.logo} />
                    <h3>{e.company}</h3>
                  </div>
                  <span className="sys">{e.location}</span>
                </div>
                <p className="parent">{e.parent}</p>
                {e.roles.map((r) => (
                  <div className="role" key={r.title}>
                    <strong>{r.title}</strong>
                    <div className="dates">{r.dates}</div>
                    <ul>
                      {r.points.map((p) => (
                        <li key={p}>{p}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </article>
            ))}
            <div className="exp-block earlier-head">
              <p className="sys">Earlier</p>
            </div>
            {earlier.map((x) => (
              <article className="exp-block" key={x.org}>
                <div className="exp-top">
                  <div>
                    <CompanyLogo name={x.logo} />
                    <h3>{x.org}</h3>
                  </div>
                  <span className="sys">{x.dates}</span>
                </div>
                <p className="parent">{x.role}</p>
              </article>
            ))}
          </div>
        </div>
        <div className="wrap-wide skill-cols">
          <div>
            <h4>AI & systems</h4>
            <ul>
              {skills.ai.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Product</h4>
            <ul>
              {skills.product.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Domain</h4>
            <ul>
              {skills.domain.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Build</h4>
            <ul>
              {skills.build.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
