# Product visual source ledger

Internal working note. Not linked from the site. Its purpose is to make every
artifact traceable to a first-party description of the mechanism, so no visual
decision is arbitrary and no claim about John's work is invented here.

Boundary held throughout: **public sources establish the product category and
mechanics. The portfolio establishes John's role, scope and metrics.** A
capability found on a vendor page is never attributed to John.

Provenance grades: A domain evidence · B entity/relationship reference ·
C motion reference · D structural metaphor · E direct asset (never used).

---

## S1 · Quantile — Interest Rate Compression
Source: first-party product page (supplied by John), grade A.

Stated mechanism, verbatim structure:
1. **Submit & Validate** — "Multiple participants and central parties upload
   their data to Quantile and set their **risk constraints**."
2. **Identify Optimisation Opportunities** — the engine generates "a proposal
   containing **trade terminations, residual trades and risk replacements**."
3. **Accept & Execute** — "validated and accepted by participants and executed
   at the CCP, reducing notional and trade count."

Headline definition: "reduces **gross notional and trade count** while
**preserving the overall risk profile and valuation**."
Also: "One Run. Multiple Currencies." — several currencies targeted together.
Also: flexible constraints, "target what matters most to you."

INVARIANT: risk profile and valuation.
WHAT MOVES: gross notional, trade count, network topology.
Visual primitives: participant portfolios, constraint envelope, three distinct
proposal trade types, a stable risk contour behind a collapsing gross topology.

## S2 · Quantile — Counterparty Risk Optimisation
Source: first-party product page (supplied), grade A.

**This is not compression and must not be drawn like it.**
"optimise cleared and uncleared IM and risk-based capital under **SA-CCR and
IMM** by analysing the risk of transactions between participants and
**rebalancing portfolios with new market risk neutral trades**."
Proposal = "a set of **new market risk neutral trades**." Risk was "the first to
sweep risk into **LCH SwapAgent**." Constraints: "risk, notional and resource
metric constraints."

INVARIANT: market-risk neutrality.
WHAT MOVES: counterparty exposure distribution, IM, capital.
Note: compression REMOVES notional; this ADDS trades. Opposite gestures.

## S3 · Quantile / LCH — FX Smart Clearing
Source: first-party product page (supplied), grade A.

"**selectively clear** FX Forwards via LCH ForexClear." Works by "intelligently
selecting **existing uncleared trades to move to LCH ForexClear**, and
optimising portfolios with **new rebalancing trades**." Customisable by
"preferred **currency pairs and trading partners**." Portfolios "can also
potentially be compressed." Driver: "**SA-CCR** has increased capital
requirements for FX which creates a new incentive to clear, assuming the
differences in **cleared and uncleared IM** are appropriately managed."
Benefit of the move: "**multilateral netting**."

INVARIANT: the participant's chosen risk and resource bounds.
WHAT MOVES: which side of the cleared/uncleared boundary a trade sits on.
Visual primitives: a clearing boundary, selection, migration, residual bilateral
book, rebalancing trades.

## S4 · OpenGamma — Simulate (pre-trade what-if margin)
Sources: first-party product page + first-party API documentation, grade A.

