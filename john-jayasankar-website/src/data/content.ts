export const person = {
  name: "John Jayasankar",
  role: "Lead Product Manager",
  location: "New York",
  email: "johnjayasankar@gmail.com",
  linkedin: "https://www.linkedin.com/in/johnjayasankar",
  substack: "https://substack.com/@johnjayasankar",
  resume: "/John_Jayasankar_Resume.pdf",
  photo: "/john-jayasankar.jpg",
  education: {
    school: "Haverford College",
    degree: "B.A., Economics & Linguistics",
    detail: "GPA 3.9 · cum laude · Linguistics High Honors",
    year: "2022",
  },
};

export const metrics = [
  { value: "3.5h → 8m", label: "expert setup, now an agent", href: "/work/iport" },
  { value: "3×", label: "run volume, same headcount", href: "/work/iport" },
  { value: "$3M+", label: "new and expansion ARR", href: "/work" },
  { value: "$6.5T", label: "notional made eligible", href: "/work/cross-currency" },
];

export type CaseBlock = { title: string; body: string | string[] };

export type CaseStudy = {
  slug: string;
  number: string;
  kicker: string;
  title: string;
  alias: string;
  company: string;
  year: string;
  stage: string;
  summary: string;
  role: string;
  problem: string;
  decision: string;
  outcome: string;
  metrics: { value: string; label: string }[];
  chips: string[];
  flow?: { stage: string; title: string; note: string }[];
  blocks: CaseBlock[];
  featured?: boolean;
  productHref?: string;
  productLabel?: string;
};

export const liveProducts = {
  ridelens: "https://ride-lens2.vercel.app/",
  raildrop: "https://rail-drop3.vercel.app/",
} as const;

