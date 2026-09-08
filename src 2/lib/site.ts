import { cases, person } from "@/data/content";

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
  "/agentfit",
  "/opportunity-os",
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

export function pageTitle(pathname: string) {
  const titles: Record<string, string> = {
    "/": DEFAULT_TITLE,
    "/work": "Work · John Jayasankar",
    "/approach": "Build · John Jayasankar",
    "/writing": "Writing · John Jayasankar",
    "/about": "About · John Jayasankar",
    "/agentfit": "AgentFit · John Jayasankar",
    "/opportunity-os": "Opportunity OS · John Jayasankar",
  };
  const study = cases.find((c) => pathname === `/work/${c.slug}`);
  return titles[pathname] ?? (study ? `${study.alias} · John Jayasankar` : DEFAULT_TITLE);
}

export function pageDescription(pathname: string) {
  const study = cases.find((c) => pathname === `/work/${c.slug}`);
  if (study) return study.summary;
  if (pathname === "/about") {
    return "Lead Product Manager in New York. Production AI agents and 0→1 financial infrastructure.";
  }
  if (pathname === "/work") {
    return "Selected systems: production AI agents and 0→1 financial infrastructure, with measured change.";
  }
  if (pathname === "/approach") {
    return "Agents should earn autonomy. Context, typed tools, human gates, and evidence.";
  }
  if (pathname === "/writing") {
    return "Product theses on agents, control, and financial infrastructure.";
  }
  if (pathname === "/agentfit") {
    return "When should a workflow get an agent? Fit score, autonomy ceiling, blockers, and a local-first instrument. A discovery hypothesis, not a production authorization.";
  }
  if (pathname === "/opportunity-os") {
    return "A local-first command center for the search: Today, Pipeline, Contacts, Interviews, Story, and Fit. No backend. No accounts.";
  }
  return DEFAULT_DESCRIPTION;
}