API objects, exact names: `additionalBasePortfolio`, `incrementalPortfolio`,
`beforeMargin`, `afterMargin`, `incrementalMargin`, `standaloneMargin`,
`marginDetails`, `brokerCcpBreakdown` ("margin totals for this entity split out
by Broker and CCP"), `crossMarginBreakdown`, `spanDetails`.

Definitions worth designing around:
- `incrementalMargin` — "the change in margin after adding the new allocations
  into the existing portfolio."
- `standaloneMargin` — "the margin of the new trades and positions alone,
  assuming no existing portfolio."

**The gap between standalone and incremental is the portfolio offset benefit.**
That single relationship is the most teachable idea in the product and it is
documented first-party, so it drives the artifact.

Product page: model position changes (add / remove / edit), "find the cheapest
option across exchanges and brokers", "maximise your available trading
capacity", and "Initial Margin limits can be a constraining factor for firms to
put on new trades."
Methodologies listed: SPAN, CME SPAN2, ICE SPAN/IRM2, JSCC, EUREX, ISDA SIMM.

INVARIANT: the base portfolio and the scenario assumptions, held constant so
alternatives are comparable.
WHAT MOVES: where the hypothetical trade is allocated, and the resulting margin
and headroom.

## S5 · Internal products (I-Port, QT CoCo)
No public first-party imagery exists and none was sought beyond John's own
case-study copy. Modelled only from the portfolio's existing description:
run context, bounded judgment, typed actions, human approval, parallel capacity;
and for CoCo, two MCP evidence surfaces resolving to a root cause.
Employer work stays intentionally generalised: no client data, no internal
architecture, no production configuration.

## S6 · Opportunity OS
John's own build. Modelled from his own specification: weighted fit components
where components that cannot be evaluated leave the denominator rather than
being scored zero.

---

## Things deliberately NOT represented
- No vendor artwork traced, recoloured or embedded. No Quantile or OpenGamma
  branding, palette or wordmark inside any artifact.
- No invented counterparties, trade identifiers, notionals or margin figures.
  Labels stay schematic (PARTICIPANT A, VENUE 01).
- No claim that John's FX work used every published Smart Clearing capability.
  The public product supplies the domain model only.
- Compression and counterparty-risk optimisation are kept visually distinct
  because they are different services with opposite primary gestures.

---

## What this research actually changed

**Card 07 · Pre-Trade Margin Simulator.** The published what-if API documents
`standaloneMargin` next to `incrementalMargin`. The scene previously showed only
baseline + incremental per venue. It now reveals, on hover, the standalone cost
of the same trade with no portfolio behind it, with a caliper marking the gap.
At one venue the incremental figure exceeds the standalone one and the caliper
flips to COMPOUNDS, because a new position can concentrate risk instead of
offsetting it. That relationship is the reason the product exists and it came
straight out of the API reference, not from the product page.

**Card 02 · AI Incident Investigation Agent.** Evidence from the two MCP
surfaces was drawn identically. Run state is now a tick (a sample at an instant)
and the support corpus a bar (written material), and the scene counts what it
kept against what it set aside, so triage is visible as triage.

**Card 06 · a correction, recorded deliberately.** Research into FX Smart
Clearing led me to rebuild this artifact around selectively moving uncleared FX
forwards to a CCP. That was wrong. Smart Clearing is the *vendor's* product
story; John's scope on this card is the ForexClear margin API embedded in the
optimiser behind a four-source validation layer, and his metrics are proposal
acceptance and live-run failure rate. Rebuilding around the public product would
have quietly attributed a capability to him that his own copy does not claim.
The artifact was reverted to the validation corridor and improved within his
scope instead: the corridor declared four-source validation but only had three
source gates, and proposals now visibly stop in the corridor rather than in the
live run, which is what the -94% figure describes.

This is the boundary in section 11 of the brief doing its job, and it is worth
recording that it caught a real error rather than a hypothetical one.

---

# Second pass · derived from the source repositories

The first pass researched the *employer* products from public first-party
pages. This pass went to the two builds John owns outright and read the code,
because for those there is no boundary problem: the repository is the primary
source.

Sources: `~/Documents/GitHub/agentfit` (AgentFit) and the Opportunity OS
working tree. Both test suites were executed rather than trusted.

## Facts read out of the code, not inferred

| Claim on the site | Verified against | Result |
|---|---|---|
| AgentFit · 20 dimensions | `domain/dimensions.ts` | 20 ✓ |
| AgentFit · fit is 6 weighted components | `engine/fit.ts` `FIT_WEIGHTS` | 6, summing to 100 ✓ |
| AgentFit · 0 of 16 archetypes reach full autonomy | `assess()` over `ARCHETYPES` | 0 of 16 ✓ |
| AgentFit · 2 of 6 examples decline an agent | same | 2 (`reconciliation`, `compliance-review`) ✓ |
| AgentFit · 128 model tests passing | `npx vitest run` | 128 ✓ |
| **AgentFit · "27 gates"** | `engine/autonomy.ts` `GATES` | **31 — corrected everywhere** |
| Opportunity OS · 8 modules | app nav | 8 ✓ |
| Opportunity OS · 7 weighted fit components | `lib/fit.ts` `WEIGHTS` | 7 (25/25/15/10/10/10/5) ✓ |
| Opportunity OS · 12 named agenda rules | `lib/agenda.ts` | 12 ✓ |
| Opportunity OS · 118 logic tests | `node scripts/run-tests.mjs` | 118 ✓ |

The gate count was wrong on the site in three places (card metric, card
summary, case study). The model has grown to 31 gates: 2 capping at level 1,
6 at level 2, 13 at level 3, 10 at level 4. Corrected rather than rounded.

## What the artifacts now derive from

**Card 08 · AgentFit (`gates`).** Rebuilt on real output. All sixteen shipped
archetypes are plotted on the rung each one actually earned, positioned left to
right by its real Agent Fit score. The argument the product makes is visible as
a contradiction in the data rather than as a caption: `reconciliation` scores
**69** and sits on rung 0, while `reporting` scores **66** and reaches rung 4.
The top rung is empty because nothing reaches it — the picture reports the same
"0 of 16" the metric does. The six rung names are `AUTONOMY_LADDER` verbatim.

**Card 03 · Opportunity OS (`ledger`).** The seven component weights were
already the real ones; the score was not — it was `74 + ev * 8`, a number that
moved with the animation and could not be checked against the bars under it.
It now computes: 64 points earned, and the only thing the interaction changes
is the denominator. Scoring the two unevaluable components as zero divides by
100 and reports **64**; excluding them divides by the **80** the app could
actually evaluate and reports **80**, alongside a coverage figure of 80%. Same
evidence, two denominators — which is the product decision, now arithmetic the
viewer can verify.

**Card 05 · Valuation & Validation (`prism`).** The two diverging surfaces were
right but the artifact stopped at detection, while the case is about
consequence: a discrepancy found inside the live window halts the cycle for
every participant. The timeline is now drawn — the independent check, the 48
hours, and the live cycle it stays clear of — and the discrepancies are counted
rather than implied.

## A renderer bug that was suppressing six diagrams

`Painter.prototype.dot` sized every marker with the `k` returned by `project()`.
That value is `f / z`, a depth factor intended for line widths; it omits
`cam.scale` (~233px), so every dot in every scene was drawn at a radius of a
fraction of a pixel and never appeared. Marker radii had been tuned by eye
against a renderer that was not drawing them.

Fixed by multiplying by the projection scale. Measured effect on painted ink:
orchestration +105%, gates +97%, lattice +56%, knot +23%, prism +18%,
constellation +21%. Six diagrams gained the markers they were always specifying
— the agent core and context particles in 01, the evidence nodes in 02, the
participant ring in 04.

## Boundary, unchanged

Nothing here attributes a new capability, client, metric or technology to John.
The employer artifacts (`knot`, `capital`, `lattice`) were not re-scoped; only
the renderer fix touched them, and it changed how they draw, not what they say.

---

# Third pass · the diagrams that had not been re-derived

The second pass covered the two builds John owns plus `prism`. This pass took
the remaining artifacts and asked the same question of each: does the picture
show the mechanism the case describes, or does it show a category?

**Card 01 · Production Operations AI Agent (`orchestration`).** The scene had an
approval plane that nothing ever stopped at — every typed action flowed straight
through it. The case is explicit that the agent "acts only through bounded
product surfaces" with "a human on the consequential step", so the gate was the
one thing that had to be doing work. Actions now assemble inside the boundary,
**queue at the plane**, and execute only after the operator clears them; the
scene reports how many are held. Added the two outcomes the case leads with:
setup 3.5h → 8m, and zero AI-initiated configuration errors.

**Card 02 · AI Incident Investigation Agent (`constellation`).** Evidence triage
was already right. What was missing was consequence: −78% escalations is the
headline, and "before senior engineering has to step in" existed only as a
caption. The escalation boundary is now a drawn line, and the diagnosis
visibly settles above it rather than crossing.

**Card 04 · Cross-Currency Compression (`knot`).** The multilateral cycle, the
preserved risk envelope and the three proposal outcomes were all correct. But
the card claims **34% greater notional reduction per run than bilateral**, and
the bilateral baseline was nowhere in the picture. A tick on the gross-notional
bar now marks where two-party netting stops, so the claimed gap is the gap you
can see. Ratio held honestly: .72 / .537 = 1.34.

**Approach · AI Platform & Controls (`stack`).** The layers were generic
(WORKFLOW / CONTEXT / TOOLS / ACTIONS…) where the case names its components
exactly. They now read MCP SERVERS, DOMAIN APIS, TYPED ACTIONS, HUMAN APPROVAL,
DETERMINISTIC, EVALS & QA. More importantly the claim is not that a stack
exists, it is that **one pattern was standardised across five enterprise
systems** — so five systems now enter the same stack at its base.

**Card 06 (`lattice`) and Card 07 (`capital`)** were reviewed and left as they
are. The FX validation corridor already matches John's scope exactly, and the
what-if allocation scene remains the most closely researched artifact on the
site. Both gained their markers back from the `dot` fix.

Every card caption and every `aria-label` was rewritten to describe what its
scene now actually draws, so the described behaviour and the rendered behaviour
do not drift apart.

---

# Fourth pass · Gridiron (JJ-SYS-11), 14 September 2026

Gridiron is John's own build, so, as with AgentFit, the repository is the
primary source: its README and CHANGELOG at version 0.5.1, the ESPN and Kalshi
data it captured for its replay lab, and the design screenshots its end-to-end
suite writes. The story shows captured real games exactly as the app shows them.

## Where every figure in the story comes from

| Story figure | Source | Check |
|---|---|---|
| 6 live · 1 in overtime · 2 in the red zone | `docs/screenshots/slate-1440.png`, the NFL Week 1 replay at 4:33 PM ET | read off the capture |
| NO at DET, OT 4:57, 24 to 31 · ARI at LAC, Q1 9:34, 0 to 0 | the same capture | ✓ |
| Watch next: "Overtime · 7-point game", "Tying or go-ahead chance in the red zone" | the same capture | ✓ |
| CHI at CAR, Q4 1:57, 59 to 37 · GB at MIN, Q1 12:11, 3 to 0 | `fixtures/espn/summary`, the last play before 20:33:38Z | clocks match the capture |
| ARI drive: 10 plays, 65 yards, ARI 30 to 2nd & Goal at the LAC 5 | `summary/nfl-401872926.json`, drive 1, each play's start and end yard line | 27+2+0+11+5+4+2+0+11+3 = 65 |
| ESPN win probability LAC 70% | `winprobability`, play 401872926272: 0.6959 | ✓ |
| DraftKings LAC −8.5 · O/U 47.5 | `pickcenter` closing lines (they opened at −11.5 and 45.5) | ✓ |
| Kalshi LAC to win 73.5¢ | `fixtures/kalshi/nfl-20260913.json`, the 20:33 minute: bid 0.73, ask 0.74, midpoint 0.735; the card writes it as −277 | ✓ |
| Touchdown ARI, 5-yard run, Q1 8:49 · LAC 65%, ARI +5 | play 401872926301; 0.6489 after it; `formatSwing` rounds the 0.047 move to +5; "Touchdown ARI" is the title `shared/alerts.ts` writes | ✓ |
| 446 tests · 60 Chrome journeys | `npm test` and `npm run test:e2e` at 0.5.1 | 446 passed · 67 passed, 60 in Chrome |

## What the story deliberately leaves out

- Player names, although the captured plays carry them.
- Team colours. The window keeps the site's palette; the field is the deep
  forest of Gridiron's own fields.
- Anything the provider did not report. The ball moves only between reported
  spots along the centre line; the incomplete pass and the run for no gain draw
  nothing, because the ball did not move.
- A live state. Every phase is the replay, and the bay says captured real games.

## How it was built

The case states that Gridiron was implemented with Claude Code from John's
brief, because that is how it was built. Unlike the Cursor-built products, that
is written into the case rather than left for a reader to assume.
