import { Link, useLocation } from "react-router-dom";
import { SiteFooter } from "@/components/Layout";
import { ProductLink } from "@/components/ProductLink";
import { liveProducts } from "@/data/content";
import { paletteShortcutLabel } from "@/util/motion";
import { prefetchRoute } from "@/util/prefetch";
import { listRecents } from "@/util/recents";
import { suggestCases } from "@/util/suggest";
import { useEffect, useState } from "react";

export function NotFoundPage() {
  const { pathname } = useLocation();
  const suggestions = suggestCases(pathname);
  const [shortcut, setShortcut] = useState("⌘K");
  const [recents, setRecents] = useState(() => listRecents().slice(0, 4));

  useEffect(() => {
    setShortcut(paletteShortcutLabel());
    setRecents(listRecents().slice(0, 4));
  }, []);

  return (
    <div className="sheet page">
      <section className="section">
        <div className="wrap-wide page-hero">
          <p className="sys">404 · Off-map</p>
          <h1 className="display">This page is not in the system.</h1>
          <p className="lede">
            The URL does not match a case, essay, or live product. The work is still here, just
            not at this address.
          </p>
          <p className="notfound-path sys" aria-label={`Requested path ${pathname}`}>
            Requested
            <span>{pathname || "/"}</span>
          </p>
          {suggestions.length > 0 ? (
            <div className="notfound-suggest">
              <p className="sys">Closest matches</p>
              <ul>
                {suggestions.map((study) => (
                  <li key={study.slug}>
                    <Link
                      to={`/work/${study.slug}`}
                      onMouseEnter={() => prefetchRoute(`/work/${study.slug}`)}
                      onFocus={() => prefetchRoute(`/work/${study.slug}`)}
                    >
                      <span className="sys">JJ-SYS-{study.number}</span>
                      <strong>{study.alias}</strong>
                      <span>{study.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {recents.length > 0 ? (
            <div className="notfound-recents">
              <p className="sys">Recent</p>
              <ul>
                {recents.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      onMouseEnter={() => prefetchRoute(item.path.split("#")[0] || "/")}
                      onFocus={() => prefetchRoute(item.path.split("#")[0] || "/")}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          <div className="hero-actions">
            <Link className="btn btn-ink" to="/" onMouseEnter={() => prefetchRoute("/")}>
              Home
            </Link>
            <Link className="btn btn-line" to="/work" onMouseEnter={() => prefetchRoute("/work")}>
              Selected systems
            </Link>
            <Link className="btn btn-line" to="/simple" onMouseEnter={() => prefetchRoute("/simple")}>
              Simple
            </Link>
            <ProductLink className="btn btn-line" href={liveProducts.ridelens}>
              RideLens ↗
            </ProductLink>
            <ProductLink className="btn btn-line" href={liveProducts.raildrop}>
              RailDrop ↗
            </ProductLink>
          </div>
          <p className="case-nav-hint sys">Press {shortcut} to jump anywhere</p>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
