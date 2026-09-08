import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { cases, liveProducts, person, writing } from "@/data/content";
import { copyText } from "@/util/clipboard";
import { caseBriefText } from "@/util/caseBrief";
import { caseToc } from "@/util/caseToc";
import { absoluteUrl, pageTitle, siteOrigin } from "@/lib/site";
import { prefetchRoute } from "@/util/prefetch";
import { flashToast } from "@/util/toast";
import {
  HOME_JUMPS,
  SIMPLE_JUMPS,
  APPROACH_JUMPS,
  aboutJumps,
  writingJumps,
  workJumps,
} from "@/util/pageJumps";
import { listRecents } from "@/util/recents";
import { locusLabel } from "@/util/locus";
import { compactKey, editDistance } from "@/util/suggest";
import { relativeAt } from "@/util/relativeTime";
import { usePaletteShortcut } from "@/util/usePaletteShortcut";
import { resumeLabel } from "@/components/ContinueReading";
import { useOrientId } from "@/util/useOrientId";

type CommandItem = {
  id: string;
  label: string;
  hint?: string;
  group: string;
  keywords?: string;
  here?: boolean;
  prefetch?: string;
  run: () => void | Promise<void | boolean>;
};

const GROUPS = [
  "Keys",
  "Recent",
  "Pages",
  "On this page",
  "On this case",
  "Cases",
  "Writing",
  "Live",
  "Contact",
] as const;

function keysForPath(pathname: string, shortcut: string): CommandItem[] {
  const remind = (label: string) => async () => {
    flashToast(label);
    return true;
  };
  const items: CommandItem[] = [
    {
      id: "keys-palette",
      label: `${shortcut} · Open command palette`,
      hint: "Global",
      group: "Keys",
      keywords: "keys help ? grammar shortcut",
      run: remind(`${shortcut} opens the palette`),
    },
    {
      id: "keys-top",
      label: "t · Back to top",
      hint: "Global",
      group: "Keys",
      keywords: "keys help ? scroll top",
      run: remind("t · back to top"),
    },
    {
      id: "keys-esc",
      label: "Esc · Clear locus (place held)",
      hint: "Global",
      group: "Keys",
      keywords: "keys help ? clear hash section soft",
      run: remind("Esc · clear locus · place held"),
    },
    {
      id: "keys-email",
      label: "e · Copy email",
      hint: "Global",
      group: "Keys",
      keywords: "keys help ? contact mail",
      run: remind("e · copy email"),
    },
    {
      id: "keys-link",
      label: "y · Copy link to locus",
      hint: "Global",
      group: "Keys",
      keywords: "keys help ? share permalink",
      run: remind("y · copy link"),
    },
  ];

  if (/^\/work\/[^/]+$/.test(pathname)) {
    items.push(
      {
        id: "keys-case-jk",
        label: "j / k · Case sections",
        hint: "Case",
        group: "Keys",
        keywords: "keys help ? sections beats",
        run: remind("j / k · case sections"),
      },
      {
        id: "keys-case-digits",
        label: "1–N · Jump to beat",
        hint: "Case",
        group: "Keys",
        keywords: "keys help ? digits sections beats",
        run: remind("1–N · jump to beat"),
      },
      {
        id: "keys-case-adj",
        label: "[ ] · Adjacent cases",
        hint: "Case",
        group: "Keys",
        keywords: "keys help ? previous next",
        run: remind("[ ] · adjacent cases"),
      },
      {
        id: "keys-case-brief",
        label: "b · Copy case brief",
        hint: "Case",
        group: "Keys",
        keywords: "keys help ? brief clipboard",
        run: remind("b · copy brief"),
      },
    );
  } else if (pathname === "/") {
    items.push({
      id: "keys-home",
      label: "j / k · Home ladder · Enter opens case",
      hint: "Home",
      group: "Keys",
      keywords: "keys help ? systems",
      run: remind("j / k · home · Enter opens case"),
    });
  } else if (pathname === "/work") {
    items.push({
      id: "keys-work",
      label: "1–4 facets · j / k ledger · Enter opens",
      hint: "Work",
      group: "Keys",
      keywords: "keys help ? filter",
      run: remind("1–4 facets · j / k ledger"),
    });
  } else if (pathname === "/approach") {
    items.push({
      id: "keys-build",
      label: "1–5 layers · j / k ladder",
      hint: "Build",
      group: "Keys",
      keywords: "keys help ? autonomy",
      run: remind("1–5 layers · j / k ladder"),
    });
  } else if (pathname === "/about" || pathname === "/writing" || pathname === "/simple") {
    items.push({
      id: "keys-page-jk",
      label: "j / k · Move through this page",
      hint: "Page",
      group: "Keys",
      keywords: "keys help ? sections",
      run: remind("j / k · move through this page"),
    });
  }

  return items;
}

