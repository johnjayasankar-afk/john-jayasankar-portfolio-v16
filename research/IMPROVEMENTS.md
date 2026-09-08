# Improvement log (private)

Not served publicly. Cumulative notes for portfolio cycles.

## 2026-09-08 — Final polish (lines, images, fit)

### Direction considered

1. **Layout hygiene** (chosen) — Kill lines through text/logos, stop mobile clipping, soften target accents, tighten portrait presentation. Content already strong.
2. **Visual redesign** — Deferred; not needed for this pass.
3. **New features** — Deferred.

### What changed

- **Simple mobile timeline**: Stack date → logo → copy; rail left of content (not through logos/years); fuller copy width.
- **Simple desktop**: Larger logo inset away from rail; cleaner hr; portrait ring.
- **Complex mobile**: Smaller gutters; removed machine `min-height` fighting aspect-ratio; hero overflow-x clip only; lede wraps with `overflow-wrap`.
- **Target/focus accents**: Soft background + ID tick instead of full-height inset rules through Work IDs.
- **Toast**: Moves under header so it cannot cover About body copy.
- **Portraits**: Slightly larger About plate; GPU-friendly paint on hero/about images.
- **SystemsCore**: Market labels lifted clear of the ring.

### Verified

- `npm run build` succeeded.
- Puppeteer @ 390×844: `overflow: 0` on Home + Simple; full phrases present (`financial infrastructure`, `financial workflows`); Simple entries `display:flex; flex-direction:column`.
- Work: soft row highlight, no continuous vertical rule through JJ-SYS IDs.
- Preview `http://127.0.0.1:4173/` → 200.
- Zips: refreshed final + production (+ Downloads `20260908-1424`).

### Gaps / next opportunities

- Higher-res portrait asset from John still the main content upgrade.
- Optional Safari embed-still check for RideLens/RailDrop.

---

## 2026-09-08 — Case diagram literacy (I-Port / CoCo / SwapAgent)

### Direction considered

1. **Case diagram literacy** (chosen) — Bring I-Port, CoCo, and CompressNet to the same teaching bar as SystemsCore: numbered zones, larger type, stacked mobile layouts; kill mid-animation metric zeros on case pages.
2. **Full visual redesign** — Deferred; carbon/porcelain still holds.
3. **New interaction toys** — Deferred; improve existing diagrams first.

### What changed

- **`useCompactStage`** extracted to `src/util/compactStage.ts` (shared with SystemsCore).
- **IPortPlane / CocoTrace / CompressNet**: Desktop three/four-zone panels; compact stacked teaching cards ≤980px; CompressNet uses 8 banks with always-visible alternate labels.
- **HUD notes**: Clearer Before/Gate/After and Incident/Evidence/Diagnose copy.
- **Case + SystemStage metrics**: `animate={false}` so recruiting skim never sees `0.0h → 0m`.
- **CSS**: Case/sys machine min-height on mobile for stacked SVGs.
- **MAINTENANCE.md**: Notes shared compact helper.

### Verified

- `tsc --noEmit` + `npm run build` succeeded.
- Preview `http://127.0.0.1:4173/` → 200.
- DOM I-Port: `3.5h → 8m`, `01 · Before`, `Before: senior` — no `0.0H`.
- Routes 200: `/`, `/work`, `/work/iport`, `/work/coco`, `/work/cross-currency`, `/work/ridelens`, `/about`.
- Screenshots: `.audit/cycle-case-literacy/` (before/after desktop + mobile).
- Zips: refreshed final + production (+ Downloads).

### Gaps / next opportunities

- Higher-res portrait still needs an asset from John.
- Optional: Safari blocked-embed still UI for RideLens/RailDrop.
- Supporting diagrams (FX / Valuation / What-If) can get the same compact treatment if skim stalls there.

---

## 2026-09-08 — Hero systems-core literacy (diagram clarity)

### Direction considered

1. **SystemsCore literacy** (chosen) — Redesign the home thesis diagram for readable labels, explicit 01–03 zones, mobile stacked teaching layout; tighten HUD copy. No full visual redesign.
2. **Full visual redesign** — Deferred; carbon/porcelain still recruits once the diagram teaches.
3. **New interaction toys** — Deferred; improve the existing silhouette before adding more.

