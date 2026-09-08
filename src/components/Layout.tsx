import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { cases, liveProducts, person } from "@/data/content";
import { ProductLink } from "@/components/ProductLink";
import { CopyEmail } from "@/components/CopyEmail";
import { ExternalLink } from "@/components/ExternalLink";
import { Cursor } from "./Cursor";
import { BackersSprite } from "./BackersSprite";
import { BackersStrip } from "./BackersStrip";
import { CommandPalette } from "./CommandPalette";
import { BackToTop } from "./BackToTop";
import { ErrorBoundary } from "./ErrorBoundary";
import { GrammarChip } from "./GrammarChip";
import { RouteFallback } from "./RouteFallback";
import { Seo } from "./Seo";
import { resetVisual } from "@/scene/visual";
import { pageTitle } from "@/lib/site";
import { paletteShortcutLabel, prefersReducedMotion } from "@/util/motion";
import { flashCopied, flashToast, subscribeToast } from "@/util/toast";
import { prefetchRoute } from "@/util/prefetch";
import { copyText } from "@/util/clipboard";
import { locusLabel, pageChromeLabel } from "@/util/locus";
import { pushRecent } from "@/util/recents";
import { bindHashReplacer, bindProgress, clearLocusHash, isTypingTarget, replaceHash, scrollToId, shouldSkipHashScroll, shouldSkipHashSpy } from "@/util/scroll";
import { useOrientId } from "@/util/useOrientId";

/** Primary recruiting path - Writing stays on the site + footer + palette, not competing with Work. */
const primaryLinks = [
  { to: "/work", label: "Work" },
  { to: "/approach", label: "Approach" },
  { to: "/about", label: "About" },
];

const footerSiteLinks = [
  ...primaryLinks,
  { to: "/writing", label: "Writing" },
  { to: "/simple", label: "Simple" },
];

