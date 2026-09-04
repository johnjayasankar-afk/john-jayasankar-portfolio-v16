import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { cases, liveProducts, person } from "@/data/content";

type CommandItem = {
  id: string;
  label: string;
  hint?: string;
  run: () => void;
};

export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate();
  const items = useMemo<CommandItem[]>(
    () => [
      { id: "home", label: "Home", hint: "JJ", run: () => navigate("/") },
      { id: "work", label: "Work", hint: "Page", run: () => navigate("/work") },
      { id: "build", label: "Build", hint: "Page", run: () => navigate("/approach") },
      { id: "writing", label: "Writing", hint: "Page", run: () => navigate("/writing") },
      { id: "about", label: "About", hint: "Page", run: () => navigate("/about") },
      {
        id: "ridelens",
        label: "Open RideLens",
        hint: "Live",
        run: () => {
          window.open(liveProducts.ridelens, "_blank", "noopener,noreferrer");
        },
      },
      {
        id: "raildrop",
        label: "Open RailDrop",
        hint: "Live",
        run: () => {
          window.open(liveProducts.raildrop, "_blank", "noopener,noreferrer");
        },
      },
      {
        id: "case-ridelens",
        label: "RideLens case",
        hint: "JJ-SYS-08",
        run: () => navigate("/work/ridelens"),
      },
      {
        id: "case-raildrop",
        label: "RailDrop case",
        hint: "JJ-SYS-09",
        run: () => navigate("/work/raildrop"),
      },
      ...cases
        .filter((study) => study.slug !== "ridelens" && study.slug !== "raildrop")
        .map((study) => ({
          id: `case-${study.slug}`,
          label: study.alias,
          hint: `JJ-SYS-${study.number}`,
          run: () => navigate(`/work/${study.slug}`),
        })),
      {
        id: "email",
        label: "Email John",
        hint: "Mail",
        run: () => {
          window.location.href = `mailto:${person.email}`;
        },
      },
      {
        id: "substack",
        label: "Follow on Substack",
        hint: "Writing",
        run: () => {
          window.open(person.substack, "_blank", "noopener,noreferrer");
        },
      },
      {
        id: "resume",
        label: "Résumé ↗",
        hint: "PDF",
        run: () => {
          window.open(person.resume, "_blank", "noopener,noreferrer");
        },
      },
      {
        id: "linkedin",
        label: "LinkedIn",
        hint: "↗",
        run: () => {
          window.open(person.linkedin, "_blank", "noopener,noreferrer");
        },
      },
    ],
    [navigate],
  );

  if (!open) return null;
  return <PalettePanel items={items} onClose={onClose} />;
}

function PalettePanel({ items, onClose }: { items: CommandItem[]; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return needle ? items.filter((item) => item.label.toLowerCase().includes(needle)) : items;
  }, [items, query]);
  const index = filtered.length === 0 ? 0 : Math.min(active, filtered.length - 1);
  const activeId = filtered[index] ? `cmd-${filtered[index].id}` : undefined;

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    inputRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key === "Tab") {
        event.preventDefault();
        inputRef.current?.focus();
        if (filtered.length === 0) return;
        const dir = event.shiftKey ? -1 : 1;
        setActive((i) => (i + dir + filtered.length) % filtered.length);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose, filtered.length]);

  useEffect(() => {
    document.getElementById(activeId ?? "")?.scrollIntoView({ block: "nearest" });
  }, [activeId]);

  return (
    <div
      className="site-palette"
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
      onClick={onClose}
    >
      <div className="site-palette-panel" onClick={(event) => event.stopPropagation()}>
        <input
          ref={inputRef}
          autoFocus
          value={query}
          placeholder="Go to a page, case, or product"
          role="combobox"
          aria-expanded="true"
          aria-controls="site-commands"
          aria-activedescendant={activeId}
          aria-autocomplete="list"
          aria-label="Filter commands"
          onChange={(event) => {
            setQuery(event.target.value);
            setActive(0);
          }}
          onKeyDown={(event) => {
            if (event.key === "Escape") onClose();
            if (event.key === "ArrowDown") {
              event.preventDefault();
              if (filtered.length === 0) return;
              setActive((i) => (i + 1) % filtered.length);
            }
            if (event.key === "ArrowUp") {
              event.preventDefault();
              if (filtered.length === 0) return;
              setActive((i) => (i - 1 + filtered.length) % filtered.length);
            }
            if (event.key === "Enter" && filtered[index]) {
              filtered[index].run();
              onClose();
            }
          }}
        />
        {filtered.length === 0 ? (
          <p className="sys site-palette-empty" role="status" aria-live="polite">
            Nothing matches.
          </p>
        ) : (
          <div id="site-commands" className="site-palette-list" role="listbox" aria-label="Commands">
            {filtered.map((item, i) => (
              <button
                key={item.id}
                id={`cmd-${item.id}`}
                type="button"
                role="option"
                tabIndex={-1}
                aria-selected={i === index}
                data-active={i === index}
                onMouseEnter={() => setActive(i)}
                onClick={() => {
                  item.run();
                  onClose();
                }}
              >
                <span>{item.label}</span>
                {item.hint ? <small>{item.hint}</small> : null}
              </button>
            ))}
          </div>
        )}
        <p className="sys site-palette-hint">↑↓ to move · Enter to open · Esc to close</p>
      </div>
    </div>
  );
}
