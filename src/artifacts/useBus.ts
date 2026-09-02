import { useVisual, visual } from "@/scene/visual";

export function useBus() {
  useVisual();
}

export function storyBlend(hud: number) {
  if (visual.story === "broken") return 0;
  if (visual.story === "decision") return 0.42;
  if (visual.story === "control") return 0.72;
  if (visual.story === "impact") return 1;
  return hud;
}
