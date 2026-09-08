/** Quiet relative timestamps for Continue / palette recents. */
export function relativeAt(at: number): string {
  const sec = Math.max(0, Math.round((Date.now() - at) / 1000));
  if (sec < 45) return "just now";
  if (sec < 3600) return `${Math.floor(sec / 60) || 1}m ago`;
  if (sec < 86400) return `${Math.floor(sec / 3600)}h ago`;
  const days = Math.floor(sec / 86400);
  return days === 1 ? "yesterday" : `${days}d ago`;
}
