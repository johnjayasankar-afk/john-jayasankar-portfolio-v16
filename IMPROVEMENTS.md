# Improvement log

One entry per improvement cycle. Newest first. Each records what shipped, what
was actually verified, what is still open, and where the next cycle should look.

---

## Cycle 14 - 2026-09-13 · Final pass: covers, principles, story detail

**Why this.** John asked for one final pass over every project animation, and for
the three writing images and the three Approach principles to match the site's
palette, themes and motion.

### Shipped

**1. Writing covers.** The three gradient covers (purple, orange and green, none
of them in the palette) became animated schematic stages, built by the new
`tools/ideas.py`:
- *Routing intelligence*: a user action at low, routine or high stakes goes
  through a router to rules, a small model or a frontier model, the route drawing
  in and the tier lighting up, captioned "A unit-economics decision".
- *Earned autonomy*: an agent scope card on the six rungs of the Approach ladder.
  Evidence, reversibility and control check in one by one, then the scope
  advances a rung past its lock.
- *Infrastructure first*: data quality, APIs, entitlements and workflow design
  check in from the bottom as a scan passes, then the model ships.

**2. Principles on Approach (and the home page).** The black line drawings became
stages in the same language:
- *Start with the workflow*: a request travels the handoff to an outcome, then
  down the dashed exception path with "Cost of being wrong", then every node is
  mapped and only then "Then choose a model".
- *Agents should earn autonomy*: the ladder's rungs as rising bars, an evidence
  meter filling, the next rung locked in amber until the agent climbs to it.
- *Reliability is a feature*: faults caught at validation and at evals, operator
  visibility lit, Live clear and Cleanup struck through.

Covers and drawings carry no figures and no claims about a system: their labels
are each note's or principle's own words and the Approach ladder's rungs. They are
decorative to assistive technology, since each card says the same in words.

**3. Stories, final pass.**
- The pointer that presses a button now carries a name tag: Operator releases the
  I-Port gate, Human approves at the home gate and the platform's HITL layer, Desk
  simulates the OpenGamma trade, You compare rides and watch a trip.
- Attention moves through the rows: a soft light sweeps each row as the agent
  reaches it (I-Port, QT CoCo, ForexClear), and an amber wash holds on a row
  waiting on a person or a gate.
- QT CoCo's decision row fills an evidence packet while facts arrive. LCH
  SwapAgent draws its reduction per run as two bars, bilateral against
  multilateral at the case's 1 : 1.34. The platform's dashed spine flows while a
  request travels down it.

**4. Cards and pausing.** Stories on the Labs band and the Work page, and all six
ideas, now run on the bays' shared clock: a thin progress line shows their phases,
Work rows light the current phase name under the story, and anything paused under
the pointer shows a small Paused pill. A bay held on a phase does not.

**5. The stage breathes.** Each stage's tinted light sits on its own layer and
drifts slowly, pausing off screen and absent under reduced motion.

**6. Removed and regenerated.** The gradient cover CSS, the film grain, the
cover titles and the principle line-art SVGs are gone. Thumbnails and the social
card were captured again from the finished stories.

### Verified

Headless Chrome over the DevTools protocol against the local build:

- **Every story phase (40 lab pages) and every idea phase (18) at their card
  sizes**: nothing spills past its stage, no truncated titles. Stories still grow
  10 to 11px in a 700px frame instead of clipping, as before.
- **Real pages at 1440, 1024 and 390** (home, Approach, Writing, Work, Labs,
  Platform): layout width equals viewport width, no spills, no truncation.
- **Behaviour**: a writing cover shows three progress segments filling, advances,
  shows Paused and holds under the pointer, and clears on leaving; a principle
  advances in view; Work phase names match the story's phase; a bay shows Paused
  on hover and not once a phase is held. With reduced motion there are no
  progress lines, covers and principles rest complete, and nothing waits to
  arrive.
- **The cycle 10 audit set**: one `h1`, no skipped headings, no duplicate ids, no
  broken images, no console errors apart from the 404 page's own 404. 3,143 text
  elements checked for contrast; the only flags are the known home proof figures.
- **Caught and fixed on the way**: the "Cost of being wrong" chip overlapped the
  Exception node; later rows and layers painted over the pointer name tags on
  I-Port and the platform (the active row now rises above its neighbours); the
  reliability drawing read small and gained a caption and larger checkpoints; the
  multilateral bar was labelled "Network", which clashed with the network row.

### Not verified

- How the motion feels on a real device with a physical mouse. It was checked as
  timed captures, sampled opacities and dispatched pointer events.
- Safari and Firefox. The pointer lift and the locked-rung styling use `:has()`;
  without it the pointer can sit under the next row and the lock shows alone.

---

## Cycle 13 - 2026-09-13 · Stories, finished

**Why this.** John loved the stories and asked what else would make them, and
the site, feel complete, polished and sleek, and to add it to every one of them.

### Shipped

**1. Detail in every story, all taken from the case copy.**
- Home showcase: each agent card's bar falls to its real ratio (8 of 210
  minutes, 11 of 270), a typed action travels into the gate and on to the
  market, and a pointer presses Approve.
- I-Port: the operator row starts as "Owned by senior engineering", a pointer
  presses Release at the gate, checks settle row by row, and setup runs down from
  210 minutes to 8.
- QT CoCo: the incident rings "Paging engineering" before any evidence, run and
  ops facts arrive in order with noise struck out, time runs down from 270
  minutes to 11, and escalations count to −78%.
- LCH SwapAgent: a scan circles the hub while the run settles offsets, and +34%
  counts up.
- Simplified Compression: rows outside tolerance turn amber, then their dots move
  inside the band as the sources agree; the 48-hour gap draws in before the live
  window; −91% counts up.
- ForexClear: eligibility, margin and the four sources clear in order, and
  acceptance counts to 100%.
- AI Platform & Controls: finished layers turn mint as the request passes, a
  pointer approves the HITL step, and at evaluation the five systems check off
  and "Production-ready" lands.
- OpenGamma What-If: the hypothetical trade slides in, a pointer presses
  Simulate, and a hatched span shows what offsets in the book take off the
  standalone cost.
- RideLens: two of the product's quick-fill hubs type themselves into From and
  To, a pointer presses Compare beside the ⌘ Enter shortcut, and Auto-refresh
  turns once ranking starts.
- RailDrop: a pointer presses Watch trip, the three days light up in turn while
  scanning, focus walks down the board the way J does with the product's J, K and
  H keys shown, and the saving pops when the alert lands.
- Daylight: a small display warms in step with the preset while the matching
  temperature lights up, then shows the explained state, neutral and dimmed,
  with a check once it is read back; the ladder is scanned top to bottom; the two
  explained phrases are highlighted; asked, accepted and confirmed check in order.

**2. Shared motion.** Status checks draw themselves in, floats settle, windows sit
on a soft stack of cards, and a light crosses the window bar each time a story
moves on. Stories below the fold assemble row by row the first time they are
seen. A story leans gently toward a pointer moving over it.

**3. Calm by design.** A bay waits while the pointer rests on it, and its
telemetry says Paused. Labs and Work stories play only while in view and wait
under the pointer. A story's animations stop while it is off screen, and states
that are not showing never animate. Reduced motion gets complete, still stories.

