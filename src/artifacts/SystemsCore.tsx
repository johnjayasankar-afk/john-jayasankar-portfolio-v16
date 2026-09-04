import { useState } from "react";
import { useBus } from "./useBus";
import { visual } from "@/scene/visual";
import { Frame } from "./Frame";

const contexts = [{ label: "MCP" }, { label: "Run state" }, { label: "Evidence" }];
const actions = [{ label: "Diagnose" }, { label: "Compress" }, { label: "Validate" }];

const CX = 28;
const CW = 128;
const CH = 26;
const ROW = [122, 156, 190];
const mid = (i: number) => ROW[i] + CH / 2;
const BUS = 170;
const PX = 186;
const PY = 128;
const PW = 80;
const PH = 80;
const PCX = PX + PW / 2;
const PCY = PY + PH / 2;
const HX = 274;
const HY = 156;
const HW = 48;
const HH = 24;
const AX = 338;
const AW = 118;
const DX = 478;
const MX = 652;
const MY = 168;
const MR = 62;

const books = [0, 1, 2, 3, 4, 5].map((i) => {
  const a = (i / 6) * Math.PI * 2 - Math.PI / 2;
  return {
    i,
    x: MX + Math.cos(a) * MR,
    y: MY + Math.sin(a) * MR,
    lx: MX + Math.cos(a) * (MR + 18),
    ly: MY + Math.sin(a) * (MR + 18),
    pair: (i + 3) % 6,
  };
});

function nearestBook(x: number, y: number) {
  const px = x * 800;
  const py = y * 360;
  let best = { i: -1, d: 36 * 36 };
  for (const b of books) {
    const d = (b.x - px) ** 2 + (b.y - py) ** 2;
    if (d < best.d) best = { i: b.i, d };
  }
  return best.i;
}

