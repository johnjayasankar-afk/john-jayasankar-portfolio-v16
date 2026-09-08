import { cases, person, writing } from "@/data/content";
import { caseToc } from "@/util/caseToc";

export const SITE_NAME = person.name;
export const DEFAULT_TITLE = "John Jayasankar · Lead Product Manager";
export const DEFAULT_DESCRIPTION =
  "John Jayasankar is a Lead Product Manager in New York building production AI agents and 0→1 financial infrastructure. AI agents, fintech, and high-stakes workflows.";

export const routes = [
  "/",
  "/work",
  "/approach",
  "/writing",
  "/about",
  "/simple",
  ...cases.map((c) => `/work/${c.slug}`),
] as const;

export function configuredOrigin() {
  return import.meta.env.VITE_SITE_URL?.replace(/\/$/, "") ?? "";
}

export function siteOrigin() {
  const configured = configuredOrigin();
  if (configured) return configured;
  if (typeof window !== "undefined") return window.location.origin;
  return "";
}

export function absoluteUrl(path: string, origin = siteOrigin()) {
  if (!origin) return path;
  if (/^https?:\/\//.test(path)) return path;
  const suffix = path.startsWith("/") ? path : `/${path}`;
  return `${origin}${suffix === "/" ? "/" : suffix}`;
}

export function cleanPath(pathname: string) {
  if (pathname === "/" || pathname === "") return "/";
  return pathname.replace(/\/+$/, "");
}

export function isKnownPath(pathname: string) {
  const path = cleanPath(pathname);
  if (path === "/") return true;
  return (routes as readonly string[]).includes(path);
}

export function pageTitle(pathname: string, hash = "") {
  const titles: Record<string, string> = {
    "/": DEFAULT_TITLE,
    "/work": "Work · John Jayasankar",
    "/approach": "Approach · John Jayasankar",
    "/writing": "Writing · John Jayasankar",
    "/about": "About · John Jayasankar",
    "/simple": "John Jayasankar",
    "/ridelens": "RideLens · John Jayasankar",
    "/raildrop": "RailDrop · John Jayasankar",
    "/daylight": "Daylight · John Jayasankar",
  };
  const path = cleanPath(pathname);
  const study = cases.find((c) => path === `/work/${c.slug}`);
  if (path === "/writing") {
    const id = hash.replace(/^#/, "");
    const note = writing.find((w) => w.id === id);
    if (note) return `${note.title} · John Jayasankar`;
  }
  if (study) {
    const id = hash.replace(/^#/, "");
    const beat = caseToc(study).find((item) => item.id === id);
    if (beat) {
      const short = beat.label.replace(/^\d+\s+/, "");
      return `${short} · ${study.alias} · John Jayasankar`;
    }
    return `${study.alias} · John Jayasankar`;
  }
  if (titles[path]) return titles[path];
  return "Not found · John Jayasankar";
}

export function pageDescription(pathname: string, hash = "") {
  const path = cleanPath(pathname);
  const study = cases.find((c) => path === `/work/${c.slug}`);
  if (study) return study.summary;
  if (path === "/writing") {
    const id = hash.replace(/^#/, "");
    const note = writing.find((w) => w.id === id);
    if (note) return note.dek;
    return "Product theses on agents, control, and financial infrastructure.";
  }
  if (path === "/about") {
    return "Lead Product Manager in New York. Production AI agents and 0→1 financial infrastructure.";
  }
  if (path === "/work") {
    return "Selected systems: production AI agents and 0→1 financial infrastructure, with measured change.";
  }
  if (path === "/approach") {
    return "Agents should earn autonomy. Context, typed tools, human gates, and evidence.";
  }
  if (path === "/simple") {
    return "John Jayasankar. Lead Product Manager in New York. Production AI agents, financial infrastructure, RideLens, RailDrop, and Daylight.";
  }
  if (path === "/ridelens") {
    return "Every ride, one comparison. Uber, Lyft, Empower, and Curb ranked before you book.";
  }
  if (path === "/raildrop") {
    return "Know when your train gets cheaper. Watch Amtrak listed fares across your window. Never invent a price.";
  }
  if (path === "/daylight") {
 return "Adaptive display lighting for macOS. Warmth and brightness on a schedule you set - offline and explainable.";
  }
  if (path === "/") return DEFAULT_DESCRIPTION;
  return "This page is not on johnjayasankar.com.";
}