**4. Work rows play.** The ten Work page stories now play while in view, instead
of waiting for a hover that touch screens never send.

### Verified

Headless Chrome over the DevTools protocol against the local build:

- **Every story at every phase in eight frame sizes (40 lab pages).** No window or
  float past its stage, nothing covering a status chip, no spill or truncation.
  As before, stories grow 10 to 11px in a 700px frame rather than clip.
- **Reviewed as captures.** Every phase of every story at case-bay size, the Labs
  card and mobile frames at three phases each, and twelve mid-animation moments:
  the pointer pressing Release, Approve and Simulate, RideLens typing, the
  Daylight display warming and its highlights, board focus and counters running.
- **Behaviour on real pages.** Stories below the fold wait, then assemble on
  arrival; a featured bay advances, reads Paused and holds under the pointer,
  resumes as Auto and sweeps its bar on the next phase; stories pause when
  scrolled away; Labs stories play in view and wait under the pointer; the
  pointer lean sets its offsets; all ten Work stories play in view. With reduced
  motion nothing is hidden, the story holds still and the telemetry reads Still.
- **The cycle 10 audit set, re-run.** Layout width equals viewport width, one
  `h1`, no skipped headings, no duplicate ids, no broken images, no console errors
  apart from the 404 page's own 404. 3,089 text elements checked for contrast;
  the only flags are the home proof figures, the known pseudo-element false
  positive.
- Thumbnails and the social card regenerated from the finished stories.

### Not verified

- How the motion feels on a real device with a physical mouse. It was checked as
  timed captures and through dispatched events.
- Safari and Firefox. Counters use `@property`; where it is missing, a counter
  jumps from its starting figure to the final one partway through.

---

## Cycle 12 - 2026-09-13 · Stories replace the 3D diagrams

**Why this.** John asked whether the 3D diagrams were distracting from the clean,
polished site, and if so what should replace them, or whether they should be
brought into line with its palette and fonts. Studying the site beside
elevenlabs.io and standout.work settled it. The canvases were a second design
language: night-green screens, neon line work, perspective and small canvas-drawn
labels inside a light porcelain page, moving all the time, with text that could
not share the page's type or stay crisp at every size. Both reference sites show
product rather than abstraction. Standout explains its flow with white app
windows, chips and calendar cards on dotted, tinted panels; ElevenLabs uses soft
gradients and real interface pieces. Restyling the canvases would have left them
abstract. Replacing them lets each system show what it actually changed.

### Shipped

**1. Stories.** Each of the ten systems, and the home showcase, is now a story: a
light dotted stage holding one schematic product window, drawn in HTML and CSS
with the site's tokens and fonts. Each bay phase is a state of that window.
I-Port's setup rows fill with authorised context, its typed actions wait for an
operator, and the setup bar falls from 3.5 hours to 8 minutes. SwapAgent's
pairwise network settles through a hub with $6.5T eligible. RailDrop's window is
its own sample board. Daylight draws the Balanced preset, the six-layer ladder,
the sentence the app writes and its readback. Notes and metrics float beside the
window when the frame is wide enough. `tools/stories.py` builds them, and
`tools/stories_lab.py` renders every story at every phase in eight frame sizes.

**2. Held to the case copy.** Every label and figure in a story comes from its
case or from the product's own published sample data, and every bay footer says
Schematic or Illustrative. Two first drafts went further than the copy and were
cut: an Edit control on the I-Port gate (the case only has operators releasing
actions) and "OTC SIMM" among the OpenGamma venues (the case names OTC). RideLens
ranks quote types, not providers, because nothing published says which provider
wins.

**3. Behaviour.** Pages are written with every story at its resting phase, so they
are complete without script and for reduced motion. A bay holds that phase for
one step, then walks its phases while it is on screen, on one shared clock; tabs,
digits and the rail work as before. A swap fades the old state out before the new
one fades in, so two states never overlap, and states that are not showing stop
animating. Stages keep their aspect ratio but grow rather than clip when a frame
is too small for its window.

**4. Removed.** `gfx.js` (103 KB, 11 scenes), the scene lab, `_bounds.js`, and the
canvas-only CSS, JS and data fields. The retired files are in
`site-v1/removed-cycle12/`.

**5. Regenerated.** The ten work thumbnails and `og.jpg` are captured from the
stories at 2x. Image URLs now carry content hashes like the CSS and JS:
`/assets/img` is cached for a week, and returning visitors would otherwise keep
seeing the old dark thumbnails.

**6. Fixed along the way.** CoCo's card metric read "4.5h → 1…": card stat columns
now never shrink below the figure they hold. Reversed rows on the Labs page gave
the bay the narrow column; the bay now gets the wide one.

### Verified

Headless Chrome over the DevTools protocol against the local build:

- **Every story at every phase in eight frame sizes (40 lab pages).** No window or
  float past its stage, no float covering a window's status chip, no text
  spilling out of a window, no truncated titles. The one finding left: six
  stories grow 10 to 11px beyond 16:9 in a 700px frame, which is the
  grow-instead-of-clip rule working, in a single-column layout.
- **Real pages at 1440, 1280, 1024 and 390.** No truncated figures, no stat row
  overflow, no story spilling its stage, and the three Labs card titles aligned.
  Before the fixes this audit caught metric floats past the stage top, RideLens
  30px too tall for the Labs page, a Daylight card 6 to 8px taller than its
  neighbours, mobile Labs cards clipping (a `min-height: 0` had switched off the
  content-based minimum), and "18 banks" truncated by a first stats fix.
- **The cycle 10 audit set, re-run.** 12 pages at 1440 and 6 at 390: layout width
  equals viewport width, one `h1` per page, no skipped headings, no duplicate
  ids, no broken images, no canvases, and no console errors apart from the 404
  page's own 404. 3,134 text elements checked for contrast; the only flags are the
  home proof figures, the pseudo-element false positive recorded in cycle 10.
- **Screenshots reviewed.** Every story at every phase; the home showcase, featured
  cards and Labs band at 1440 and 390; the Labs page; Work; I-Port, SwapAgent,
  RailDrop and Approach bays; Daylight at 390; all thumbnails and the social card.

### Not verified

- Motion as a visitor feels it in a real browser. Phase changes were checked as
  stills at every step and through the clock logic, not watched on a device.
- Safari and Firefox. `overflow: clip` and container queries need Safari 16 or
  later; older browsers clip at the fixed ratio instead of growing.

### Open

- If John wants real screenshots of the Labs products, they belong beside the
  stories on the case pages, not in place of them.
- The OpenGamma card on About is still much shorter than the Quantile card, and
  balancing it needs content from John.

---

## Cycle 11 - 2026-09-13 · Employer marks, before and after, interaction polish

**Why this.** John asked for the Quantile and OpenGamma logos on the About
experience cards, shown the way the investor marks are, and for anything else
that would bring the site closer to the polish of elevenlabs.io and
standout.work without leaving the cycle 10 design.

### Shipped

**1. Employer marks on About.** Each experience card opens with a forest plate
holding the employer's mark on a white tile, the same treatment as the investor
grid, with tenure and city beside it. The Earlier list and the Haverford tile
draw their marks the same way. All of them go through one helper,
`mark_span()` in `tools/build.py`, which draws the existing vector file through
a CSS mask in `currentColor`, fitted to a box from its aspect ratio. The unused
`logo_box()` helper was removed.