export function CommandPalette({
  open,
  onClose,
  seed,
}: {
  open: boolean;
  onClose: () => void;
  seed?: "keys" | null;
}) {
  const navigate = useNavigate();
  const { pathname, hash } = useLocation();
  const orientId = useOrientId(hash);
  const orientHash = orientId ? `#${orientId}` : "";
  const shortcut = usePaletteShortcut();
  const [recentsTick, setRecentsTick] = useState(0);
  const [present, setPresent] = useState(open);
  const [visible, setVisible] = useState(open);

  useEffect(() => {
    if (open) setRecentsTick((n) => n + 1);
  }, [open]);

  useEffect(() => {
    if (open) {
      setPresent(true);
      const frame = window.requestAnimationFrame(() => setVisible(true));
      return () => window.cancelAnimationFrame(frame);
    }
    setVisible(false);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setPresent(false);
      return;
    }
    const timer = window.setTimeout(() => setPresent(false), 160);
    return () => window.clearTimeout(timer);
  }, [open]);

  const items = useMemo<CommandItem[]>(() => {
    const here = (path: string) => pathname === path || (path !== "/" && pathname.startsWith(`${path}/`));
    const go = (path: string) => () => {
      prefetchRoute(path);
      navigate(path);
    };
    const current = `${pathname}${hash || ""}`;
    const recents = listRecents()
      .filter((row) => row.path !== current && row.path !== pathname)
      .slice(0, 5)
      .map((row) => ({
        id: `recent-${row.path}`,
        label: /^\/work\/[^/]+/.test(row.path.split("#")[0]) ? resumeLabel(row) : row.label,
        hint: relativeAt(row.at),
        group: "Recent" as const,
        keywords: `recent history ${row.path}`,
        prefetch: row.path.split("#")[0],
        run: go(row.path),
      }));

    return [
      ...keysForPath(pathname, shortcut),
      ...recents,
      {
        id: "home",
        label: "Home",
        hint: here("/") ? "Here" : "JJ",
        group: "Pages",
        keywords: "index landing",
        here: pathname === "/",
        prefetch: "/",
        run: go("/"),
      },
      {
        id: "work",
        label: "Work",
        hint: here("/work") && !pathname.startsWith("/work/") ? "Here" : "Page",
        group: "Pages",
        keywords: "systems ledger cases",
        here: pathname === "/work",
        prefetch: "/work",
        run: go("/work"),
      },
      {
        id: "build",
        label: "Build",
        hint: here("/approach") ? "Here" : "Page",
        group: "Pages",
        keywords: "approach method",
        here: pathname === "/approach",
        prefetch: "/approach",
        run: go("/approach"),
      },
      {
        id: "writing",
        label: "Writing",
        hint: here("/writing") ? "Here" : "Page",
        group: "Pages",
        keywords: "notes essays",
        here: pathname === "/writing",
        prefetch: "/writing",
        run: go("/writing"),
      },
      {
        id: "about",
        label: "About",
        hint: here("/about") ? "Here" : "Page",
        group: "Pages",
        keywords: "bio john",
        here: pathname === "/about",
        prefetch: "/about",
        run: go("/about"),
      },
      {
        id: "simple",
        label: "Simple",
        hint: here("/simple") ? "Here" : "Minimal",
        group: "Pages",
        keywords: "karpathy plain",
        here: pathname === "/simple",
        prefetch: "/simple",
        run: go("/simple"),
      },
      ...(function homeJumps(): CommandItem[] {
        if (pathname !== "/") return [];
        return [
          ...HOME_JUMPS.map((item) => ({
            id: `home-${item.id}`,
            label: item.label,
            hint: "Home",
            group: "On this page" as const,
            keywords: `home section ${item.id}`,
            here: orientHash === `#${item.id}`,
            prefetch: "/",
            run: go(`/#${item.id}`),
          })),
          ...cases.map((study) => ({
            id: `home-sys-${study.slug}`,
            label: study.alias,
            hint: "System",
            group: "On this page" as const,
            keywords: `${study.title} ${study.slug} stage system home`,
            here: orientHash === `#${study.slug}`,
            prefetch: `/work/${study.slug}`,
            run: go(`/#${study.slug}`),
          })),
        ];
      })(),
      ...(function simpleJumps(): CommandItem[] {
        if (pathname !== "/simple") return [];
        return SIMPLE_JUMPS.map((item) => ({
          id: `simple-${item.id}`,
          label: item.label,
          hint: "Simple",
          group: "On this page" as const,
          keywords: `simple section ${item.id}`,
          here: orientHash === `#${item.id}`,
          prefetch: "/simple",
          run: go(`/simple#${item.id}`),
        }));
      })(),
      ...(function writingPageJumps(): CommandItem[] {
        if (pathname !== "/writing") return [];
        return writingJumps().map((item) => ({
          id: `writing-jump-${item.id}`,
          label: item.label,
          hint: "Writing",
          group: "On this page" as const,
          keywords: `writing thesis ${item.id}`,
          here: orientHash === `#${item.id}`,
          prefetch: item.path.startsWith("/writing") ? "/writing" : item.path,
          run: go(item.path),
        }));
      })(),
      ...(function aboutPageJumps(): CommandItem[] {
        if (pathname !== "/about") return [];
        return aboutJumps().map((item) => ({
          id: `about-jump-${item.id}`,
          label: item.label,
          hint: "About",
          group: "On this page" as const,
          keywords: `about experience ${item.id}`,
          here: orientHash === `#${item.id}`,
          prefetch: "/about",
          run: go(`/about#${item.id}`),
        }));
      })(),
      ...(function approachPageJumps(): CommandItem[] {
        if (pathname !== "/approach") return [];
        return APPROACH_JUMPS.map((item) => ({
          id: `approach-jump-${item.id}`,
          label: item.label,
          hint: "Build",
          group: "On this page" as const,
          keywords: `approach layer ladder ${item.id}`,
          here: orientHash === `#${item.id}`,
          prefetch: "/approach",
          run: go(`/approach#${item.id}`),
        }));
      })(),
      ...(function workPageJumps(): CommandItem[] {
        if (pathname !== "/work") return [];
        return workJumps().map((item) => ({
          id: `work-jump-${item.id}`,
          label: item.label,
          hint: "Open",
          group: "On this page" as const,
          keywords: `work ledger ${item.id}`,
          here: orientHash === `#${item.id}`,
          prefetch: item.path,
          run: go(item.path),
        }));
      })(),
      ...(function caseNav(): CommandItem[] {
        const index = cases.findIndex((c) => pathname === `/work/${c.slug}`);
        if (index < 0) return [];
        const study = cases[index];
        const prev = cases[(index - 1 + cases.length) % cases.length];
        const next = cases[(index + 1) % cases.length];
        const toc = caseToc(study);
        const beatId = orientId;
        const beat = toc.find((item) => item.id === beatId);
        const caseUrl =
          absoluteUrl(`/work/${study.slug}`, siteOrigin()) ||
          `${typeof window !== "undefined" ? window.location.origin : ""}/work/${study.slug}`;
        return [
          {
            id: "case-copy-brief",
            label: "Copy case brief",
            hint: "b",
            group: "On this case" as const,
            keywords: `brief clipboard share packet ${study.alias} ${study.title}`,
            run: async () => copyText(caseBriefText(study, caseUrl)),
          },
          {
            id: "case-copy-section",
            label: beat
              ? `Copy link · ${beat.label.replace(/^\d+\s+/, "")}`
              : "Copy link to this case",
            hint: "y",
            group: "On this case" as const,
            keywords: "section beat permalink clipboard share",
            run: async () => {
              const path = beat ? `/work/${study.slug}#${beat.id}` : `/work/${study.slug}`;
              const url =
                absoluteUrl(path, siteOrigin()) ||
                `${typeof window !== "undefined" ? window.location.origin : ""}${path}`;
              return copyText(url);
            },
          },
          {
            id: "case-prev",
            label: `Previous: ${prev.alias}`,
            hint: "←",
            group: "On this case" as const,
            keywords: `prev previous adjacent ${prev.title} ${prev.slug}`,
            prefetch: `/work/${prev.slug}`,
            run: go(`/work/${prev.slug}`),
          },
          {
            id: "case-next",
            label: `Next: ${next.alias}`,
            hint: "→",
            group: "On this case" as const,
            keywords: `next adjacent ${next.title} ${next.slug}`,
            prefetch: `/work/${next.slug}`,
            run: go(`/work/${next.slug}`),
          },
          ...toc.map((item) => ({
            id: `section-${item.id}`,
            label: item.label,
            hint: study.alias,
            group: "On this case" as const,
            keywords: `${study.title} ${study.slug} section beat`,
            here: orientId === item.id,
            prefetch: `/work/${study.slug}`,
            run: go(`/work/${study.slug}#${item.id}`),
          })),
        ];
      })(),
      ...cases.map((study) => ({
        id: `case-${study.slug}`,
        label: study.alias,
        hint: pathname === `/work/${study.slug}` ? "Here" : `JJ-SYS-${study.number}`,
        group: "Cases" as const,
        keywords: `${study.title} ${study.company} ${study.slug} ${study.kicker}`,
        here: pathname === `/work/${study.slug}`,
        prefetch: `/work/${study.slug}`,
        run: go(`/work/${study.slug}`),
      })),
      ...writing.map((note) => {
        const path = note.to ?? `/writing#${note.id}`;
        const onWriting = pathname === "/writing" && hash === `#${note.id}`;
        const onDest = note.to ? here(note.to) : onWriting;
        return {
          id: `note-${note.id}`,
          label: note.title,
          hint: note.tag,
          group: "Writing" as const,
          keywords: `${note.dek} ${note.tag} thesis`,
          here: onDest,
          prefetch: note.to ?? "/writing",
          run: go(path),
        };
      }),
      {
        id: "ridelens",
        label: "Open RideLens",
        hint: "Live",
        group: "Live",
        keywords: "product app",
        run: () => {
          window.open(liveProducts.ridelens, "_blank", "noopener,noreferrer");
        },
      },
      {
        id: "raildrop",
        label: "Open RailDrop",
        hint: "Live",
        group: "Live",
        keywords: "product app",
        run: () => {
          window.open(liveProducts.raildrop, "_blank", "noopener,noreferrer");
        },
      },
      {
        id: "email",
        label: "Email John",
        hint: "Mail",
        group: "Contact",
        keywords: person.email,
        run: () => {
          window.location.href = `mailto:${person.email}`;
        },
      },
      {
        id: "copy-email",
        label: "Copy email",
        hint: person.email,
        group: "Contact",
        keywords: "clipboard address",
        run: async () => {
          const ok = await copyText(person.email);
          if (!ok) window.prompt("Copy email", person.email);
          return ok;
        },
      },
      {
        id: "copy-link",
        label: "Copy link to this page",
        hint: "Share",
        group: "Contact",
        keywords: "url clipboard share permalink",
        run: async () => {
          const path = `${pathname}${hash || ""}`;
          const url = absoluteUrl(path === "/" ? "/" : path, siteOrigin()) || `${window.location.origin}${path}`;
          const ok = await copyText(url);
          if (!ok) window.prompt("Copy link", url);
          return ok;
        },
      },
      {
        id: "substack",
        label: "Follow on Substack ↗",
        hint: "Writing",
        group: "Contact",
        run: () => {
          window.open(person.substack, "_blank", "noopener,noreferrer");
        },
      },
      {
        id: "resume",
        label: "Résumé ↗",
        hint: "PDF",
        group: "Contact",
        keywords: "cv resume",
        run: () => {
          window.open(person.resume, "_blank", "noopener,noreferrer");
        },
      },
      {
        id: "linkedin",
        label: "LinkedIn ↗",
        hint: "Profile",
        group: "Contact",
        run: () => {
          window.open(person.linkedin, "_blank", "noopener,noreferrer");
        },
      },
    ];
  }, [navigate, pathname, hash, orientId, orientHash, recentsTick, shortcut]);

  if (!open && !present) return null;
  return (
    <PalettePanel
      items={items}
      onClose={onClose}
      pathname={pathname}
      hash={hash}
      orientHash={orientHash}
      open={visible}
      seed={seed ?? null}
    />
  );
}

