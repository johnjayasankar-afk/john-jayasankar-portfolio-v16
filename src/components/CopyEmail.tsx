import { useEffect, useId, useRef, useState } from "react";
import { person } from "@/data/content";
import { copyText } from "@/util/clipboard";
import { flashToast } from "@/util/toast";

/** Visible address + quiet copy - mailto alone fails in many corp clients. */
export function CopyEmail({
  tone = "light",
}: {
  tone?: "light" | "dark";
}) {
  const [status, setStatus] = useState<"idle" | "copied" | "fail">("idle");
  const timer = useRef(0);
  const addressRef = useRef<HTMLAnchorElement>(null);
  const statusId = useId();

  useEffect(() => () => window.clearTimeout(timer.current), []);

  async function onCopy() {
    const ok = await copyText(person.email);
    window.clearTimeout(timer.current);
    if (ok) {
      setStatus("copied");
      flashToast("Email copied");
      timer.current = window.setTimeout(() => setStatus("idle"), 1600);
      return;
    }
    flashToast("Could not copy email");
    setStatus("fail");
    const node = addressRef.current;
    if (node) {
      const range = document.createRange();
      range.selectNodeContents(node);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
    timer.current = window.setTimeout(() => setStatus("idle"), 2400);
  }

  const live =
    status === "copied"
      ? "Email copied to clipboard."
      : status === "fail"
        ? "Could not copy. Select the address and copy."
        : "";

  return (
    <div className={`copy-email copy-email--${tone}`}>
      <a ref={addressRef} className="copy-email-address" href={`mailto:${person.email}`}>
        {person.email}
      </a>
      <button
        type="button"
        className={`copy-email-btn${status === "copied" ? " is-ok" : status === "fail" ? " is-fail" : ""}`}
        onClick={() => void onCopy()}
        aria-describedby={statusId}
      >
        {status === "copied" ? "Copied" : status === "fail" ? "Select & copy" : "Copy"}
      </button>
      <span id={statusId} className="sr-only" role="status" aria-live="polite">
        {live}
      </span>
    </div>
  );
}