### What changed

- **SystemsCore wide**: Three zone panels (Agents / Gate / Market), larger type, 8-bank ring (was 12), clearer pair callouts, “illustrative silhouette” footnote.
- **SystemsCore compact** (≤980px): Stacked cards with the same story + simplified 6-node market ring — readable without pinch-zoom.
- **HUD notes**: Recruiting-clear phase copy (hours→minutes / approval / $6.5T eligible).
- **Mobile hero CTAs**: Slightly tighter button padding so About isn’t clipped.
- **MAINTENANCE.md**: Documents dual SystemsCore layouts.

### Verified

- `tsc --noEmit` + `npm run build` succeeded.
- Preview `http://127.0.0.1:4173/` → 200.
- Browser: Agents / Gate / Market HUD notes update; Gate + Market pressed states work.
- Before/after screenshots: `.audit/cycle-hero-clarity/` (`before-home`, `after-home`, `before-home-m`, `after-home-m`).
- Mobile after: stacked “01 · Production agents” / “02 · HITL” readable; desktop after: three zones visible beside identity.
- Zips: refreshed final + production (+ Downloads).

### Gaps / next opportunities

- Higher-res portrait still needs an asset from John.
- Optional: Safari blocked-embed still UI for RideLens/RailDrop.
- Case-study diagrams (I-Port / CoCo / Compress) still denser than the new home thesis — next literacy pass if recruiting skim stalls there.

---

## 2026-09-08 — Presence primacy (portrait, strip off chrome, contact)

### Direction considered

1. **Presence primacy** (chosen) — Larger hero portrait from existing asset; move employer investor strip off global chrome onto About with explicit framing; eager Home/About so first paint is John; sharpen contact close.
2. **Full visual redesign** — Deferred; carbon/porcelain still recruits well once logos stop competing.
3. **New diagram toys** — Deferred; 10-second identity clarity outranks new interactions.

### What changed

- **Hero portrait**: 168px desktop / 112px mobile (was ~72–88px); sizes attribute updated.
- **Investor strip**: Removed from Layout chrome. On About only (`BackersStrip inPage`), framed as institutional context — not personal funding.
- **Eager routes**: Home + About static imports so recruiting entry points skip the loading shell.
- **Contact**: Specific hiring close (“production AI or market infrastructure”).
- **`#content`**: `padding-top: var(--header)` now that strip no longer clears the fixed header.
- **MAINTENANCE.md**: Documents strip placement.

### Verified

- `npm run build` succeeded.
- Preview `http://127.0.0.1:4173/` → 200 (serving current dist).
- Before/after home: employer strip gone from first viewport; name/portrait/career/metrics remain.
- DOM: Home has no “Employer investors”; About has Institutional context + `backers--inpage`; contact headline present.
- Work/Approach also free of chrome strip.
- Screenshots: `.audit/cycle-close/` (`before-home`, `after-home`, `after2-home`, `after-about`, …).
- Zips: refreshed final + production (+ Downloads).

### Gaps / next opportunities

- Higher-resolution / alternate crop portrait still valuable if John supplies one (current asset is 768²).
- Optional: Safari check of blocked-embed stills for RideLens/RailDrop.
- Index chunk grew with eager Home+About — acceptable for recruiting paint; revisit code-split only if Lighthouse regresses.

---

## 2026-09-08 — Hiring-manager Work path (facets, stills, Approach→cases)

### Direction considered

1. **Hiring-manager Work path** (chosen) — Capability filters (Agents / Markets / Independent), clearer ledger ownership, static embed stills, Approach principles linked to cases.
2. **Visual redesign** — Deferred; carbon/porcelain still holds.
3. **New diagram toys** — Deferred; routing/evidence clarity over new surfaces.

### What changed

