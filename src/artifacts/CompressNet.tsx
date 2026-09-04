import { useEffect, useState } from "react";
import { storyBlend, useBus } from "./useBus";
import { visual } from "@/scene/visual";
import { Frame } from "./Frame";
import { prefersReducedMotion } from "@/util/motion";

const N = 8;
const CX = 400;
const CY = 170;
const R = 86;

const banks = Array.from({ length: N }, (_, i) => {
  const a = (i / N) * Math.PI * 2 - Math.PI / 2;
  return {
    i,
    a,
    x: CX + Math.cos(a) * R,
    y: CY + Math.sin(a) * R,
    lx: CX + Math.cos(a) * (R + 20),
    ly: CY + Math.sin(a) * (R + 20),
    book: 22 + (i % 3) * 7,
  };
});

const bilateral: [number, number][] = [];
for (let i = 0; i < N; i++) {
  bilateral.push([i, (i + 1) % N]);
}

const cycle: [number, number][] = [
  [0, 3],
  [3, 5],
  [5, 0],
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
  const envelope = visual.hoverEnvelope || (t > 0.28 && t < 0.86);

  return (
    <Frame viewBox="0 0 800 320">
      <text className="m-title" x="28" y="26">
        Multilateral offset
      </text>
      <text className="m-k" x="28" y="46">
        {t < 0.2 ? "Bilateral books  ·  trapped notional" : t < 0.75 ? "Compatible offsets  ·  SwapAgent" : "Reduced books  ·  risk unchanged"}
      </text>
      <text className="m-num" x="772" y="40" textAnchor="end" fontSize="28">
        {t > 0.9 ? "−34%" : "$6.5T"}
      </text>
      <text className="m-k" x="772" y="62" textAnchor="end">
        {t > 0.9 ? "reduction / run" : "8 banks  ·  ring + cycle"}
      </text>

      <circle className="m-line" cx={CX} cy={CY} r={R + 22} opacity={envelope ? 0.9 : 0.16} />
      <circle className="m-line" cx={CX} cy={CY} r={R} opacity="0.22" />

      {bilateral.map(([a, b]) => {
        const related = hover < 0 || hover === a || hover === b;
        const op = t > 0.8 ? 0 : Math.max(0, 0.42 * (1 - t * 1.05));
        return (
          <line
            key={`b-${a}-${b}`}
            className="m-line"
            x1={banks[a].x}
            y1={banks[a].y}
            x2={banks[b].x}
            y2={banks[b].y}
            opacity={related ? op : op * 0.12}
          />
        );
      })}

      {cycle.map(([a, b]) => {
        const related = hover < 0 || hover === a || hover === b;
        const op = t < 0.18 ? 0.08 : t < 0.78 ? 0.18 + t * 0.45 : Math.max(0.04, 0.7 * (1 - t));
        return (
          <line
            key={`c-${a}-${b}`}
            className="m-line"
            x1={banks[a].x}
            y1={banks[a].y}
            x2={banks[b].x}
            y2={banks[b].y}
            opacity={related ? op : op * 0.15}
          />
        );
      })}

      {banks.map((b) => {
        const related = hover < 0 || hover === b.i;
        const len = Math.max(10, b.book * (1 - t * 0.64));
        const ix = Math.cos(b.a);
        const iy = Math.sin(b.a);
        const x2 = b.x - ix * len;
        const y2 = b.y - iy * len;
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
            <line
              className="m-line"
              x1={b.x + ((CX - b.x) / R) * 8}
              y1={b.y + ((CY - b.y) / R) * 8}
              x2={CX - ((CX - b.x) / R) * 22}
              y2={CY - ((CY - b.y) / R) * 22}
              opacity={0.08 + t * 0.48}
            />
            <line className="m-line" x1={b.x} y1={b.y} x2={x2} y2={y2} opacity="0.85" />
            <rect className="m-fill" x={b.x - 5} y={b.y - 5} width="10" height="10" opacity="0.92" />
            <text className="m-k" x={b.lx} y={b.ly + 3} textAnchor="middle" opacity={related ? 0.85 : 0.4}>
              {String(b.i + 1).padStart(2, "0")}
            </text>
          </g>
        );
      })}

      <rect className="m-box" x={CX - 20} y={CY - 20} width="40" height="40" />
      <rect className="m-fill" x={CX - 7} y={CY - 7} width="14" height="14" opacity={0.2 + t * 0.7} />
      <text className="m-k" x={CX} y={CY + R + 40} textAnchor="middle">
        SwapAgent
      </text>
    </Frame>
  );
}