export const cases: CaseStudy[] = [
  {
    slug: "iport",
    number: "01",
    kicker: "Production AI",
    title: "Operations agent that collapsed a 3.5-hour bottleneck",
    alias: "I-Port",
    company: "Quantile · LSEG",
    year: "2025",
    stage: "0→1 to production",
    featured: true,
    summary:
      "A production AI agent sitting inside a live operations workflow, not beside it. Bounded actions, operator visibility, and a quality bar the system had to hold.",
    role: "Lead Product Manager. Owned 0→1 strategy and launch: framed the workflow, defined the agent boundary and success metrics, designed controls and rollout, and tied the product to operating leverage.",
    problem:
      "High-value compression-run setup depended on a lengthy senior-engineering workflow. It was reliable. It was also the throughput constraint: higher volume meant more expert hours the team did not have.",
    decision:
      "Treat the bottleneck as an operations product, not a chatbot. The agent receives authorized live context (run state, configurations, client data) and acts only through typed, bounded surfaces. Operators stay in the loop.",
    outcome:
      "Setup fell from 3.5 hours to 8 minutes. Run volume scaled 3× at constant headcount. Zero AI-initiated configuration errors in the first six months.",
    metrics: [
      { value: "3.5h → 8m", label: "setup time" },
      { value: "3×", label: "run volume" },
      { value: "0", label: "AI config errors / 6 mo" },
    ],
    chips: ["Bounded autonomy", "Human visibility", "Live context", "Production quality metric"],
    flow: [
      { stage: "Before", title: "3.5h expert setup", note: "Senior engineering was the throughput bottleneck." },
      { stage: "Decision", title: "Bounded agent in the workflow", note: "Live context, typed actions, operator control." },
      { stage: "After", title: "8 minutes, 3× volume", note: "Operations absorbed the load without added headcount." },
    ],
    blocks: [
      {
        title: "System pattern",
        body: [
          "Assembles only the context needed for the current run",
          "Uses controlled tool actions rather than open-ended system access",
          "Keeps operator visibility and intervention in the execution loop",
          "Measures setup speed, throughput, and configuration quality in production",
        ],
      },
    ],
  },
  {
    slug: "coco",
    number: "02",
    kicker: "Production AI · MCP",
    title: "Incident agent that returned 750 engineering hours a year",
    alias: "QT CoCo",
    company: "Quantile · LSEG",
    year: "2025",
    stage: "Production",
    summary:
      "Years of production knowledge, two domain MCP servers, and a product that diagnoses before it escalates.",
    role: "Lead Product Manager. Led development and launch, shaped domain boundaries and support workflows, and focused the product on actionable diagnosis, not generic Q&A.",
    problem:
      "Institutional production support depended on deep system knowledge accumulated over years. Investigations were slow and routinely escalated from operations to senior engineering.",
    decision:
      "Build for diagnosis. The agent retrieves evidence through two specialized MCP surfaces, applies six years of production-support knowledge, and sharpens the incident before anyone pages an expert.",
    outcome:
      "Expert investigation fell from 4.5 hours to 11 minutes. Escalations to engineering dropped 78%. 750+ senior engineering hours a year went back to product development.",
    metrics: [
      { value: "4.5h → 11m", label: "investigation" },
      { value: "-78%", label: "escalations" },
      { value: "750+", label: "eng hours / year" },
    ],
    chips: ["Domain MCP", "Evidence first", "Escalation boundary", "Expert time as KPI"],
    flow: [
      { stage: "Before", title: "4.5h investigation", note: "Deep knowledge lived with a small set of experts." },
      { stage: "Decision", title: "MCP-backed evidence triage", note: "Retrieve domain evidence, then escalate only if needed." },
      { stage: "After", title: "11 minutes", note: "Fewer escalations, engineering time returned." },
    ],
    blocks: [
      {
        title: "System pattern",
        body: [
          "Connects the agent to curated operational context through domain-specific MCP",
          "Surfaces evidence relevant to the incident instead of generic answers",
          "Structures triage so issues can be resolved or sharply scoped before escalation",
          "Uses investigation time and escalation rate as production success criteria",
        ],
      },
    ],
  },
  {
    slug: "cross-currency",
    number: "03",
    kicker: "0→1 · Market structure",
    title: "Multilateral compression for $6.5T of trapped notional",
    alias: "LCH SwapAgent",
    company: "Quantile · LSEG",
    year: "2024",
    stage: "0→1 launch",
    summary:
      "A settlement path that turned unused network offsets into an executable multilateral product.",
    role: "Product Manager. Owned the 0→1 launch across product design, eligibility, workflow, institutional onboarding, and GTM.",
    problem:
      "Cross-currency exposures were optimized in bilateral relationships. Offsets across the wider network sat unused because there was no settlement structure that could support a multilateral outcome.",
    decision:
      "Launch multilateral cross-currency compression with LCH SwapAgent as settlement counterparty. The engine finds compatible offsets across participants. Value only matters if eligibility, constraints, and settlement remain executable.",
    outcome:
      "$6.5T of previously ineligible bilateral notional became available across 12 currency pairs. 18 banks achieved 34% greater notional reduction per run than bilateral optimization.",
    metrics: [
      { value: "$6.5T", label: "eligible notional" },
      { value: "18 banks", label: "12 currency pairs" },
      { value: "+34%", label: "notional reduction / run" },
    ],
    chips: ["Multilateral network", "Settlement design", "Eligibility", "Executable outcome"],
    flow: [
      { stage: "Before", title: "Bilateral only", note: "Offsets across the wider network were unreachable." },
      { stage: "Decision", title: "SwapAgent settlement", note: "A structure that could actually clear a multilateral result." },
      { stage: "After", title: "$6.5T unlocked", note: "18 banks, 34% more reduction per run." },
    ],
    blocks: [
      {
        title: "How it works",
        body: [
          "Expands optimization from bilateral pairings to a multilateral network",
          "Identifies economically compatible offsets across participants, not pairwise cancellation",
          "Uses the settlement structure so the reduced book remains executable",
          "Measures value in notional made eligible and notional eliminated, while the risk intent of the book stays inside constraints",
        ],
      },
    ],
  },
  {
    slug: "valuation",
    number: "04",
    kicker: "Reliability · Infrastructure",
    title: "Dual-source engine that stopped $6T cycles from failing late",
    alias: "Simplified Compression",
    company: "Quantile · LSEG",
    year: "2024",
    stage: "0→1 launch",
    summary:
      "An independent valuation view plus dual-source validation. Data quality became a product control, not an operations cleanup step.",
    role: "Product Manager. Defined product strategy and launched the valuation and validation engine.",
    problem:
      "Institution-scale compression cycles depended on consistent valuation across sources. A discrepancy found late could halt a live cycle and force an expensive resubmission.",
    decision:
      "Create an independent valuation view and compare two sources before the live window. Move failure upstream, while it is still cheap.",
    outcome:
      "Discrepancies surfaced 48 hours earlier. Failed-run resubmissions fell 91% across 24 banks running $6T+ cycles.",
    metrics: [
      { value: "$6T+", label: "cycle notional" },
      { value: "48h", label: "earlier detection" },
      { value: "-91%", label: "resubmissions" },
    ],
    chips: ["Independent valuation", "Dual-source", "Shift-left controls", "Reliability KPI"],
    blocks: [
      {
        title: "How it works",
        body: [
          "Produces an independent valuation view",
          "Compares results across two sources before live execution",
          "Surfaces discrepancies early enough for teams to resolve them",
          "Turns data quality from a late-stage failure into an explicit product control",
        ],
      },
    ],
  },
  {
    slug: "fx-compression",
    number: "05",
    kicker: "FX · Production",
    title: "FX compression with margin intelligence in the optimizer",
    alias: "ForexClear",
    company: "Quantile · LSEG",
    year: "2024",
    stage: "Production",
    summary:
      "A mathematically good proposal still fails if margin inputs disagree. Reliability had to live inside the product.",
    role: "Product Manager. Designed and shipped FX-forward and NDF compression with the ForexClear margin API embedded in the optimizer.",
    problem:
      "FX optimization only creates value if the proposal survives margin constraints, data-quality checks, and live execution. Late validation made good math fail in production.",
    decision:
      "Embed the ForexClear margin API in the optimizer. Add a four-source validation layer around production inputs, before the live window.",
    outcome:
      "100% proposal acceptance across 40+ live runs. Four-source validation cut live-run failures 94%.",
    metrics: [
      { value: "40+", label: "live runs" },
      { value: "100%", label: "proposal acceptance" },
      { value: "-94%", label: "live failures" },
    ],
    chips: ["Embedded margin API", "Four-source validation", "Pre-live quality gate", "Acceptance KPI"],
    blocks: [
      {
        title: "How it works",
        body: [
          "Validates margin constraints inside the optimization workflow",
          "Cross-checks critical data across four sources",
          "Surfaces quality issues before the live production window",
          "Measures success through proposal acceptance and live-run reliability",
        ],
      },
    ],
  },
  {
    slug: "platform",
    number: "06",
    kicker: "Agent platform",
    title: "A reusable control plane for five enterprise agents",
    alias: "AI Platform & Controls",
    company: "Quantile · LSEG",
    year: "2025",
    stage: "Platform",
    summary:
      "One-off agent integrations do not scale. The scarce work was making context, tools, actions, and evaluation consistent.",
    role: "Lead Product Manager. Standardized the product and control pattern across five enterprise systems.",
    problem:
      "Individual AI workflows were becoming one-off integrations. Production scale needed a repeatable way to expose domain context and actions while keeping behavior bounded, observable, and reviewable.",
    decision:
      "Standardize human-supervised architecture: reusable MCP servers, domain APIs, Pydantic-typed actions, deterministic services, HITL gates, and shared evaluation / QA baselines.",
    outcome:
      "New agent workflows reuse proven interfaces instead of starting from zero. Agent development became a product capability, not a sequence of prototypes.",
    metrics: [
      { value: "5", label: "enterprise systems" },
      { value: "MCP + APIs", label: "reusable interfaces" },
      { value: "HITL + evals", label: "production controls" },
    ],
    chips: ["Reusable interfaces", "Typed actions", "Deterministic services", "Evaluation baseline"],
    blocks: [
      {
        title: "Control model",
        body: [
          "Typed actions constrain what an agent can attempt",
          "Deterministic services keep high-consequence logic outside the model",
          "Human approval gates consequential workflow steps",
          "Evaluation and QA baselines create a repeatable path from prototype to production",
        ],
      },
    ],
  },
  {
    slug: "margin-simulator",
    number: "07",
    kicker: "0→1 · Pre-trade",
    title: "Pre-trade simulator that made capital a decision, not a surprise",
    alias: "OpenGamma What-If",
    company: "OpenGamma · Trading Technologies",
    year: "2022-23",
    stage: "0→1",
    summary:
      "Trading teams could see current margin. They could not see what a proposed trade would do to capital across broker, venue, and product, before they executed it.",
    role: "Product Analyst. Originated and shipped the 0→1 product. Led discovery across trading, treasury, risk, and operations.",
    problem:
      "Front-office teams lacked a simple way to compare the incremental margin impact of a proposed trade across brokers, venues, and products before execution. Capital showed up after the fact.",
    decision:
      "Build a what-if engine in the trading workflow: current portfolio plus a hypothetical trade, simulated against native clearing methodologies (CME SPAN and ICE IRM) across OTC and exchange-traded venues.",
    outcome:
      "Institutional clients identified allocations with up to 30% lower initial margin for equivalent risk. Discovery and adoption spanned 20+ enterprise clients: banks, asset managers, commodity firms, and hedge funds.",
    metrics: [
      { value: "0→1", label: "originated and shipped" },
      { value: "up to -30%", label: "initial margin" },
      { value: "20+", label: "enterprise clients" },
    ],
    chips: ["Scenario before trade", "Native methodology", "Decision UX", "Capital efficiency"],
    flow: [
      { stage: "Current", title: "Portfolio IM is known", note: "Teams can see where they stand. They cannot see the next trade." },
      { stage: "What-if", title: "Propose, then simulate", note: "Add the hypothetical position and recompute margin before execution." },
      { stage: "Decide", title: "Compare allocations", note: "Cheaper venue, broker, or product becomes a pre-trade choice." },
    ],
    blocks: [
      {
        title: "How it works",
        body: [
          "Starts from the current portfolio, not a blank page",
          "Adds, edits, or removes a proposed position as a hypothetical",
          "Simulates initial margin across broker, venue, and product before execution",
          "Uses native clearing methodologies as validation anchors so the comparison is decision-grade",
        ],
      },
    ],
  },
  {
    slug: "ridelens",
    number: "08",
    kicker: "Independent product",
    title: "RideLens: every ride, one comparison",
    alias: "RideLens",
    company: "Independent",
    year: "2026",
    stage: "0→1 · live product",
    productHref: liveProducts.ridelens,
    productLabel: "Open RideLens",
    summary:
      "Live roads. Real rate cards. Uber, Lyft, Empower, and Curb in one place, ranked before you open four apps and guess.",
    role: "Product and builder. Designed the comparison model, quote honesty rules, ranking modes, and the live marketplace surface.",
    problem:
      "Getting across town meant bouncing between apps, comparing stale screenshots in my head, and hoping the fare I saw was still the fare I would pay. Ranges got flattened into fake precision. Wait times lived in a different mental tab than price.",
    decision:
      "Build one decision surface. Map the route once. Pull published rate cards and a marketplace that moves with time of day, weather, and hotspots. Keep estimates as estimates, ranges as ranges, and upfront quotes as upfront. Rank by Price, Soonest, or Value, then hand off to the provider to book.",
    outcome:
      "A working product: Photon search, OSRM routing, side-by-side provider cards, and auto-refresh after the first compare. Built end-to-end in Cursor and shipped live. I made it because I kept paying the tax of not knowing which ride was actually better tonight.",
    metrics: [
      { value: "4", label: "providers, one board" },
      { value: "Live", label: "route + marketplace" },
      { value: "Honest", label: "ranges stay ranges" },
    ],
    chips: ["Multi-provider", "Live routing", "Quote honesty", "Price · Soonest · Value"],
    flow: [
      { stage: "Fragmented", title: "Four apps, one guess", note: "Price in one place. ETA in another. Memory in between." },
      { stage: "One surface", title: "Route once, compare once", note: "Same trip. Side-by-side cards. Rank modes you can trust." },
      { stage: "Decide", title: "Pick, then book there", note: "RideLens ranks. The provider still owns the ride." },
    ],
    blocks: [
      {
        title: "Why I built it",
        body: [
          "I live in a city where the right ride changes with the clock, and where opening four apps is its own chore",
          "I wanted a product that respects uncertainty: never invent a midpoint just to look decisive",
          "The interesting work was the comparison contract, not another map widget",
        ],
      },
      {
        title: "How it works",
        body: [
          "Search From and To (or Quick fill), map the route, and line up Uber, Lyft, Empower, and Curb",
          "Fare math uses published rate cards plus a marketplace model that ticks with conditions",
          "Rank by Price, Soonest, or Value; expired quotes never win the board",
          "Open the provider to book. RideLens stays the lens, not the broker",
        ],
      },
    ],
  },
  {
    slug: "raildrop",
    number: "09",
    kicker: "Independent product",
    title: "RailDrop: know when your train gets cheaper",
    alias: "RailDrop",
    company: "Independent",
    year: "2026",
    stage: "0→1 · live product",
    productHref: liveProducts.raildrop,
    productLabel: "Open RailDrop",
    summary:
      "Book the trip. Watch every bookable Amtrak rail option across your window. One email when a listed fare actually drops. Never an invented price.",
    role: "Product and builder. Designed the watch window, honesty rules, alert discipline, and the live board that never pretends Amtrak is quieter than it is.",
    problem:
      "Northeast Corridor trips are booked early for peace of mind, then the board keeps moving. Flexible tickets can be changed, but only if you notice the drop. Most people do not. They paid $128 and never learn Regional 95 is sitting at $47.",
    decision:
      "Watch the corridor, not just the train you bought. Default window is travel day ±1. Compare against what you actually paid. Surface every eligible rail option. Alert once when the opportunity improves. Keep booking on Amtrak: copy the itinerary, confirm there, never invent a deep link or a fare.",
    outcome:
      "A live product with immediate scans, scheduled rechecks, guest watches, optional email alerts, and a board that fails honestly when the source is down. Built end-to-end in Cursor. I made it after enough trips where the cheaper train was there the whole time. I just was not watching.",
    metrics: [
      { value: "±1 day", label: "default watch window" },
      { value: "Honest", label: "never invent a fare" },
      { value: "One alert", label: "only when it improves" },
    ],
    chips: ["Fare watch", "±1 day board", "No invented prices", "You decide on Amtrak"],
    flow: [
      { stage: "Booked", title: "You already paid", note: "Peace of mind first. The board does not freeze for you." },
      { stage: "Watch", title: "Same stations, every train", note: "Regional, Acela, connections, not just your seat." },
      { stage: "Alert", title: "One precise email", note: "Opportunity improved. Confirm on Amtrak before you change anything." },
    ],
    blocks: [
      {
        title: "Why I built it",
        body: [
          "I kept buying Flexible Amtrak tickets early, then learning too late that a later Regional was half the price",
          "Existing tools either invent certainty or bury the signal in noise. I wanted quiet honesty",
          "The product is the watch discipline: same stations, every rail option, alert only when it matters",
        ],
      },
      {
        title: "How it works",
        body: [
          "Tell RailDrop stations, date, and what you paid. The first scan runs immediately",
          "Default window covers the day before, the travel day, and the day after",
          "Email only when a qualifying fare appears or the best listed price improves",
          "Copy trip details and change on Amtrak; RailDrop never invents fees, fares, or fake itineraries",
        ],
      },
    ],
  },
];

