import { useId, type ReactNode } from "react";
import { CompanyLogo, type LogoName } from "@/components/CompanyLogos";
import oceanTrailEmblem from "@/assets/marks/ocean-trail-emblem.png";

/** Fixed square B&W brand tile for the timeline. */
export function TimelineLogo({ name }: { name: LogoName }) {
  return (
    <div className="timeline-logo" data-logo={name} aria-hidden="true">
      {name === "oceantrail" ? <OceanTrailEmblem /> : <CompanyLogo name={name} compact />}
    </div>
  );
}

function OceanTrailEmblem() {
  const id = `ot-simple-${useId().replace(/:/g, "")}`;
  return (
    <svg viewBox="0 0 72 72" fill="currentColor" overflow="visible" preserveAspectRatio="xMidYMid meet">
      <defs>
        <mask id={id} maskUnits="userSpaceOnUse">
          <image href={oceanTrailEmblem} x="0" y="0" width="72" height="72" />
        </mask>
      </defs>
      <rect x="0" y="0" width="72" height="72" mask={`url(#${id})`} />
    </svg>
  );
}

function MarkFrame({ children, className = "product-logo" }: { children: ReactNode; className?: string }) {
  return (
    <div className={className} aria-hidden="true">
      {children}
    </div>
  );
}

/** Simple monochrome product marks for pet projects. */
export function RideLensMark() {
  return (
    <MarkFrame>
      <svg viewBox="0 0 64 64" fill="none">
        <circle cx="32" cy="32" r="18" stroke="currentColor" strokeWidth="1.75" />
        <circle cx="32" cy="32" r="8" stroke="currentColor" strokeWidth="1.75" />
        <path d="M14 32h8M42 32h8" stroke="currentColor" strokeWidth="1.75" strokeLinecap="square" />
        <path d="M24 22l3 3M37 39l3 3M37 25l3-3M24 42l3-3" stroke="currentColor" strokeWidth="1.75" strokeLinecap="square" />
      </svg>
    </MarkFrame>
  );
}

export function RailDropMark() {
  return (
    <MarkFrame>
      <svg viewBox="0 0 64 64" fill="none">
        <path d="M18 18h28M18 26h28M18 34h28" stroke="currentColor" strokeWidth="1.75" strokeLinecap="square" />
        <path d="M22 18v16M42 18v16" stroke="currentColor" strokeWidth="1.75" />
        <path d="M32 36c0 0-8 9-8 13a8 8 0 0 0 16 0c0-4-8-13-8-13z" fill="currentColor" />
        <circle cx="32" cy="48" r="2.2" fill="#fff" />
      </svg>
    </MarkFrame>
  );
}

export function DaylightMark() {
  return (
    <MarkFrame>
      <svg viewBox="0 0 64 64" fill="none">
        <path
          d="M12 44c6-16 14-24 20-24s14 8 20 24"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="square"
        />
        <circle cx="32" cy="28" r="7" stroke="currentColor" strokeWidth="1.75" />
        <path d="M32 14v4M32 38v4M18 28h4M42 28h4M21 17l3 3M40 36l3 3M21 39l3-3M40 20l3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
      </svg>
    </MarkFrame>
  );
}

type SystemSlug =
  | "iport"
  | "coco"
  | "cross-currency"
  | "valuation"
  | "fx-compression"
  | "platform"
  | "margin-simulator"
  | "ridelens"
  | "raildrop"
  | "daylight";

/** Product-faithful B&W diagrams for selected-systems cards. */
export function SystemDiagram({ slug }: { slug: SystemSlug }) {
  return (
    <div className="system-diagram" aria-hidden="true">
      {slug === "iport" && <IPortDiagram />}
      {slug === "coco" && <CocoDiagram />}
      {slug === "cross-currency" && <XccyDiagram />}
      {slug === "valuation" && <ValuationDiagram />}
      {slug === "fx-compression" && <FxDiagram />}
      {slug === "platform" && <PlatformDiagram />}
      {slug === "margin-simulator" && <MarginDiagram />}
      {slug === "ridelens" && <RideLensCardArt />}
      {slug === "raildrop" && <RailDropCardArt />}
      {slug === "daylight" && <DaylightCardArt />}
    </div>
  );
}

