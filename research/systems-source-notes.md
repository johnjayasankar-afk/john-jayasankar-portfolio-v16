# Systems source notes (internal)

Public materials inform visual mechanics only. John's portfolio remains the source of personal claims, metrics, dates, and ownership.

## OpenGamma Simulate / What-If
- Source: https://opengamma.com/simulate/
- Also: https://opengamma.com/what-if-tool-for-traders/, https://opengamma.com/managing-liquidity-during-volatility/, docs.opengamma.com what-if workflow
- Concept: current portfolio vs hypothetical change (add / remove / edit positions)
- User question: what happens to initial margin / financing cost / capacity if I execute this?
- Compare allocations across brokers, venues, products before execution
- Value: avoid discovering capital consequence after the trade, when moving it is expensive
- Relevant project: JJ-SYS-07 Pre-trade margin simulator
- Safe to represent: CURRENT vs PROPOSED vs SIMULATED delta. Native methodologies already claimed in the portfolio (CME SPAN, ICE IRM). Do not invent clients, APIs, or new metrics.

## Quantile IRC fact sheet + LSEG compression pages
- Source: `/Users/johnjayasankar/Desktop/Quantile/Quantile IRC Fact Sheet.pdf`
- Also: https://www.lseg.com/en/post-trade/solutions/optimise/interest-rate-compression
- Workflow: Submit & validate (participants + risk constraints) → Identify (terminations, residual trades, risk replacements) → Accept & execute at CCP
- Core idea: reduce gross notional and trade count while preserving overall risk profile and valuation
- Multilateral: network of participants, not bilateral cancellation
- Flexible constraints: clients control risk while the engine optimizes
- Relevant project: JJ-SYS-03 cross-currency compression (settlement / eligibility are John's claims). Visual may use generic multilateral compression mechanics. Do not attribute IRC product awards, "hundreds of trillions," or internal APIs to John.
- Safe to represent: dense network → constrained multilateral solution → fewer gross positions, stable risk envelope.

## Visual translation
- 2D network / fact-sheet flow → spatial 5-participant graph + glass risk envelope that holds while ribbons collapse
- HUD: Gross / Run (identify → constraints → multilateral solution → terminate) / Compressed, plus P1–P5 hover traces
- Schematic bars: gross notional falls, risk profile stays. Not a live engine output.
- Before/after IM table → landscape morph + Current / + Trade / Simulate / Compare
- Incoming pearl cube = hypothetical position. Ghost marker in Compare = baseline vs with-trade.
- Schematic IM bars only. Do not present as calculated output.
- Do not copy vendor diagrams, screenshots, or brand color.
