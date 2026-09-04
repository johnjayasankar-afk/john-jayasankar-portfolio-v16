import { lazy, Suspense } from "react";
import type { ArtifactKind } from "@/scene/visual";
import { ArtifactHud } from "@/components/ArtifactHud";
import { ControlStack } from "./ControlStack";
import { SystemsCore } from "./SystemsCore";

const IPortPlane = lazy(() => import("./IPortPlane").then((m) => ({ default: m.IPortPlane })));
const CocoTrace = lazy(() => import("./CocoTrace").then((m) => ({ default: m.CocoTrace })));
const RideLensPlane = lazy(() => import("./RideLensPlane").then((m) => ({ default: m.RideLensPlane })));
const ReconcilePlane = lazy(() => import("./ReconcilePlane").then((m) => ({ default: m.ReconcilePlane })));
const CompressNet = lazy(() => import("./CompressNet").then((m) => ({ default: m.CompressNet })));
const FxMatrix = lazy(() => import("./FxMatrix").then((m) => ({ default: m.FxMatrix })));
const WhatIfEngine = lazy(() => import("./WhatIfEngine").then((m) => ({ default: m.WhatIfEngine })));
const RailDropPlane = lazy(() => import("./RailDropPlane").then((m) => ({ default: m.RailDropPlane })));

function Plane({ kind }: { kind: ArtifactKind }) {
  if (kind === "systems-core") return <SystemsCore />;
  if (kind === "iport") return <IPortPlane />;
  if (kind === "coco") return <CocoTrace />;
  if (kind === "ridelens") return <RideLensPlane />;
  if (kind === "cross-currency") return <CompressNet />;
  if (kind === "valuation") return <ReconcilePlane />;
  if (kind === "fx-compression") return <FxMatrix />;
  if (kind === "margin-simulator") return <WhatIfEngine />;
  if (kind === "platform" || kind === "architecture") return <ControlStack />;
  if (kind === "raildrop") return <RailDropPlane />;
  return null;
}

export function ProductVisual({ kind }: { kind: ArtifactKind }) {
  return (
    <>
      <Suspense fallback={<div className="fill-stage plane-fallback" aria-hidden="true" />}>
        <Plane kind={kind} />
      </Suspense>
      <ArtifactHud kind={kind} />
    </>
  );
}
