# John Jayasankar personal site

Vite + React + TypeScript. Ready for GitHub and Vercel.

The live products **AgentFit** and **Opportunity OS** ship inside this folder at `public/apps/` (copied into `dist/apps/` on build). They are the current working apps, not demos.

## Design system

- Grid: `--gutter` 20–40px, `--wide` 1760px
- Space: 8 / 16 / 24 / 40 / 64 / 96
- Type: Schibsted Grotesk + IBM Plex Mono, tracking `--track` 0.14em
- Color: carbon `#09080c`, porcelain `#f1ece4`, ink `#121014`; text `--fg-2` 64%, `--fg-3` 45%
- Motion: `--ease` cubic-bezier(0.22, 1, 0.36, 1); `--dur-ui` 0.25s, `--dur-chrome` 0.35s
- Corners: 0. Marks: `currentColor`. Instruments are 2D SVG.

## Deploy on Vercel

1. Unzip this folder. The unzipped folder is the repo root (`package.json` at the top level).
2. Confirm `public/apps/agentfit/` and `public/apps/opportunity-os/` exist (the live products).
3. Push it to a new GitHub repo.
4. In [Vercel](https://vercel.com/new), import that repo.
5. Leave the defaults: Framework **Vite**, build `npm run build`, output `dist`.
6. Deploy. `vercel.json` rewrites the marketing site to `index.html` and the nested apps to their own `index.html`. Static assets under `/apps/*/assets/` are served as files.

Live product URLs:

- `/apps/agentfit/`
- `/apps/opportunity-os/`

`/agentfit` and `/opportunity-os` redirect to those apps.

## Run locally

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173` if that port is free. This repo’s Vite should be started from this folder with `--config ./vite.config.ts` so you do not accidentally serve the parent Opportunity OS app.

If you rebuild the nested products from the sibling repos:

```bash
bash scripts/embed-products.sh
```