**2. Before and after, on the home page.** A section between Selected work and
Labs: five systems, each with how the work ran before it shipped and what
changed after, behind a Before / After switch. Every phrase comes from that
system's own case copy. Two first drafts overstated their source (the valuation
case says a late discrepancy "could halt" a live cycle) and were rewritten to
match it. The rows start on Before and turn over once, shortly after the section
comes into view; touching the switch hands control to the visitor, and anyone
who prefers reduced motion, or arrives with the section already on screen, sees
After. Rows link to their cases. Later home sections were renumbered 03 to 06.

**3. Interaction polish.**
- One highlight glides between header links under a fine pointer. It is measured
  against a still marker in its own containing block, so it stays true while the
  header changes shape.
- A soft pointer light on the dark panels: the Labs band, the contact card, the
  Labs page visit card, the investor panel on About and the footer card.
- Diagram screens fade in as their scene mounts instead of showing an empty box.
- Autoplaying Labs cards follow the pointer, like the full bays.
- The Work menu's overview column ends with a Labs card and thumbnail, and the
  menu panel is opaque, so the hero no longer shows through it.
- The keyboard hint appears once per visitor instead of once per page.

### Verified

Headless Chrome over the DevTools protocol against the local build:

- **The cycle 10 audit set, re-run in full**: 12 pages at 1440 wide and 6 at 390.
  Layout width equals viewport width on every page, one `h1` per page, no
  skipped heading levels, no duplicate ids, no broken images, and
  no console errors apart from the 404 page's own 404 response. Contrast shows no
  new failures; the only flags are the home proof figures, the pseudo-element
  false positive documented in cycle 10.
- **Screenshots reviewed**: About at 1440 and 390 (employer plates, Earlier list,
  Haverford tile, investor panel with the pointer light); the before and after
  section in both states at 1440 and after the turn-over at 390; the header
  highlight at rest, after the header floated and moving between links; the Work
  menu open over the hero and over the marquee; the Labs band; a Labs page bay
  and a case page bay after the fade-in.
- The first screenshot pass caught two defects, both fixed and re-shot: the
  highlight drifted after the header floated (it had measured its own animated
  position), and hero text showed through the Work menu.

### Not verified

- The feel of the highlight and pointer light under a physical mouse or
  trackpad. They were exercised with synthetic pointer events.
- Safari and Firefox, and touch devices beyond 390px emulation.

### Open

- The OpenGamma card is much shorter than the Quantile card beside it. Balancing
  them needs new content, which should come from John.

---

## Cycle 10 - 2026-09-13 · Labs featured, redesigned in porcelain and evergreen

**Why this.** John asked to remove AgentFit and Opportunity OS, to feature the
three best products from his Labs site (RideLens, Daylight and RailDrop) with
case studies and diagrams as detailed as the Quantile work, to feature the Labs
site itself, and to bring the whole site as close as possible to the polish of
elevenlabs.io and standout.work while it stays a recruiting portfolio.

### Shipped

**1. AgentFit and Opportunity OS removed** from cases, the home ledger, the
Simple page, the palette index, the sitemap and the thumbnails, and their two
scenes were deleted from `gfx.js`. The retired files are in
`site-v1/removed-cycle10/`.

**2. Labs featured.** A new `/labs` page: hero, product index, one section per
product with an interactive bay, the rule each product refuses to break, and a
card out to labs-rouge.vercel.app. A dark Labs section on the home page with
live scene cards. Labs in the header, the Work menu, the footer, the palette and
About.

**3. The three cases rewritten from the products' own public sites** (captured
13 September 2026; RailDrop's FAQ answers were read by opening its disclosure
elements): RideLens 11 beats, RailDrop 12, Daylight 15. Two new beat kinds,
`grid` and `specs`. Nothing is inferred from code, and every figure is either
the product's own sample data or labelled illustrative. The previous Daylight
case described separate warmth and brightness ladders; the app has one six-layer
ladder that decides the two controls separately, and the copy and scene now say
that.

**4. Three scenes rebuilt.** RideLens reads left to right: a street map with the
route mapped once, the marketplace model with its four named conditions, then
the board, re-ranked by Price, Soonest and Value. RailDrop: the corridor, ±1 day
lanes, a glass bar at what you paid, a check strip, one email. Daylight: the
Balanced preset as warmth and brightness curves with mired fades, the six-layer
ladder, the display, and asked, accepted, confirmed. Each was rendered at every
phase stop, reviewed on the screen colour, and framed from measured bounds.

**5. The redesign.** Porcelain ground with a dot grid, Inter display type,
forest and mint. A header that floats into a pill, with a Work menu. A centred
two-tone hero, a tabbed showcase over stepped mint bands, count-up proof
figures, an investor marquee, selected-work cards with live bays, the Labs band,
principle cards with line drawings, gradient writing covers, a split contact
card, and a footer with bands and a wordmark. The renderer's palette moved to
amber, sky and mint on night green. Thumbnails and the social card were
regenerated from the scenes. Fonts are now Inter, Newsreader italic and IBM
Plex Mono.

### Verified

Headless Chrome over the DevTools protocol against the local build:

- **12 pages at 1440 wide and 6 at 390 wide**, audited with every element in
  view: layout width equals viewport width on every page, one `h1` per page, no
  skipped heading levels, no duplicate ids, no broken images, no console errors
  (the 404 page's own 404 response excepted).
- The first mobile pass found the header's menu button cut off. Cause: three
  decorative glows sized in `vw` (and one in fixed pixels) widened the mobile
  layout viewport to 410 to 567px. They are now sized to their section and
  clipped, and the re-audit shows 390 on every page.
- **Text contrast measured on 3,084 text elements** across those 18 audits: no
  failures except the home proof figures, which the audit measured against the
  page ground because their dark background is painted by a pseudo-element. They
  are light text on forest, well above AA.
- Build checks: no em or en dashes; every internal link, anchor and ARIA
  reference resolves. The RideLens live embed was seen loading on its case page.

### Not verified

- Safari and Firefox; only Chrome was driven.
- Frame rate on low-end phones with several scenes on screen.
- Clipboard actions in a real browser, and the embedded products' own behaviour.
- Text drawn inside canvases is held legible by the renderer's text floor; it was
  checked by eye in renders, not measured per pixel.

### Open

- Teach the contrast audit to read backgrounds painted by pseudo-elements.
- Cross-document view transitions only run in Chromium.

---

## Cycle 9 - 2026-09-12 · Rebuilt to the live site's format

**Why this.** John pointed at johnjayasankar.com and said it was substantially
better than this design. The brief: match its format closely, look at every tab
and section, keep the 3D system designs, keep every stat, project and link, and
make the result more impressive than the live site. The single-page version
this replaces is kept as `site-v1/`.

### Shipped

**1. The live site's structure, page for page.** Home (hero with a
control-model bay, proof stats, five featured systems, the also-shipped ledger,
approach, writing, contact), `/work` (facets with URL state and a twelve-row
ledger), a page per system at `/work/<slug>` (breadcrumb, headline metrics,
diagram bay, sticky section bar, facts sidebar, numbered beats, flow, live
product embed for RideLens and RailDrop, next and previous, copyable brief),
`/approach` (control layers, principles, autonomy ladder), `/about`,
`/writing`, `/simple` and a 404. Copy is taken verbatim from the live site.