- **Work facets**: All · Agents · Markets · Independent (`?d=`). Legacy `?d=quantile|opengamma` kept. Ledger shows role line + company · year. Metrics render immediately (`animate={false}`); Reveal immediate so ledger never paints empty.
- **Locus fix**: Facet locus only names cases in the filtered set (no “Agents · Daylight”).
- **ProductPreview**: Still posters in `public/previews/` for RideLens/RailDrop (poster while loading; full-bleed still + CTA if embed blocked).
- **Approach + Home**: Principles carry “In the work” links to related cases.
- **MAINTENANCE.md**: Documents Work facets and stills.

### Verified

- `npm run build` succeeded.
- Preview `http://127.0.0.1:4173/` → 200 (kept running).
- DOM: facets + counts; Independent 3 cases; Approach/Home “In the work”; RideLens/RailDrop iframes; metrics `3.5h → 8m` / `750+` / `$6.5T` (not mid-animation zeros).
- Browser: Independent facet pressed; locus `01/03 · RideLens`; primary nav Work · Approach · About; Résumé link present.
- Screenshots: `.audit/cycle-work-path/` (`work-after`, `work-agents-after`, `work-m-after`, `approach-after`, `ridelens-live-after`).
- Live products RideLens / RailDrop → 200.
- Zips: refreshed final + production (+ Downloads stamped).

### Gaps / next opportunities

- Larger hero portrait still needs an asset from John.
- Optional: verify blocked-embed still UI in a frame-denying browser (manual Safari check).
- Watch RailDrop embed on real mobile Safari.

---

## 2026-09-08 — Independent products depth (Daylight literacy + live embeds)

### Direction considered

1. **Independent building as evidence** (chosen) — Daylight literacy to peer bar; in-page RideLens/RailDrop live previews; mobile scrub no longer sticky.
2. **Visual redesign** — Deferred; carbon/porcelain holds.
3. **Iframe Daylight** — Impossible (frame-ancestors none / macOS app); honest open-site path instead.

### What changed

- **Daylight case**: In plain terms / What I owned / How it was built; `featured: false` (ledger only); stronger summary.
- **DaylightPlane**: Explain teaching default; plain captions; conceptual footer; HUD notes clarity.
- **ProductPreview**: sandboxed iframe for RideLens & RailDrop on case “Try the live product”; labeled live-not-mock; open full-size CTA retained.
- **Mobile**: case-scrub `position: relative` (was sticky) so hero landing is not stolen; `--scrub: 0`.
- **MAINTENANCE.md**: embed rules documented.

### Verified

- `npm run build` succeeded.
- Preview `http://127.0.0.1:4173/` → 200.
- DOM: Daylight literacy + Explain/Conceptual; RideLens/RailDrop iframe + “Live product preview”; Daylight no embed + macOS copy.
- CDP: `#live` shows working RideLens UI in-frame; scrubPos relative on mobile.
- Screenshots: `.audit/cycle-independents/`.

### Gaps / next opportunities

- Larger hero portrait still needs an asset from John.
- Optional: capture curated static product stills as fallback when embeds fail in locked-down browsers.
- Watch RailDrop embed on real mobile Safari.

---

## 2026-09-08 — Recruiting path clarity (About↔cases, Writing demotion, Diff default)

### Direction considered

1. **Recruiting journey clarity** (chosen) — Experience→case links with proof metrics; Writing out of primary nav to match thesis depth; platform literacy; valuation Diff teaching default; email on home hero.
2. **Visual redesign** — Deferred; carbon/porcelain still holds.
3. **New diagram toys** — Deferred; fix story defaults over new surfaces.

### What changed

- **About**: “Selected cases from this role” above role bullets, each with primary metric; Quantile Reveal immediate so first viewport shows evidence.
- **Nav**: Primary = Work · Approach · About. Writing remains at `/writing`, footer, mobile menu, and command palette.
- **Writing page**: Framed as “Three notes… not full essays.”
- **Platform case**: In plain terms + What I owned; stronger summary.
- **Valuation**: Diff teaching default on empty-hash case load (rest); broken story still shows Before when scrolled.
- **Home**: Copy-email under hero CTAs.
- **MAINTENANCE.md**: documents primary nav rule.

### Verified

