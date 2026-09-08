import { useEffect, useState } from "react";
import { storyBlend, useBus } from "./useBus";
import { visual } from "@/scene/visual";
import { Frame } from "./Frame";
import { prefersReducedMotion } from "@/util/motion";

/** XCCY: bilateral mesh dissolves → cleared chords → shrinking residual envelope. */
const N = 12;
const CX = 400;
const CY = 162;
const R = 100;
const BANKS = ["JPM", "GS", "MS", "Citi", "BNPP", "BARC", "DB", "UBS", "HSBC", "RBC", "SCB", "BofA"];

const banks = Array.from({ length: N }, (_, i) => {
  const a = (i / N) * Math.PI * 2 - Math.PI / 2;
  return {
    i,
    a,
    x: CX + Math.cos(a) * R,
    y: CY + Math.sin(a) * R,
    book: 16 + (i % 4) * 4,
    name: BANKS[i],
  };
});

const bilateral: [number, number][] = [];
for (let i = 0; i < N; i++) {
  bilateral.push([i, (i + 1) % N]);
  if (i % 2 === 0) bilateral.push([i, (i + 4) % N]);
}

const cleared: [number, number][] = [
  [0, 4],
  [4, 8],
  [8, 0],
  [1, 5],
  [5, 9],
  [9, 1],
  [2, 7],
  [3, 10],
];

export function CompressNet() {
  useBus();
  const [shown, setShown] = useState(visual.compress);
  useEffect(() => {
    if (prefersReducedMotion()) {
      visual.compress = visual.compressTarget;
      setShown(visual.compressTarget);
      return;
    }
    let cur = visual.compress;
    let id = 0;
    const loop = () => {
      cur += (visual.compressTarget - cur) * 0.14;
      if (Math.abs(cur - visual.compressTarget) < 0.001) cur = visual.compressTarget;
      visual.compress = cur;
      setShown((prev) => (Math.abs(prev - cur) < 0.0005 ? prev : cur));
      id = requestAnimationFrame(loop);
    };
    id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
  }, []);

  const t = storyBlend(shown);
  const hover = visual.hoverBank;
  const envelope = visual.hoverEnvelope || (t > 0.28 && t < 0.9);
  const residual = Math.max(24, R * (1 - t * 0.48));

  return (
    <Frame viewBox="0 0 800 320" family="market">
      <text className="m-title" x="28" y="22" fontSize={12}>
        LCH SwapAgent · XCCY
      </text>
      <text className="m-k" x="28" y="40" fontSize={11}>
        {t < 0.2
          ? "Bilateral mesh · network offsets unused"
          : t < 0.75
            ? "Cleared chords · SwapAgent settles multilateral"
            : "Residual envelope held · eligible notional unlocked"}
      </text>
      <text className="m-num" x="760" y="32" textAnchor="end" fontSize={34}>
        {t > 0.9 ? "+34%" : "$6.5T"}
      </text>
      <text className="m-k" x="760" y="56" textAnchor="end" fontSize={11}>
        {t > 0.9 ? "reduction / run" : "18 banks · 12 pairs"}
      </text>

      {bilateral.map(([a, b]) => {
        const related = hover < 0 || hover === a || hover === b;
        const op = t > 0.7 ? 0 : Math.max(0, 0.35 * (1 - t * 1.15));
        return (
          <line
            key={`b-${a}-${b}`}
            className="m-line"
            x1={banks[a].x}
            y1={banks[a].y}
            x2={banks[b].x}
            y2={banks[b].y}
            opacity={related ? op : op * 0.1}
          />
        );
      })}

      {cleared.map(([a, b]) => {
        const related = hover < 0 || hover === a || hover === b;
        const op = t < 0.15 ? 0.04 : t < 0.8 ? 0.15 + t * 0.55 : Math.max(0.06, 0.5 * (1 - t));
        return (
          <line
            key={`c-${a}-${b}`}
            className="m-line"
            x1={banks[a].x}
            y1={banks[a].y}
            x2={banks[b].x}
            y2={banks[b].y}
            opacity={related ? op : op * 0.12}
          />
        );
      })}

      <circle className="m-line" cx={CX} cy={CY} r={residual + 16} opacity={envelope ? 0.9 : 0.15} />
      <circle className="m-line" cx={CX} cy={CY} r={residual} opacity={t > 0.45 ? 0.4 : 0.12} />

      {banks.map((b) => {
        const related = hover < 0 || hover === b.i;
        const showLabel = hover === b.i;
        const len = Math.max(6, b.book * (1 - t * 0.72));
        const ix = Math.cos(b.a);
        const iy = Math.sin(b.a);
        return (
          <g
            key={b.i}
            opacity={related ? 1 : 0.2}
            onPointerEnter={() => {
              visual.hoverBank = b.i;
            }}
            onPointerLeave={() => {
              visual.hoverBank = -1;
            }}
            style={{ cursor: "pointer" }}
          >
            <line className="m-line" x1={b.x} y1={b.y} x2={CX - ix * 22} y2={CY - iy * 22} opacity={0.08 + t * 0.5} />
            <line className="m-line" x1={b.x} y1={b.y} x2={b.x - ix * len} y2={b.y - iy * len} opacity="0.85" />
            <circle className={related && t > 0.5 ? "m-fill" : "m-box"} cx={b.x} cy={b.y} r="4.5" opacity={related ? 0.95 : 0.5} />
            {showLabel ? (
              <text
                className="m-k m-ms"
                x={b.x + ix * 28}
                y={Math.min(292, Math.max(72, b.y + iy * 28 + 3))}
                textAnchor="middle"
                opacity={0.9}
                fontSize={9}
              >
                {b.name}
              </text>
            ) : null}
          </g>
        );
      })}

      <circle className={t > 0.5 ? "m-fill" : "m-box"} cx={CX} cy={CY} r="20" opacity={t > 0.5 ? 0.35 : 0.12} />
      <circle className="m-box" cx={CX} cy={CY} r="20" />
      <text className="m-label" x={CX} y={CY + 4} textAnchor="middle" fontSize={13}>
        LCH
      </text>

      <text className="m-k" x="28" y="308" opacity="0.5" fontSize={11}>
        Gross bilateral → cleared chords → residual envelope
      </text>
      <text className="m-k" x="760" y="308" textAnchor="end" opacity={t > 0.75 ? 0.95 : 0.45} fontSize={11}>
        {t > 0.75 ? "Risk held · executable" : "12 of 18 banks shown"}
      </text>
    </Frame>
  );
}
