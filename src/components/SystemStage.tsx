import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import type { CaseStudy } from "@/data/content";
import { ProductVisual } from "@/artifacts/ProductVisual";
import { ProductLink } from "@/components/ProductLink";
import { VisibleMount } from "@/components/VisibleMount";
import { kindForSlug } from "@/scene/kinds";

export function SystemStage({
  study,
  tone,
  flip = false,
  eager = false,
  extra,
}: {
  study: CaseStudy;
  tone: "chamber" | "sheet";
  flip?: boolean;
  eager?: boolean;
  extra?: ReactNode;
}) {
  const live = study.productHref ? (
    <ProductLink
      className={tone === "chamber" ? "btn btn-solid" : "btn btn-ink"}
      href={study.productHref}
    >
      {study.productLabel ?? "Open product"} ↗
    </ProductLink>
  ) : null;

  return (
    <section className={`sys-block ${tone}${flip ? " flip" : ""}`}>
      <div className="sys-visual">
        <VisibleMount eager={eager}>
          <ProductVisual kind={kindForSlug(study.slug)} />
        </VisibleMount>
        <span className="cal cal-tl" />
        <span className="cal cal-br" />
      </div>
      <div className="sys-copy">
        <p className="sys">
          JJ-SYS-{study.number} / {study.kicker}
        </p>
        <h3>{study.title}</h3>
        <p>{study.summary}</p>
        <div className="sys-meta">
          {study.metrics.map((m) => (
            <span key={m.label}>
              <b>{m.value}</b>
              {m.label}
            </span>
          ))}
        </div>
        <div className="hero-actions">
          <Link className={tone === "chamber" ? "btn btn-ghost" : "btn btn-line"} to={`/work/${study.slug}`}>
            Open case
          </Link>
          {extra ?? live}
        </div>
      </div>
    </section>
  );
}