function Frame({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 160 100"
      fill="none"
      className="system-svg"
      preserveAspectRatio="xMidYMid meet"
      overflow="hidden"
    >
      {children}
    </svg>
  );
}

function Cue({
  x,
  y,
  children,
  anchor = "start",
}: {
  x: number | string;
  y: number | string;
  children: string;
  anchor?: "start" | "middle" | "end";
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      fill="currentColor"
      fontSize={6}
      fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
      letterSpacing="0.04em"
      opacity={0.72}
    >
      {children}
    </text>
  );
}

/** Collapsing time bars → HITL → run packet. */
function IPortDiagram() {
  return (
    <Frame>
      <rect x="12" y="24" width="26" height="52" stroke="currentColor" strokeWidth="1.3" opacity="0.3" />
      <rect x="12" y="34" width="26" height="42" fill="currentColor" fillOpacity="0.45" />
      <Cue x="25" y="18" anchor="middle">
        3.5h
      </Cue>
      <path d="M42 50h14" stroke="currentColor" strokeWidth="1.4" />
      <rect x="56" y="34" width="18" height="32" stroke="currentColor" strokeWidth="1.4" fill="currentColor" fillOpacity="0.14" />
      <Cue x="65" y="52" anchor="middle">
        HITL
      </Cue>
      <path d="M74 50h12" stroke="currentColor" strokeWidth="1.4" />
      <rect x="90" y="24" width="26" height="52" stroke="currentColor" strokeWidth="1.3" opacity="0.3" />
      <rect x="90" y="50" width="26" height="26" fill="currentColor" fillOpacity="0.5" />
      <Cue x="103" y="18" anchor="middle">
        8m
      </Cue>
      <rect x="124" y="34" width="24" height="32" rx="2" stroke="currentColor" strokeWidth="1.4" fill="currentColor" fillOpacity="0.16" />
      <Cue x="136" y="52" anchor="middle">
        RUN
      </Cue>
    </Frame>
  );
}

/** Dual MCP → diagnose diamond → OPS/ENG fork. */
function CocoDiagram() {
  return (
    <Frame>
      <circle cx="22" cy="50" r="12" stroke="currentColor" strokeWidth="1.4" fill="currentColor" fillOpacity="0.08" />
      <Cue x="22" y="53" anchor="middle">
        T0
      </Cue>
      <path d="M34 44 L50 28M34 56 L50 72" stroke="currentColor" strokeWidth="1.3" />
      <rect x="50" y="16" width="36" height="28" rx="1.5" stroke="currentColor" strokeWidth="1.3" fill="currentColor" fillOpacity="0.06" />
      <Cue x="68" y="34" anchor="middle">
        MCP
      </Cue>
      <rect x="50" y="56" width="36" height="28" rx="1.5" stroke="currentColor" strokeWidth="1.3" fill="currentColor" fillOpacity="0.06" />
      <Cue x="68" y="74" anchor="middle">
        MCP
      </Cue>
      <polygon points="100,38 112,50 100,62 88,50" stroke="currentColor" strokeWidth="1.4" fill="currentColor" fillOpacity="0.12" />
      <path d="M112 50 L128 34M112 50 L128 66" stroke="currentColor" strokeWidth="1.4" />
      <rect x="128" y="22" width="26" height="20" rx="1.5" stroke="currentColor" strokeWidth="1.3" fill="currentColor" fillOpacity="0.16" />
      <Cue x="141" y="35" anchor="middle">
        OPS
      </Cue>
      <rect x="128" y="58" width="26" height="20" rx="1.5" stroke="currentColor" strokeWidth="1.3" opacity="0.5" />
      <Cue x="141" y="71" anchor="middle">
        ENG
      </Cue>
    </Frame>
  );
}

