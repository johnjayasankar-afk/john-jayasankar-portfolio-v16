import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import type { CaseStudy } from "@/data/content";
import { ProductVisual } from "@/artifacts/ProductVisual";
import { VisibleMount } from "@/components/VisibleMount";
import { kindForSlug } from "@/scene/kinds";

export function SystemStage({
  study,
  tone,
  flip = false,
  extra,
}: {
  study: CaseStudy;
  tone: "chamber" | "sheet";
  flip?: boolean;
  extra?: ReactNode;
}) {
  return (
    <section className={`sys-block ${tone}${flip ? " flip" : ""}`}>
      <div className="sys-visual">
        <VisibleMount>
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
          {extra}
        </div>
      </div>
    </section>
  );
}
