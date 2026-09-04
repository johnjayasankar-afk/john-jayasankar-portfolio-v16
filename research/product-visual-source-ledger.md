# Product visual source ledger (internal)

Public sources inform mechanics only. John's portfolio remains the source of role, metrics, dates, and ownership.

## Quantile Interest Rate Compression

- SOURCE: https://www.lseg.com/en/post-trade/solutions/optimise/interest-rate-compression
- SOURCE: https://www.lseg.com/content/dam/post-trade/en_us/documents/post-trade-solutions/fact-sheets/interest-rate-compression-factsheet.pdf
- COMPANY: Quantile / LSEG
- PRODUCT: Multilateral interest rate compression
- TYPE: First-party page + fact sheet
- KEY MECHANIC: Multiple participants submit + set risk constraints → engine proposes terminations, residual trades, risk replacements → accept/execute at CCP. Gross notional and trade count fall. Overall risk profile and valuation are preserved. Multi-currency in one run. Flexible client constraints.
- VISUAL PRIMITIVE: Participant portfolios in a network; typed proposal (kill / keep / replace); stable risk envelope
- CLASS: A / B / C
- RELEVANT PROJECT: JJ-SYS-03 (domain model only). John's claims stay: SwapAgent settlement, $6.5T eligible, 18 banks, +34%/run. Do not attribute IRC awards or “trillions since launch” to John.
- SAFE: Schematic multilateral compression. Not vendor diagram copy. Not Ready. Run. Reduce.

## Quantile Counterparty Risk Optimisation

- SOURCE: https://www.lseg.com/en/post-trade/solutions/optimise/capital-optimisation
- SOURCE: https://www.lseg.com/content/dam/post-trade/en_us/documents/post-trade-solutions/fact-sheets/capital-optimisation-factsheet.pdf
- KEY MECHANIC: Analyse risk between participants; rebalance with new market-risk-neutral trades; IM / SA-CCR / IMM can move; market risk stays controlled.
- RELEVANT PROJECT: Domain contrast only. John's FX case is compression + ForexClear margin API, not CRO. Do not visualize CRO as John's FX product.

## Quantile FX / ForexClear / SwapAgent

- SOURCE: https://www.lseg.com/en/insights/post-trade/everything-you-need-to-know-about-smart-clearing
- SOURCE: https://www.lseg.com/content/dam/post-trade/en_us/documents/lch/resources/fx-smart-clearing.pdf
- KEY MECHANIC: FX book as pair/tenor structure; eligibility; IM tolerances; selective routing to a cleared venue vs residual. Margin/capital constraints bound what can move.
- RELEVANT PROJECT: JJ-SYS-05 domain model (margin inside optimizer, validation before live). Do not claim Smart Clearing backload volumes or PoC stats as John's.
- SAFE: Pair × maturity matrix + margin gate + four-source check. No flags, no tickers.

## OpenGamma Simulate / What-If

- SOURCE: https://opengamma.com/simulate/
- SOURCE: https://docs.opengamma.com/ (What-If API)
- KEY MECHANIC: Base portfolio + incremental portfolio. Results include before, after, incrementalMargin, standaloneMargin, broker/CCP allocation, capacity/limits. Cheapest venue/broker can be solved when omitted. Standalone ≠ incremental because of existing offsets.
- VISUAL PRIMITIVE: Current book; hypothetical trade; scenario branches; before/after/Δ; capacity rail; standalone vs incremental
- CLASS: A / B
- RELEVANT PROJECT: JJ-SYS-07. John's claims stay: originated 0→1, CME SPAN / ICE IRM, up to −30% IM, 20+ clients. Do not invent API fields as John's UI, or fake IM dollars.
- SAFE: Schematic bars and venue A/B/C. Not a cloned OpenGamma screen. Not a capital mountain.

## Internal products (I-Port, CoCo, AgentFit, platform)

- SOURCE: src/data/content.ts only
- No public vendor diagrams. Visuals derived from John's case copy: run/context/typed action/HITL; evidence MCP layers; autonomy ladder; reusable control plane.
