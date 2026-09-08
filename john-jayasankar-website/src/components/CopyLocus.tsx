import { useRef, useState } from "react";
import { copyText } from "@/util/clipboard";
import { absoluteUrl, siteOrigin } from "@/lib/site";
import { flashCopied } from "@/util/toast";

/** Quiet deep-link copy — same grammar as case sidebar tools. */
export function CopyLocus({
  path,
  label = "Copy link",
  toastLabel,
}: {
  path: string;
  label?: string;
  toastLabel?: string;
}) {
  const [flash, setFlash] = useState("");
  const timer = useRef(0);

  async function onCopy() {
    const url = absoluteUrl(path, siteOrigin()) || `${window.location.origin}${path}`;
    const ok = await copyText(url);
    window.clearTimeout(timer.current);
    const locus = toastLabel ?? label;
    setFlash(ok ? `Copied · ${locus}` : "Could not copy");
    flashCopied(locus, ok);
    timer.current = window.setTimeout(() => setFlash(""), 1600);
  }

  return (
    <button type="button" className="case-copy-link" onClick={() => void onCopy()}>
      {flash || label}
    </button>
  );
}
