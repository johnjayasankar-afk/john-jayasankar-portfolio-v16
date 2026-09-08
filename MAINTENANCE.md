# Maintenance guide

Private operational notes for updating johnjayasankar.com. Not linked from the site.

## Single source of truth

| What | Where |
| --- | --- |
| Name, role, email, résumé, photo, career line | `src/data/content.ts` → `person` |
| Case studies, metrics, chips, live URLs | `src/data/content.ts` → `cases`, `liveProducts` |
| Homepage featured order | `src/data/content.ts` → `featuredHomeSlugs` (+ `featured: true` on cases) |
| Experience ↔ case links | `src/data/content.ts` → `experience[].related` |
| Writing theses | `src/data/content.ts` → `writing` |
| Approach principles | `src/data/content.ts` → `principles` |
| SEO titles / descriptions | `src/lib/site.ts` |
| Product visuals / HUDs | `src/artifacts/*`, `src/scene/kinds.ts` |

## Common updates

1. **Replace résumé** — overwrite `public/John_Jayasankar_Resume.pdf` (path in `person.resume`).
2. **Replace portrait** — overwrite `public/john-jayasankar.jpg` (keep square crop; object-position is tuned in CSS).
3. **Add a case** — append to `cases`, add `kindForSlug` mapping if it needs a diagram, optional route aliases in `App.tsx` / `vercel.json` for live products.
4. **Feature on homepage** — add slug to `featuredHomeSlugs` (order matters) and set `featured: true`. Remaining cases appear in the compact ledger. Current featured set: I-Port, CoCo, cross-currency, RideLens, RailDrop. Daylight stays in the ledger (macOS app).
5. **Update a claim** — edit the case once; homepage stages and Work ledger read from the same object.
6. **Primary nav** — Work · Approach · About. Writing stays at `/writing`, footer, mobile menu, and command palette (short theses only).
7. **Live product embeds** — RideLens and RailDrop embed on their case pages (`ProductPreview`). Still posters in `public/previews/`. Daylight cannot (frame-ancestors none / macOS app).
8. **Work facets** — All · Agents · Markets · Independent (`?d=`). Legacy `?d=quantile|opengamma` still filter by employer.
9. **Investor strip** — Lives on About only (`BackersStrip` with `inPage`), not in global chrome. Label: employer investors & acquirers — not personal funding.
10. **Hero systems diagram** — `SystemsCore` switches to a stacked teaching layout under 980px; desktop keeps the three-zone Agents → Gate → Market silhouette. Metrics must stay in sync with `cases`.
11. **Case diagrams** — I-Port, CoCo, and CompressNet share `useCompactStage` (`src/util/compactStage.ts`). Keep claim qualifiers (`eligible notional`, conceptual footnotes) when editing SVG copy.

## Do not publish

- `.audit/`, `research/`, improvement logs, drafts, evidence notes
- Invented metrics, testimonials, or first-person essays without review

## Verify before ship

```bash
npm run build
npx vite preview --host 127.0.0.1 --port 4173
```

Walk: home identity → featured case → independent product → About experience → résumé → email.