- `npm run build` succeeded.
- Preview `http://127.0.0.1:4173/` → 200 (kept running).
- DOM: nav Writing absent / footer Writing present; About selected cases + metrics; valuation “outside the band” / Diff; platform literacy; Writing “Three notes”.
- Screenshots: `.audit/cycle-recruit-clarity/after-*.png`.
- Live products RideLens / RailDrop / Daylight → 200.
- Zips: `opportunity-os/john-jayasankar-website-final.zip` + production (+ stamped).

### Gaps / next opportunities

- Larger hero portrait still needs an asset from John.
- Case sticky scrub vs hero collision on real mobile deploy — watch.
- Daylight case still lighter on “In plain terms” than peers.
- Optional: in-portfolio product preview frames for RideLens/RailDrop.

---

## 2026-09-08 — Valuation / FX / what-if literacy + role TOC fix

### Direction considered

1. **Raise remaining fintech diagrams to I-Port literacy bar** (chosen) — ReconcilePlane, FxMatrix, WhatIfEngine + matching case “In plain terms” / “What I owned”.
2. **New interactive toys** — Deferred; literacy on existing surfaces wins.
3. **Visual redesign** — Still deferred; carbon/porcelain holds.

### What changed

- **ReconcilePlane**: plain captions (Before → Split → Diff → Lock); always-visible 48h → −91%; `$6T+ cycle notional · 24 banks`; conceptual footer (notional ≠ revenue).
- **FxMatrix**: NDF plain language; gate plain questions; 40+ → 100% / −94% framing; conceptual footer.
- **WhatIfEngine**: Inc vs Alone legend; “up to −30%” as observed potential, not guaranteed; illustrative compare footer.
- **Cases** `valuation`, `fx-compression`, `margin-simulator`: “In plain terms” + “What I owned”; summaries lead with consequence.
- **ArtifactHud** notes for valuation / FX / capital aligned to literacy.
- **Second pass**: Case TOC / closing section renamed **Role & tags** so it no longer duplicates block title “What I owned”.

### Verified

- `npm run build` succeeded (fixed unused `booked` in FxMatrix).
- Preview `http://127.0.0.1:4173/` → 200.
- Headless Chrome DOM: In plain terms / What I owned / cycle notional / not revenue / Conceptual workflow / non-deliverable / not a guaranteed / John Jayasankar.
- Screenshots: `.audit/cycle-literacy-fintech/` (home, valuation, fx, margin, work, about; mobile home/valuation; tall case bodies).
- Live products: RideLens, RailDrop, Daylight Vercel URLs → 200.

### Gaps / next opportunities

- Writing remains short theses — do not inflate.
- Optional: larger hero portrait from John.
- Watch case-hero vs sticky chrome on real deploy scroll.
- Optional: deeper HUD walkthrough demos for valuation Diff/Lock default story.

---

## 2026-09-08 — Fintech literacy + CoCo featured + ship zips

### Direction considered

1. **Literacy + AI evidence** (chosen) — Make cross-currency understandable to non-fintech readers; promote CoCo into the homepage featured set for AI hiring clarity; ship verified zips.
2. **New diagram toys** — Deferred; CompressNet/CoCo improvements beat new surfaces.
3. **Visual redesign** — Still deferred; presence-first carbon holds.

### What changed

- Homepage featured: **I-Port → CoCo → cross-currency → RideLens → RailDrop** (Daylight moves to “Also shipped”).
- **CompressNet**: plain-language before/run/after captions; always-visible `$6.5T eligible notional · not revenue`; legend for pairwise vs network vs risk envelope; conceptual disclaimer.
- **CompressHud** notes explain eligible notional ≠ cash saved.
- **Cross-currency case**: “In plain terms” + “What I owned” blocks; metric label “eligible notional unlocked”.
- **CoCo**: featured; clearer summary; “What I owned” block; diagram always shows `4.5h → 11m` with conceptual footer; stronger HUD notes.
- Home featured lede updated to match the five-system mix.

### Verified

