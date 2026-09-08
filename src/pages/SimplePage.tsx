import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { liveProducts, person, writing } from "@/data/content";
import { CommandPalette } from "@/components/CommandPalette";
import { ExternalLink } from "@/components/ExternalLink";
import { Seo } from "@/components/Seo";
import { RailDropMark, RideLensMark, DaylightMark, SystemDiagram, TimelineLogo } from "@/pages/simpleLogos";
import { copyText } from "@/util/clipboard";
import { paletteShortcutLabel } from "@/util/motion";
import { prefetchRoute } from "@/util/prefetch";
import { bindHashReplacer, clearLocusHash, isTypingTarget, replaceHash, shouldSkipHashSpy } from "@/util/scroll";
import { flashToast, subscribeToast } from "@/util/toast";
import { pushRecent } from "@/util/recents";
import { SIMPLE_JUMPS } from "@/util/pageJumps";
import "./simple.css";

const SECTION_IDS = [
  "dhead",
  "history",
  "bio",
  "selected-systems",
  "build",
  "writing",
  "pet-projects",
  "outcomes",
  "misc",
] as const;

function CircleIcon({ children }: { children: ReactNode }) {
  return (
    <svg className="iico" viewBox="0 0 40 40" aria-hidden="true" focusable="false">
      <circle cx="20" cy="20" r="20" fill="#333" />
      {children}
    </svg>
  );
}

function SectionTitle({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h2 className="ctitle" id={`${id}-title`}>
      <a className="ctitle-link" href={`#${id}`} title={`Link to ${children}`}>
        {children}
      </a>
    </h2>
  );
}

const systemCards = [
  { slug: "iport", label: "I-Port", dek: "3.5h setup → 8 minutes" },
  { slug: "coco", label: "QT CoCo", dek: "750+ eng hours returned / year" },
  { slug: "cross-currency", label: "SwapAgent", dek: "$6.5T notional made eligible" },
  { slug: "valuation", label: "Valuation", dek: "48h earlier discrepancy signal" },
  { slug: "fx-compression", label: "ForexClear", dek: "100% proposal acceptance" },
  { slug: "platform", label: "Platform", dek: "Reusable agent control spine" },
  { slug: "margin-simulator", label: "OpenGamma", dek: "Pre-trade margin decisions" },
  { slug: "ridelens", label: "RideLens", dek: "Every ride, one comparison" },
  { slug: "raildrop", label: "RailDrop", dek: "Know when your train gets cheaper" },
  { slug: "daylight", label: "Daylight", dek: "Your screen, through the day" },
] as const;

const outcomes = [
  {
    slug: "iport",
    title: "Operations agent that collapsed a 3.5-hour bottleneck",
    venue: "Quantile · 2025",
    detail: "Setup 3.5h → 8m · 3× run volume · 0 AI config errors / 6 mo",
  },
  {
    slug: "coco",
    title: "Incident agent that returned 750 engineering hours a year",
    venue: "Quantile · 2025",
    detail: "Investigation 4.5h → 11m · -78% escalations · domain MCP",
  },
  {
    slug: "cross-currency",
    title: "Multilateral compression for $6.5T of trapped notional",
    venue: "Quantile · LCH SwapAgent · 2024",
    detail: "18 banks · 12 currency pairs · +34% notional reduction / run",
  },
  {
    slug: "valuation",
    title: "Dual-source engine that stopped $6T cycles from failing late",
    venue: "Quantile · 2024",
    detail: "48h earlier detection · -91% resubmissions · 24 banks",
  },
  {
    slug: "fx-compression",
    title: "FX compression with margin intelligence in the optimizer",
    venue: "Quantile · ForexClear · 2024",
    detail: "40+ live runs · 100% proposal acceptance · -94% live failures",
  },
  {
    slug: "margin-simulator",
    title: "Pre-trade simulator that made capital a decision, not a surprise",
    venue: "OpenGamma · 2022 - 2023",
    detail: "0→1 front-office product · adoption across 20+ enterprise clients",
  },
] as const;