/** Cleared chord ring → LCH. */
function XccyDiagram() {
  const nodes = [
    [40, 28],
    [80, 16],
    [120, 28],
    [40, 72],
    [80, 84],
    [120, 72],
  ] as const;
  return (
    <Frame>
      <circle cx="80" cy="50" r="30" stroke="currentColor" strokeWidth="1.2" opacity="0.22" />
      {nodes.map(([x, y], i) => (
        <g key={i}>
          <line x1={x} y1={y} x2="80" y2="50" stroke="currentColor" strokeWidth="1" opacity="0.28" />
          <circle cx={x} cy={y} r="3.5" stroke="currentColor" strokeWidth="1.2" fill="currentColor" fillOpacity="0.2" />
        </g>
      ))}
      <path d="M40 28L80 84M120 28L40 72M80 16L120 72" stroke="currentColor" strokeWidth="1.35" opacity="0.55" />
      <circle cx="80" cy="50" r="12" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.16" />
      <Cue x="80" y="53" anchor="middle">
        LCH
      </Cue>
      <Cue x="144" y="88" anchor="end">
        +34%
      </Cue>
    </Frame>
  );
}

/** Tolerance band with dots. */
function ValuationDiagram() {
  return (
    <Frame>
      <Cue x="16" y="16">
        INT
      </Cue>
      <path d="M14 28h18M14 42h14M14 56h16M14 70h12" stroke="currentColor" strokeWidth="1.2" opacity="0.5" />
      <Cue x="144" y="16" anchor="end">
        IND
      </Cue>
      <path d="M128 28h18M128 42h14M128 56h16M128 70h12" stroke="currentColor" strokeWidth="1.2" opacity="0.5" />
      <rect x="48" y="22" width="64" height="56" stroke="currentColor" strokeWidth="1.3" fill="currentColor" fillOpacity="0.05" />
      <rect x="64" y="22" width="32" height="56" fill="currentColor" fillOpacity="0.1" />
      <line x1="80" y1="22" x2="80" y2="78" stroke="currentColor" strokeWidth="1.2" opacity="0.55" />
      <circle cx="70" cy="36" r="2.5" fill="currentColor" />
      <circle cx="92" cy="48" r="3" fill="currentColor" />
      <circle cx="74" cy="62" r="2.5" fill="currentColor" opacity="0.6" />
      <Cue x="80" y="92" anchor="middle">
        bp
      </Cue>
    </Frame>
  );
}

/** 3×3 book → four-source → OK. */
function FxDiagram() {
  return (
    <Frame>
      {[0, 1, 2].map((c) =>
        [0, 1, 2].map((r) => (
          <rect
            key={`${c}-${r}`}
            x={10 + c * 16}
            y={22 + r * 20}
            width="13"
            height="16"
            rx="1"
            stroke="currentColor"
            strokeWidth="1.1"
            fill={c + r === 1 ? "currentColor" : "none"}
            fillOpacity={c + r === 1 ? 0.14 : 0}
            opacity={c === 2 && r === 2 ? 0.35 : 1}
          />
        )),
      )}
      <Cue x="34" y="16" anchor="middle">
        BOOK
      </Cue>
      <path d="M62 52h14" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="100" cy="36" r="8" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="114" cy="52" r="8" stroke="currentColor" strokeWidth="1.2" fill="currentColor" fillOpacity="0.12" />
      <circle cx="100" cy="68" r="8" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="86" cy="52" r="8" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="100" cy="52" r="3" fill="currentColor" />
      <Cue x="100" y="18" anchor="middle">
        IM
      </Cue>
      <path d="M122 52h10" stroke="currentColor" strokeWidth="1.4" />
      <rect x="132" y="38" width="22" height="28" rx="2" stroke="currentColor" strokeWidth="1.4" fill="currentColor" fillOpacity="0.16" />
      <Cue x="143" y="54" anchor="middle">
        OK
      </Cue>
    </Frame>
  );
}

/** Spine with orbiting systems. */
function PlatformDiagram() {
  return (
    <Frame>
      {[22, 40, 58, 76].map((y, i) => (
        <g key={y}>
          <circle cx="24" cy={y} r="5" stroke="currentColor" strokeWidth="1.2" fill="currentColor" fillOpacity={i === 1 ? 0.2 : 0.06} />
          {i === 1 && <line x1="29" y1={y} x2="72" y2="50" stroke="currentColor" strokeWidth="1.3" />}
        </g>
      ))}
      <Cue x="24" y="14" anchor="middle">
        SYS
      </Cue>
      <line x1="80" y1="18" x2="80" y2="86" stroke="currentColor" strokeWidth="1.4" opacity="0.45" />
      {[22, 38, 54, 70, 86].map((y, i) => (
        <circle key={y} cx="80" cy={y} r={i === 2 ? 6 : 3.5} fill="currentColor" fillOpacity={i === 2 ? 0.85 : 0.35} />
      ))}
      <Cue x="100" y="30">
        CTX
      </Cue>
      <Cue x="100" y="54">
        HITL
      </Cue>
      <Cue x="100" y="78">
        EVAL
      </Cue>
    </Frame>
  );
}

