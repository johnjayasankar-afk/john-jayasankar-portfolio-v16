import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

const CASE_SLUGS = [
  "iport",
  "coco",
  "cross-currency",
  "valuation",
  "fx-compression",
  "margin-simulator",
  "platform",
  "ridelens",
  "raildrop",
];

const PATHS = [
  "/",
  "/work",
  "/approach",
  "/writing",
  "/about",
  ...CASE_SLUGS.map((s) => `/work/${s}`),
];

function siteMeta(origin: string): Plugin {
  const abs = (path: string) => `${origin}${path === "/" ? "/" : path}`;

  return {
    name: "site-meta",
    transformIndexHtml(html) {
      if (!origin) return html;
      return html
        .replace('href=""', `href="${abs("/")}"`)
        .replace('property="og:url" content=""', `property="og:url" content="${abs("/")}"`)
        .replaceAll("/john-jayasankar.jpg", `${origin}/john-jayasankar.jpg`);
    },
    closeBundle() {
      if (!origin) return;
      const dist = resolve(fileURLToPath(new URL(".", import.meta.url)), "dist");
      const urls = PATHS.map(
        (path) => `  <url>\n    <loc>${abs(path)}</loc>\n    <changefreq>monthly</changefreq>\n  </url>`,
      ).join("\n");
      writeFileSync(
        resolve(dist, "sitemap.xml"),
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
      );
      writeFileSync(resolve(dist, "robots.txt"), `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`);
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, fileURLToPath(new URL(".", import.meta.url)), "");
  const origin = (env.VITE_SITE_URL || "").replace(/\/$/, "");

  return {
    root: fileURLToPath(new URL(".", import.meta.url)),
    plugins: [react(), siteMeta(origin)],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
  };
});