export const experience = [
  {
    company: "Quantile Technologies",
    logo: "quantile" as const,
    parent: "An LSEG business · acquired for $370M",
    location: "New York",
    related: [
      { slug: "iport", label: "I-Port" },
      { slug: "coco", label: "CoCo" },
      { slug: "cross-currency", label: "Compression" },
      { slug: "platform", label: "Platform" },
    ],
    roles: [
      {
        title: "Lead Product Manager, Portfolio Optimization",
        dates: "Sep 2025 to Present",
        points: [
          "Shipping production AI agents and a reusable human-supervised architecture across enterprise financial workflows.",
          "Generated $3M+ in new and expansion ARR across rates, FX, and cross-currency optimization.",
        ],
      },
      {
        title: "Product Manager, Portfolio Optimization",
        dates: "Jul 2023 to Sep 2025",
        points: [
          "Owned discovery, strategy, launch, and GTM for optimization products used by global banks.",
          "0→1 launches in multilateral compression, valuation/validation, and FX, then the agent layer on top of those systems.",
        ],
      },
    ],
  },
  {
    company: "OpenGamma",
    logo: "opengamma" as const,
    parent: "Acquired by Trading Technologies",
    location: "New York",
    related: [{ slug: "margin-simulator", label: "Margin simulator" }],
    roles: [
      {
        title: "Product Analyst",
        dates: "Jul 2022 to Jun 2023",
        points: [
          "Originated and shipped a 0→1 pre-trade margin simulator used in front-office workflows.",
          "Led discovery across trading, treasury, risk, and operations; adoption across 20+ enterprise clients.",
        ],
      },
    ],
  },
];