/** Three methodology pillars. */
function MarginDiagram() {
  return (
    <Frame>
      <Cue x="28" y="16" anchor="middle">
        SPAN
      </Cue>
      <Cue x="70" y="16" anchor="middle">
        IRM
      </Cue>
      <Cue x="112" y="16" anchor="middle">
        SIMM
      </Cue>
      <rect x="18" y="44" width="16" height="34" fill="currentColor" fillOpacity="0.55" />
      <rect x="40" y="30" width="16" height="48" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 2" opacity="0.55" />
      <rect x="60" y="40" width="16" height="38" fill="currentColor" fillOpacity="0.4" />
      <rect x="82" y="28" width="16" height="50" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 2" opacity="0.5" />
      <rect x="102" y="48" width="16" height="30" fill="currentColor" fillOpacity="0.3" />
      <rect x="124" y="26" width="16" height="52" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 2" opacity="0.45" />
      <path d="M16 80h124" stroke="currentColor" strokeWidth="1.3" />
      <Cue x="144" y="92" anchor="end">
        −30%
      </Cue>
    </Frame>
  );
}

/** Route + ranked fare strip. */
function RideLensCardArt() {
  return (
    <Frame>
      <circle cx="20" cy="28" r="4" fill="currentColor" />
      <line x1="24" y1="28" x2="68" y2="28" stroke="currentColor" strokeWidth="1.3" opacity="0.5" />
      <circle cx="72" cy="28" r="4" fill="currentColor" />
      <Cue x="20" y="18">
        JFK
      </Cue>
      <Cue x="72" y="18">
        TSQ
      </Cue>
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect x="20" y={42 + i * 12} width={96 - i * 14} height="8" fill="currentColor" fillOpacity={i === 0 ? 0.55 : 0.2} />
          {i === 0 && <rect x="16" y={42} width="3" height="8" fill="currentColor" />}
        </g>
      ))}
      <Cue x="140" y="48" anchor="end">
        $
      </Cue>
    </Frame>
  );
}

/** Price bars vs paid baseline rail. */
function RailDropCardArt() {
  const prices = [47, 133, 61, 141];
  return (
    <Frame>
      <Cue x="16" y="16">
        BOS
      </Cue>
      <Cue x="56" y="16">
        NYP
      </Cue>
      <line x1="112" y1="26" x2="112" y2="76" stroke="currentColor" strokeWidth="1.3" opacity="0.55" />
      <Cue x="112" y="16" anchor="middle">
        $128
      </Cue>
      {prices.map((p, i) => {
        const w = Math.max(8, ((p - 40) / 110) * 64);
        return (
          <g key={p}>
            <rect x="16" y={30 + i * 12} width={w} height="8" fill="currentColor" fillOpacity={i === 0 ? 0.55 : 0.25} />
          </g>
        );
      })}
      <Cue x="144" y="88" anchor="end">
        −$81
      </Cue>
    </Frame>
  );
}

/** Schedule arc + active hour marker. */
function DaylightCardArt() {
  return (
    <Frame>
      <Cue x="18" y="16">
        06
      </Cue>
      <Cue x="80" y="16" anchor="middle">
        12
      </Cue>
      <Cue x="142" y="16" anchor="end">
        21
      </Cue>
      <path
        d="M18 66C38 30 52 24 80 24C108 24 122 34 142 66"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
      <circle cx="112" cy="36" r="4.5" fill="currentColor" />
      <line x1="112" y1="40" x2="112" y2="70" stroke="currentColor" strokeWidth="1.2" opacity="0.45" strokeDasharray="3 2" />
      <rect x="18" y="70" width="124" height="1.2" fill="currentColor" opacity="0.35" />
      <Cue x="112" y="86" anchor="middle">
        4200K
      </Cue>
    </Frame>
  );
}