**2. Generated, not hand-maintained.** `tools/build.py` renders every page from
three data files and refuses to finish on an em or en dash, an internal link or
anchor that resolves nowhere, or a duplicate id.

**3. Bays instead of flat diagrams.** Every system keeps its bespoke canvas
scene, plus four new ones: the hero's control model, the RideLens compare
board, the RailDrop watch and the Daylight schedule. Phase tabs pin the
narrative, the rail's playhead reports the scene's real position, and case
pages list every phase with its full caption and a plain-language reading of
the diagram. The Work ledger carries a live thumbnail per system that wakes on
hover or keyboard focus.

**4. Scene defects found by rendering every scene at every phase stop, at three
panel sizes.** AgentFit's three tabs showed the same picture (now Fit, Gates
and Earned differ). Opportunity OS displayed an interpolated "FIT 72" that the
product never computes (the score now switches between the two denominators).
Compression's Risk envelope tab was identical to Compressed (the envelope now
lights). Scenes composed for a 6:5 panel floated small in 16:10 bays, so each
now declares a measured `frame`. Label collisions in CoCo, the FX corridor and
Daylight were moved apart.

**5. Around the content.** Command palette, keyboard grammar, continue chip,
first-visit key hint, a live New York clock, a regenerated 1200x630 social
card, résumé at `/John_Jayasankar_Resume.pdf` with the old path redirected, and
a CSP that allows exactly the two embedded products.

### Verified

Headless Chrome in real time, driven over the DevTools protocol, against the
packaged copy served locally:

- **19 pages at 1440x900**, audited at the top and at 60% scroll, **and 8 pages
  at 390px**: every measured text element clears 4.5:1 (3:1 for large text), no
  horizontal overflow, exactly one `h1` per page, no skipped heading levels, no
  unnamed links or buttons outside decorative `aria-hidden` images, no images
  without `alt`, no broken images, and zero console errors or CSP violations.
- **Both live embeds loaded** inside their frames. Every bay mounted and drew;
  the Work page drew all twelve thumbnails.
- **Interactions exercised:** `j` twice on Work moved to the second row and
  woke its thumbnail; `4` filtered to Independent; `⌘K` opened the palette,
  "rail" returned only the three RailDrop entries and `?` listed the keys;
  clicking a rung updated the ladder readout; on a phone the section bar keeps
  the active beat in view.
- **Found and fixed during verification:** phase captions inheriting uppercase;
  metric arrows breaking onto their own line (an `i` selector caught the arrow
  glyph); palette fuzzy matching too loose; the case section bar's grey text at
  4.4:1 (the bar is now opaque); the embed loading text inheriting dark body
  colour at 1.6:1 (now 6.7:1); the to-top button reachable by Tab while
  invisible; institutional marks overflowing a phone by 9px; and the local dev
  server resetting connections under parallel asset requests (listen backlog
  raised from 5 to 128; three reloads afterwards were clean).

### Not verified

- Clipboard actions (copy email, link, brief): headless runs do not grant
  clipboard access.
- Safari and Firefox. Only Chrome was driven.
- Frame rate on low-end phones.

### Open

- AgentFit and Opportunity OS (JJ-SYS-11 and 12) are not on the live site. They
  stay because their scenes were designed for them; removing them is two data
  entries.
- `→` renders from the system font, as on the live site: it is not in either
  webfont's Latin subset.
- Daylight is linked rather than framed, because it is a macOS app.

---

## Cycle 8 - 2026-09-12 · The two artifacts nobody had inspected

**Why this.** Cycle 7 said not to go looking for structural work again without a
change in the content, and that still holds. But two artifacts this site
produces had never been examined at all: **what a shared link looks like**, and
**what the plain page looks like on paper**. Both matter for a portfolio that
gets forwarded and printed. One was fine after a small correction; the other was
broken in a way that mattered.

### Shipped

**1. The printed plain page had no way to contact him.** The print stylesheet
appends a link's destination after it, since paper has nothing to click:
`a[href^="http"]::after { content: " (" attr(href) ")" }`. That pattern only
matches `http`, so the one `mailto:` in the body printed nothing. The line came
out as:

