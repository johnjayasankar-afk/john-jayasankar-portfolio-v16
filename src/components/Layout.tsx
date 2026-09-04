import { Suspense, useEffect, useRef, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { liveProducts, person } from "@/data/content";
import { ProductLink } from "@/components/ProductLink";
import { Cursor } from "./Cursor";
import { BackersSprite } from "./BackersSprite";
import { BackersStrip } from "./BackersStrip";
import { CommandPalette } from "./CommandPalette";
import { Seo } from "./Seo";
import { resetVisual } from "@/scene/visual";
import { paletteShortcutLabel } from "@/util/motion";

const links = [
  { to: "/work", label: "Work" },
  { to: "/approach", label: "Build" },
  { to: "/writing", label: "Writing" },
  { to: "/about", label: "About" },
];

export function Layout() {
  const { pathname, hash } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [shortcut, setShortcut] = useState("⌘K");
  const menuBtnRef = useRef<HTMLButtonElement>(null);
  const mobileNavRef = useRef<HTMLElement>(null);
  const nightFirst = pathname === "/" || /^\/work\/[^/]+$/.test(pathname) || pathname === "/approach";
  const [onCream, setOnCream] = useState(!nightFirst);

  useEffect(() => {
    setShortcut(paletteShortcutLabel());
  }, []);

  useEffect(() => {
    setOpen(false);
    setPaletteOpen(false);
    resetVisual();
    setOnCream(!nightFirst);
  }, [pathname, nightFirst]);

  useEffect(() => {
    if (hash) {
      const id = decodeURIComponent(hash.replace(/^#/, ""));
      const go = () => document.getElementById(id)?.scrollIntoView({ block: "start" });
      go();
      requestAnimationFrame(go);
      return;
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  useEffect(() => {
    const update = () => {
      setScrolled(window.scrollY > 12);
      const header = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header")) || 72;
      const ticker = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--ticker")) || 86;
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

  useEffect(() => {
    if (!open) {
      document.body.style.overflow = "";
      return;
    }
    document.body.style.overflow = "hidden";
    const focusables = () => {
      const nav = mobileNavRef.current;
      const items = nav ? [...nav.querySelectorAll<HTMLElement>("a, button")] : [];
      if (menuBtnRef.current) items.unshift(menuBtnRef.current);
      return items;
    };
    const firstNav = focusables();
    (firstNav[1] ?? firstNav[0])?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        menuBtnRef.current?.focus();
        return;
      }
      if (event.key !== "Tab") return;
      const list = focusables();
      if (list.length === 0) return;
      const first = list[0];
      const last = list[list.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== "k") return;
      event.preventDefault();
      setOpen(false);
      setPaletteOpen((value) => !value);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="site">
      <Seo />
      <a className="skip" href="#content">
        Skip to content
      </a>
      <Cursor />
      <BackersSprite />
      <header
        className={`site-header${scrolled ? " scrolled" : ""}${onCream ? " on-cream" : ""}`}
        inert={paletteOpen ? true : undefined}
      >
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
            <button
              type="button"
              className="cmd-launch"
              aria-label={`Open command palette (${shortcut})`}
              onClick={() => setPaletteOpen(true)}
            >
              {shortcut}
            </button>
            <a href={person.resume} target="_blank" rel="noreferrer">
              Résumé ↗
            </a>
          </div>
          <button
            ref={menuBtnRef}
            type="button"
            className={`menu-btn${open ? " open" : ""}`}
            aria-label={open ? "Close menu" : "Menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            <span />
          </button>
        </div>
      </header>
      <div inert={open || paletteOpen ? true : undefined}>
        <BackersStrip onCream={onCream} />
      </div>
      <nav
        id="mobile-nav"
        ref={mobileNavRef}
        className={`mobile-nav${open ? " open" : ""}`}
        aria-label="Mobile"
        role={open ? "dialog" : undefined}
        aria-modal={open || undefined}
        hidden={!open}
      >
        {links.map((l) => (
          <NavLink key={l.to} to={l.to} onClick={() => setOpen(false)}>
            {l.label}
          </NavLink>
        ))}
        <a href={person.resume} target="_blank" rel="noreferrer">
          Résumé ↗
        </a>
        <a href={`mailto:${person.email}`}>Email</a>
        <button
          type="button"
          onClick={() => {
            setOpen(false);
            setPaletteOpen(true);
          }}
        >
          {shortcut}
        </button>
      </nav>
      <main id="content" inert={open || paletteOpen ? true : undefined} aria-hidden={open || paletteOpen || undefined}>
        <Suspense fallback={<div className="page-fallback" aria-hidden="true" />}>
          <Outlet />
        </Suspense>
      </main>
      <CommandPalette
        open={paletteOpen}
        onClose={() => {
          setPaletteOpen(false);
          queueMicrotask(() => {
            const launch = document.querySelector<HTMLElement>(".cmd-launch");
            if (launch && launch.offsetParent !== null) launch.focus();
            else menuBtnRef.current?.focus();
          });
        }}
      />
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
            Résumé ↗
          </a>
          <a href={person.substack} target="_blank" rel="noreferrer">
            Substack
          </a>
          <ProductLink href={liveProducts.ridelens}>RideLens</ProductLink>
          <ProductLink href={liveProducts.raildrop}>RailDrop</ProductLink>
        </div>
      </div>
    </footer>
  );
}