export function Layout() {
  const navigate = useNavigate();
  const { pathname, hash, search } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [paletteSeed, setPaletteSeed] = useState<"keys" | null>(null);
  const [shortcut, setShortcut] = useState("⌘K");
  const [emailFlash, setEmailFlash] = useState("");
  const [siteToast, setSiteToast] = useState("");
  const menuBtnRef = useRef<HTMLButtonElement>(null);
  const mobileNavRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const nightFirst = pathname === "/" || /^\/work\/[^/]+$/.test(pathname) || pathname === "/approach";
  const isCase = /^\/work\/[^/]+$/.test(pathname);
  const [onCream, setOnCream] = useState(!nightFirst);
  const [announce, setAnnounce] = useState("");
  const orientId = useOrientId(hash);
  const orientHash = orientId ? `#${orientId}` : "";
  const locus = locusLabel(pathname, orientHash); // hash or soft locus after Esc
  const headerLocus = useMemo(() => {
    const page = pageChromeLabel(pathname);
    if (pathname.startsWith("/work/") && pathname !== "/work") {
      const study = cases.find((c) => pathname === `/work/${c.slug}`);
      if (study && locus) return `${study.alias} · ${locus}`;
      if (study) return study.alias;
    }
    if (locus) return `${page} · ${locus}`;
    if (pathname === "/work") {
      const study = cases.find((c) => c.slug === orientId);
      if (study) {
        const n = String(cases.findIndex((c) => c.slug === study.slug) + 1).padStart(2, "0");
        return `${n}/${String(cases.length).padStart(2, "0")} · ${study.alias}`;
      }
    }
    return page === "Home" ? null : page;
  }, [pathname, orientId, locus]);

  useEffect(() => {
    setShortcut(paletteShortcutLabel());
  }, []);

  useEffect(() => subscribeToast(setSiteToast), []);

  useEffect(() => {
    return bindHashReplacer((id) => {
      navigate(
        { pathname, search, hash: id ? `#${id}` : "" },
        { replace: true, preventScrollReset: true },
      );
    });
  }, [navigate, pathname, search]);

  useEffect(() => {
    if (isCase) return;
    return bindProgress(progressRef.current);
  }, [pathname, isCase]);

  useEffect(() => {
    setOpen(false);
    setPaletteOpen(false);
    setPaletteSeed(null);
    resetVisual();
    setOnCream(!nightFirst);
  }, [pathname, nightFirst]);

  // After client navigation: announce immediately from known titles (no Seo race)
  useEffect(() => {
    const label = pageTitle(pathname, hash).replace(/\s*·\s*John Jayasankar$/, "").trim() || "Home";
    setAnnounce(label);
    const path = `${pathname}${hash || ""}`;
    // Esc-cleared locus must not overwrite beat-aware Continue / palette recents.
    // Home bare `/` stays out; home deep links (`/#iport`) are worth resuming.
    if ((pathname !== "/" || Boolean(hash)) && !shouldSkipHashSpy()) {
      const study = cases.find((c) => pathname === `/work/${c.slug}`);
      const recentLabel =
        study && locus
          ? `${study.alias} · ${locus}`
          : study
            ? study.alias
            : label;
      pushRecent(path, recentLabel);
    }
    if (hash) return;
    const frame = window.requestAnimationFrame(() => {
      document.getElementById("content")?.focus({ preventScroll: true });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [pathname, hash, locus]);

  useEffect(() => {
    const idle = window.setTimeout(() => {
      prefetchRoute("/work");
      prefetchRoute("/approach");
      prefetchRoute("/writing");
      prefetchRoute("/about");
      prefetchRoute("/simple");
      prefetchRoute("/work/iport");
    }, 900);
    return () => window.clearTimeout(idle);
  }, []);

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

 // Deep-link scroll. Esc clearing the hash must NOT jump to top - soft locus stays.
  useEffect(() => {
    if (!hash) return;
    if (shouldSkipHashScroll()) return;
    const id = decodeURIComponent(hash.replace(/^#/, ""));
    let tries = 0;
    let timer = 0;
    let arriveClear = 0;
    let correctA = 0;
    let correctB = 0;
    const markArrive = () => {
      const el = document.getElementById(id);
      if (!el) return false;
      el.setAttribute("data-arrive", "");
      window.clearTimeout(arriveClear);
      arriveClear = window.setTimeout(() => el.removeAttribute("data-arrive"), 820);
      return true;
    };
    const go = (behavior?: ScrollBehavior) => {
      if (!document.getElementById(id)) return false;
      scrollToId(id, behavior ? { behavior } : undefined);
      markArrive();
      return true;
    };
    const scheduleCorrect = () => {
      // Lazy chunks / images shift layout; re-pin after settle.
      correctA = window.setTimeout(() => go("auto"), 420);
      correctB = window.setTimeout(() => go("auto"), 980);
    };
    const cleanup = () => {
      window.clearTimeout(timer);
      window.clearTimeout(arriveClear);
      window.clearTimeout(correctA);
      window.clearTimeout(correctB);
    };
    if (go()) {
      scheduleCorrect();
      return cleanup;
    }
    const tick = () => {
      tries += 1;
      if (go()) {
        scheduleCorrect();
        return;
      }
      if (tries > 40) return;
      timer = window.setTimeout(tick, 50);
    };
    requestAnimationFrame(tick);
    return cleanup;
  }, [pathname, hash]);

  // Fresh route without a hash lands at top. Hash-only clears (Esc) leave scroll alone.
  useEffect(() => {
    if (hash) return;
    window.scrollTo(0, 0);
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps -- hash intentional

  useEffect(() => {
    const onPageShow = (event: PageTransitionEvent) => {
      if (!event.persisted) return;
      if (hash) {
        const id = decodeURIComponent(hash.replace(/^#/, ""));
        if (document.getElementById(id)) scrollToId(id);
        return;
      }
      window.scrollTo(0, 0);
    };
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, [pathname, hash]);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 980px)");
    const onChange = () => {
      if (!mq.matches) setOpen(false);
    };
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const update = () => {
      setScrolled(window.scrollY > 12);
      const root = getComputedStyle(document.documentElement);
      const headerRaw = parseFloat(root.getPropertyValue("--header"));
      const tickerRaw = parseFloat(root.getPropertyValue("--ticker"));
      const header = Number.isFinite(headerRaw) ? headerRaw : 64;
      // --ticker is intentionally 0 with in-flow backers; `|| 80` falsely probed mid-page.
      const ticker = Number.isFinite(tickerRaw) ? tickerRaw : 0;
      // Probe mid-upper viewport so chrome does not flip at the first pixel of the next section.
      const probeY = Math.min(
        window.innerHeight * 0.38,
        Math.max(header + ticker + 28, header + ticker + window.innerHeight * 0.16),
      );
      const probe = document.elementFromPoint(Math.min(window.innerWidth / 2, 640), probeY);
      if (!probe) {
        setOnCream(!nightFirst);
        return;
      }
      const slot = probe.closest(".backers-slot--chrome");
      if (slot) {
        setOnCream(slot.classList.contains("on-cream"));
        return;
      }
      const night = probe.closest(".hero, .contact, .case-hero, .case-visual-band, .chamber");
      const cream = probe.closest(".sheet, .case-body");
      setOnCream(Boolean(cream) && !night);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    let tries = 0;
    let retryTimer = 0;
    const retry = () => {
      update();
      tries += 1;
      if (tries < 24) retryTimer = window.setTimeout(retry, 50);
    };
    retryTimer = window.setTimeout(retry, 0);

    const main = document.getElementById("content");
    let mo: MutationObserver | undefined;
    if (main) {
      mo = new MutationObserver(() => {
        update();
      });
      mo.observe(main, { childList: true, subtree: true });
    }

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      window.clearTimeout(retryTimer);
      mo?.disconnect();
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
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(false);
        setPaletteSeed(null);
        setPaletteOpen((value) => !value);
        return;
      }
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (paletteOpen || open) return;
      if (isTypingTarget(event.target)) return;
      const target = event.target as HTMLElement | null;
      if (target?.closest("a, button, input, textarea, select, [contenteditable='true']")) return;

      const key = event.key.toLowerCase();
      if (key === "?" || (event.shiftKey && key === "/")) {
        event.preventDefault();
        setOpen(false);
        setPaletteSeed("keys");
        setPaletteOpen(true);
        return;
      }
      if (key === "t") {
        event.preventDefault();
        replaceHash(null);
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: prefersReducedMotion() ? "auto" : "smooth",
        });
        return;
      }
      if (event.key === "Escape") {
        if (!hash && !orientId) return;
        event.preventDefault();
        clearLocusHash();
        return;
      }
      // Pages with their own section-link `y` keep ownership.
      const pageOwnsY =
        isCase ||
        pathname === "/writing" ||
        pathname === "/about" ||
        pathname === "/work" ||
        pathname === "/approach";
      if (key === "y" && !pageOwnsY) {
        event.preventDefault();
        const path = orientId ? `${pathname}#${orientId}` : `${pathname}${hash || ""}`;
        const url =
          path === "/" || path === ""
            ? `${window.location.origin}/`
            : `${window.location.origin}${path}`;
        void copyText(url).then((ok) => {
          flashCopied(locus ?? "page", ok);
        });
        return;
      }
      if (key === "e") {
        event.preventDefault();
        const copyBtn =
          document.querySelector<HTMLButtonElement>(".copy-email-btn") ||
          document.querySelector<HTMLButtonElement>(".mobile-email-copy");
        if (copyBtn) {
          copyBtn.click();
          return;
        }
        void copyText(person.email).then((ok) => {
          setEmailFlash(ok ? "Copied" : person.email);
          window.setTimeout(() => setEmailFlash(""), 1600);
          flashToast(ok ? "Email copied" : "Could not copy email");
        });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [paletteOpen, open, pathname, hash, locus, isCase, orientId]);

  async function copyMobileEmail() {
    const ok = await copyText(person.email);
    setEmailFlash(ok ? "Copied" : person.email);
    window.setTimeout(() => setEmailFlash(""), 1600);
    flashToast(ok ? "Email copied" : "Could not copy email");
  }

  return (
    <div className="site">
      <Seo />
      {!isCase ? <div className="site-progress" ref={progressRef} aria-hidden="true" /> : null}
      <a className="skip" href="#content" inert={open || paletteOpen ? true : undefined}>
        Skip to content
      </a>
      <div className="route-announce" aria-live="polite">
        {announce}
      </div>
      {siteToast ? (
        <div className="site-toast is-on" role="status" aria-live="polite">
          {siteToast}
        </div>
      ) : null}
      <Cursor />
      <BackersSprite />
      <header
        className={`site-header${scrolled ? " scrolled" : ""}${onCream ? " on-cream" : ""}`}
        inert={paletteOpen ? true : undefined}
      >
        <div className="header-inner">
          <div className="header-primary" inert={open ? true : undefined}>
            <Link to="/" className="brand" aria-label="John Jayasankar home">
              <b>JJ</b>
              <span>Jayasankar</span>
            </Link>
            <nav className="nav-links" aria-label="Primary">
              {primaryLinks.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.to !== "/work"}
                  className={({ isActive }) => (isActive ? "active" : "")}
                  onMouseEnter={() => prefetchRoute(l.to)}
                  onFocus={() => prefetchRoute(l.to)}
                >
                  {l.label}
                </NavLink>
              ))}
            </nav>
            <div className="header-cta">
              <Link
                to="/simple"
                className="simple-launch"
                title="Karpathy-style simple page"
                onMouseEnter={() => prefetchRoute("/simple")}
                onFocus={() => prefetchRoute("/simple")}
              >
                Simple
              </Link>
              <button
                type="button"
                className="cmd-launch"
                aria-label={`Open command palette (${shortcut})`}
                onClick={() => {
                  setPaletteSeed(null);
                  setPaletteOpen(true);
                }}
              >
                {shortcut}
              </button>
              <ExternalLink href={person.resume} mark>
                Résumé
              </ExternalLink>
            </div>
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
      <nav
        id="mobile-nav"
        ref={mobileNavRef}
        className={`mobile-nav${open ? " open" : ""}`}
        aria-label="Site menu"
        role={open ? "dialog" : undefined}
        aria-modal={open || undefined}
        hidden={!open}
      >
        {primaryLinks.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.to !== "/work"}
            className={({ isActive }) => (isActive ? "active" : "")}
            onClick={() => setOpen(false)}
            onMouseEnter={() => prefetchRoute(l.to)}
            onFocus={() => prefetchRoute(l.to)}
          >
            {l.label}
          </NavLink>
        ))}
        <Link to="/writing" onClick={() => setOpen(false)} onMouseEnter={() => prefetchRoute("/writing")}>
          Writing
        </Link>
        <Link to="/simple" onClick={() => setOpen(false)} onMouseEnter={() => prefetchRoute("/simple")}>
          Simple
        </Link>
        <ExternalLink href={person.resume} mark>
          Résumé
        </ExternalLink>
        <a href={`mailto:${person.email}`}>Email</a>
        <button
          type="button"
          onClick={() => {
            void copyMobileEmail();
          }}
        >
          {emailFlash || "Copy email"}
        </button>
        <span className="sr-only" role="status" aria-live="polite">
          {emailFlash === "Copied" ? "Email copied to clipboard." : emailFlash && emailFlash.includes("@") ? "Could not copy email." : ""}
        </span>
        <button
          type="button"
          onClick={() => {
            setOpen(false);
            setPaletteSeed(null);
            setPaletteOpen(true);
          }}
        >
          {shortcut}
        </button>
        {open ? (
          <p className="sys mobile-nav-meta">
            {headerLocus ? (
              <>
                <span className="mobile-nav-locus">{headerLocus}</span>
                <span aria-hidden="true"> · </span>
              </>
            ) : null}
            <span className="mobile-nav-keys">{shortcut} jump</span>
          </p>
        ) : null}
      </nav>
      {/* In-flow under the fixed header: visible at the top of every Layout page, scrolls away. */}
      <div className={`backers-slot--chrome${onCream ? " on-cream" : ""}`}>
        <BackersStrip onCream={onCream} />
      </div>
      <main id="content" tabIndex={-1} inert={open || paletteOpen ? true : undefined}>
        <ErrorBoundary key={pathname}>
          <Suspense fallback={<RouteFallback label={locus ? `Loading · ${locus}` : "Loading"} />}>
            <Outlet />
          </Suspense>
        </ErrorBoundary>
      </main>
      <GrammarChip />
      <BackToTop />
      <CommandPalette
        open={paletteOpen}
        seed={paletteSeed}
        onClose={() => {
          setPaletteOpen(false);
          setPaletteSeed(null);
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
  const { pathname, hash } = useLocation();
  const orientId = useOrientId(hash);
  const locus = locusLabel(pathname, orientId ? `#${orientId}` : "");
  const page = pageChromeLabel(pathname);

  return (
    <footer className={`site-footer${night ? " night" : " on-sheet"}`}>
      <div className="wrap-wide footer-grid">
        <div className="footer-brand">
          <b>John Jayasankar</b>
          <p>Lead Product Manager</p>
          <p>New York · {new Date().getFullYear()}</p>
          <p className="footer-locus sys" aria-live="polite">
            {locus ? (
              <>
                {page}
                <i aria-hidden="true"> · </i>
                {locus}
              </>
            ) : (
              page
            )}
          </p>
          <CopyEmail tone={night ? "dark" : "light"} />
        </div>
        <nav className="footer-nav" aria-label="Site">
          <p className="sys footer-col-label">Site</p>
          {footerSiteLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onMouseEnter={() => prefetchRoute(l.to)}
              onFocus={() => prefetchRoute(l.to)}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <nav className="footer-nav" aria-label="Elsewhere">
          <p className="sys footer-col-label">Elsewhere</p>
          <a href={`mailto:${person.email}`}>Email</a>
          <ExternalLink href={person.linkedin} mark>
            LinkedIn
          </ExternalLink>
          <ExternalLink href={person.resume} mark>
            Résumé
          </ExternalLink>
          <ExternalLink href={person.substack} mark>
            Substack
          </ExternalLink>
          <ProductLink href={liveProducts.ridelens}>RideLens ↗</ProductLink>
          <ProductLink href={liveProducts.raildrop}>RailDrop ↗</ProductLink>
          <ProductLink href={liveProducts.daylight}>Daylight ↗</ProductLink>
        </nav>
      </div>
    </footer>
  );
}