> Best way to reach me is email or LinkedIn (https://www.linkedin.com/in/johnjayasankar).

LinkedIn spelled out, the email address absent - the single most actionable
thing on the page, missing from the copy most likely to be passed around. It now
reads `email (johnjayasankar@gmail.com)`.

The address is supplied through a `data-print` attribute rather than from the
href, because `attr(href)` would drag the scheme onto the page as
"mailto:johnjayasankar@gmail.com". The icon row stays silent as before, and the
404 (which shares this stylesheet and links email the same way) got the same
treatment.

*The first attempt was a no-op and is worth recording.* Seeing
`a[href^="mailto"]::after { content: "" }` in the print block, I removed it,
assuming it was stripping the address. It was not: nothing had ever printed a
mailto, so the rule was only redundant with the `#dico` rule beside it. The
symptom did not move, which is how I caught it. The fix is the rule that was
missing, not the rule that was there, and the comment I had written in the
meantime - which described a stripping that never happened - was corrected too.

**2. The share metadata was inconsistent between the two pages.**
`og:site_name` was declared on the plain page but not on the main one, and
neither page declared `twitter:image:alt` despite both having written an
`og:image:alt`. Both added, so the two pages now present identically when
forwarded.

### Verified

- **OG image**: declared 1200x630, actual 1200x630 (81K), read from the JPEG's
  SOF marker rather than trusted.
- **Structured data**: the JSON-LD on both pages parses, `@type` Person, with
  name, url, jobTitle and sameAs present.
- **Sitemap**: two entries, both resolving 200 against the routing (no
  redirects), matching each page's canonical and `og:url`. robots.txt disallows
  `/research/`. The 404 is correctly `noindex` with no canonical or OG tags.
- **The résumé PDF** the site links from three places: 1 page, 39K, not
  encrypted, 3,887 characters of extractable text containing his name, Quantile,
  OpenGamma and Haverford - so it is parseable by an ATS, not a scan.
- **Print output re-read after the fix**: the plain page prints 4 pages with the
  address present, `mailto:` never leaking onto the page, and the icon row still
  silent (the LinkedIn URL appears exactly once, from the misc list). The main
  site prints 13 pages and already carried the address, because there it is the
  link text rather than only the href.
- Full regression, index at 1440 and 640, simple at 1440 and 500, and 404: no
  horizontal overflow, all text AA (361 / 348 / 57 / 9 nodes), no heading skips,
  focus rings everywhere, no dangling chip separators, five drag hints, 9/9
  scenes drawing, case dialog with both actions, hash cleared on close, CLS
  0.0000, no console errors.

### Limitations and dependencies

- One LCP reading of 4,604ms appears again in the regression: first Chrome
  launch of a batch, the same contention named in cycles 6 and 7. The 640px run
  in the same batch reads 1,600ms.
- The résumé PDF has a slightly non-standard cross-reference table; pypdf
  recovers from it and extracts all text, and browsers open it fine. It is
  John's document, so it is noted rather than rewritten.
- The three Writing notes still all point at one Substack profile URL. Seventh
  cycle as an open item, still blocked on the real per-post URLs.

### Where the next cycle should look

1. **The Substack URLs**, still the only dead end a visitor can hit.
2. Every artifact this site produces has now been inspected: both pages, the
   404, the printed forms of all three, the case-study print, the share cards,
   the sitemap, the structured data and the linked PDF. There is no
   uninspected surface left that I know of.

---

## Cycle 7 - 2026-09-11 · Two promises the site was not keeping

**Why this.** Cycle 6 closed by saying a cycle that finds nothing should say so.
Rather than assume, I walked the two journeys never walked end to end: the
pointer interaction the diagrams advertise, and the keyboard path through the
page. One was clean. The other was not, and neither was the 404.

### Shipped

**1. A fifth diagram was interactive in silence.** Five scenes read `env.scrub`
and let the pointer drive their model - ledger, knot, lattice, capital, gates -
but only four carried the `Drag to …` hint. `lattice` (FX Forward & NDF
Compression) responded to the pointer with nothing to say so.

Establishing that took a controlled test, because two effects are easy to
confuse. Every scene shifts under the pointer, since `mx` drives camera yaw, and
every scene also drifts on its own clock. So: saturate `grab` by holding at the
left edge, snapshot the painted text, hold still for 130ms and snapshot again
(the control, measuring time drift alone), then sweep to the right edge over the
same 130ms and snapshot a third time. Only `lattice` among the unhinted scenes
changed its readout beyond the control. `prism` and `stack` do not respond and
correctly carry no hint; `orchestration` and `constellation` only move their
projected labels under parallax, which is not a promise worth making.

The hint added is **"Drag to enforce"** - dragging raises `rigor`, which puts
one to five validation gates in force, exactly what the HUD's "MARGIN +
N-SOURCE VALIDATION" reports.

The four existing promises were checked at the same time and all deliver:
ledger swings FIT 69/100 "UNKNOWNS SCORED ZERO" to 79/100 "UNKNOWNS EXCLUDED",
gates moves AUTONOMY 0 · HUMAN-LED to 2 · ASSISTIVE, capital goes from CURRENT
PORTFOLIO to SIMULATING, knot runs the compression.

**2. The 404 never said whose site it was.** It has no header by design, so a
visitor arriving from a broken link saw "Not found", an apology and three links
with nothing identifying the site. The name now sits above the heading and
doubles as the way home.

*The critique pass caught my first attempt.* Styled as an ordinary link it
rendered as a fourth blue item above three blue choices, reading as an option
rather than as identity. It is now set in ink, with its underline on hover and
focus, so identity and options are visually distinct.

### Verified

- **Keyboard journey, end to end, first time.** Skip link present and its target
  exists; it is the first focusable element. Header order runs brand → six
  section links → ⌘K → Simple → Résumé. All nine case triggers are real buttons.
  Opening a case moves focus into the dialog and Escape returns it to the exact
  trigger. The palette takes focus into its input and returns it to whatever
  opened it. Nothing focusable is invisible.
- **The closed mobile drawer is genuinely unreachable**, tested by trying to
  focus each link rather than by reading `tabIndex`: 0 of 7 take focus while
  closed, 7 of 7 once opened, with `aria-expanded` tracking. (At 1440 the same
  probe reports 6 of 7, which is just the visible desktop nav.)
- **The 404 audited for the first time**: 9 text nodes all AA, focus rings
  present, no overflow, one h1, at 1440 and 500.
- Caption rows carrying a hint measured at 1440 / 1200 / 1000 / 760: all five
  align right, none overflow, the new one behaves exactly as the other four.
- Full regression across index (1440, 640), simple and 404: no horizontal
  overflow, all text AA, no heading skips, focus rings everywhere, no dangling
  chip separators, 9/9 scenes drawing, case dialog with both actions, hash
  cleared on close, CLS 0.0000, no long tasks, no console errors.

### Limitations and dependencies

- One LCP reading of 4,540ms appears in the regression. That is the first Chrome
  launch of a batch competing with others, the same contention named in cycle 6;
  the 640px run in the same batch reads 1,692ms, matching the serial figures.
  Named rather than dropped.
- The hints read "Drag to …" but the interaction is pointer-move on the parent,
  so hovering across is enough and no button need be held. Dragging also works,
  and the in-canvas copy uses the same verb ("DRAG ACROSS TO RUN COMPRESSION"),
  so the wording was left in the author's voice.
- The three Writing notes still all point at one Substack profile URL. Sixth
  cycle as an open item, still blocked on the real per-post URLs.

### Where the next cycle should look

1. **The Substack URLs**, unchanged, still the only dead end a visitor can hit.
2. The affordance audit is now exhaustive for the diagrams, the keyboard path is
   walked, and all three pages are covered by the regression. I would not go
   looking for structural work here again without a change in the content.

---

## Cycle 6 - 2026-09-08 · The hero's entrance was the page's slowest element

**What I did not do.** Cycle 5's log flagged the systems section as the one place
a structural idea might pay: eight cards, 45% of the page, past 16,000px at
stacked widths. I used the capture path to read it card by card first. The
alternation (body left / visual right, then reversed), the numbered headers and
the nine distinct diagrams carry it; a grouping header or a jump index would be
chrome over content that already works. Left alone deliberately, second cycle
running, and I am now confident enough to stop proposing it.

**What I measured instead.** Load performance had never been profiled on this
site, only weighed. Weight is fine (234K gzipped critical path, all cached a
year). Timing was not.

The first profile: **LCP 2128ms against FCP 752ms**. Zero long tasks, zero
layout shift, scripts parsing in 14ms each. Nothing was slow to arrive; the
largest element took 1,376ms *after first paint* to finish painting.

The cause is the hero. It fires its entrance on `requestAnimationFrame` rather
than on scroll, so its own choreography sits on the critical path:

| | delay | duration | lands |
|---|---|---|---|
| eyebrow | 0 | 800 | 800ms |
| headline line 2 | 105 | 1150 | 1255ms |
| lede | 480 | 800 | **1280ms** |
| actions | 560 | 800 | 1360ms |
| stats | 640 | 800 | 1440ms |

The lede is the largest element in the viewport, so its 1,280ms landing *is* the
LCP. The text was in the DOM at 750ms and the reader waited another 1.4 seconds
to see it settle, at the single moment a recruiter decides whether to keep
reading.

### Shipped

The timeline is compressed roughly 40%, keeping the ease
(`cubic-bezier(.16,1,.3,1)`, which spends its time decelerating) and the
sequence: `--t-reveal` .8s → .58s, `--t-scene` 1.15s → .70s, the per-line
stagger 105ms → 80ms, and the hero's delay ladder 480/560/640 → 260/320/380.
Below-the-fold delays are untouched; those fire on scroll and cost nothing.

**The second pass caught a real regression in the first attempt.** At
`--t-scene: .82s` the headline landed at 900ms and the lede at 840ms, so the
lede finished *before* the headline above it. That inverts the reading order the
stagger exists to create. Dropping the scene duration to .70s restores a
strictly ascending ladder: 580 → 700 → 780 → 840 → 900 → 960.

### Verified

- LCP re-measured over three serial runs (one Chrome at a time; parallel runs
  starve each other and produced a 4,808ms outlier worth naming rather than
  hiding): **LCP - FCP 864, 928 and 936ms, against 1,376ms before**. LCP
  absolute 1,676-1,916ms against 2,128ms. Local TTFB is ~650ms of Python dev
  server, so production numbers will be materially lower.
- The ladder read back from computed `transitionDelay` and `transitionDuration`
  per element and asserted strictly ascending. Hero composed at 960ms, was
  1,440ms.
- Reduced-motion run measures LCP 840ms, confirming both that the preference
  still disables the reveal entirely and that the animation was exactly what
  LCP had been waiting on.
- Full regression, index at 1440 / 1100 / 620 / 500 and simple at 1440 / 500: no
  horizontal overflow, all text AA (360 and 57 nodes), no heading skips, no
  dangling chip separators, header right edge on the column, 9/9 scenes drawing,
  case dialog with both actions, hash cleared on close, CLS 0.0000, no console
  errors.
- The hero's composed state captured and compared: unchanged, as intended. Only
  the timing moved.

### Limitations and dependencies

- Timings are from a local Python dev server with a ~650ms TTFB. The deltas are
  sound because everything is measured against FCP on the same server, but the
  absolute LCP figures are pessimistic against a real CDN.
- The three Writing notes still all point at one Substack profile URL. Fifth
  cycle as an open item, still blocked on the real per-post URLs.

### Where the next cycle should look

1. **The Substack URLs**, still the only dead end a visitor can hit.
2. Honestly, not much else. Overflow, contrast, heading order, header
   alignment, scene legibility, dialog behaviour, print, chip wrapping and now
   load timing all have checks that run clean. A cycle that finds nothing should
   say so rather than manufacture work.

---

## Cycle 5 - 2026-09-08 · A way to see the whole page, and what it showed

**Why this.** Cycle 4 closed with one gap: no reliable way to render a full page
of this site, so whole-section composition had only ever been judged from
numbers. Everything scene-level was measurable; the page as a composed object
was not. That gap is what this cycle closed, and then used.

**The capture path.** Three things were fighting the harness, and each needed a
different answer:

- A tall window inflates the hero's `100svh`, pushing the rest of the document
  off-screen. Fixed by keeping a real 900px viewport and moving the page with
  `body { margin-top: -Y }` instead of scrolling, so viewport units stay honest
  and the paint is deterministic.
- `IntersectionObserver` does not deliver under virtual time, so the canvas
  scenes never learn they are on screen. `site.js` discards what `GFX.mount`
  returns, so a shim between `gfx.js` and `site.js` collects the Stage instances
  and the capture page sets `vis = true` on each.
- The scroll handler never runs without a real scroll, so the fixed header drew
  transparent over the content and the progress rail sat at zero. The capture
  page now mirrors the state that offset would have produced.

The result renders any part of the page on demand and is trustworthy for layout,
type and composition. It is *not* fully trustworthy for canvases far down the
document, which sometimes come back blank; the real-time ink test reports 9/9
scenes drawing at every width, so that is a harness limit, not a site defect.

### Shipped

**A separator no longer dangles at the end of a wrapped chip row.** The first
thing the new capture showed, in the profile section: the focus-area row read
`... PYTHON · SQL · AWS ·` and then wrapped, leaving a dot at the end of the
line with nothing after it. `.chip:not(:last-child)::after` gives every chip a
trailing dot, and `.chip` is `white-space:nowrap`, so the dot is welded to its
chip and travels to the line end when the row wraps.

CSS cannot see where a flex line breaks. Comparing `offsetTop` between adjacent
chips can, so a short routine marks the last chip on each visual row `is-eol`
and the stylesheet suppresses that one dot. Without JS the row still reads
correctly; it just keeps the stray dot.

It re-runs on `ResizeObserver` rather than `resize`, because the row also
re-wraps when the page scrollbar disappears - opening the case dialog locks
`body` overflow, which on a classic-scrollbar platform widens the content by
~15px and fires no resize event.

Fonts matter here too: chip widths move when the mono face swaps in, so
`document.fonts.ready` triggers a re-mark.

### Verified

- Chip rows at 1440, 1200, 1000, 820, 640 and 500: 2, 2, 2, 3, 3 and 4 visual
  rows, every row's last separator suppressed, every mid-line separator kept.
- Runtime re-wrap: narrowing the container to 560px (no window resize) takes the
  row from 2 to 3 rows and re-marks correctly; restoring returns it to 2. Read
  from computed `::after` display per row, not inferred.
- Confirmed visually with a before/after crop, not only from computed styles.
  The earlier numeric checks reported false positives, because
  `getComputedStyle(el, '::after').content` returns `"none"` for the last chip,
  which has no rule matching it at all.
- Full regression, index at 1440 / 1100 / 900 / 620 / 500 and simple at 1440 /
  500: no horizontal overflow, all text AA (360 and 57 nodes), no heading skips,
  header right edge still landing exactly on the column, 9/9 scenes drawing,
  case dialog opening with both actions and its counter, hash cleared on close,
  no console errors.
- The whole page reviewed frame by frame at 1440 for the first time: hero,
  profile, experience, systems cards, writing, contact and footer.

### Limitations and dependencies

- **Canvases in full-page captures are unreliable** even with the visibility
  shim; some render, some come back blank depending on where they sit in the
  document. Scene-level verification goes through canvas extraction, which is
  reliable, and the real-time ink test covers whether they draw at all.
- The capture page is a harness, not shipped. It has to be regenerated from
  `index.html` whenever the page changes, since it works by injecting a shim
  between the two script tags.
- The three Writing notes still all point at one Substack profile URL. Unchanged
  since cycle 2 and still the only dead end a visitor can hit.

### Where the next cycle should look

1. **The Substack URLs.** Fourth cycle as the top item, still blocked on John.
2. **The systems section is 45% of the page** and at stacked widths the document
   runs past 16,000px. Nothing is wrong with it, but it is the one part of the
   composition where a structural idea, rather than a fix, might pay.
3. Nothing else measurable is outstanding. Overflow, contrast, heading order,
   header alignment, scene legibility, dialog behaviour and print are all
   covered by checks that run clean.

---

## Cycle 4 - 2026-09-08 · The stacked layout gave the diagrams a 238px stage

**Why this.** Cycle 3's log proposed changing `tscale` (which sizes canvas type
from `min(W, H)`) on the theory that a 1006x250 canvas was getting the same tiny
type as a 474px one. Measurement disproved that hypothesis. Small type was not
the fault; a short stage was. Recorded here because the wrong fix would have
made the crowding worse by enlarging type in the one place there was no room.

