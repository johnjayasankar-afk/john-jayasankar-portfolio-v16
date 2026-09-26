# John Jayasankar · portfolio

The site at johnjayasankar.com: production AI agents, market infrastructure and
the independent products on Labs. Every system is told as a story: a schematic
interface that steps through what changed.

Static HTML and CSS with one small script. No framework, no runtime
dependencies, no CDN and no canvas. Pages are generated from plain data by a
small Python script, and the generated HTML is committed, so hosting needs no
build step.

---

## Deploy with GitHub and Vercel

1. Put the contents of this folder at the root of a GitHub repository and push.
2. In Vercel choose **Add New → Project** and import that repository.
3. Framework preset **Other**. Leave the build command empty, and leave the
   output directory as the repository root. No environment variables.
4. Deploy. Every push to the default branch redeploys.

`vercel.json` supplies clean URLs (`/work/setup-agent` serves `work/setup-agent.html`),
caching and security headers, including the Content-Security-Policy. It also
pins the build settings: framework preset Other, no install step, no build step,
and the repository root as the output directory. Those override the project's
dashboard settings, so a Vercel project that was first set up for another
framework (for example Vite, which fails with `vite: command not found`) still
serves this site as plain files.
`.vercelignore` keeps the generator, the story lab pages, the research notes and
these docs off the CDN.

To point the site at another domain before deploying:

```bash
./set-domain.sh example.com
```

That rewrites the one place the domain lives (`tools/data_pages.py`) and
regenerates canonical URLs, Open Graph and Twitter tags, the sitemap and robots.

## Run it locally

```bash
python3 tools/serve.py . 4400
```

Then open http://localhost:4400. The server behaves like Vercel: clean URLs, the
headers from `vercel.json` (re-read on every request) and a real 404 page. A
plain `python3 -m http.server` will not resolve clean URLs, so use this one.

## Edit content

Everything a visitor reads lives in four files:

| File | Holds |
|---|---|
| `tools/data_systems_a.py` | JJ-SYS-01 to 06: the Quantile systems. Case copy, metrics, bay titles and phases |
| `tools/data_systems_b.py` | JJ-SYS-07 OpenGamma, then 08 to 11: RideLens, RailDrop, Daylight and Gridiron, including their Labs card copy |
| `tools/data_pages.py` | home, labs, work, approach, about, writing, simple and 404 copy, including the home before and after rows; navigation, the Work menu groups and footer links; the domains strip, glossary and disclaimer; the domain |
| `tools/stories.py` | each system's story: what its schematic interface shows at every phase |
| `tools/ideas.py` | the writing covers and the Approach principle drawings, in the same language |
| `tools/claims.py` | every verifiable figure on the site, declared once: value, source, how it is counted, the date it was last checked. `data_systems_*.py` and `data_pages.py` read from here and carry no figure of their own |

Then regenerate:

```bash
python3 tools/build.py
```

The build writes every page, `sitemap.xml`, `robots.txt` and
`assets/js/jj-data.js` (the command palette index), and stamps CSS, JS and image
URLs with content hashes so a deploy never serves a stale file. It refuses to
finish if any page contains an em or en dash, an internal link, in-page anchor or
ARIA reference that resolves nowhere, or a duplicate id, and it checks that
every bay has one story step per phase.

Case beats come in seven kinds: `text`, `list`, `flow`, `role`, `live`, `grid`
(titled cards) and `specs` (key and value). A grid or specs beat can carry a
note, printed below it.

---

## Structure

```
index.html  labs.html  work.html  approach.html  about.html  writing.html  simple.html  404.html
work/<system>.html            one case page per system (11)
assets/css/site.css           design tokens, every component and the stories
assets/css/simple.css         the plain page
assets/js/site.js             header and Work menu, reveal and count-up, showcase tabs,
                              bays and stories, thumbnails, palette, keys, facets, case beats
assets/js/jj-data.js          generated palette index
assets/fonts/                 Inter (variable), Newsreader italic (variable), IBM Plex Mono 400/500
assets/img/                   portrait, employer and school logos, favicon, og.jpg, work/ thumbnails
John_Jayasankar_Resume.pdf
tools/                        generator, data, stories, ideas, claims ledger, checkers,
                              dev server, CDP driver                                     (not deployed)
_stories.html _stories.js     story lab                                                     (not deployed)
_thumbs.html _og.html         sources for the thumbnails and the link-preview card          (not deployed)
research/                     source notes behind the case copy                             (not deployed)
```