function scoreItem(item: CommandItem, needle: string) {
  const label = item.label.toLowerCase();
  const hint = (item.hint ?? "").toLowerCase();
  const hay = `${label} ${hint} ${item.id} ${item.keywords ?? ""}`.toLowerCase();
  const compactNeedle = compactKey(needle);
  const compactLabel = compactKey(item.label);
  const compactId = compactKey(item.id);

  if (needle === "?" || needle === "keys" || needle === "help") {
    return item.group === "Keys" ? 100 : -1;
  }
  if (label === needle) return 100;
  if (label.startsWith(needle)) return 90;
  if (compactLabel.startsWith(compactNeedle) && compactNeedle.length >= 2) return 86;
  if (label.includes(needle)) return 72;
  if (hint.includes(needle)) return 55;
  if (hay.includes(needle)) return 48;
  if (compactLabel.includes(compactNeedle) && compactNeedle.length >= 3) return 44;

  if (compactNeedle.length >= 3) {
    const targets = [
      compactLabel,
      compactId,
      ...item.label
        .toLowerCase()
        .split(/[^a-z0-9]+/)
        .map(compactKey)
        .filter((t) => t.length >= 3),
    ];
    let best = Infinity;
    for (const target of targets) {
      if (!target) continue;
      if (Math.abs(target.length - compactNeedle.length) > 3) continue;
      best = Math.min(best, editDistance(compactNeedle, target));
    }
    if (best <= 1) return 50;
    if (best === 2 && compactNeedle.length >= 4) return 34;
  }
  return -1;
}