**How it was found.** Cycle 3 could finally see the diagrams but was still
judging collisions by eye. This cycle instruments them: a wrapper on
`CanvasRenderingContext2D.prototype.fillText` records every glyph painted in a
single animation frame, attributes it to its canvas, reassembles labels from
runs of adjacent characters, and reports the tightest gap between labels sharing
a baseline. That turns "looks tight" into a number.

### Shipped

1. **The stacked card's visual now sizes from width.** Below 1100px the card
   goes single-column and the visual spans its full width, but `min-height` was
   a flat `300px` - and the caption underneath takes ~62px of it, so the canvas
   was 1006x238. The scenes are composed for the 578x425-506 stage the
   two-column card gives them. At a third of that height their projected labels
   crowded vertically: the instrument put ledger's tightest gap at **3.7px** and
   capital's at 26px. `min-height` is now `clamp(400px, 46vw, 470px)`, so the
   stage tracks the dimension that actually changed. Ledger's tightest gap went
   from 3.7px to 11.8px at 900, and the scenes read at every stacked width.

2. **Phone height is tied to the label threshold.** Below 580px viewport the
   canvas falls under the 520px the renderer needs to seat labels (measured: 511px
   at a 560px viewport), so the diagram is decorative there. Giving it a 400px
   block on all eight cards would have been pure scroll, so it returns to 300px.
   One threshold now governs both decisions instead of two unrelated numbers.

