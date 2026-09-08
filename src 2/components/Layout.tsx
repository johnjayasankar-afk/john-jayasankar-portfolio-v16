import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { person } from "@/data/content";
import { Cursor } from "./Cursor";
import { BackersSprite } from "./BackersSprite";
import { BackersStrip } from "./BackersStrip";
import { Seo } from "./Seo";
import { resetVisual } from "@/scene/visual";

const links = [
  { to: "/work", label: "Work" },
  { to: "/approach", label: "Build" },
  { to: "/writing", label: "Writing" },
  { to: "/about", label: "About" },
];

export function Layout() {
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const nightFirst = pathname === "/" || /^\/work\/[^/]+$/.test(pathname) || pathname === "/approach";
  const [onCream, setOnCream] = useState(!nightFirst);

  useEffect(() => {
    window.scrollTo(0, 0);
    setOpen(false);
    resetVisual();
    setOnCream(!nightFirst);
  }, [pathname, nightFirst]);

  useEffect(() => {
    const update = () => {
      setScrolled(window.scrollY > 12);
      const header = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header")) || 72;
      const ticker = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--ticker")) || 84;
      const probe = document.elementFromPoint(Math.min(window.innerWidth / 2, 640), header + ticker + 12);
      if (!probe) {
        setOnCream(!nightFirst);
        return;
      }
      const night = probe.closest(".hero, .contact, .case-hero, .case-visual-band, .chamber");
      const cream = probe.closest(".sheet, .case-body");
      setOnCream(Boolean(cream) && !night);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [pathname, nightFirst]);

  return (
    <div className="site">
      <Seo />
      <a className="skip" href="#content">
        Skip to content
      </a>
      <Cursor />
      <BackersSprite />
      <header className={`site-header${scrolled ? " scrolled" : ""}${onCream ? " on-cream" : ""}`}>
        <div className="header-inner">
          <Link to="/" className="brand" aria-label="John Jayasankar home">
            <b>JJ</b>
            <span>Jayasankar</span>
          </Link>
          <nav className="nav-links" aria-label="Primary">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to !== "/work"}
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
          <div className="header-cta">
            <a href={person.resume} target="_blank" rel="noreferrer">
              Résumé ↗
            </a>
          </div>
          <button className="menu-btn" aria-label="Menu" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
            <span />
          </button>
        </div>
      </header>
      <BackersStrip onCream={onCream} />
      <nav className={`mobile-nav${open ? " open" : ""}`}>
        {links.map((l) => (
          <NavLink key={l.to} to={l.to} onClick={() => setOpen(false)}>
            {l.label}
          </NavLink>
        ))}
        <a href={person.resume} target="_blank" rel="noreferrer">
          Résumé
        </a>
        <a href={`mailto:${person.email}`}>Email</a>
      </nav>
      <main id="content">
        <Outlet />
      </main>
    </div>
  );
}

export function SiteFooter({ night = false }: { night?: boolean }) {
  return (
    <footer className={`site-footer${night ? " night" : " on-sheet"}`}>
      <div className="wrap-wide footer-grid">
        <div className="footer-brand">
          <b>John Jayasankar</b>
          <p>Lead Product Manager</p>
          <p>New York · {new Date().getFullYear()}</p>
        </div>
        <nav className="footer-nav" aria-label="Footer">
          {links.map((l) => (
            <Link key={l.to} to={l.to}>
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="footer-nav">
          <a href={`mailto:${person.email}`}>Email</a>
          <a href={person.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a href={person.resume} target="_blank" rel="noreferrer">
            Résumé
          </a>
          <a href={person.substack} target="_blank" rel="noreferrer">
            Writing
          </a>
        </div>
      </div>
    </footer>
  );
}
