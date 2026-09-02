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
  "agentfit",
  "opportunity-os",
];

const PATHS = [
  "/",
  "/work",
  "/approach",
  "/writing",
  "/about",
  "/agentfit",
  "/opportunity-os",
  "/apps/agentfit/",
  "/apps/opportunity-os/",
  ...CASE_SLUGS.map((s) => `/work/${s}`),
];

function nestedAppFallback(): Plugin {
  const apps = [
    { prefix: "/apps/agentfit", file: "/apps/agentfit/index.html" },
    { prefix: "/apps/opportunity-os", file: "/apps/opportunity-os/index.html" },
  ];

  const handle = (req: { url?: string }, _res: unknown, next: () => void) => {
    const url = (req.url ?? "").split("?")[0];
    const match = apps.find(
      (app) => url === app.prefix || url === `${app.prefix}/` || url.startsWith(`${app.prefix}/`),
    );
    if (!match) {
      next();
      return;
    }
    const rest = url.slice(match.prefix.length);
    if (rest.includes(".") && !rest.endsWith(".html")) {
      next();
      return;
    }
    req.url = match.file;
    next();
  };

  return {
    name: "nested-app-fallback",
    configureServer(server) {
      server.middlewares.use(handle);
    },
    configurePreviewServer(server) {
      server.middlewares.use(handle);
    },
  };
}

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
    plugins: [react(), nestedAppFallback(), siteMeta(origin)],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
  };
});