### Verified

- Stage geometry across the ladder, measured in the browser:

  | viewport | layout | canvas | labels |
  |---|---|---|---|
  | 1440 | two-column | 578x425 | shown |
  | 1100 | stacked | 1006x408 | shown |
  | 900 | stacked | 822x352 | shown |
  | 620 | stacked | 566x338 | shown |
  | 560 | stacked | 511x238 | suppressed |
  | 500 | stacked | 456x222 | suppressed |

- Label gaps re-measured after the change: no collisions at any width. The one
  the instrument flagged at 900 ("STOPPED SHORT OF ESCALATION" against
  "RESOLVED", -77px) was checked against a rendered capture and is a **false
  positive** - the two sit on separate lines, and the row-grouping threshold was
  too tight. Recorded rather than acted on.
- constellation, ledger and gates captured at 822x352 and inspected: bars,
  ladder rungs, axis ticks and the dashed UNKNOWN markers all separate cleanly.
- Regression at 1440, 1100, 900, 620, 560 and 500: 9/9 scenes drawing, no
  horizontal overflow, case modal and its two actions intact, no console errors.
- Desktop page height unchanged at 10,109px; the cost lands only on stacked
  widths (14,307px at 1100, 16,172px at 620).

### Limitations and dependencies

- **The stacked layout is now longer** - about 1,400px at a 1100px viewport,
  from eight visuals growing 100-170px each. Judged worth it: those widths are
  already a long single-column scroll, and the diagrams were unreadable at 238px.
  Desktop, where a recruiter most likely reads this, is untouched.
- Phones still get the diagrams without annotation. Unchanged from cycle 3 and
  still the honest description: they are decorative there, with the caption and
  the canvas `aria-label` carrying the meaning.
- Full-page screenshots of the systems section remain unreliable in this harness
  (programmatic scroll plus virtual time captures a blank viewport). Scene-level
  verification goes through canvas extraction, which is reliable; card-level
  composition was checked numerically rather than visually.
- The three Writing notes still all point at one Substack profile URL. Unchanged
  since cycle 2, still the only dead end a visitor can hit, still blocked on the
  real per-post URLs.

### Where the next cycle should look

1. **The Substack URLs.** Third cycle running as the top item, still blocked.
2. **`tscale` is fine; leave it alone.** This cycle's measurement retired that
   idea. If narrow-canvas labels are revisited, the lever is composition per
   scene, not a global scale factor.
3. **A reliable full-page capture path** would close the last verification gap.
   Everything scene-level and geometry-level is measurable now; whole-section
   composition is the one thing still judged from numbers alone.

---

## Cycle 3 - 2026-09-07 · The diagrams' annotation layer was not rendering

**Why this.** Cycle 2's log named this as the open gap: the nine canvas scenes
had never actually been looked at. They are `IntersectionObserver`-gated and
virtual time never fires the callbacks, so every screenshot attempt across three
sessions had captured them blank. Solved by reading the pixels instead of
photographing them: scroll each canvas into view in a real-time headless run,
`toDataURL()` it, POST it to a sink on the dev server, decode. Nine scenes, a
contact sheet, and the first honest look at the site's most distinctive asset.

What it showed was worse than a polish problem.

### Shipped

1. **Painted labels now render.** Every `hud()`/`txt()` string in `gfx.js` is a
   legend, an axis or a headline figure. They were drawn at alphas from .34 to
   .55, then multiplied by `quiet`, which rested at .52 - so "31 GATES · MINIMUM
   WINS", "0 AI-INITIATED CONFIG ERRORS" and the entire autonomy ladder were
   landing near **1.2:1** against the stage. They were in the frame and invisible.
   A canvas is opaque to a DOM contrast audit, which is why five cycles of AA
   checks never caught it. `txt()` and `hud()` now floor text at `C.dim` alpha
   .92, a figure derived from rendered pixels rather than nominal colour, since
   7px glyphs lose coverage to antialiasing.

   The ledger scene is the clearest case: its thesis is that unknown components
   leave the denominator, and the SENIORITY and COMP bars carrying that point
   had no labels and no "UNKNOWN" markers at all. The gates scene's ladder had
   no rung labels. Those diagrams could not be read.

2. **`prism` shows two sources again.** The valuation scene animates two
   independent valuations converging, and when locked they were superimposed
   exactly, drawing as a single surface. The loop spends 28% of its time locked,
   so for most of a glance the diagram contradicted its own caption. The sheets
   now keep a residual separation and sit parallel when they agree.

3. **Label brightness no longer rides on engagement.** `quiet` rested at .52 and
   rose to 1 only while dragging, so labels were legible only to a reader who
   already knew to interact. Now they are legible at rest; `grab` still drives
   `scrub`, which is the interaction that actually rewards it.

4. **The suppression cutoff moved to where the type fits.** Labels drop out on
   canvases too narrow to seat them. That cutoff was 400px, set when they were
   too dim to notice; with them visible it is measurably wrong. `tscale` bottoms
   out at .62 on the short, wide canvas the stacked-card layout produces, and at
   474px the ledger's bar labels overlap into an unreadable run, separating by
   566px. Cutoff moved to 520px. Making the labels legible is what exposed this.

### Verified

- Contrast measured from rendered pixels, sampling glyph cores against the
  stage, at both device pixel ratios (the renderer caps DPR at 2):

  | | before | after, DPR 1 | after, DPR 2 |
  |---|---|---|---|
  | gates ladder labels | 1.17 | 4.71 | 5.85 |
  | ledger bar labels | - | 4.60 | 5.85 |
  | orchestration corners | - | 4.68 | 6.42 |
  | stack right-hand labels | - | 4.49 | 6.42 |

  AA is 4.5:1. Before the change the gates labels measured 1.17:1.
- All nine scenes extracted and inspected at DPR 1 and DPR 2, plus `prism` across
  five frames of its ~5.9s loop to confirm it reads in both the diverged and
  reconciled states.
- The ledger label band captured at six canvas widths (474, 566, 579, 694, 822,
  1006) to locate the collision threshold rather than guess it.
- Regression at 1440, 1100 and 640: 9/9 scenes drawing, no horizontal overflow,
  no console errors, and cycle 2's case-study modal, actions and counter intact.
- `node --check` on `gfx.js` after every edit.

### Limitations and dependencies

- **The 520px suppression means phones get diagrams without annotation.** The
  caption under each diagram and the canvas `aria-label` carry the meaning
  there. That is a deliberate trade - illegible overlapping type is worse than
  none - but the honest description is that the diagrams are decorative on a
  phone. Fixing it properly means composing narrow-canvas label layouts per
  scene, which is nine pieces of hand work.