function paletteFooter(pathname: string, hash: string): string {
  const locus = locusLabel(pathname, hash);
  const base = "↑↓ · j/k when empty · Enter · Esc · ? keys";
  if (/^\/work\/[^/]+$/.test(pathname)) {
    return locus
      ? `${locus} · j/k · Esc clears · y · ${base}`
      : `Case · j/k sections · y copy · ${base}`;
  }
  if (pathname === "/")
    return locus
      ? `${locus} · j/k · Esc clears · Enter case · ${base}`
      : `Home · j/k · Enter case · ${base}`;
  if (pathname === "/work")
    return locus
      ? `${locus} · 1–4 · j/k · Esc clears · ${base}`
      : `Ledger · 1–4 facets · j/k · Enter · y · ${base}`;
  if (pathname === "/writing")
    return locus ? `${locus} · j/k · Esc clears · y · ${base}` : `Writing · j/k · y · ${base}`;
  if (pathname === "/about")
    return locus ? `${locus} · j/k · Esc clears · y · ${base}` : `About · j/k · y · ${base}`;
  if (pathname === "/approach")
    return locus
      ? `${locus} · 1–5 · j/k · Esc clears · ${base}`
      : `Build · 1–5 layers · j/k ladder · y · ${base}`;
  if (pathname === "/simple")
    return locus ? `${locus} · j/k · Esc clears · y · ${base}` : `Simple · j/k · y · ${base}`;
  return locus ? `${locus} · Esc clears · ${base}` : base;
}

