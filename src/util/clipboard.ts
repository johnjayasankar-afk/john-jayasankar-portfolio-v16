/** Copy text to the clipboard. Falls back to a temporary selection when needed. */
export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Corp browsers and insecure contexts often block clipboard.writeText.
  }

  try {
    const node = document.createElement("textarea");
    node.value = text;
    node.setAttribute("readonly", "");
    node.style.position = "fixed";
    node.style.opacity = "0";
    node.style.pointerEvents = "none";
    document.body.appendChild(node);
    node.select();
    node.setSelectionRange(0, text.length);
    const ok = document.execCommand("copy");
    document.body.removeChild(node);
    return ok;
  } catch {
    return false;
  }
}
