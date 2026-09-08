import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { cases, person } from "@/data/content";
import { absoluteUrl, cleanPath, isKnownPath, pageDescription, pageTitle, siteOrigin } from "@/lib/site";

function setNamed(selector: string, attr: "content" | "href", value: string) {
  const el = document.head.querySelector(selector);
  if (el) el.setAttribute(attr, value);
}

const PERSON_SCHEMA_ID = "site-person-schema";
const CASE_SCHEMA_ID = "site-case-schema";
const PERSON_SCHEMA_PATHS = new Set(["/", "/about", "/simple"]);

function syncPersonSchema(path: string, origin: string) {
  document.getElementById("simple-person-schema")?.remove();
  const existing = document.getElementById(PERSON_SCHEMA_ID);

  if (!PERSON_SCHEMA_PATHS.has(path)) {
    existing?.remove();
    return;
  }

  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: person.name,
    jobTitle: person.role,
    email: `mailto:${person.email}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: person.location,
      addressCountry: "US",
    },
    url: absoluteUrl("/", origin),
    image: absoluteUrl(person.photo, origin),
    sameAs: [person.linkedin, person.substack],
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: person.education.school,
    },
    knowsAbout: [
      "AI agents",
      "Product management",
      "Financial infrastructure",
      "Portfolio optimization",
      "Fintech",
    ],
  };

  const script = (existing as HTMLScriptElement | null) ?? document.createElement("script");
  script.type = "application/ld+json";
  script.id = PERSON_SCHEMA_ID;
  script.text = JSON.stringify(schema);
  if (!existing) document.head.appendChild(script);
}

function syncCaseSchema(path: string, origin: string) {
  const existing = document.getElementById(CASE_SCHEMA_ID);
  const study = cases.find((c) => path === `/work/${c.slug}`);
  if (!study) {
    existing?.remove();
    return;
  }

  const schema = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: study.title,
    description: study.summary,
    datePublished: `${study.year}-01-01`,
    author: {
      "@type": "Person",
      name: person.name,
      url: absoluteUrl("/", origin),
    },
    about: study.company,
    keywords: [study.alias, study.kicker, study.company, ...study.chips].join(", "),
    url: absoluteUrl(`/work/${study.slug}`, origin),
    mainEntityOfPage: absoluteUrl(`/work/${study.slug}`, origin),
  };

  const script = (existing as HTMLScriptElement | null) ?? document.createElement("script");
  script.type = "application/ld+json";
  script.id = CASE_SCHEMA_ID;
  script.text = JSON.stringify(schema);
  if (!existing) document.head.appendChild(script);
}

export function Seo() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const origin = siteOrigin();
    const path = cleanPath(pathname);
    const known = isKnownPath(path);
    const study = cases.find((c) => path === `/work/${c.slug}`);
    const url = absoluteUrl(path === "/" ? "/" : path, origin) + (hash || "");
    const image = absoluteUrl(person.photo, origin);
    const title = pageTitle(pathname, hash);
    const description = pageDescription(pathname, hash);

    document.title = title;
    setNamed('meta[name="description"]', "content", description);
    setNamed('meta[name="robots"]', "content", known ? "index, follow" : "noindex, follow");
    setNamed('meta[property="og:title"]', "content", title);
    setNamed('meta[property="og:description"]', "content", description);
    setNamed('meta[property="og:url"]', "content", url);
    setNamed('meta[property="og:type"]', "content", study ? "article" : "website");
    setNamed('meta[property="og:image"]', "content", image);
    setNamed(
      'meta[property="og:image:alt"]',
      "content",
 study ? `${study.alias} - ${study.title}` : `${person.name}, ${person.role}`,
    );
    setNamed('meta[property="og:image:width"]', "content", "768");
    setNamed('meta[property="og:image:height"]', "content", "768");
    setNamed('meta[name="twitter:card"]', "content", "summary_large_image");
    setNamed('meta[name="twitter:title"]', "content", title);
    setNamed('meta[name="twitter:description"]', "content", description);
    setNamed('meta[name="twitter:image"]', "content", image);
    setNamed('meta[name="twitter:image:alt"]', "content", study ? study.alias : person.name);
    setNamed('link[rel="canonical"]', "href", absoluteUrl(path === "/" ? "/" : path, origin));
    syncPersonSchema(path, origin);
    syncCaseSchema(path, origin);
  }, [pathname, hash]);

  return null;
}