- Headless Chrome lays out at a 500px minimum, so the suppressed state below
  520px could not be observed directly; the threshold was derived from the width
  sweep and the branch itself is a single comparison.
- The three Writing notes still all link to one Substack profile URL. Unchanged
  from cycle 2 and still the only place a visitor hits a dead end. Needs the
  real per-post URLs.

### Where the next cycle should look

1. **The Substack URLs** - unchanged, still blocked on John, still the highest
   value per unit of work.
2. **Narrow-canvas label layouts**, if the phone experience of the diagrams
   matters. Nine scenes of hand composition; worth it only if mobile traffic is
   a real audience for this site.
3. **`tscale` keys off `min(W, H)`**, which is why a 1006x250 canvas gets the
   same tiny type as a 474px one. Sizing from the diagonal, or from width alone
   with a height guard, would give the stacked layout readable labels without
   touching each scene.

---

## Cycle 2 — 2026-09-07 · Case studies become things you can take with you

**Why this and not something else.** The nine case studies are the deepest
content on the site and the reason a hiring manager stays past the hero. They
live in a dialog, and that dialog was leaky in ways that only show up when
someone tries to *use* a case rather than read it: send it to a colleague, come
back to it, print it. Three of the four items below are that. Nothing was added
for decoration.

Two candidate features were considered and rejected after inspection rather
than built:

- *A filter or jump index over the eight systems.* The cards already carry
  number, type, status, title, summary and three metrics each, so an index would
  have restated what is on screen while adding a block to read before the
  content starts. The brief for this site has repeatedly been "less busy".
- *A separate long-form page holding all nine cases.* Real value (the case text
  lives in `site.js`, so it is absent from the HTML source and from a normal
  print), but it duplicates `simple.html`'s job and doubles the surface that has
  to stay in step. Making each case printable addressed the same need at a
  fraction of the cost. Revisit if SEO on case content ever matters.

### Shipped

1. **The URL now names the case on screen.** `render()` only redrew the body;
   the hash was written once by `open()`. Paging with `←` `→` or the prev/next
   buttons left the address bar on whichever case the reader opened first, so a
   link copied after paging pointed at the wrong one. `render()` now
   `replaceState`s the case it just drew.

2. **Back closes the case instead of leaving the site.** `open()` used
   `replaceState`, so the dialog changed the URL without adding a history entry
   and Back navigated away from the page entirely. It now pushes exactly one
   entry per opening (not per case paged through, so Back always means "out"),
   with a `popstate` handler that closes on Back and reopens on Forward. Arriving
   by deep link is handled separately: the entry is already the reader's, so
   `close()` rewrites it rather than stepping back off the site.

3. **An open case prints as its own document.** The print stylesheet hid
   `.modal` along with the rest of the overlay chrome, so pressing print while
   reading a case printed the page *behind* it and dropped the case. A
   `body.is-case` flag (distinct from `is-locked`, which the command palette
   also sets) now hides the page and promotes the dialog to the document.

4. **Copy link · Print, and a position counter.** The print behaviour above is
   invisible without an affordance, and the share workflow — forward one case to
   a colleague — should not require fishing a URL out of a hidden mobile address
   bar. Two actions sit at the end of the case's utility row in the same mono
   uppercase language as the number and type. The counter (`4 / 9`) sits between
   the prev/next buttons, which previously gave no sense of how many cases there
   were.

### Verified

Measured, not assumed. Both viewports = 1440 and 500 unless noted.

- URL tracks the case through `←` `→` and the prev/next buttons; copied link
  follows the case after paging (`#case-agentfit` → `#case-platform`).
- Back closes the dialog and stays on the page; Forward reopens the same case;
  Escape clears the hash; cold load at `/#case-forex` opens the case, and
  Escape from there stays on the site.
- Print with a case open: 2 pages for FX Forward, 3 for AgentFit, containing the
  full case and nothing else — page behind gone, prev/next and the two actions
  suppressed. Verified by extracting text from Chrome's PDF output.
- Print with no case open is unchanged: 13 pages, hero through contact, no
  dialog leakage.
- Dialog contrast: 50 text nodes, all pass WCAG AA. The counter's `/` separator
  was caught at 1.29:1 and fixed by giving the current number `--ink` and the
  rest `--ink-3`, which also gave the fraction real hierarchy.
- Tab order `× → Copy link → Print → prev → next`, focus ring on every one.
- Copy button no longer resizes on click: "Link copied" and "Copy failed"
  measure 78.1px against 66.0px at rest, so the label is pinned at 79px.
- Clipboard success path exercised with a stubbed `writeText`; the failure path
  falls back to `execCommand` and, failing that, says "Copy failed" rather than
  claiming success.
- `node --check` on `site.js`, brace balance on `site.css`, after every edit.

### Limitations and dependencies

- **The three Writing notes all link to the same Substack profile URL**, not to
  three posts. A reader drawn in by a specific title lands on a profile and has
  to hunt. Left alone deliberately: inventing post URLs would fabricate content.
  Needs the real per-post URLs from John, or the section reframed as standing
  theses rather than links.
- The clipboard success path could not be exercised against the real API in
  headless Chrome, which denies clipboard access to an unfocused document. The
  code path was verified with a stub; the permission behaviour is Chrome's.
- Case text still lives in `site.js`, so it is not in the HTML source. Fine for
  crawlers that execute JS, not for those that do not.

### Where the next cycle should look

1. **Get the real Substack post URLs in** — highest value per unit of work left
   on the site, and the only place a visitor currently hits a dead end.
2. **The eight canvas scenes are unverifiable in headless Chrome** — they are
   `IntersectionObserver`-gated and virtual time never fires the callbacks, so
   no screenshot pipeline here has ever actually confirmed what they draw. A
   real-browser rendering check would close the one gap in the site's test
   coverage.
3. **Consider whether `#systems` at ~4,600px is doing too much work.** Eight
   full-width cards is a lot of scroll. Rejected the index this cycle for good
   reasons, but the underlying length is worth revisiting with fresh eyes.

---

## Cycle 1 — 2026-09-06 · Alignment, semantics, and the deploy package

Recorded retrospectively; this predates the log.

- **The masthead never fit its own column.** At 1600px the header measured
  1278px of content in a 1152px column, so the Résumé button hung 127px past the
  line the rest of the page aligns to. The responsive ladder hid this below
  1200px, but above it the column is capped at 1280 so widening never helped.
  Fixed by taking the nav numbers out of the horizontal bar (the CSS already
  named them "the first thing to go"), returning them in the mobile drawer where
  each link is a full-width row, and tightening gaps. Verified at 25 widths from
  320 to 1920: the header's right edge lands exactly on the column at every one.
- Three step headings jumped `h2` → `h4`; promoted to `h3` with `class="h4"` so
  the type is unchanged.
- All three pages declared `viewport-fit=cover` or a dead iOS 9
  `shrink-to-fit=no` with no `env(safe-area-inset-*)` handling anywhere, so
  content could slide under the notch in landscape. Added insets to the shell,
  drawer, footer and container; unified the viewport strings.
- The packaging step silently dropped dotfiles, so the zip shipped without
  `.vercelignore` — deploying it would have published the internal research
  ledger and 84K of unused vendor marks.
- Added the `⌘K` command palette.
