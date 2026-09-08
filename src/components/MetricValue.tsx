import { useEffect, useMemo, useRef, useState } from "react";
import { prefersReducedMotion } from "@/util/motion";

type Parsed =
  | { kind: "plain" }
  | {
      kind: "simple";
      prefix: string;
      num: number;
      decimals: number;
      suffix: string;
    }
  | {
      kind: "pair";
      left: { num: number; decimals: number; suffix: string };
      right: { num: number; decimals: number; suffix: string };
    };

const SIMPLE =
  /^(?<prefix>[+$−-]?)(?<num>\d+(?:\.\d+)?)(?<suffix>%|\+|×|x|[TMBKkmh]\+?|\/\w+)?$/u;
const PAIR =
  /^(?<lnum>\d+(?:\.\d+)?)(?<lsuffix>[a-zA-Z%]*)\s*(?:→|->| - |-)\s*(?<rnum>\d+(?:\.\d+)?)(?<rsuffix>[a-zA-Z%]*)$/u;

function decimalsOf(raw: string): number {
  const i = raw.indexOf(".");
  return i < 0 ? 0 : raw.length - i - 1;
}

function parseMetric(value: string): Parsed {
  const trimmed = value.trim();
  const pair = PAIR.exec(trimmed);
  if (pair?.groups) {
    return {
      kind: "pair",
      left: {
        num: Number(pair.groups.lnum),
        decimals: decimalsOf(pair.groups.lnum),
        suffix: pair.groups.lsuffix ?? "",
      },
      right: {
        num: Number(pair.groups.rnum),
        decimals: decimalsOf(pair.groups.rnum),
        suffix: pair.groups.rsuffix ?? "",
      },
    };
  }
  const simple = SIMPLE.exec(trimmed);
  if (simple?.groups) {
    return {
      kind: "simple",
      prefix: simple.groups.prefix === "−" ? "-" : simple.groups.prefix || "",
      num: Number(simple.groups.num),
      decimals: decimalsOf(simple.groups.num),
      suffix: simple.groups.suffix ?? "",
    };
  }
  return { kind: "plain" };
}

function fmt(n: number, decimals: number): string {
  return n.toFixed(decimals);
}

/** Animate metric numerals on enter - falls back to plain text for non-numeric values. */
export function MetricValue({
  value,
  className,
  animate = true,
}: {
  value: string;
  className?: string;
  /** When false, always show the authored value (proof strips, dense ledgers). */
  animate?: boolean;
}) {
  const parsed = useMemo(() => parseMetric(value), [value]);
  const ref = useRef<HTMLSpanElement>(null);
  const [text, setText] = useState(value);
  const [pairLeft, setPairLeft] = useState(() =>
    parsed.kind === "pair" ? `${fmt(parsed.left.num, parsed.left.decimals)}${parsed.left.suffix}` : "",
  );
  const [pairRight, setPairRight] = useState(() =>
    parsed.kind === "pair" ? `${fmt(parsed.right.num, parsed.right.decimals)}${parsed.right.suffix}` : "",
  );
  const played = useRef(false);

  useEffect(() => {
    setText(value);
    played.current = false;
    if (parsed.kind === "pair") {
      setPairLeft(`${fmt(parsed.left.num, parsed.left.decimals)}${parsed.left.suffix}`);
      setPairRight(`${fmt(parsed.right.num, parsed.right.decimals)}${parsed.right.suffix}`);
    }
  }, [value, parsed]);

  useEffect(() => {
    if (!animate || parsed.kind === "plain") return;
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches) return;

    let frame = 0;
    let start = 0;
    const duration = 900;

    const run = (now: number) => {
      if (!start) start = now;
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      if (parsed.kind === "simple") {
        setText(`${parsed.prefix}${fmt(parsed.num * eased, parsed.decimals)}${parsed.suffix}`);
      } else if (parsed.kind === "pair") {
        setPairLeft(`${fmt(parsed.left.num * eased, parsed.left.decimals)}${parsed.left.suffix}`);
        setPairRight(`${fmt(parsed.right.num * eased, parsed.right.decimals)}${parsed.right.suffix}`);
      }
      if (t < 1) frame = window.requestAnimationFrame(run);
      else {
        setText(value);
        if (parsed.kind === "pair") {
          setPairLeft(`${fmt(parsed.left.num, parsed.left.decimals)}${parsed.left.suffix}`);
          setPairRight(`${fmt(parsed.right.num, parsed.right.decimals)}${parsed.right.suffix}`);
        }
      }
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || played.current) return;
        played.current = true;
        start = 0;
        frame = window.requestAnimationFrame(run);
      },
      { threshold: 0.55 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [animate, parsed, value]);

  if (parsed.kind === "pair") {
    return (
      <span ref={ref} className={className} data-metric="pair">
        <span className="metric-pair-num">{pairLeft}</span>
        <span className="metric-pair-join" aria-hidden="true">
          →
        </span>
        <span className="metric-pair-num">{pairRight}</span>
      </span>
    );
  }

  return (
    <span ref={ref} className={className} data-metric={parsed.kind}>
      {text}
    </span>
  );
}