export function SimplePage() {
  const navigate = useNavigate();
  const [emailOpen, setEmailOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [shortcut, setShortcut] = useState("⌘K");
  const [status, setStatus] = useState("");
  const [siteToast, setSiteToast] = useState("");
  const [locus, setLocus] = useState("01 / 09 · Top");
  const copyTimer = useRef<number | null>(null);
  const emailRef = useRef<HTMLAnchorElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const emailOpenRef = useRef(false);
  const paletteOpenRef = useRef(false);
  const setLocusRef = useRef(setLocus);
  const revealRef = useRef<() => void>(() => undefined);
  const closeEmailRef = useRef<() => void>(() => undefined);

  emailOpenRef.current = emailOpen;
  paletteOpenRef.current = paletteOpen;
  setLocusRef.current = setLocus;

  useLayoutEffect(() => {
    setShortcut(paletteShortcutLabel());
  }, []);

  useLayoutEffect(() => {
    pushRecent("/simple", "Simple");
  }, []);

  useLayoutEffect(() => subscribeToast(setSiteToast), []);

  useLayoutEffect(() => {
    return bindHashReplacer((id) => {
      navigate(
        { pathname: "/simple", hash: id ? `#${id}` : "" },
        { replace: true, preventScrollReset: true },
      );
    });
  }, [navigate]);

  useLayoutEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = document.documentElement;

    const sectionEls = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => !!el,
    );

    let spyFrame = 0;
    let spyLockUntil = 0;
    let progFrame = 0;
    let settleTimer = 0;
    const bar = progressRef.current;

    const updateProgress = () => {
      progFrame = 0;
      if (!bar) return;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      bar.style.transform = `scaleX(${p})`;
    };

    const spy = () => {
      spyFrame = 0;
      if (performance.now() < spyLockUntil) return;
      const probe = window.scrollY + Math.min(120, window.innerHeight * 0.18);
      const scrollBottom = window.scrollY + window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      const atBottom = scrollBottom >= docHeight - 3;

      let active = sectionEls[0]?.id ?? "dhead";
      if (atBottom) {
        // Last section often cannot pin under the top edge; keep the hash honest
        active = sectionEls[sectionEls.length - 1]?.id ?? active;
      } else {
        for (const el of sectionEls) {
          if (el.offsetTop <= probe) active = el.id;
        }
      }
      sectionEls.forEach((el) =>
        el.classList.toggle("is-active-section", el.id === active && active !== "dhead"),
      );
      const idx = Math.max(0, SECTION_IDS.indexOf(active as (typeof SECTION_IDS)[number]));
      const jump = SIMPLE_JUMPS.find((row) => row.id === active);
      setLocusRef.current(
        `${String(idx + 1).padStart(2, "0")} / ${String(SECTION_IDS.length).padStart(2, "0")} · ${jump?.label ?? active}`,
      );
      if (shouldSkipHashSpy()) return;
      if (active === "dhead") replaceHash(null);
      else replaceHash(active);
    };

    const scrollToId = (rawId: string, behavior: "instant" | "smooth") => {
      const id = rawId.replace(/-title$/, "") || "dhead";
      const el = document.getElementById(id);
      if (!el) return;
      const top = Math.max(0, el.getBoundingClientRect().top + window.scrollY - 16);
      const motion = behavior === "smooth" && !reduce ? "smooth" : "instant";
      spyLockUntil = performance.now() + (motion === "smooth" ? 1000 : 0);
      window.scrollTo({ top, left: 0, behavior: motion });
      if (id === "dhead") replaceHash(null);
      else replaceHash(id);
      sectionEls.forEach((section) =>
        section.classList.toggle("is-active-section", section.id === id && id !== "dhead"),
      );
      if (id !== "dhead") {
        if (el.tabIndex < 0) el.tabIndex = -1;
        window.requestAnimationFrame(() => el.focus({ preventScroll: true }));
      }

      window.clearTimeout(settleTimer);
      if (motion === "instant") {
        spyLockUntil = 0;
        spy();
        updateProgress();
      } else {
        settleTimer = window.setTimeout(() => {
          spyLockUntil = 0;
          spy();
          updateProgress();
        }, 1000);
      }
    };

    const onScrollSpy = () => {
      if (!spyFrame) spyFrame = window.requestAnimationFrame(spy);
    };
    window.addEventListener("scroll", onScrollSpy, { passive: true });

    // Shared / bookmarked section links land instantly and keep the hash honest
    const initialHash = window.location.hash.replace(/^#/, "");
    if (initialHash) scrollToId(initialHash, "instant");
    else {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      spy();
    }

    const onDocClick = (event: MouseEvent) => {
      const link = (event.target as HTMLElement | null)?.closest?.("a.ctitle-link, a.simple-top");
      if (!(link instanceof HTMLAnchorElement)) return;
      const href = link.getAttribute("href");
      if (!href?.startsWith("#")) return;
      event.preventDefault();
      scrollToId(href.slice(1) || "dhead", reduce ? "instant" : "smooth");
      if (link.classList.contains("simple-top")) {
        window.requestAnimationFrame(() =>
          document.querySelector<HTMLElement>("#dhead h1")?.focus({ preventScroll: true }),
        );
      }
    };
    document.addEventListener("click", onDocClick);

    // Browser back/forward between section hashes
    const onHashChange = () => {
      scrollToId(window.location.hash.replace(/^#/, "") || "dhead", "instant");
    };
    window.addEventListener("hashchange", onHashChange);

    const onPageShow = (event: PageTransitionEvent) => {
      if (!event.persisted) return;
      spy();
      updateProgress();
    };
    window.addEventListener("pageshow", onPageShow);

    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPaletteOpen((open) => !open);
        return;
      }

      if (event.metaKey || event.ctrlKey || event.altKey) return;

      if (event.key === "Escape" && emailOpenRef.current) {
        event.preventDefault();
        closeEmailRef.current();
        return;
      }

      if (paletteOpenRef.current) return;
      if (isTypingTarget(event.target)) return;

      const target = event.target as HTMLElement | null;
      if (target?.closest("a, button, input, textarea, select, [contenteditable='true']")) {
        return;
      }

      if (event.key === "Escape") {
        if (!window.location.hash) return;
        event.preventDefault();
        clearLocusHash();
        return;
      }

      if (event.key === "f") {
        event.preventDefault();
        navigate("/");
        return;
      }
      if (event.key === "e") {
        event.preventDefault();
        revealRef.current();
        return;
      }
      if (event.key === "t") {
        event.preventDefault();
        scrollToId("dhead", reduce ? "instant" : "smooth");
        window.requestAnimationFrame(() =>
          document.querySelector<HTMLElement>("#dhead h1")?.focus({ preventScroll: true }),
        );
        return;
      }
      if (event.key === "y") {
        event.preventDefault();
        const id = window.location.hash.replace(/^#/, "") || "dhead";
        const url = `${window.location.origin}${window.location.pathname}#${id}`;
        void copyText(url).then((ok) => {
          setStatus(ok ? "Section link copied." : "Could not copy link.");
          flashToast(ok ? "Section link copied" : "Could not copy link");
          if (copyTimer.current) window.clearTimeout(copyTimer.current);
          copyTimer.current = window.setTimeout(() => setStatus(""), 1600);
        });
        return;
      }
      if (event.key === "Enter") {
        const id = window.location.hash.replace(/^#/, "") || "dhead";
        const section = document.getElementById(id);
        const link = section?.querySelector<HTMLAnchorElement>('a[href^="/work/"]');
        const href = link?.getAttribute("href");
        if (!href) return;
        event.preventDefault();
        navigate(href);
        return;
      }
      if (event.key === "j" || event.key === "k") {
        event.preventDefault();
        const ids = [...SECTION_IDS];
        const hash = window.location.hash.replace(/^#/, "") || "dhead";
        const here = ids.indexOf(hash as (typeof SECTION_IDS)[number]);
        const at = here < 0 ? 0 : here;
        const nextIndex =
          event.key === "j" ? Math.min(ids.length - 1, at + 1) : Math.max(0, at - 1);
        scrollToId(ids[nextIndex], reduce ? "instant" : "smooth");
      }
    };
    window.addEventListener("keydown", onKey);

    const onScrollProgress = () => {
      if (!progFrame) progFrame = window.requestAnimationFrame(updateProgress);
    };
    window.addEventListener("scroll", onScrollProgress, { passive: true });
    updateProgress();

    const idleId = window.setTimeout(() => {
      prefetchRoute("/");
      prefetchRoute("/approach");
      prefetchRoute("/writing");
      prefetchRoute("/work/iport");
    }, 700);

    return () => {
      root.classList.remove("simple-smooth-scroll");
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScrollSpy);
      window.removeEventListener("scroll", onScrollProgress);
      window.removeEventListener("hashchange", onHashChange);
      window.removeEventListener("pageshow", onPageShow);
      document.removeEventListener("click", onDocClick);
      if (spyFrame) window.cancelAnimationFrame(spyFrame);
      if (progFrame) window.cancelAnimationFrame(progFrame);
      window.clearTimeout(idleId);
      window.clearTimeout(settleTimer);
      if (copyTimer.current) window.clearTimeout(copyTimer.current);
    };
  }, [navigate]);

  async function copyEmail() {
    const ok = await copyText(person.email);
    if (ok) {
      setStatus("Email copied to clipboard.");
      flashToast("Email copied");
      if (copyTimer.current) window.clearTimeout(copyTimer.current);
      copyTimer.current = window.setTimeout(() => setStatus(""), 1600);
      return true;
    }
    const node = emailRef.current;
    if (node) {
      const range = document.createRange();
      range.selectNodeContents(node);
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
    flashToast("Could not copy email");
    setStatus("Select the address and copy.");
    if (copyTimer.current) window.clearTimeout(copyTimer.current);
    copyTimer.current = window.setTimeout(() => setStatus(""), 2400);
    return false;
  }

  async function revealEmail() {
    emailOpenRef.current = true;
    setEmailOpen(true);
    await copyEmail();
    window.requestAnimationFrame(() => emailRef.current?.focus());
  }

  function closeEmail() {
    emailOpenRef.current = false;
    setEmailOpen(false);
    setStatus("");
  }

  revealRef.current = () => {
    void revealEmail();
  };
  closeEmailRef.current = closeEmail;

  return (
    <div className="simple-root is-ready">
      <Seo />
      <div className="simple-progress" ref={progressRef} aria-hidden="true" />
      <a className="simple-skip" href="#history">
        Skip to timeline
      </a>
      <main id="simple-main" aria-label="Simple portfolio">

      <div id="dhead" className="container">
        <div className="simple-tools">
          <p className="simple-locus" aria-live="polite">
            {locus}
          </p>
          <button
            type="button"
            className="simple-cmd"
            aria-label={`Open command palette (${shortcut})`}
            onClick={() => setPaletteOpen(true)}
          >
            {shortcut}
          </button>
          <Link className="simple-switch" to="/" title="Press F" onMouseEnter={() => prefetchRoute("/")} onFocus={() => prefetchRoute("/")}>
            Full site →
          </Link>
        </div>
        <div className="row">
          <div id="dpic">
            <img
              src={person.photo}
              alt={person.name}
              width={240}
              height={240}
              decoding="async"
              fetchPriority="high"
            />
          </div>
          <div id="ddesc">
            <h1 tabIndex={-1}>{person.name}</h1>
            <h2>I like to ship AI agents into high-stakes financial workflows.</h2>
            <div id="dico" role="group" aria-label="Profiles and contact">
              <ExternalLink href={person.linkedin} title="LinkedIn" aria-label="LinkedIn">
                <CircleIcon>
                  <path
                    fill="#fff"
                    d="M14.2 16.1h2.5v9.7h-2.5v-9.7zm1.2-4c.8 0 1.5.7 1.5 1.5s-.7 1.4-1.5 1.4-1.5-.6-1.5-1.4.7-1.5 1.5-1.5zM22 16.1h2.4v1.3h.1c.3-.6 1.2-1.5 2.5-1.5 2.7 0 3.2 1.8 3.2 4.1v5.8h-2.5v-5.1c0-1.2 0-2.8-1.7-2.8s-2 1.3-2 2.7v5.2H22v-9.7z"
                  />
                </CircleIcon>
              </ExternalLink>
              <ExternalLink href={person.substack}>
                <CircleIcon>
                  <path fill="#fff" d="M11 13.5h18v2.2H11v-2.2zm0 4.4h18V28L20 24.2 11 28V17.9z" />
                </CircleIcon>
              </ExternalLink>
              <ExternalLink href={person.resume}>
                <CircleIcon>
                  <path
                    fill="#fff"
                    d="M14 11.5h12c.8 0 1.5.7 1.5 1.5v14c0 .8-.7 1.5-1.5 1.5H14c-.8 0-1.5-.7-1.5-1.5v-14c0-.8.7-1.5 1.5-1.5zm2 4v1.8h8V15.5h-8zm0 4v1.8h8V19.5h-8zm0 4v1.8h5V23.5h-5z"
                  />
                </CircleIcon>
              </ExternalLink>
              <button
                type="button"
                className="simple-ico-btn"
                title="Reveal and copy email (E)"
                aria-label="Reveal and copy email"
                aria-expanded={emailOpen}
                aria-controls="demail"
                onClick={revealEmail}
              >
                <CircleIcon>
                  <path
                    fill="#fff"
                    d="M11.5 14.2h17c.8 0 1.5.7 1.5 1.5v8.6c0 .8-.7 1.5-1.5 1.5h-17c-.8 0-1.5-.7-1.5-1.5v-8.6c0-.8.7-1.5 1.5-1.5zm.8 1.8 7.7 5.3 7.7-5.3H12.3zm15.7 1.5-6.6 4.5 6.6 3.7v-8.2zm-16.5 0v8.2l6.6-3.7-6.6-4.5z"
                  />
                </CircleIcon>
              </button>
            </div>
            <div id="demail" className={emailOpen ? "show" : undefined}>
              {emailOpen ? (
                <>
                  <a ref={emailRef} href={`mailto:${person.email}`}>{person.email}</a>
                  <button
                    type="button"
                    className="simple-copy"
                    aria-label="Copy email address"
                    onClick={() => void copyEmail()}
                  >
                    {status.startsWith("Email copied")
                      ? "copied"
                      : status.startsWith("Could not") || status.startsWith("Select")
                        ? "failed"
                        : "copy"}
                  </button>
                </>
              ) : null}
            </div>
            <div className="simple-live" aria-live="polite">
              {status}
            </div>
          </div>
        </div>
      </div>

      <hr />

      <div id="history" className="container" tabIndex={-1}>
        <div className="entry row">
          <div className="timespan">2025 - present</div>
          <div className="ico">
            <div className="entry-dot" />
            <TimelineLogo name="quantile" />
          </div>
          <div className="desc">
            I am Lead Product Manager for Portfolio Optimization at{" "}
            <ExternalLink href="https://www.quantile.com/">
              Quantile Technologies
            </ExternalLink>{" "}
            (an{" "}
            <ExternalLink href="https://www.lseg.com/">
              LSEG
            </ExternalLink>{" "}
            business). I ship production AI agents and a reusable human-supervised architecture across enterprise financial workflows. The work has generated $3M+ in new and expansion ARR across rates, FX, and cross-currency optimization.
          </div>
        </div>

        <div className="entry row">
          <div className="timespan">2023 - 2025</div>
          <div className="ico">
            <div className="entry-dot" />
            <TimelineLogo name="quantile" />
          </div>
          <div className="desc">
            I was Product Manager for Portfolio Optimization at Quantile. I owned discovery, strategy, launch, and GTM for optimization products used by global banks. That meant 0→1 launches in multilateral compression, valuation/validation, and FX, then putting an agent layer on top of those systems.
            <div className="desc-more">
              A few of the systems from this stretch:{" "}
              <Link to="/work/iport" onFocus={() => prefetchRoute("/work/iport")} onMouseEnter={() => prefetchRoute("/work/iport")}>
                I-Port
              </Link>{" "}
              collapsed a 3.5-hour expert setup bottleneck to 8 minutes and scaled run volume 3× at constant headcount.{" "}
              <Link to="/work/coco" onFocus={() => prefetchRoute("/work/coco")} onMouseEnter={() => prefetchRoute("/work/coco")}>
                QT CoCo
              </Link>{" "}
              returned 750+ senior engineering hours a year by diagnosing incidents before they escalated.{" "}
              <Link
                to="/work/cross-currency"
                onFocus={() => prefetchRoute("/work/cross-currency")}
                onMouseEnter={() => prefetchRoute("/work/cross-currency")}
              >
                LCH SwapAgent
              </Link>{" "}
              made $6.5T of previously ineligible bilateral notional available across 12 currency pairs.{" "}
              <Link
                to="/work/valuation"
                onFocus={() => prefetchRoute("/work/valuation")}
                onMouseEnter={() => prefetchRoute("/work/valuation")}
              >
                Simplified Compression
              </Link>{" "}
              surfaced valuation discrepancies 48 hours earlier and cut failed-run resubmissions 91%.{" "}
              <Link
                to="/work/fx-compression"
                onFocus={() => prefetchRoute("/work/fx-compression")}
                onMouseEnter={() => prefetchRoute("/work/fx-compression")}
              >
                ForexClear
              </Link>{" "}
              embedded margin intelligence in the optimizer and hit 100% proposal acceptance across 40+ live runs.{" "}
              <Link
                to="/work/platform"
                onFocus={() => prefetchRoute("/work/platform")}
                onMouseEnter={() => prefetchRoute("/work/platform")}
              >
                The agent platform
              </Link>{" "}
              made context, tools, actions, and evaluation reusable across five enterprise agents.
            </div>
          </div>
        </div>

        <div className="entry row">
          <div className="timespan">2022 - 2023</div>
          <div className="ico">
            <div className="entry-dot" />
            <TimelineLogo name="opengamma" />
          </div>
          <div className="desc">
            I was a Product Analyst at{" "}
            <ExternalLink href="https://opengamma.com/">
              OpenGamma
            </ExternalLink>
            , later acquired by Trading Technologies. I originated and shipped a 0→1{" "}
            <Link
              to="/work/margin-simulator"
              onFocus={() => prefetchRoute("/work/margin-simulator")}
              onMouseEnter={() => prefetchRoute("/work/margin-simulator")}
            >
              pre-trade margin simulator
            </Link>{" "}
            used in front-office workflows. I led discovery across trading, treasury, risk, and operations, with adoption across 20+ enterprise clients. The point was simple: capital should be a decision before you execute, not a surprise after.
          </div>
        </div>

        <div className="entry row">
          <div className="timespan">2021</div>
          <div className="ico">
            <div className="entry-dot" />
            <TimelineLogo name="wellsfargo" />
          </div>
          <div className="desc">
            Summer Analyst on the FX / Rates trading desk at Wells Fargo. This is where I learned that in markets, a late failure is not an ops inconvenience. It is the product.
          </div>
        </div>

        <div className="entry row">
          <div className="timespan">2021</div>
          <div className="ico">
            <div className="entry-dot" />
            <TimelineLogo name="wharton" />
          </div>
          <div className="desc">
            Research Assistant at the Wharton School, working on reporting quality and incentives. Useful training for caring about whether a number is actually true before anyone acts on it.
          </div>
        </div>

        <div className="entry row">
          <div className="timespan">Earlier</div>
          <div className="ico">
            <div className="entry-dot" />
            <TimelineLogo name="hartford" />
          </div>
          <div className="desc">
            Summer Intern at Hartford Funds on Mutual Funds & ETFs. Early market-structure reps before I moved fully into product.
          </div>
        </div>

        <div className="entry row">
          <div className="timespan">Earlier</div>
          <div className="ico">
            <div className="entry-dot" />
            <TimelineLogo name="oceantrail" />
          </div>
          <div className="desc">
            Private Equity Summer Intern at Ocean Trail Partners. Diligence reps, then out.
          </div>
        </div>

        <div className="entry row">
          <div className="timespan">2018 - 2022</div>
          <div className="ico">
            <div className="entry-dot" />
            <TimelineLogo name="haverford" />
          </div>
          <div className="desc">
            B.A. in Economics & Linguistics at{" "}
            <ExternalLink href="https://www.haverford.edu/">
              Haverford College
            </ExternalLink>
            . GPA 3.9, cum laude, Linguistics High Honors. I liked the combination: models of behavior on one side, precision about language and meaning on the other. That pairing still shows up in how I design agent boundaries.
          </div>
        </div>
      </div>

      <div id="bio" className="container bio-block">
        <SectionTitle id="bio">bio</SectionTitle>
        <div className="prose">
          John Jayasankar is a Lead Product Manager in New York. He builds production AI agents and 0→1 financial infrastructure for complex, high-stakes workflows. At Quantile (LSEG) he has shipped agents and optimization products used by global banks. Previously he originated a pre-trade margin simulator at OpenGamma.           Independently he built and shipped{" "}
          <ExternalLink href={liveProducts.ridelens}>
            RideLens
          </ExternalLink>
          ,{" "}
          <ExternalLink href={liveProducts.raildrop}>
            RailDrop
          </ExternalLink>
          , and{" "}
          <ExternalLink href={liveProducts.daylight}>
            Daylight
          </ExternalLink>
          .
        </div>
      </div>

      <div id="selected-systems">
        <div className="container">
          <SectionTitle id="selected-systems">selected systems</SectionTitle>
          <div className="row">
            {systemCards.map((card) => {
              const path = `/work/${card.slug}`;
              return (
                <div className="card" key={card.slug}>
                  <Link
                    to={path}
                    onFocus={() => prefetchRoute(path)}
                    onMouseEnter={() => prefetchRoute(path)}
                  >
                    <div className="ccimg">
                      <SystemDiagram slug={card.slug} />
                    </div>
                    <div className="cdesc">
                      <strong>{card.label}</strong>
                      <span>{card.dek}</span>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div id="build" className="container">
        <SectionTitle id="build">how I build</SectionTitle>
        <div className="prose">
          Agents should earn autonomy. I start with the workflow, then give the system only the context, tools, and typed actions it needs, with a human gate on anything consequential. Model capability is one layer. Scope expands when evidence says it should.{" "}
          <Link to="/approach" onFocus={() => prefetchRoute("/approach")} onMouseEnter={() => prefetchRoute("/approach")}>
            More on the control model here
          </Link>
          .
        </div>
      </div>

      <div id="writing" className="container">
        <SectionTitle id="writing">featured writing</SectionTitle>
        <div className="prose">
          Short theses for now. Longer notes land on{" "}
          <ExternalLink href={person.substack}>
            Substack
          </ExternalLink>
          .
        </div>
        <ul className="writing-list">
          {writing.map((w) => {
            const path = w.to ?? `/writing#${w.id}`;
            return (
            <li key={w.id}>
              <Link
                className="writing-title"
                to={path}
                onMouseEnter={() => prefetchRoute(w.to ?? "/writing")}
                onFocus={() => prefetchRoute(w.to ?? "/writing")}
              >
                {w.title}
              </Link>
              {" · "}
              {w.dek}
            </li>
            );
          })}
        </ul>
      </div>

      <div id="pet-projects" className="container">
        <SectionTitle id="pet-projects">pet projects</SectionTitle>
        <div className="project">
          <div className="pico">
            <RideLensMark />
          </div>
          <div className="pdesc">
            <ExternalLink href={liveProducts.ridelens}>
              RideLens
            </ExternalLink>{" "}
            is every ride, one comparison. Live roads. Real rate cards. Uber, Lyft, Empower, and Curb ranked before you book. I built it end-to-end because I was tired of opening four apps and guessing.{" "}
            <Link
              to="/work/ridelens"
              onFocus={() => prefetchRoute("/work/ridelens")}
              onMouseEnter={() => prefetchRoute("/work/ridelens")}
            >
              Case writeup
            </Link>
            .
          </div>
          <div className="pend" />
        </div>
        <div className="project">
          <div className="pico">
            <RailDropMark />
          </div>
          <div className="pdesc">
            <ExternalLink href={liveProducts.raildrop}>
              RailDrop
            </ExternalLink>{" "}
            watches Amtrak listed fares across your travel window and emails only when a qualifying option improves. It fails honestly when the source is down and never invents fees, fares, or fake itineraries.{" "}
            <Link
              to="/work/raildrop"
              onFocus={() => prefetchRoute("/work/raildrop")}
              onMouseEnter={() => prefetchRoute("/work/raildrop")}
            >
              Case writeup
            </Link>
            .
          </div>
          <div className="pend" />
        </div>
        <div className="project">
          <div className="pico">
            <DaylightMark />
          </div>
          <div className="pdesc">
            <ExternalLink href={liveProducts.daylight}>
              Daylight
            </ExternalLink>{" "}
            is adaptive display lighting for macOS: warmth and brightness on a schedule you set, entirely offline, with a printed precedence ladder and three levels of certainty about whether a change actually took.{" "}
            <Link
              to="/work/daylight"
              onFocus={() => prefetchRoute("/work/daylight")}
              onMouseEnter={() => prefetchRoute("/work/daylight")}
            >
              Case writeup
            </Link>
            .
          </div>
          <div className="pend" />
        </div>
      </div>

      <div id="outcomes" className="container">
        <SectionTitle id="outcomes">selected outcomes</SectionTitle>
        {outcomes.map((item) => (
          <div className="pub" key={item.slug}>
            <div className="pub-title">
              <Link
                to={`/work/${item.slug}`}
                onFocus={() => prefetchRoute(`/work/${item.slug}`)}
                onMouseEnter={() => prefetchRoute(`/work/${item.slug}`)}
              >
                {item.title}
              </Link>
            </div>
            <div className="pub-venue">{item.venue}</div>
            <div className="pub-authors">{item.detail}</div>
          </div>
        ))}
      </div>

      <div id="misc" className="container">
        <SectionTitle id="misc">misc unsorted</SectionTitle>
        <ul className="nodot">
          <li>
            The denser version of this site, with interactive systems diagrams, lives on the{" "}
            <Link to="/">full site</Link>
            {" "}(or press <kbd>F</kbd>).
          </li>
          <li>
            I write short notes on agent economics and control on{" "}
            <ExternalLink href={person.substack}>
              Substack
            </ExternalLink>
            .
          </li>
          <li>
            Based in {person.location}. Best email is under the envelope icon above (press <kbd>E</kbd>,{" "}
            <kbd>Esc</kbd> to hide), or just{" "}
            <a href={`mailto:${person.email}`}>{person.email}</a>.
          </li>
          <li>
            Résumé as a PDF:{" "}
            <ExternalLink href={person.resume}>
              John_Jayasankar_Resume.pdf
            </ExternalLink>
            .
          </li>
          <li>
            Shortcuts: <kbd>{shortcut}</kbd> jump · <kbd>j</kbd>/<kbd>k</kbd> sections · <kbd>Y</kbd> copy section ·{" "}
            <kbd>F</kbd> full site · <kbd>E</kbd> email · <kbd>T</kbd> top. Section titles are deep
            links.
          </li>
          <li>
            This simple page is intentionally light: one layout, timeline, bio, and links. The full site is allowed to be heavier because the products are.
          </li>
        </ul>
        <div className="simple-footer">
          <span>
            {person.name} · {person.role} · {person.location}
          </span>
          <a className="simple-top" href="#dhead">
            Top ↑
          </a>
        </div>
      </div>
      </main>
      {siteToast ? (
        <div className="simple-toast" role="status" aria-live="polite">
          {siteToast}
        </div>
      ) : null}
      <CommandPalette
        open={paletteOpen}
        onClose={() => {
          setPaletteOpen(false);
          queueMicrotask(() => {
            document.querySelector<HTMLElement>(".simple-cmd")?.focus();
          });
        }}
      />
    </div>
  );
}