- `npm run build` succeeded.
- Preview on `http://127.0.0.1:4173/` (restarted after zip; confirm 200).
- Headless screenshots: `.audit/cycle-literacy/` (home, mobile, cross-currency, coco, about, ridelens).
- DOM: QT CoCo on home; In plain terms / eligible notional / not revenue / Conceptual diagram; CoCo What I owned / 4.5h→11m.
- Live RideLens, RailDrop, Daylight → HTTP 200.
- Zips written:
  - `opportunity-os/john-jayasankar-website-final.zip` (source + dist, no node_modules)
  - `opportunity-os/john-jayasankar-website-production.zip` (+ stamped production zip)
  - Copies in `~/Downloads/` when available.

### Gaps / next opportunities

- Valuation / FX diagrams still denser than I-Port/CoCo literacy bar.
- Writing remains short theses — do not inflate.
- Optional: larger hero portrait from John.
- Watch case-hero vs sticky chrome on real deploy scroll.

## 2026-09-08 — Diagrams teach + mobile identity first

### Direction considered

1. **Improve existing instruments** (chosen) — Redesign I-Port / RideLens / RailDrop so default state teaches; label illustrations honestly; demote investor strip on mobile. Highest credibility gain per hour.
2. **New interaction toys** — Extra sims beyond content support. Rejected this cycle (risk of fake “demo theater”).
3. **Full visual redesign** — Deferred; presence-first carbon from prior cycle still holds.

### What changed

- **I-Port**: Before → Gate → After plane with always-visible `3.5h → 8m`, labeled columns, conceptual-workflow footer. HUD steps renamed Before / Gate / After.
- **RideLens**: Illustrative ranking board; “Why #1 changed” line; fare + ETA columns; open-product disclaimer.
- **RailDrop**: Explicit alert rule copy; “Triggers alert” / “Beats paid” labels; illustrative disclaimer.
- **Cases**: At-a-glance line (company · stage · year · role); RideLens/RailDrop “How it was built” blocks (Cursor + ownership, modeled vs live).
- **Mobile**: Employer investors strip reordered below page content (`flex` order) so identity wins the first viewport. Desktop strip unchanged under header. Label remains “Employer investors & acquirers.”

### Verified

- `npm run build` succeeded.
- Preview `127.0.0.1:4173`; headless Chrome screenshots in `.audit/cycle-diagrams/` (home desktop/mobile, I-Port, RideLens, RailDrop).
- DOM: Before/Gate/After, Conceptual workflow, Illustrative / Why #1 changed, Alert rule, case-glance, How it was built.
- Live products HTTP 200: RideLens, RailDrop, Daylight.
- Mobile first viewport no longer led by logo ticker (identity + CTAs first).

### Gaps / next opportunities

- CoCo still compact on home — promote if agentic hiring is the primary audience.
- Cross-currency CompressNet readability pass (eligible notional literacy) next diagram candidate.
- Writing still short theses only — keep as notes until authorized essays exist.
- Optional: larger hero portrait crop from John.
- Case page hero still can collide with sticky chrome on some hash/scroll timings (pre-existing; watch on deploy).

## 2026-09-08 15:02 · last polish pass
- Removed em/en dashes from site copy (simple + complex); ranges use hyphens.
- Proof metrics strip: removed vertical rules; uniform gap spacing.
- Fixed section is-target wash that replaced sheet/chamber fills (dark text on carbon while scrolling).
- Header cream probe samples mid-upper viewport so chrome flips less early.
- SystemsCore / CompressNet: stats + legend fully above ring.
- IPort: Actions below flow rail; no arrow through Bind/Assemble.
- CocoTrace: continuous rails both sides of Diagnose.
- RailDrop: Triggers alert under price.
- About: portrait fills intro column; wider intro grid.
- Approach: principle rules + related rows full width; ladder full-width under intro.

## 2026-09-08 15:06 · backers strip restored
- Employer investors & acquirers marquee returns under the fixed header on all Layout pages.
- In document flow (not sticky); scrolls away with the page.
- Excluded from /simple (outside Layout).
- Removed duplicate mid-page strip on About; context copy remains and points to the top strip.