function PalettePanel({
  items,
  onClose,
  pathname,
  hash,
  orientHash,
  open,
  seed,
}: {
  items: CommandItem[];
  onClose: () => void;
  pathname: string;
  hash: string;
  orientHash: string;
  open: boolean;
  seed: "keys" | null;
}) {
  const navigate = useNavigate();
  const [query, setQuery] = useState(seed === "keys" ? "keys" : "");
  const [active, setActive] = useState(0);
  const [flash, setFlash] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const closingRef = useRef(false);

  useEffect(() => {
    if (!open) return;
    setQuery(seed === "keys" ? "keys" : "");
    setActive(0);
    setFlash("");
    closingRef.current = false;
  }, [open, seed, pathname]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) {
      // Keys stay discoverable via ? / keys / help — not the default browse list.
      return items.filter((item) => item.group !== "Keys");
    }
    if (needle === "?" || needle === "keys" || needle === "help") {
      return items.filter((item) => item.group === "Keys");
    }
    return items
      .map((item) => ({ item, score: scoreItem(item, needle) }))
      .filter((row) => row.score >= 0)
      .sort((a, b) => b.score - a.score || a.item.label.localeCompare(b.item.label))
      .map((row) => row.item);
  }, [items, query]);

  const grouped = useMemo(() => {
    return GROUPS.map((group) => ({
      group,
      items: filtered.filter((item) => item.group === group),
    })).filter((row) => row.items.length > 0);
  }, [filtered]);

  const flat = useMemo(() => grouped.flatMap((row) => row.items), [grouped]);
  const index = flat.length === 0 ? 0 : Math.min(active, flat.length - 1);
  const activeId = flat[index] ? `cmd-${flat[index].id}` : undefined;

  const runItem = async (item: CommandItem) => {
    if (closingRef.current) return;
    const copyIds = new Set(["copy-email", "copy-link", "case-copy-brief", "case-copy-section"]);
    if (copyIds.has(item.id) || item.group === "Keys") {
      const ok = await item.run();
      const success = ok !== false;
      const pageLocus =
        locusLabel(pathname, orientHash) ??
        pageTitle(pathname, hash).replace(/\s*·\s*John Jayasankar$/, "").trim();
      let msg = item.label;
      if (item.id === "copy-email") msg = success ? "Email copied" : "Could not copy email";
      else if (item.id === "copy-link" || item.id === "case-copy-section") {
        msg = success ? `Copied · ${pageLocus || "page"}` : "Could not copy link";
      } else if (item.id === "case-copy-brief") {
        msg = success ? "Brief copied" : "Could not copy brief";
      }
      setFlash(msg);
      flashToast(msg);
      closingRef.current = true;
      window.setTimeout(() => {
        onClose();
      }, 520);
      return;
    }
    await item.run();
    onClose();
  };

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    if (open) inputRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (!open) return;
      if (event.key === "Tab") {
        event.preventDefault();
        inputRef.current?.focus();
        if (flat.length === 0) return;
        const dir = event.shiftKey ? -1 : 1;
        setActive((i) => (i + dir + flat.length) % flat.length);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose, flat.length, open]);

  useEffect(() => {
    document.getElementById(activeId ?? "")?.scrollIntoView({ block: "nearest" });
  }, [activeId]);

  let flatOffset = 0;

  return (
    <div
      className={`site-palette${open ? " is-open" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
      onClick={onClose}
    >
      <div className="site-palette-panel" onClick={(event) => event.stopPropagation()}>
        <p className="sys site-palette-locus">
          {locusLabel(pathname, orientHash) ??
            (pageTitle(pathname, hash).replace(/\s*·\s*John Jayasankar$/, "").trim() || "Navigate")}
        </p>
        <input
          ref={inputRef}
          autoFocus
          value={query}
          placeholder="Jump, search, or type keys…"
          role="combobox"
          aria-expanded="true"
          aria-controls={flat.length ? "site-commands" : "site-commands-empty"}
          aria-activedescendant={flat.length ? activeId : undefined}
          aria-autocomplete="list"
          aria-label="Filter commands"
          onChange={(event) => {
            setQuery(event.target.value);
            setActive(0);
          }}
          onKeyDown={(event) => {
            if (event.key === "Escape") onClose();
            const letterNav = query.trim() === "";
            const down = event.key === "ArrowDown" || (letterNav && event.key === "j");
            const up = event.key === "ArrowUp" || (letterNav && event.key === "k");
            if (down) {
              event.preventDefault();
              if (flat.length === 0) return;
              setActive((i) => (i + 1) % flat.length);
            }
            if (up) {
              event.preventDefault();
              if (flat.length === 0) return;
              setActive((i) => (i - 1 + flat.length) % flat.length);
            }
            if (event.key === "Enter" && flat[index]) {
              event.preventDefault();
              void runItem(flat[index]);
            }
          }}
        />
        {flash ? (
          <p className="sys site-palette-flash" role="status" aria-live="polite">
            {flash}
          </p>
        ) : null}
        {flat.length === 0 ? (
          <div className="site-palette-empty" role="status" aria-live="polite" id="site-commands-empty">
            <p className="sys">Nothing matches{query.trim() ? ` “${query.trim()}”` : ""}.</p>
            <p className="site-palette-empty-hint">Try a case name, page, keys, or ? · Esc to close</p>
            <div className="site-palette-recover">
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  inputRef.current?.focus();
                }}
              >
                Clear query
              </button>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  navigate("/work");
                }}
              >
                Work
              </button>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  navigate("/work/iport");
                }}
              >
                I-Port
              </button>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  navigate("/about");
                }}
              >
                About
              </button>
            </div>
          </div>
        ) : null}
        <div
          id="site-commands"
          className="site-palette-list"
          role="listbox"
          aria-label="Commands"
          hidden={flat.length === 0}
        >
          {grouped.map((row) => {
            const start = flatOffset;
            flatOffset += row.items.length;
            return (
              <div key={row.group} className="site-palette-group" role="group" aria-label={row.group}>
                <p className="sys site-palette-group-label">{row.group}</p>
                {row.items.map((item, i) => {
                  const absolute = start + i;
                  return (
                    <button
                      key={item.id}
                      id={`cmd-${item.id}`}
                      type="button"
                      role="option"
                      tabIndex={-1}
                      aria-selected={absolute === index}
                      data-active={absolute === index}
                      data-here={item.here ? "true" : undefined}
                      onMouseEnter={() => {
                        setActive(absolute);
                        if (item.prefetch) prefetchRoute(item.prefetch);
                      }}
                      onClick={() => {
                        void runItem(item);
                      }}
                    >
                      <span>{item.label}</span>
                      {item.hint ? <small>{item.hint}</small> : null}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
        <p className="sys site-palette-hint">{paletteFooter(pathname, orientHash)}</p>
      </div>
    </div>
  );
}
