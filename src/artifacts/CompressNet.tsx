import { useEffect, useState } from "react";
import { storyBlend, useBus } from "./useBus";
import { visual } from "@/scene/visual";
import { Frame } from "./Frame";
import { prefersReducedMotion } from "@/util/motion";
import { useCompactStage } from "@/util/compactStage";

/**
 * Cross-currency compression (conceptual).
 * Default state: pairwise netting left network offsets stuck.
 * $6.5T is eligible notional - not revenue.
 */
const BANKS = ["JPM", "GS", "MS", "CITI", "BNPP", "BARC", "DB", "UBS"] as const;

function makeBanks(n: number, cx: number, cy: number, r: number) {
  return Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2;
    return {
      i,
      a,
      x: cx + Math.cos(a) * r,
      y: cy + Math.sin(a) * r,
      book: 14 + (i % 4) * 3,
      name: BANKS[i % BANKS.length],
    };
  });
}

export function CompressNet() {
  useBus();
  const compact = useCompactStage();
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
  const phase = t < 0.2 ? 0 : t < 0.75 ? 1 : 2;
  const caption =
    phase === 0
      ? "Before: banks can only net in pairs · network offsets sit unused"
      : phase === 1
        ? "Run: LCH SwapAgent settles compatible offsets across the network"
        : "After: more notional can enter the run · risk intent held";

  if (compact) {
    return <CompactCompress t={t} phase={phase} caption={caption} />;
  }

  return <WideCompress t={t} phase={phase} caption={caption} />;
}

