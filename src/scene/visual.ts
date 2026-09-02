import { useSyncExternalStore } from "react";

export type ArtifactKind =
  | "systems-core"
  | "iport"
  | "coco"
  | "agentfit"
  | "cross-currency"
  | "valuation"
  | "fx-compression"
  | "platform"
  | "margin-simulator"
  | "architecture"
  | "opportunity";

export type Story = "rest" | "broken" | "decision" | "control" | "impact";

export type VisualState = {
  fit: number;
  compress: number;
  compressTarget: number;
  hoverBank: number;
  hoverEnvelope: boolean;
  capitalMode: "baseline" | "proposed" | "simulate" | "compare";
  iport: number;
  coco: number;
  reconcile: number;
  fx: number;
  os: number;
  core: number;
  story: Story;
};

const defaults: VisualState = {
  fit: 72,
  compress: 0,
  compressTarget: 0,
  hoverBank: -1,
  hoverEnvelope: false,
  capitalMode: "baseline",
  iport: 0,
  coco: 0,
  reconcile: 0,
  fx: 0,
  os: 0,
  core: 0,
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
