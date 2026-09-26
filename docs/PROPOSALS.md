# Proposals

Two questions this repository should answer before it builds anything else.
Argument, cost, recommendation. Nothing here has been built.

---

## 1. Where the Labs case studies should live

### The situation

RideLens, Daylight, RailDrop and Gridiron each exist twice. Here they have a
`/work/` case study: the problem, the build, the figures, the schematic, what it
refuses to do. On Labs they have a build card: the same three figures, the same
schematic in miniature, the rule, and a link to the live product.

Until this cycle the portfolio also said "Four independent products" where eight
exist, so a visitor who never reached Labs undercounted the shipped work by half.
That wording is fixed. The structural question it exposed is not.

### What each option costs

**A. Consolidate onto Labs; the portfolio points at them.**

The portfolio keeps a short Labs section and stops carrying four full case
studies. Labs grows a case study per build, eight of them.

- Saves: one copy of every product fact instead of two. Today a figure changing
  means editing `tools/data_systems_b.py` and `tools/data.py`, and until this
  cycle nothing checked that they agreed.
- Costs: the portfolio loses four of its eleven case studies, and the four that
  demonstrate end-to-end ownership most directly. A recruiter who opens
  johnjayasankar.com and reads for ninety seconds now sees six employer systems,
  every one of which has to be described with the client and the product name
  masked, and no unmasked work at all. That is the worst possible trade.
- Also costs: Labs would need per-build pages, which is its own open question
  (Labs `README.md`, and Labs `docs/PROPOSALS.md`).

**B. Keep both; the duplication is real but bounded.**

- Saves: nothing, on its own.
- Costs: two copies of every product fact. But that cost is now paid down. Both
  sites read their figures from `tools/claims.py`, and `tools/verify_claims.py`
  fails when a figure drifts from its source. The duplication that remains is
  prose, which is genuinely different on the two sites: the portfolio explains
  how the thing was built, Labs explains what it does.
- The real cost is a reader's, not a maintainer's: the same product described
  twice in two voices, and no signposting between them beyond a link.

**C. Move all eight onto the portfolio; Labs becomes a launcher.**

- Saves: one site to maintain in substance.
- Costs: the portfolio's Work page goes from eleven systems to fifteen, of which
  eight are independent products. The page's argument is "production AI agents
  and 0 to 1 financial infrastructure". Eight consumer and tool builds against
  six employer systems inverts that, and a reader skimming the list would take
  the products for the main thing.
- Also costs: Labs stops being a thing worth visiting, and the domain becomes a
  redirect table.

### Recommendation

**B, with one addition.** Keep both, because the two sites answer different
questions and the maintenance argument for consolidating has largely been paid
off by the ledger. The addition: each `/work/` case study should link its Labs
card and each Labs card should link its case study, which is half true today
(Labs links the case, the case does not link back). One line of data each side.

The ninety-second read is the deciding argument. A recruiter on the portfolio
should see production systems first and independent products as evidence that
the same person ships alone. Moving the products off removes the evidence;
moving them all on buries the systems.

### Cost to do the recommendation

Small. A `labs=` URL per product in `tools/data_systems_b.py` and a link in the
case study chrome. An hour, not a cycle.

---

## 2. The one figure this site is missing

### The situation

Every system here reports what changed operationally: hours returned,
percentages, run counts, proposal acceptance. None reports what the work cost or
how long it took. And the most distinctive thing on the site, the schematic
interfaces, has nothing said about how it is made.

The generator that makes this site is 82 kB of Python in `tools/`, and `tools/`
is in `.vercelignore`. The build refuses to finish on a dangling internal link,
an unresolved ARIA reference, a duplicate id, an em or en dash, or a bay whose
phases do not match its story. As of this cycle it also carries a claims ledger
that re-derives its own figures from eight other repositories and reports what
it cannot check. That is the most direct evidence of how this person works that
exists anywhere in the portfolio, and it is excluded from the deploy.

### The argument for a "how this site is built" page

It is the only artifact on the site where the reader can check the claim
themselves. Everywhere else they are asked to believe a figure about a system
they cannot see, masked because it belongs to an employer. Here the system is
the page they are reading.

It also answers the objection the rest of the site invites. A portfolio that
says "production AI agents for high-stakes workflows" and is itself a hand-rolled
static site invites the question of whether the person can build. A page that
says: Python generator, no framework, a build that refuses six classes of defect,
a ledger that checks its own numbers against eight repositories and says out loud
which ones it cannot check, answers it in one screen.

### The argument against

It is a portfolio about financial infrastructure and production AI, and a page
about the portfolio's own build system is a step sideways. Someone hiring for a
Lead PM role does not need to know how the site was generated, and a page that
shows the tooling can read as the work of someone more interested in the tooling
than the problem. There is a version of this page that is indulgent.

It also adds a page to maintain that says things about the build, which will
drift from the build unless it is generated from it, which is more work again.

### Recommendation

**Build it, on two conditions.**

First, it is about the discipline, not the tooling. The interesting claim is not
"Python, no framework". It is: this site refuses to publish a number it cannot
source, and here is the mechanism. That is the same claim every product on Labs
makes about its own data, applied to the thing making the claim. It belongs
here for the same reason Gridiron's "reported, never guessed" belongs on
Gridiron.

Second, it is generated from the build, not written alongside it. The count of
refusals, the count of claims, how many are machine checkable, how many are
asserted and when they were last affirmed: all of it is already in
`tools/claims.py` and `tools/build.py` and can be read at build time. A page
whose figures come from the ledger cannot drift from the ledger. A page that
describes the ledger in prose will.

The one figure the site is missing is not cost and not duration. It is: **of the
figures on this site, how many can a machine check, and how many are taken on
trust.** As of this cycle that is 59 distinct claims across the two sites: 36
re-derived by a command against a source repository, 4 re-derivable in principle
but not on this machine (Pricing Hub's 893 formula checks and 46 bad-data probes
need Excel; Gridiron's three named sources and RailDrop's one email are claims
about behaviour rather than counts), and 19 asserted, every one of them an
employment figure measured inside a system neither repository can reach, carrying
the date it was last affirmed and nothing else.

Publishing that ratio, and being honest that the employer figures are all in the
last group, is a stronger claim than any single percentage on the Work page. It
is also the one figure that gets worse if the site is careless, which is what
makes it worth publishing.

### Cost

Moderate. A page template, a section in `tools/build.py` that reads the ledger,
and copy. `tools/` stays in `.vercelignore`: the page is generated from the
source, it does not publish it.
