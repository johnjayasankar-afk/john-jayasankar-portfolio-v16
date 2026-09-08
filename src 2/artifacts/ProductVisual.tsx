import { lazy, Suspense } from "react";
import type { ArtifactKind } from "@/scene/visual";
import { ArtifactHud } from "@/components/ArtifactHud";
import { ControlStack } from "./ControlStack";
import { SystemsCore } from "./SystemsCore";

const IPortPlane = lazy(() => import("./IPortPlane").then((m) => ({ default: m.IPortPlane })));
const CocoTrace = lazy(() => import("./CocoTrace").then((m) => ({ default: m.CocoTrace })));
const FitField = lazy(() => import("./FitField").then((m) => ({ default: m.FitField })));
const ReconcilePlane = lazy(() => import("./ReconcilePlane").then((m) => ({ default: m.ReconcilePlane })));
const CompressNet = lazy(() => import("./CompressNet").then((m) => ({ default: m.CompressNet })));
const FxMatrix = lazy(() => import("./FxMatrix").then((m) => ({ default: m.FxMatrix })));
const WhatIfEngine = lazy(() => import("./WhatIfEngine").then((m) => ({ default: m.WhatIfEngine })));
const OpportunityPlane = lazy(() => import("./OpportunityPlane").then((m) => ({ default: m.OpportunityPlane })));

function Plane({ kind }: { kind: ArtifactKind }) {
  if (kind === "systems-core") return <SystemsCore />;
  if (kind === "iport") return <IPortPlane />;
  if (kind === "coco") return <CocoTrace />;
  if (kind === "agentfit") return <FitField />;
  if (kind === "cross-currency") return <CompressNet />;
  if (kind === "valuation") return <ReconcilePlane />;
  if (kind === "fx-compression") return <FxMatrix />;
  if (kind === "margin-simulator") return <WhatIfEngine />;
  if (kind === "platform" || kind === "architecture") return <ControlStack />;
  if (kind === "opportunity") return <OpportunityPlane />;
  return null;
}

export function ProductVisual({ kind }: { kind: ArtifactKind }) {
  return (
    <>
      <Suspense fallback={null}>
        <Plane kind={kind} />
      </Suspense>
      <ArtifactHud kind={kind} />
    </>
  );
}
