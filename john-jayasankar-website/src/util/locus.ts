import { CONTROL_LAYERS } from "@/artifacts/ControlStack";
import { cases, writing } from "@/data/content";
import { caseToc } from "@/util/caseToc";
import { aboutJumps, HOME_JUMPS, SIMPLE_JUMPS } from "@/util/pageJumps";

/** Page-level chrome label (footer / 404) — hash-aware locus layered on top. */
export function pageChromeLabel(pathname: string): string {
  if (pathname === "/") return "Home";
  if (pathname === "/work") return "Work";
  if (pathname === "/approach") return "Build";
  if (pathname === "/writing") return "Writing";
  if (pathname === "/about") return "About";
  if (pathname === "/simple") return "Simple";
  const study = cases.find((c) => pathname === `/work/${c.slug}`);
  if (study) return `${study.alias}`;
  return "Off-map";
}

/** Quiet header readout for the current deep-link locus. */
export function locusLabel(pathname: string, hash: string): string | null {
  const id = hash.replace(/^#/, "");
  if (!id) return null;

  if (pathname === "/") {
    const home = HOME_JUMPS.find((j) => j.id === id);
    if (home) return home.label;
    const study = cases.find((c) => c.slug === id);
    if (study) return study.alias;
    return null;
  }

  if (pathname === "/writing") {
    const note = writing.find((w) => w.id === id);
    return note?.title ?? null;
  }

  if (pathname === "/about") {
    return aboutJumps().find((j) => j.id === id)?.label ?? null;
  }

  if (pathname === "/approach") {
    if (id === "layers") return "Control layers";
    if (id === "ladder") return "Autonomy ladder";
    const layer = /^layer-(\d+)$/.exec(id);
    if (layer) {
      const n = Number(layer[1]);
      const item = CONTROL_LAYERS[n - 1];
      return item ? `Layer ${n} · ${item.short}` : `Layer ${layer[1]}`;
    }
    return null;
  }

  if (pathname === "/work") {
    return cases.find((c) => c.slug === id)?.alias ?? null;
  }

  if (pathname === "/simple") {
    return SIMPLE_JUMPS.find((j) => j.id === id)?.label ?? null;
  }

  const study = cases.find((c) => pathname === `/work/${c.slug}`);
  if (study) {
    const beat = caseToc(study).find((item) => item.id === id);
    if (!beat) return null;
    return beat.label.replace(/^\d+\s+/, "");
  }

  return null;
}