export const backers = [
  { name: "Accel", logo: "accel" as const },
  { name: "Thoma Bravo", logo: "thomabravo" as const },
  { name: "Spectrum Equity", logo: "spectrum" as const },
  { name: "FirstMark Capital", logo: "firstmark" as const },
  { name: "Dawn Capital", logo: "dawn" as const },
  { name: "Allianz X", logo: "allianzx" as const },
  { name: "LSEG", logo: "lseg" as const },
  { name: "CME Group", logo: "cme" as const },
  { name: "Japan Exchange Group", logo: "jpx" as const },
  { name: "Trading Technologies", logo: "tt" as const },
];

export const earlier = [
  { org: "Wells Fargo", logo: "wellsfargo" as const, role: "Summer Analyst, FX / Rates Trading", dates: "2021" },
  { org: "Wharton School", logo: "wharton" as const, role: "Research Assistant, reporting quality & incentives", dates: "2021" },
  { org: "Hartford Funds", logo: "hartford" as const, role: "Summer Intern, Mutual Funds & ETFs", dates: "Prior" },
  { org: "Ocean Trail Partners", logo: "oceantrail" as const, role: "Private Equity Summer Intern", dates: "Prior" },
];

export const writing = [
  {
    id: "routing-intelligence",
    tag: "AI product economics",
    title: "How much intelligence is this user action worth?",
    dek: "Routing intelligence is a unit-economics decision.",
  },
  {
    id: "autonomy",
    tag: "Agent controls",
    title: "Autonomy is a product decision, not a model capability.",
    dek: "Evidence, reversibility, and control determine where an agent should be allowed to act.",
    to: "/approach",
  },
  {
    id: "infrastructure",
    tag: "Fintech × AI",
    title: "The hardest AI products are often infrastructure products.",
    dek: "Data quality, APIs, entitlements, and workflow design decide whether the model actually ships.",
    to: "/work",
  },
];

export const principles = [
  {
    num: "01",
    title: "Start with the workflow.",
    body: "Map handoffs, exceptions, and the cost of being wrong before choosing a model. If the operating model would not change, it is not an agent problem.",
  },
  {
    num: "02",
    title: "Agents should earn autonomy.",
    body: "Context, bounded tools, deterministic services, and human control are the product. Model capability is one layer. Scope expands when evidence says it should.",
  },
  {
    num: "03",
    title: "Reliability is a feature.",
    body: "In markets and in agents, a late failure is a product failure. Validation, evals, and operator visibility belong in the design, not in the cleanup.",
  },
];

export const skills = {
  ai: ["AI agents", "LLM orchestration", "MCP servers", "Tool calling", "HITL controls", "Agent evals & QA", "Pydantic actions"],
  product: ["0→1 strategy", "Enterprise discovery", "Platform / API products", "GTM", "Pricing & packaging", "Activation"],
  domain: ["Financial infrastructure", "Portfolio optimization", "Derivatives compression", "Margin & risk", "FX / NDFs", "CCP workflows"],
  build: ["Python", "SQL", "AWS", "API design"],
};
