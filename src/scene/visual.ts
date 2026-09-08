import { useSyncExternalStore } from "react";

export type ArtifactKind =
  | "systems-core"
  | "iport"
  | "coco"
  | "ridelens"
  | "cross-currency"
  | "valuation"
  | "fx-compression"
  | "platform"
  | "margin-simulator"
  | "architecture"
  | "raildrop"
  | "daylight";

export type Story = "rest" | "broken" | "decision" | "control" | "impact";

export type VisualState = {
  ride: number;
  compress: number;
  compressTarget: number;
  hoverBank: number;
  hoverEnvelope: boolean;
  envelopeLocked: boolean;
  capitalMode: "baseline" | "proposed" | "simulate" | "compare";
  iport: number;
  coco: number;
  reconcile: number;
  fx: number;
  rail: number;
  day: number;
  core: number;
  stack: number;
  story: Story;
};

const defaults: VisualState = {
  ride: 0,
  compress: 0,
  compressTarget: 0,
  hoverBank: -1,
  hoverEnvelope: false,
  envelopeLocked: false,
  capitalMode: "baseline",
  iport: 0,
  coco: 0,
  reconcile: 0.55,
  fx: 0,
  rail: 0,
  day: 0.55,
  core: 0,
  stack: 2,
  story: "rest",
};

const listeners = new Set<() => void>();
let version = 0;
let frame = 0;

function flush() {
  frame = 0;
  version += 1;
  listeners.forEach((l) => l());
}

function emit() {
  if (frame) return;
  frame = requestAnimationFrame(flush);
}

const raw: VisualState = { ...defaults };

export const visual: VisualState = new Proxy(raw, {
  set(target, key, value) {
    if (typeof key !== "string" || !(key in target)) return false;
    const field = key as keyof VisualState;
    if (Object.is(target[field], value)) return true;
    Object.assign(target, { [field]: value });
    emit();
    return true;
  },
});

export function resetVisual() {
  Object.assign(raw, defaults);
  emit();
}

export function subscribeVisual(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getVisualVersion() {
  return version;
}

export function useVisual() {
  useSyncExternalStore(subscribeVisual, getVisualVersion, getVisualVersion);
}
