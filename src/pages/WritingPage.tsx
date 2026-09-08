import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { person, writing } from "@/data/content";
import { Reveal } from "@/components/Reveal";
import { SiteFooter } from "@/components/Layout";
import { ContinueReading } from "@/components/ContinueReading";
import { ExternalLink } from "@/components/ExternalLink";
import { CopyLocus } from "@/components/CopyLocus";
import { prefetchRoute } from "@/util/prefetch";
import { copyText } from "@/util/clipboard";
import { absoluteUrl, siteOrigin } from "@/lib/site";
import { flashCopied } from "@/util/toast";
import { listRecents } from "@/util/recents";
import { usePaletteShortcut } from "@/util/usePaletteShortcut";
import { useOrientId } from "@/util/useOrientId";
import {
  bindSectionSpy,
  isInteractiveTarget,
  isTypingTarget,
  replaceHash,
  scrollToId,
} from "@/util/scroll";

const WRITING_IDS = writing.map((w) => w.id);

export function WritingPage() {
  const navigate = useNavigate();
  const { hash } = useLocation();
  const activeId = useOrientId(hash);
  const [linkFlash, setLinkFlash] = useState("");
  const [visited, setVisited] = useState(() => new Set<string>());
  const shortcut = usePaletteShortcut();
  const activeNote = writing.find((row) => row.id === activeId);
  const enterHint = activeNote?.to ? "Enter opens note" : "Enter when linked";

  useEffect(() => bindSectionSpy(WRITING_IDS), []);

  useEffect(() => {
    setVisited(
      new Set(
        listRecents()
          .map((row) => row.path)
          .filter((path) => path.startsWith("/writing")),
      ),
    );
  }, [activeId]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const link = (event.target as HTMLElement | null)?.closest?.("a.writing-title-link");
      if (!(link instanceof HTMLAnchorElement)) return;
      const href = link.getAttribute("href");
      if (!href?.startsWith("#")) return;
      event.preventDefault();
      scrollToId(href.slice(1));
      replaceHash(href.slice(1));
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (isTypingTarget(event.target)) return;
      if (isInteractiveTarget(event.target)) return;

      if (event.key === "Enter") {
        const note = writing.find((row) => row.id === activeId);
        if (!note?.to) return;
        event.preventDefault();
        navigate(note.to);
        return;
      }

      if (event.key === "y") {
        const id = activeId || writing[0]?.id;
        if (!id) return;
        event.preventDefault();
        const path = `/writing#${id}`;
        const url = absoluteUrl(path, siteOrigin()) || `${window.location.origin}${path}`;
        void copyText(url).then((ok) => {
          const note = writing.find((row) => row.id === id);
          const label = note?.title ?? id;
          setLinkFlash(ok ? `Copied · ${label}` : url);
          flashCopied(label, ok);
          window.setTimeout(() => setLinkFlash(""), 1600);
        });
        return;
      }

      if (event.key !== "j" && event.key !== "k") return;
      event.preventDefault();
      const here = WRITING_IDS.indexOf(activeId);
      const at = here < 0 ? (event.key === "j" ? -1 : 0) : here;
      const next =
        event.key === "j"
          ? Math.min(WRITING_IDS.length - 1, at + 1)
          : Math.max(0, at - 1);
      const id = WRITING_IDS[next];
      scrollToId(id);
      replaceHash(id);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeId, navigate]);

  return (
    <div className="sheet page">
      <section className="section">
        <div className="wrap-wide">
          <Reveal className="page-hero" immediate>
            <p className="sys">Writing · short theses · not full essays</p>
            <h1 className="display">Three notes on agents, markets, and product economics.</h1>
            <p className="lede">
              Intentionally short. These theses show how I think about AI product economics,
 autonomy, and infrastructure, not long articles. Longer writing lands on Substack
              when it exists.
            </p>
            <div className="hero-actions">
              <ExternalLink className="btn btn-line" href={person.substack} mark>
                Follow on Substack
              </ExternalLink>
            </div>
            <ContinueReading className="continue-read-page" />
          </Reveal>
          <div className="writing-list">
            {writing.map((w, i) => {
              const here = activeId === w.id;
              const seen = visited.has(`/writing#${w.id}`);
              return (
                <Reveal key={w.id} inView delay={0.03 * Math.min(i, 6)} className="writing-reveal" immediate={i < 3}>
                  <article
                    id={w.id}
                    tabIndex={-1}
                    className={here ? "is-target" : undefined}
                    data-visited={seen ? "true" : undefined}
                    aria-current={here ? "location" : undefined}
                  >
                    <span className="sys sys-num">
                      {String(i + 1).padStart(2, "0")}
                      {seen ? <i className="ledger-seen" aria-hidden="true" /> : null}
                    </span>
                    <div>
                      <p className="sys">{w.tag}</p>
                      <h3>
                        {w.to ? (
                          <Link
                            className="writing-title-link"
                            to={w.to}
                            onMouseEnter={() => prefetchRoute(w.to!)}
                            onFocus={() => prefetchRoute(w.to!)}
                          >
                            {w.title}
                          </Link>
                        ) : (
                          <a className="writing-title-link" href={`#${w.id}`}>
                            {w.title}
                          </a>
                        )}
                      </h3>
                      <p>{w.dek}</p>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
          <p className="case-nav-hint sys">{`j / k theses · ${enterHint} · y link · ${shortcut} jump`}</p>
          <div className="page-locus-tools">
            <CopyLocus
              path={activeId ? `/writing#${activeId}` : "/writing"}
              label={activeId ? "Copy locus" : "Copy page"}
              toastLabel={activeNote?.title ?? "Writing"}
            />
          </div>
          <span className="sr-only" role="status" aria-live="polite">{linkFlash}</span>
          {linkFlash ? <p className="case-nav-hint sys" aria-hidden="true">{linkFlash}</p> : null}
          <p className="follow-link">
            <ExternalLink className="text-link" href={person.substack} mark>
              Notes in progress. Follow on Substack
            </ExternalLink>
          </p>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
