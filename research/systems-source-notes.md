# Source & insight ledger

Working notes for the domain-accuracy pass on the Systems Core artifacts.
Not shipped to the public site; kept for traceability of design decisions.

All sources below are **public marketing / product material**. They were used to
understand the *product category and workflow mechanics only*. Nothing here is
attributed to John. John's résumé and existing portfolio copy remain the sole
authority for his role, scope, decisions, metrics and outcomes.

Image classification used throughout: **A** informational reference ·
**B** structural reference · **C** visual inspiration · **D** direct asset.
Nothing was classified D. No vendor artwork, palette or branding was reproduced.

---

## 1. Quantile · Interest Rate Compression (page + IRC fact sheet PDF)

**Key concepts (verbatim public framing)**
- "multilateral interest rate compression service reduces **gross notional and
  trade count** while **preserving the overall risk profile and valuation**"
- Three-step workflow:
  1. **Submit & Validate** · multiple participants and central parties upload
     data and **set their risk constraints**
  2. **Identify Optimisation Opportunities** · the optimisation engine generates
     a proposal containing **trade terminations, residual trades and risk
     replacements**
  3. **Accept & Execute** · proposal is **validated and accepted by
     participants** and **executed at the CCP**
- Targets **multiple currencies simultaneously**; flexible constraints
- Products: IRS, OIS, basis swaps, FRAs, compounding swaps, zero coupon swaps,
  inflation swaps

**Relevant project** · 04 Cross-Currency Compression (`knot`)

**Visual insight** · The single most important idea is the *divergence between
two quantities*: gross notional collapses while the risk profile does not. That
is a two-line story, not a "many lines become fewer lines" story. The three
proposal outcomes (terminate / residual / replacement) give the network three
visually distinct end-states instead of one.

**Factual insight** · "Risk replacements" means compression **adds** new trades
as well as removing them. A visual that only deletes edges is wrong.

**Safe to represent?** Yes, generically. Public workflow, no client specifics.

---

## 2. Quantile · Counterparty Risk Optimisation

**Key concepts**
- Optimises cleared and uncleared IM and risk-based capital under **SA-CCR and
  IMM**, by "analysing the risk of transactions between participants and
  **rebalancing portfolios with new market risk neutral trades** that reduce
  risk and release capital"
- Same three-step Submit & Validate → Identify → Accept & Execute shape
- "first to sweep risk into **LCH SwapAgent**… enables it to be held more
  efficiently, provides greater access to **netting opportunities**"
- Constraints are set on **risk, notional and resource metrics**

**Relevant project** · 04 Cross-Currency Compression (`knot`)

**Visual insight** · "market risk neutral trades" is the precise, publicly
stated mechanism for risk preservation. The replacement trades should read as
*neutral* (drawn cool, thin, non-directional) against the terminated gross
exposure (drawn warm, heavy).

**Safe to represent?** Yes. SwapAgent is already in John's own portfolio copy.

---

## 3. Quantile · The Challenges

**Key concepts**
- Capital requirements driven by **G-SIB, Basel III RWA, Basel III Leverage**
- Firms face a choice between "curbing their business, raising more capital or
  improving capital efficiency"
- "By adopting a **multilateral** compression solution, you can avoid
  time-consuming **bilateral** processes and access a **deeper liquidity pool**"
- IM funding cost is a "funding drag"; the fix is "a set of new market risk
  neutral trades that deliver cost reductions **without changing risk positions**"

**Relevant project** · 04 Cross-Currency Compression (`knot`)

**Visual insight** · Confirms bilateral-vs-multilateral is the distinction the
diagram must make unmistakable. A multilateral **cycle through three or more
participants** is the clearest possible proof it is not two-party netting.

---

## 4. Quantile · FX Smart Clearing (Quantile × LCH ForexClear)

**Key concepts**
- "intelligently selecting existing **uncleared** trades to move to LCH
  ForexClear, and optimising portfolios with **new rebalancing trades**"
- Benefits of clearing: **multilateral netting**, lower counterparty risk
  weights, **settled to market (STM)** treatment
- "Quantile's optimisation then ensures the risk reduction is achieved **within
  the relevant IM and risk constraints**"

**Relevant project** · 06 FX Forward & NDF Compression (`lattice`)

**Visual insight** · Reinforces that a proposal must clear *constraints* before
it is executable. The existing gate-corridor metaphor is already right; only the
labelling needed to become more specific.

**Note** · Smart Clearing is a *different* Quantile product from the ForexClear
margin-API compression work in John's portfolio. Deliberately **not** merged
into his claims.

---

## 5. OpenGamma · Simulate / What-if  (opengamma.com/simulate)

**Key concepts (verbatim public framing)**
- "Simulate the impact of changes to your portfolio… **add, remove and edit
  positions** to identify the **cheapest option across exchanges and brokers**"
- "Margin requirements and financing costs can vary greatly across **products,
  exchanges and counterparties**. Identifying the cheapest option for new
  business requires a **simulation of all the possible alternatives**"