## 2026-09-08 — Diagram polish (overlap + scroll stretch)

### Direction considered

1. **Geometry + flex lock** (chosen) — Fix SVG coordinates so text never sits on borders/rails; stop `.machine` flex-grow from fighting `aspect-ratio` (was vertically warping diagrams when scrolling section-to-section).
2. **Redraw diagrams** — Deferred; existing story frames are correct.
3. **Content changes** — None; metrics unchanged.

### What changed

- **Scroll stretch**: `.machine` is `flex: 0 0 auto` with `height: auto`; Frame sets `flexGrow/Shrink: 0`; SVG `overflow: visible` (was `hidden` clipping rings). Restored `.sys-visual` as a column flex container.
- **SystemsCore**: Ring raised/shrunk fully inside Market box; HITL rotated about box center; flow rail starts past agent copy (no “triage” strike); tighter `3.5h→8m` metrics.
- **IPortPlane**: Compact `3.5h → 8m` cluster; Context→HITL rail between rows (clears “config”); Bind/Assemble/3.5h/8m lifted inside panels; HITL centered.
- **CocoTrace**: Left diagnose rails mirror right geometry (372/364 + diagonals at y=128/240); tighter header metrics; outcome/ops padding.
- **CompressNet**: Smaller ring + bottom labels pushed off the envelope (BNPP readable).
- **FxMatrix**: Four-sources hub moved; gate subtitle split; cell copy inset from cell bottoms.
- Audit pass on RailDrop / RideLens / Reconcile / Daylight / WhatIf / ControlStack — no further overlap fixes needed.

### Verified

- `npm run build` succeeded.
- Playwright geometry @ 1440×900:
  - SystemsCore aspect 2.3334 ≈ 840/360 (no stretch); ring clearance 48px inside Market box; flow y=192 vs “Incident triage” y=238; HITL `translate(260 192) rotate(-90)`.
  - IPort Bind/Assemble/Authorize at y=274 vs panel bottom 316; header metric clustered as `3.5h→8m`.
  - Coco left diagonals mirror right `(372,128|240)→(408,176)`; rails split at junctions.
  - CompressNet BNPP y=322 with 38px gap below envelope.
- Preview: `http://127.0.0.1:4173/`

### Gaps / next opportunities

- Optional Safari still-check for RideLens/RailDrop embeds.

## 2026-09-08 — Final nits (scroll shift, CoCo, FX, Daylight)

### What changed

- **Scroll left/enlarge**: `.is-target` was setting `padding-left: 0`, which dropped the page gutter when a section became active and made the hero diagram widen and jump left. Removed. Added `scrollbar-gutter: stable` on `html`.
- **CoCo footer**: Single `m-k` line `Returned 750+ senior eng hours / year` (no oversized `m-num`, no middle-dot placeholder, no `eng.` period).
- **ForexClear**: Four-source hub retitled to the left of the cross; labels outside nodes with directional anchors.
- **Daylight**: End hour label `24` (not dotted `00`); cursor can reach chart end; hollow anchor marks; solid connector (no dashed double-hit at the tip).
- **Stray dots**: RailDrop/RideLens idle marks `·` → `—`; machine text disables dotted-zero features.

### Verified

- Playwright: hero `padL` stays `64px` and machine width `670.7` across scrollY 0→1500 with `is-target` on.
- CoCo footer text is one clean string.
- `npm run build` succeeded. Preview `http://127.0.0.1:4173/`.


## 2026-09-08 — Diagram final pass (SwapAgent / ForexClear / RailDrop / Daylight)

- **SystemsCore**: Flow rail y1=y2; hub cy aligned to HITL/flow; bank label **CITI** (not Citi).
- **FxMatrix**: Hub parked top-right (cx=730); gate column ends ≤592; Four sources / Bank / Clearing / Internal / n/a bbox-checked clear.
- **RailDrop**: Alert caption left of paid line; prices in priceCol; Triggers in statusCol — no shared bboxes.
- **Daylight**: Hour 24 end-anchored; CHART_END inset (panel clearance ~76 SVG units).
- Verified via Playwright getBBox + preview on :4173.