function WideCompress({ t, phase, caption }: { t: number; phase: number; caption: string }) {
  // Keep ring + bank labels clear of the footer and of each other (esp. BNPP at 6 o'clock).
  const CX = 420;
  const CY = 208;
  const R = 62;
  const banks = makeBanks(8, CX, CY, R);
  const hover = visual.hoverBank;
  const envelope = visual.hoverEnvelope || (t > 0.28 && t < 0.9);
  const residual = Math.max(20, R * (1 - t * 0.48));

  const bilateral: [number, number][] = [];
  for (let i = 0; i < banks.length; i++) {
    bilateral.push([i, (i + 1) % banks.length]);
    if (i % 2 === 0) bilateral.push([i, (i + 3) % banks.length]);
  }
  const cleared: [number, number][] = [
    [0, 4],
    [1, 5],
    [2, 6],
    [3, 7],
    [0, 2],
    [1, 6],
  ];

  return (
    <Frame viewBox="0 0 840 360" family="market">
      <text className="m-title" x="24" y="26" fontSize={14}>
        Cross-currency compression · LCH SwapAgent
      </text>
      <text className="m-k" x="24" y="46" fontSize={12}>
        {caption}
      </text>

      <text className="m-num" x="816" y="28" textAnchor="end" fontSize={24}>
        $6.5T
      </text>
      <text className="m-k" x="816" y="48" textAnchor="end" fontSize={11}>
        eligible notional · not revenue
      </text>

      {/* Legend + network stats sit fully above the ring */}
      <g opacity="0.95">
        <line className="m-line" x1="24" y1="72" x2="52" y2="72" opacity={phase === 0 ? 0.95 : 0.4} strokeWidth={2} />
        <text className="m-k" x="60" y="76" fontSize={11}>
          Pairwise (bilateral)
        </text>
        <line className="m-line" x1="210" y1="72" x2="238" y2="72" opacity={phase >= 1 ? 0.95 : 0.4} strokeWidth={2} />
        <text className="m-k" x="246" y="76" fontSize={11}>
          Network via LCH (multilateral)
        </text>
        <circle className="m-line" cx="478" cy="72" r="7" opacity={envelope ? 0.95 : 0.4} />
        <text className="m-k" x="492" y="76" fontSize={11}>
          Risk envelope held
        </text>
        <text className="m-k" x="816" y="76" textAnchor="end" fontSize={11} opacity={phase === 2 ? 0.95 : 0.55}>
          {phase === 2 ? "+34% reduction / run · 18 banks" : "18 banks · 12 pairs · $6.5T"}
        </text>
      </g>

      {bilateral.map(([a, b]) => {
        const related = hover < 0 || hover === a || hover === b;
        const op = t > 0.7 ? 0 : Math.max(0, 0.4 * (1 - t * 1.15));
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

      {cleared.map(([a, b]) => {
        const related = hover < 0 || hover === a || hover === b;
        const op = t < 0.15 ? 0.05 : t < 0.8 ? 0.2 + t * 0.5 : Math.max(0.08, 0.45 * (1 - t));
        return (
          <line
            key={`c-${a}-${b}`}
            className="m-line"
            x1={banks[a].x}
            y1={banks[a].y}
            x2={banks[b].x}
            y2={banks[b].y}
            opacity={related ? op : op * 0.14}
            strokeWidth={1.5}
          />
        );
      })}

      <circle className="m-line" cx={CX} cy={CY} r={residual + 14} opacity={envelope ? 0.9 : 0.18} />
      <circle className="m-line" cx={CX} cy={CY} r={residual} opacity={t > 0.45 ? 0.4 : 0.14} />

      {banks.map((b) => {
        const related = hover < 0 || hover === b.i;
        const showLabel = hover === b.i || b.i % 2 === 0 || (phase >= 1 && (b.i === 0 || b.i === 4));
        const len = Math.max(6, b.book * (1 - t * 0.72));
        const ix = Math.cos(b.a);
        const iy = Math.sin(b.a);
        return (
          <g
            key={b.i}
            opacity={related ? 1 : 0.25}
            onPointerEnter={() => {
              visual.hoverBank = b.i;
            }}
            onPointerLeave={() => {
              visual.hoverBank = -1;
            }}
            style={{ cursor: "pointer" }}
          >
            <line className="m-line" x1={b.x} y1={b.y} x2={CX - ix * 22} y2={CY - iy * 22} opacity={0.1 + t * 0.45} />
            <line className="m-line" x1={b.x} y1={b.y} x2={b.x - ix * len} y2={b.y - iy * len} opacity="0.85" />
            <circle className={related && t > 0.5 ? "m-fill" : "m-box"} cx={b.x} cy={b.y} r="5" opacity={related ? 0.95 : 0.55} />
            {showLabel ? (
              <text
                className={hover === b.i ? "m-label" : "m-k"}
                x={b.x + ix * (Math.abs(iy) > 0.7 ? 14 : 34)}
                y={Math.min(336, Math.max(114, b.y + iy * (Math.abs(iy) > 0.7 ? 48 : 28) + 4))}
                textAnchor="middle"
                opacity={hover === b.i ? 1 : 0.7}
                fontSize={hover === b.i ? 12 : 11}
              >
                {b.name}
              </text>
            ) : null}
          </g>
        );
      })}

      <circle className={t > 0.5 ? "m-fill" : "m-box"} cx={CX} cy={CY} r="22" opacity={t > 0.5 ? 0.4 : 0.14} />
      <circle className="m-box" cx={CX} cy={CY} r="22" />
      <text className="m-label" x={CX} y={CY + 5} textAnchor="middle" fontSize={14}>
        LCH
      </text>

      <text className="m-k" x="24" y="344" opacity="0.55" fontSize={12}>
        Conceptual diagram · eligible notional ≠ cash saved · press Run to watch offsets clear
      </text>
      <text className="m-k" x="816" y="344" textAnchor="end" opacity={t > 0.75 ? 0.95 : 0.5} fontSize={12}>
        {t > 0.75 ? "Executable · risk held" : "8 of 18 banks shown"}
      </text>
    </Frame>
  );
}

function CompactCompress({ t, phase, caption }: { t: number; phase: number; caption: string }) {
  const CX = 200;
  const CY = 340;
  const R = 56;
  const banks = makeBanks(6, CX, CY, R);
  const cleared: [number, number][] = [
    [0, 3],
    [1, 4],
    [2, 5],
  ];

  return (
    <Frame viewBox="0 0 400 480" family="market">
      <text className="m-title" x="20" y="26" fontSize={14}>
        SwapAgent · XCCY
      </text>
      <text className="m-k" x="20" y="46" fontSize={12}>
        {caption}
      </text>
      <text className="m-num" x="380" y="28" textAnchor="end" fontSize={20}>
        $6.5T
      </text>
      <text className="m-k" x="380" y="48" textAnchor="end" fontSize={11}>
        eligible · not revenue
      </text>

      <g>
        <rect className="m-box" x="16" y="64" width="368" height="88" rx="2" opacity={phase === 0 ? 0.28 : 0.1} />
        <text className="m-k" x="28" y="86" fontSize={11} opacity={phase === 0 ? 1 : 0.55}>
          01 · Before · pairwise only
        </text>
        <text className="m-label" x="28" y="112" fontSize={14}>
          Banks net in pairs
        </text>
        <text className="m-k" x="28" y="134" fontSize={12}>
 Network-wide offsets sit unused - notional stays trapped
        </text>
      </g>

      <g>
        <rect className="m-box" x="16" y="164" width="368" height="72" rx="2" opacity={phase === 1 ? 0.28 : 0.1} />
        <text className="m-k" x="28" y="186" fontSize={11} opacity={phase === 1 ? 1 : 0.55}>
          02 · Run · multilateral via LCH
        </text>
        <text className="m-label" x="28" y="214" fontSize={14}>
          SwapAgent settles compatible offsets across the network
        </text>
      </g>

      <g>
        <rect className="m-box" x="16" y="248" width="368" height="208" rx="2" opacity={phase === 2 ? 0.24 : 0.1} />
        <text className="m-k" x="28" y="270" fontSize={11} opacity={phase >= 1 ? 1 : 0.55}>
          03 · Network · {phase === 2 ? "executable · risk held" : "illustrative ring"}
        </text>
        <text className="m-k" x="28" y="292" fontSize={12}>
          {phase === 2 ? "+34% reduction / run · 18 banks" : "Press Run on the HUD to watch offsets clear"}
        </text>

        {phase === 0
          ? banks.map((b, i) => {
              const next = banks[(i + 1) % banks.length];
              return (
                <line
                  key={`p-${i}`}
                  className="m-line"
                  x1={b.x}
                  y1={b.y}
                  x2={next.x}
                  y2={next.y}
                  opacity="0.45"
                />
              );
            })
          : cleared.map(([a, b]) => (
              <line
                key={`c-${a}-${b}`}
                className="m-line"
                x1={banks[a].x}
                y1={banks[a].y}
                x2={banks[b].x}
                y2={banks[b].y}
                opacity={0.35 + t * 0.45}
                strokeWidth={2}
              />
            ))}

        {banks.map((b) => (
          <g key={b.i}>
            <circle className={t > 0.5 ? "m-fill" : "m-box"} cx={b.x} cy={b.y} r="5" opacity="0.9" />
            {(b.i === 0 || b.i === 3 || phase >= 1) && (
              <text
                className="m-k"
                x={b.x}
                y={b.y < CY ? b.y - 12 : b.y + 18}
                textAnchor="middle"
                fontSize={11}
              >
                {b.name}
              </text>
            )}
          </g>
        ))}
        <circle className={t > 0.5 ? "m-fill" : "m-box"} cx={CX} cy={CY} r="16" opacity={t > 0.5 ? 0.4 : 0.15} />
        <circle className="m-box" cx={CX} cy={CY} r="16" />
        <text className="m-label" x={CX} y={CY + 4} textAnchor="middle" fontSize={12}>
          LCH
        </text>
      </g>
    </Frame>
  );
}