- "**Initial Margin limits can be a constraining factor** for firms to put on new
  trades… maximise trading capacity by factoring **limits and thresholds** into
  the trade allocation process"

**Relevant project** · 07 Pre-Trade Margin Simulator (`capital`, was `terrain`)

**Visual insight · this reframed the artifact.** Pre-trade margin is not a
smooth continuous surface with a probe on it. It is a **discrete comparison
across a small set of candidate allocations**, each with its own resulting
margin, evaluated against a **limit**. The old abstract height-field implied a
continuous optimisation that the product does not perform.

**Factual insight** · the decision has two axes, not one: *cheapest* and
*feasible under the IM limit*. Cheapest-but-over-limit is not a valid answer.

---

## 6. OpenGamma · Explain (margin drivers)

**Key concepts**
- "Margin models provide **netting benefit between products and positions**, but
  identifying the source of offsets can be difficult due to the **lack of
  transparency of most margin models**"

**Relevant project** · 07 Pre-Trade Margin Simulator (`capital`)

**Visual insight · the intellectual core of the whole artifact.** Margin is
**not additive**. The same trade costs a different amount at each venue because
it nets differently against whatever is already there. That is *why* a
simulator has to exist rather than a spreadsheet. Encoding baseline IM and
**incremental** IM as two stacked segments per candidate makes this visible in
one glance: the bars differ only in their incremental portion.

---

## 7. OpenGamma · Validate

**Key concepts**
- "**independent** reconciliations… automatically downloads and normalises your
  position, margin and financing statements… validated using our **proprietary
  analytics** · allowing us to check you are not being overcharged"
- "**identify the reasons for discrepancy** to challenge incorrect margin calls"

**Relevant project** · 05 Valuation & Validation Engine (`prism`)

**Visual insight** · Confirms the existing two-surface interference metaphor is
the right one for the category: an independent recomputation compared against
another source, with the *magnitude and location* of divergence being the
product output. No change required; the artifact already reads correctly.

---

## 8. OpenGamma · Reduce, Forecast, Allocate

Read for category context. **Reduce** publicly cites "reduce capital
requirements by up to 30%… for the same level of risk"; John's résumé
independently states his simulator let clients identify allocations with up to
30% lower initial margin for equivalent risk. These are **separate claims about
different things** and were deliberately kept separate. No public metric was
imported into John's copy.

**Forecast/Allocate** · no artifact change justified.

---

## Decisions taken

| # | Change | Justified by |
|---|---|---|
| 1 | Rebuilt `terrain` → `capital`: discrete venue/broker candidates, stacked baseline + incremental IM, IM limit plane, cheapest-feasible selection | Sources 5, 6 |
| 2 | Rebuilt `knot`: three-phase Quantile workflow, multilateral cycle detection, terminate/residual/replacement outcomes, live gross-notional vs risk-profile readout | Sources 1, 2, 3 |
| 3 | Added pointer scrubbing (drag to compare before ↔ after) on both | Brief; supported by the before/after nature of both products |
| 4 | Card + case copy tightened for mechanism accuracy only | Sources 1, 5, 6 |
| 5 | No change to `prism`, `lattice`, `orchestration`, `constellation`, `ledger`, `stack` geometry | Source 7 confirmed `prism`; others out of corpus scope |

## Explicitly NOT done

- No vendor diagram traced, recoloured or embedded.
- No vendor palette or brand identity imported.
- No new capability, client, technology or metric attributed to John.
- No inference of private architecture, algorithms or configurations.
- Smart Clearing (a distinct product) not folded into John's FX work.


---

# Appendix: the investor bar

The strip above the hero lists the institutional investors and owners behind the
two companies John has worked at. These are **facts about the companies, not
about John**. The label is worded to cover both categories: "I've worked at
firms backed and acquired by".

## Included, in order

Venture / PE / growth equity first, then the exchange groups, then the platform
company that now owns OpenGamma. Within each block, ordered by brand prestige.

| # | Firm | Company | Basis |
|---|---|---|---|
| 1 | Accel | OpenGamma | Investor from the Series B (2011) through the 2019 round |
| 2 | Thoma Bravo | OpenGamma, indirectly | Backs Trading Technologies, which acquired OpenGamma (see caveat) |
| 3 | FirstMark Capital | OpenGamma | Led the Series B (2011); follow-on in Series C |
| 4 | Spectrum Equity | Quantile | $51m growth investment, Jan 2021; Quantile's *first* institutional investor |
| 5 | Dawn Capital | OpenGamma | Led the $10m round, Apr 2019 |
| 6 | Allianz X | OpenGamma | **Led** the $21m round, Feb 2022 |
| 7 | LSEG | Quantile | Acquired Quantile; owns it today, and John works there |
| 8 | CME Group | OpenGamma | Investor via CME Ventures |
| 9 | JPX (Japan Exchange Group) | OpenGamma | $1m for a minority stake, Feb 2017 |
| 10 | Trading Technologies | OpenGamma | Acquired OpenGamma, 16 Dec 2025 (see caveat) |

