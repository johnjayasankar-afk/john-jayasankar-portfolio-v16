# John Jayasankar personal site

Vite + React + TypeScript. Ready for GitHub and Vercel.

Live independent products are linked out to their own Vercel deployments:

- [RideLens](https://ride-lens2.vercel.app/) — every ride, one comparison
- [RailDrop](https://rail-drop3.vercel.app/) — know when your train gets cheaper

Case studies live on this site at `/work/ridelens` and `/work/raildrop`. Short paths `/ridelens` and `/raildrop` redirect to the live apps.

## Design system

- Grid: `--gutter` 20–40px, `--wide` 1760px
- Space: 8 / 16 / 24 / 40 / 64 / 96
- Type: Schibsted Grotesk + IBM Plex Mono, tracking `--track` 0.14em
- Color: carbon `#09080c`, porcelain `#f1ece4`, ink `#121014`; text `--fg-2` 64%, `--fg-3` 45%
- Motion: `--ease` cubic-bezier(0.22, 1, 0.36, 1); `--dur-ui` 0.25s, `--dur-chrome` 0.35s
- Corners: 0. Marks: `currentColor`. Instruments are 2D SVG.

## Deploy on Vercel

1. Unzip this folder. The unzipped folder is the repo root (`package.json` at the top level).
2. Push it to a new GitHub repo.
3. In [Vercel](https://vercel.com/new), import that repo.
4. Leave the defaults: Framework **Vite**, build `npm run build`, output `dist`.
5. Deploy. `vercel.json` rewrites the marketing site to `index.html` and redirects product shortcuts to the live apps.

## Run locally

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173` if that port is free. Start Vite from this folder with `--config ./vite.config.ts` so you do not accidentally serve a sibling app.