## Claims and checks

Every figure on this site comes from `tools/claims.py`, the claims ledger.
Nothing in the page data carries a number of its own: `data_systems_a.py`,
`data_systems_b.py` and `data_pages.py` call `M()` and `V()` for every one.

```
python3 tools/claims.py                     # the ledger as a table
python3 tools/claims.py --json              # the same, as JSON
python3 tools/verify_claims.py              # re-derive what runs in a second
python3 tools/verify_claims.py --build      # also the ones that need a test run
```

The verifier does three things and keeps them apart: it checks that every claim
is printed somewhere and that nothing printed is undeclared; it re-derives each
figure by running a command in its source repository and reports drift; and it
names what it could not check rather than passing it.

A claim has three honest states and the ledger never blurs them. Checked means a
command re-derived it today. Unchecked means it is re-derivable but not here.
Asserted means there is no machine source and a person vouched for it on a date.
The employer figures are all asserted, because they were measured inside systems
this repository cannot reach, and nothing pretends otherwise.

The product repositories are resolved as siblings of this one, or under
`CLAIMS_REPO_ROOT`. A missing repository is a failure to check, not a pass.

`tools/verify_claims.py` is byte-identical to the Labs copy, and both ledgers
declare the same `LEDGER_FORMAT`. One verifier serves both sites.

`tools/build.py` prints a warning, and does not fail, for any asserted figure
older than `STALE_AFTER_DAYS`. An old measurement is not a wrong one, and the
build has no way to tell the difference.

```
python3 tools/check_external.py             # outbound links, short links, framing
python3 tools/check_external.py --embeds    # can each embedded product be framed
python3 tools/check_external.py --selftest  # the framing rule, no network
```

`check_external.py` needs the network, so it is run by hand rather than by the
build. It is byte-identical to the Labs copy.

The embed check covers two failures that look the same and are not. This site's
own `frame-src` omitting an origin it embeds is a misconfiguration here, and
fails the run. A product refusing to be framed is the product's decision, and is
reported without failing anything, because the page handles it: a live preview
ships as a still and only reveals the frame when the product posts
`embed:ready`. A frame the browser blocked never sends that. See
`docs/DOMAINS.md` for the handshake and what each product had to change.

## Stories and bays

Every system has a bay: its story, with phase controls, live telemetry and a
caption. Cards on the home, Labs and Work pages use the compact bay (phase pills
under the story); case pages, the home showcase and Approach use the full bay (a
phase list with captions, a plain-language reading of the interface and a rail
whose playhead shows where the story is).

A story is a light, dotted stage holding one product-style window. Each phase of
the bay is a state of that window: rows fill in, a gate holds, a figure lands.
Notes and metrics float beside the window where there is room for them.

- Stories are HTML and CSS drawn with the site's own tokens, so they stay crisp
  at any size and share the page's type. Container queries decide what each size
  shows: floating notes above 640px, a denser window below 430px, and on the
  narrowest phone cards (about 250px) window titles and long layer names wrap
  rather than trail off, so no label is ever cut.
- Every page is written with each story at its resting phase, so it is complete
  before any script runs, and for anyone who prefers reduced motion. A bay holds
  that phase for one step (3.4 seconds), then walks its phases while it is on
  screen. Choosing a phase holds it; choosing it again resumes. Digits 1 to 9
  pick phases for the bay in view.
- A bay waits while the pointer rests on it, and its telemetry reads Paused.
  Stories on the Labs band and the Work page play while in view and wait under
  the pointer. Stories below the fold assemble row by row the first time they
  are seen, and a story's animations stop while it is off screen.
- The stage keeps its aspect ratio, and grows rather than clipping when a frame
  is too small for its window.
- Stories are schematic and every bay footer says so. Figures are the case's
  own. RailDrop's board is the sample board on RailDrop's own site, and Daylight
  uses its Balanced preset and six layers. RideLens ranks quote types rather
  than providers, because nothing published says which provider wins. Gridiron
  shows captured real games from its NFL Week 1 replay, as the app shows them.

In `tools/stories.py`, an element that belongs to some phases carries `data-on`
(`"1"`, `"1-2"`, `"2-"`); `site.js` adds `is-on` while the bay is in one of them,
and the CSS decides what that looks like. Three helpers add the moving parts:
`press()` is a button a pointer glides onto and presses, `typed()` is text that
types itself in, and `count()` is a figure that runs to its value. The resting
value is always the real figure, so a still page or a thumbnail shows it.