Ordering rationale: Accel is a global top-tier fund. Thoma Bravo is the largest
software-focused PE firm by AUM, so it sits second on brand weight even though
its link is indirect. FirstMark is the other tier-one venture name. Spectrum is
growth equity and led the only outside round Quantile ever took. Dawn is the
strongest European B2B fund but more regional. Allianz X is a corporate venture
arm, which conventionally ranks below independent funds. The exchange block then
runs LSEG (owner of the business John works in today), CME, JPX. Trading
Technologies closes it as a platform company rather than an investor.

## Caveats on the last two, added at John's direction

Both were flagged before being added, and John asked for them anyway.

- **Trading Technologies** acquired OpenGamma on **16 December 2025**, two and a
  half years after John left in June 2023. It is an acquirer, not an investor,
  and it never owned OpenGamma while he was there. It is already named
  accurately in the Experience section as the acquirer.
- **Thoma Bravo** has no position in OpenGamma. It backs Trading Technologies,
  so its link is two hops: Thoma Bravo -> Trading Technologies -> OpenGamma,
  and only from Dec 2025.

The label was changed from "backed by" to "**backed and acquired by**" so the
strip is accurate for the whole set rather than only for the investors.

## Also excluded

- **Euclid Opportunities / ICAP / NEX** - a genuine early investor, but NEX was
  absorbed into CME Group in 2018, so CME already carries that lineage.
- **Cris Conde** (ex-SunGard CEO) - an angel, not a firm.
- **7RIDGE** - co-backer of Trading Technologies alongside Thoma Bravo; adding
  both would double-count the same relationship.

## Timing caveat worth knowing

Spectrum Equity invested in Quantile in Jan 2021 and exited through the LSEG
acquisition. John joined in July 2023, by which point Quantile was already an
LSEG business, so Spectrum was not an investor during his tenure. OpenGamma's
investors, including Allianz X, *were* in place while he was there (Jul 2022 to
Jun 2023).

## Logo treatment

Real vectors only, no rasters, all fills mapped to `currentColor` with
`fill="none"` deliberately left alone so knockout detail survives (the Spectrum
symbol, the CME globe). Defined once each in an SVG `<symbol>` sprite and
instanced with `<use>`, so three repeated marquee sets cost one copy of the
geometry.

Two marks needed surgery:

- **JPX** - shipped blank, twice. Two separate faults:
  1. The crop box was derived from a union of per-path `getBBox()` calls.
     `getBBox()` returns each path's *local* coordinates and ignores ancestor
     transforms; JPX is the only mark with nested transformed groups, so the
     translate was computed from meaningless numbers.
  2. The second attempt cropped by moving the **viewBox origin** to the content
     bbox. That works for a standalone file but breaks under `<use>`: the symbol
     is instanced at user-space (0,0), which sits outside a viewBox window that
     starts at x=37.8. It measured 191px wide and painted nothing.

  Fixed by measuring the **root** `getBBox()` and baking the crop into a
  `translate`, keeping every viewBox at origin `0 0`. There is now a check
  (`inFrame`) that asserts each mark's geometry lands inside its own viewBox, so
  this class of fault cannot ship silently again. jpx.co.jp's lockup also embeds
  the symbol as a base64 raster, so only the vector wordmark ships.
- **LSEG** - carried two `fill:none` 120x48 spacer rects from the export. They
  painted nothing but inflated `getBBox`, which masked cropping errors. Removed.
- **Allianz X** - the only published asset is a square, stacked, four-colour
  lockup: a three-tone blue X over "A company of Allianz". Flattening it to one
  ink would have destroyed the overlapping-chevron structure that *is* the mark,
  and the tagline is illegible below about 30px. So the three blues are mapped
  onto three ink opacities (1 / .78 / .45), which preserves the overlap in
  monochrome, and the tagline is dropped. **Known limitation:** this is the only
  symbol-only mark in the set, so it reads as an anonymous X to anyone who does
  not already know the brand.

Aspect ratios run from 1.1:1 (Allianz X) to 12.1:1 (FIRSTMARK), so a single
shared height is meaningless. Each mark has its own, tuned so the wordmark
cap-heights read as equal.

---

# Appendix: the portrait

Source: `techbro1.png`, 1254 x 1254, already monochrome. Resized with `sips` to
a 900px master (`portrait.jpg`, 148KB) and a 460px variant (`portrait-sm.jpg`,
40KB), served through `srcset`/`sizes` so phones do not pull the large file.

It is framed in the same language as the figure panels rather than dropped in as
a photo: hairline border, the four corner ticks used on every diagram, and a
mono caption rule beneath. The CSS filter is deliberately mild (`grayscale(1)`
on an already-monochrome source, plus a small contrast lift) with a warm
top-light and a floor shadow to seat it in the page's palette. On hover it lifts
contrast slightly and scales 2%.

The Profile grid stretches both columns to equal height, so the portrait plus
the facts list balances the body copy on the left exactly.