export function SystemsCore() {
  useBus();
  const [p, setP] = useState({ x: 0.5, y: 0.48 });
  const t = visual.core;
  const contextOn = t < 0.34;
  const gateOn = t >= 0.34 && t < 0.72;
  const marketOn = t >= 0.72;
  const hover = nearestBook(p.x, p.y);
  const pair = marketOn ? (hover >= 0 ? hover : 0) : hover;
  const status = marketOn
    ? "Offsets hold · risk in envelope"
    : gateOn
      ? "HITL on the rail · typed action"
      : "Context authorized · run-scoped";

  const setPhase = (value: number) => {
    visual.core = value;
    visual.story = "rest";
  };

  return (
    <Frame viewBox="0 0 800 360" onMove={(x, y) => setP({ x, y })}>
      <text className="m-title" x="28" y="26">
        Two systems. One control model.
      </text>
      <text className="m-k" x="28" y="50">
        Agent
      </text>
      <text className="m-k" x="520" y="50">
        Market
      </text>
      <text className="m-k" x="772" y="50" textAnchor="end">
        {marketOn ? "settlement" : gateOn ? "gate" : "context"}
      </text>

      {contexts.map((item, i) => {
        const y = ROW[i];
        const hot = contextOn || (p.x < 0.36 && Math.abs(p.y * 360 - mid(i)) < 20);
        return (
          <g key={item.label} style={{ cursor: "pointer" }} onClick={() => setPhase(0)}>
            {hot && <rect className="m-fill" x={CX} y={y} width={CW} height={CH} opacity="0.12" />}
            <rect className="m-box" x={CX} y={y} width={CW} height={CH} />
            <text className="m-k" x={CX + 12} y={y + 17}>
              {item.label}
            </text>
            <line className="m-line" x1={CX + CW} y1={mid(i)} x2={BUS} y2={mid(i)} opacity={hot ? 0.7 : 0.28} />
          </g>
        );
      })}
      <line className="m-line" x1={BUS} y1={mid(0)} x2={BUS} y2={mid(2)} opacity={contextOn || gateOn ? 0.55 : 0.28} />
      <line className="m-line" x1={BUS} y1={PCY} x2={PX} y2={PCY} opacity={contextOn || gateOn ? 0.55 : 0.28} />

      <g style={{ cursor: "pointer" }} onClick={() => setPhase(0.5)}>
        <rect className="m-box" x={PX} y={PY} width={PW} height={PH} />
        <rect className="m-fill" x={PX + 16} y={PY + 16} width={PW - 32} height={PH - 32} opacity={gateOn ? 0.2 : 0.08} />
        <text className="m-k" x={PCX} y={PCY + 4} textAnchor="middle">
          Policy
        </text>
        {(gateOn || marketOn) && <rect className="m-fill" x={HX} y={HY} width={HW} height={HH} opacity="0.16" />}
        <rect className="m-box" x={HX} y={HY} width={HW} height={HH} />
        <text className="m-k" x={HX + HW / 2} y={HY + 16} textAnchor="middle">
          HITL
        </text>
      </g>
      <line className="m-line" x1={PX + PW} y1={PCY} x2={HX} y2={PCY} opacity={gateOn || marketOn ? 0.7 : 0.28} />
      <line className="m-line" x1={HX + HW} y1={PCY} x2={AX} y2={PCY} opacity={gateOn || marketOn ? 0.7 : 0.28} />

      {actions.map((item, i) => {
        const y = ROW[i];
        const open = gateOn || marketOn;
        return (
          <g key={item.label} style={{ cursor: "pointer" }} onClick={() => setPhase(0.5)}>
            <line className="m-line" x1={AX} y1={mid(i)} x2={AX - 8} y2={mid(i)} opacity={open ? 0.55 : 0.22} />
            {i !== 1 && <line className="m-line" x1={AX - 8} y1={mid(i)} x2={AX - 8} y2={PCY} opacity={open ? 0.45 : 0.2} />}
            <rect className="m-box" x={AX} y={y} width={AW} height={CH} opacity={open ? 1 : 0.45} />
            {open && <rect className="m-fill" x={AX} y={y} width={AW} height={CH} opacity="0.08" />}
            <rect
              className={open ? "m-fill" : "m-box"}
              x={AX + AW - 18}
              y={y + 8}
              width="10"
              height="10"
              opacity={open ? 0.9 : 0.35}
            />
            <text className="m-k" x={AX + 12} y={y + 17} opacity={open ? 1 : 0.55}>
              {item.label}
            </text>
          </g>
        );
      })}

      <line className="m-line" x1={DX} y1="72" x2={DX} y2="292" opacity="0.2" />
      <circle className="m-fill" cx={DX} cy={PCY} r="3.5" opacity={marketOn ? 0.95 : 0.4} />
      <line className="m-line" x1={DX} y1={PCY} x2={MX - 14} y2={PCY} opacity={marketOn ? 0.7 : 0.22} />

      <g style={{ cursor: "pointer" }} onClick={() => setPhase(1)}>
        <circle className="m-line" cx={MX} cy={MY} r={MR} opacity={marketOn ? 0.7 : 0.28} />
        {books.map((b) => {
          const held = pair >= 0 && (b.i === pair || b.i === books[pair].pair);
          const lit = marketOn && held;
          return (
            <g key={b.i}>
              <line
              className="m-line"
              x1={b.x + ((MX - b.x) / MR) * 7}
              y1={b.y + ((MY - b.y) / MR) * 7}
              x2={MX - ((MX - b.x) / MR) * 16}
              y2={MY - ((MY - b.y) / MR) * 16}
              opacity={lit ? 0.7 : 0.18}
            />
              <rect
                className={lit ? "m-fill" : "m-box"}
                x={b.x - 5}
                y={b.y - 5}
                width="10"
                height="10"
                opacity={lit ? 0.95 : 0.45}
              />
              <text className="m-k" x={b.lx} y={b.ly + 3} textAnchor="middle" opacity={lit ? 0.9 : 0.45}>
                B0{b.i + 1}
              </text>
            </g>
          );
        })}
        <rect className="m-box" x={MX - 12} y={MY - 12} width="24" height="24" />
        <rect className="m-fill" x={MX - 6} y={MY - 6} width="12" height="12" opacity={marketOn ? 0.22 : 0.08} />
        <text className="m-k" x={MX} y={MY + MR + 36} textAnchor="middle" opacity={marketOn ? 0.85 : 0.45}>
          {marketOn && pair >= 0 ? `B0${pair + 1} × B0${books[pair].pair + 1}  hold` : "Multilateral books"}
        </text>
      </g>

      <text className="m-k" x="772" y="336" textAnchor="end">
        {status}
      </text>
    </Frame>
  );
}
