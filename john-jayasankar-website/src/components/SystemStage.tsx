import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import type { CaseStudy } from "@/data/content";
import { ProductVisual } from "@/artifacts/ProductVisual";
import { ProductLink } from "@/components/ProductLink";
import { Reveal } from "@/components/Reveal";
import { MetricValue } from "@/components/MetricValue";
import { VisibleMount } from "@/components/VisibleMount";
import { kindForSlug } from "@/scene/kinds";
import { prefetchRoute } from "@/util/prefetch";
import { useOrientId } from "@/util/useOrientId";

export function SystemStage({
  study,
  tone,
  flip = false,
  eager = false,
  seen = false,
  extra,
}: {
  study: CaseStudy;
  tone: "chamber" | "sheet";
  flip?: boolean;
  eager?: boolean;
  /** Quiet trail mark — visitor opened this case before. */
  seen?: boolean;
  extra?: ReactNode;
}) {
  const { hash } = useLocation();
  const active = useOrientId(hash) === study.slug;
  const casePath = `/work/${study.slug}`;
  const live = study.productHref ? (
    <ProductLink
      className={tone === "chamber" ? "btn btn-solid" : "btn btn-ink"}
      href={study.productHref}
    >
      {study.productLabel ?? "Open product"} ↗
    </ProductLink>
  ) : null;

  return (
    <section
      id={study.slug}
      tabIndex={-1}
      className={`sys-block ${tone}${flip ? " flip" : ""}${active ? " is-target" : ""}`}
      data-visited={seen ? "true" : undefined}
    >
      <div className="sys-visual">
        <VisibleMount eager={eager}>
          <ProductVisual kind={kindForSlug(study.slug)} />
        </VisibleMount>
        <span className="cal cal-tl" />
        <span className="cal cal-br" />
      </div>
      <Reveal inView className="sys-copy" delay={0.04}>
        <p className="sys">
          JJ-SYS-{study.number} / {study.kicker}
          {seen ? <i className="ledger-seen" aria-hidden="true" /> : null}
        </p>
        <h3>
          <Link
            className="sys-title-link"
            to={casePath}
            onMouseEnter={() => prefetchRoute(casePath)}
            onFocus={() => prefetchRoute(casePath)}
          >
            {study.title}
          </Link>
        </h3>
        <p>{study.summary}</p>
        <div className="sys-meta">
          {study.metrics.map((m) => (
            <span key={m.label}>
              <b>
                <MetricValue value={m.value} />
              </b>
              {m.label}
            </span>
          ))}
        </div>
        <div className="hero-actions">
          <Link
            className={tone === "chamber" ? "btn btn-ghost" : "btn btn-line"}
            to={casePath}
            onMouseEnter={() => prefetchRoute(casePath)}
            onFocus={() => prefetchRoute(casePath)}
          >
            Open case
          </Link>
          {extra ?? live}
        </div>
        {active ? (
          <p className="sys sys-enter-cue" aria-live="polite">
            Enter opens case
          </p>
        ) : null}
      </Reveal>
    </section>
  );
}