A pointer carries the name of whoever is pressing (Operator, Human, Desk, You),
the way a shared cursor does. Rows can say where attention is: `sweep` passes a
light over a row as work reaches it, `hold` rests an amber wash on a row waiting
on a person. Each stage's tinted light drifts slowly, stories on cards show a
thin progress line for their phases, and anything paused under the pointer
says Paused in the corner.

The writing covers and the principles on Approach are ideas, built by
`tools/ideas.py` on the same stage: a router that sends each user action to the
intelligence it is worth, an agent scope that advances only as evidence,
reversibility and control check in, a stack that lets the model ship, a mapped
workflow with its exception path, the autonomy ladder earned rung by rung, and a
lifecycle where every fault is caught before live. They are conceptual, carry
no figures, and are hidden from assistive technology because the card around
each one says the same thing in words.

The lab renders every story at the sizes the site uses:

```bash
python3 tools/stories_lab.py
python3 tools/serve.py . 4401
```

- `http://localhost:4401/_stories?only=setup-agent&step=1` shows one story at one
  phase in every frame size, from the case bay down to a 320px phone's cards
  (the Phone frames); `?auto=1` plays them all, and `?frames=Phone bay,Phone card`
  keeps only the frames named. Ideas are there too, at their card sizes:
  `?only=note-routing`, `?only=p-ladder`. Each frame constrains its story the way
  the site's cards and bays do, so what fits in the lab fits on the page.
- `http://localhost:4401/_thumbs` renders each story at rest at 800x500. The
  thumbnails in `assets/img/work/` are those renders captured at 2x and saved at
  640x400.
- `http://localhost:4401/_og` is the 1200x630 link-preview card, saved as
  `assets/img/og.jpg`.

`tools/shoot.mjs` drives headless Chrome over the DevTools protocol (Node 22 or
later, no dependencies) for screenshots and in-page audits.

## Keyboard

`⌘K` / `Ctrl K` or `/` opens the palette, `?` lists the keys for the current
page. Everywhere: `j` / `k` move through the page, `Enter` opens what is
highlighted, `y` copies a link to it, `e` copies the email, `t` goes to top.
Case pages add `←` `→` for adjacent systems and `b` for a copyable brief. Work
adds `1` to `4` for the facets. Home and Labs use digits for the bay in view.
Approach adds `1` to `5` for the control layers and `j` / `k` on the autonomy
ladder. The Simple page adds `f` for the full site.

## Design notes

- **Palette.** A porcelain ground (`#f8f6f1`) with a faint dot grid, near-black
  ink, deep forest (`#13241b`) for weight, mint for what settled. Inside the
  stories, amber marks the human gate, sky marks context and work in progress,
  and mint marks outcomes.
- **Type.** Inter for display and reading, set tight at display sizes, with the
  quieter half of each heading in a softer tone. IBM Plex Mono for labels,
  counts and the row keys inside stories. Newsreader italic appears once, on the
  Simple page. All three are self-hosted open-licence fonts.
- **Motion.** The header floats into a pill after the first scroll. Blocks rise
  into place the first time they arrive and figures count up once. The home
  showcase advances on a timer that pauses on hover, focus, when off screen or in
  a hidden tab. The domains strip pauses on hover. One highlight glides
  between header links under a fine pointer, the dark panels carry a soft pointer
  light, stories cross-fade between phases (with the pointers, typing and
  counters inside them, and a named pointer where someone presses), and the before and after rows turn
  over once when they come into view. A story state that is not showing stops
  animating. Everything honours `prefers-reduced-motion`.
- **Contrast.** Text tokens were measured: `--ink-2` is 7.3:1 and `--ink-3` 5.2:1
  on the ground. Tone halves of headings are only used at large sizes.
- **Marks.** Employer and school logos (`assets/img/logo-*.svg`) are drawn
  through CSS masks in `currentColor`; `mark_span()` fits a logo to a box from
  its aspect ratio. The investor logos were removed on 16 September 2026.

## Headers

`vercel.json` sets `default-src 'self'` with two exceptions: inline styles, and
`frame-src` for the two products embedded live on their case pages (RideLens and
RailDrop). Daylight is a macOS app and Gridiron refuses to be framed
(`frame-ancestors 'none'`), so both are linked, not framed. If you add any
other external resource, that policy is the first thing to update or the browser
will block it. The old résumé path `/assets/John_Jayasankar_Resume.pdf`
redirects permanently to `/John_Jayasankar_Resume.pdf`.
