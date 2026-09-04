import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { person } from "@/data/content";
import { absoluteUrl, cleanPath, isKnownPath, pageDescription, pageTitle, siteOrigin } from "@/lib/site";

function setNamed(selector: string, attr: "content" | "href", value: string) {
  const el = document.head.querySelector(selector);
  if (el) el.setAttribute(attr, value);
}

export function Seo() {
  const { pathname } = useLocation();

  useEffect(() => {
    const origin = siteOrigin();
    const path = cleanPath(pathname);
    const known = isKnownPath(path);
    const url = absoluteUrl(path === "/" ? "/" : path, origin);
    const image = absoluteUrl(person.photo, origin);
    const title = pageTitle(pathname);
    const description = pageDescription(pathname);

    document.title = title;
    setNamed('meta[name="description"]', "content", description);
    setNamed('meta[name="robots"]', "content", known ? "index, follow" : "noindex, follow");
    setNamed('meta[property="og:title"]', "content", title);
    setNamed('meta[property="og:description"]', "content", description);
    setNamed('meta[property="og:url"]', "content", url);
    setNamed('meta[property="og:image"]', "content", image);
    setNamed('meta[name="twitter:card"]', "content", "summary_large_image");
    setNamed('meta[name="twitter:title"]', "content", title);
    setNamed('meta[name="twitter:description"]', "content", description);
    setNamed('meta[name="twitter:image"]', "content", image);
    setNamed('link[rel="canonical"]', "href", url);
  }, [pathname]);

  return null;
}
