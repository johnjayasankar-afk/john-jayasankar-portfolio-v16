import { useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { earlier, experience, person, skills } from "@/data/content";
import { Reveal } from "@/components/Reveal";
import { SiteFooter } from "@/components/Layout";
import { CompanyLogo } from "@/components/CompanyLogos";
import { ContinueReading } from "@/components/ContinueReading";
import { CopyEmail } from "@/components/CopyEmail";
import { CopyLocus } from "@/components/CopyLocus";
import { ExternalLink } from "@/components/ExternalLink";
import { prefetchRoute } from "@/util/prefetch";
import { aboutAnchorId, aboutJumps } from "@/util/pageJumps";
import { copyText } from "@/util/clipboard";
import { absoluteUrl, siteOrigin } from "@/lib/site";
import { flashCopied } from "@/util/toast";
import { locusLabel } from "@/util/locus";
import {
  bindSectionSpy,
  isInteractiveTarget,
  isTypingTarget,
  replaceHash,
  scrollToId,
} from "@/util/scroll";
import { usePaletteShortcut } from "@/util/usePaletteShortcut";
import { useOrientId } from "@/util/useOrientId";

export function AboutPage() {
  const { pathname, hash } = useLocation();
  const activeId = useOrientId(hash);
  const shortcut = usePaletteShortcut();
  const aboutIds = useMemo(() => aboutJumps().map((j) => j.id), []);
  const locusPath = `/about#${activeId || "skills"}`;
  const toastLabel = locusLabel(pathname, activeId ? `#${activeId}` : "") ?? "About";

  useEffect(() => bindSectionSpy(aboutIds), [aboutIds]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (isTypingTarget(event.target)) return;
      if (isInteractiveTarget(event.target)) return;

      if (event.key === "y") {
        const id = activeId || aboutIds[0];
        if (!id) return;
        event.preventDefault();
        const path = `/about#${id}`;
        const url = absoluteUrl(path, siteOrigin()) || `${window.location.origin}${path}`;
        void copyText(url).then((ok) => {
          flashCopied(locusLabel(pathname, `#${id}`) ?? toastLabel, ok);
        });
        return;
      }

      if (event.key !== "j" && event.key !== "k") return;
      event.preventDefault();
      const here = aboutIds.indexOf(activeId);
      const at = here < 0 ? (event.key === "j" ? -1 : 0) : here;
      const next =
        event.key === "j" ? Math.min(aboutIds.length - 1, at + 1) : Math.max(0, at - 1);
      const id = aboutIds[next];
      if (!id) return;
      scrollToId(id);
      replaceHash(id);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeId, aboutIds, pathname, toastLabel]);

  return (
    <div className="sheet page">
      <section className="section about-section">
        <div className="wrap-wide about-grid">
          <Reveal className="about-intro">
            <p className="sys">About</p>
            <h1 className="display">Lead Product Manager in New York.</h1>
            <figure className="portrait-plate">
              <img
                className="portrait"
                src={person.photo}
                alt={person.name}
                width={768}
                height={768}
                sizes="(max-width: 980px) 200px, 220px"
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
                I want to do this at AI-native startups and in big tech alike: teams that treat
                product craft as a competitive advantage. Most of my domain expertise is in
                fintech, though I am open to any challenging application of AI. If that is a
                problem you want to tackle, get in touch.
              </p>
              <CopyEmail tone="light" />
              <ContinueReading className="continue-read-page" />
              <div className="hero-actions">
                <a className="btn btn-ink" href={`mailto:${person.email}`}>
                  Email me
                </a>
                <ExternalLink className="btn btn-line" href={person.resume} mark>
                  Résumé
                </ExternalLink>
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
            <p className="case-nav-hint sys about-nav-hint">
              {`j / k through experience & skills · y link · ${shortcut} jump`}
            </p>
            {experience.map((e) => {
              const id = aboutAnchorId(e.company);
              const here = activeId === id;
              return (
                <Reveal key={e.company} inView>
                  <article
                    className={`exp-block${here ? " is-target" : ""}`}
                    id={id}
                    tabIndex={-1}
                    aria-current={here ? "location" : undefined}
                  >
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
                    {e.related?.length ? (
                      <p className="exp-related">
                        {e.related.map((item, i) => (
                          <span key={item.slug}>
                            {i > 0 ? <span className="follow-sep" aria-hidden="true"> · </span> : null}
                            <Link
                              className="text-link"
                              to={`/work/${item.slug}`}
                              onMouseEnter={() => prefetchRoute(`/work/${item.slug}`)}
                              onFocus={() => prefetchRoute(`/work/${item.slug}`)}
                            >
                              {item.label}
                            </Link>
                          </span>
                        ))}
                        <span aria-hidden="true"> →</span>
                      </p>
                    ) : null}
                  </article>
                </Reveal>
              );
            })}
            <div className="exp-block earlier-head">
              <p className="sys">Earlier</p>
            </div>
            {earlier.map((x) => {
              const id = aboutAnchorId(x.org);
              const here = activeId === id;
              return (
                <Reveal key={x.org} inView>
                  <article
                    className={`exp-block${here ? " is-target" : ""}`}
                    id={id}
                    tabIndex={-1}
                    aria-current={here ? "location" : undefined}
                  >
                    <div className="exp-top">
                      <div>
                        <CompanyLogo name={x.logo} />
                        <h3>{x.org}</h3>
                      </div>
                      <span className="sys">{x.dates}</span>
                    </div>
                    <p className="parent">{x.role}</p>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
        <div
          className={`wrap-wide skill-band${activeId === "skills" || activeId.startsWith("skills-") ? " is-target" : ""}`}
          id="skills"
          tabIndex={-1}
        >
          <Reveal inView className="skill-band-head">
            <p className="sys">Skills</p>
            <p className="lede skill-lede">
              What I bring to agent and market systems — and the craft I hire for.
            </p>
          </Reveal>
          <div className="skill-cols">
            <div>
              <h4 id="skills-ai" tabIndex={-1}>
                AI & systems
              </h4>
              <ul>
                {skills.ai.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 id="skills-product" tabIndex={-1}>
                Product
              </h4>
              <ul>
                {skills.product.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 id="skills-domain" tabIndex={-1}>
                Domain
              </h4>
              <ul>
                {skills.domain.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 id="skills-build" tabIndex={-1}>
                Build
              </h4>
              <ul>
                {skills.build.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="skill-band-foot">
            <p className="skill-escape">
              <Link
                className="text-link"
                to="/work"
                onMouseEnter={() => prefetchRoute("/work")}
                onFocus={() => prefetchRoute("/work")}
              >
                See the systems →
              </Link>
              <span className="follow-sep" aria-hidden="true">
                {" "}
                ·{" "}
              </span>
              <Link
                className="text-link"
                to="/approach"
                onMouseEnter={() => prefetchRoute("/approach")}
                onFocus={() => prefetchRoute("/approach")}
              >
                Control model →
              </Link>
            </p>
            <CopyLocus
              path={locusPath}
              label="Copy locus"
              toastLabel={toastLabel}
            />
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
