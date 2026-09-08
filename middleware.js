/**
 * Soft-404 unknown paths while preserving vercel.json legacy redirects
 * that would otherwise be intercepted before the platform redirect layer.
 */

export const config = {
  matcher: [
    "/((?!assets/|fonts/|favicon\\.svg|john-jayasankar\\.jpg|robots\\.txt|sitemap\\.xml|.*\\.[A-Za-z0-9]+$).*)",
  ],
};

const KNOWN = new Set([
  "/",
  "/work",
  "/approach",
  "/writing",
  "/about",
  "/simple",
  "/work/iport",
  "/work/coco",
  "/work/cross-currency",
  "/work/valuation",
  "/work/fx-compression",
  "/work/margin-simulator",
  "/work/platform",
  "/work/ridelens",
  "/work/raildrop",
  "/work/daylight",
  "/ridelens",
  "/raildrop",
  "/daylight",
  "/agentfit",
  "/opportunity-os",
]);

function cleanPath(pathname) {
  if (!pathname || pathname === "/") return "/";
  return pathname.replace(/\/+$/, "") || "/";
}

export default async function middleware(request) {
  const url = new URL(request.url);
  const path = cleanPath(url.pathname);

  // Legacy renames / product bookmarks (must run here: middleware precedes vercel.json redirects)
  if (path === "/work/agentfit") {
    return Response.redirect(new URL("/work/ridelens", url.origin), 308);
  }
  if (path === "/work/opportunity-os") {
    return Response.redirect(new URL("/work/raildrop", url.origin), 308);
  }
  if (path === "/apps/agentfit" || path.startsWith("/apps/agentfit/")) {
    return Response.redirect("https://ride-lens2.vercel.app/", 307);
  }
  if (path === "/apps/opportunity-os" || path.startsWith("/apps/opportunity-os/")) {
    return Response.redirect("https://rail-drop3.vercel.app/", 307);
  }

  if (KNOWN.has(path)) return;

  const shell = new URL("/index.html", url.origin);
  const response = await fetch(shell);
  return new Response(response.body, {
    status: 404,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}
