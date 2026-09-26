#!/usr/bin/env python3
"""The claims ledger for johnjayasankar.com. Dev-only: tools/ is excluded from
the deploy by .vercelignore.

    python3 tools/claims.py            # the ledger as a table
    python3 tools/claims.py --json     # the ledger as JSON

Every verifiable figure printed on this site is declared here exactly once,
with where it came from and whether a machine can re-derive it. The page data
in data_systems_*.py reads from here through M() and V() and carries no figure
of its own, so a number cannot be changed on the site without being changed in
the ledger. tools/verify_claims.py re-derives what it can and reports the rest
as unchecked rather than as passing.

The format is shared with the Labs site so one verifier serves both. Both
repositories declare LEDGER_FORMAT and define Claim with the same fields; see
verify_claims.py, which is byte-identical in both.

A claim has three honest states and the ledger never blurs them:

  checked    a command re-derived the number today
  unchecked  the number is re-derivable, but not here and not now
  asserted   there is no machine source; a person vouched for it on a date

`check` says which:

  here       method runs in the source repo, offline, in well under a second
  build      method runs, but needs installed dependencies and real time
  elsewhere  re-derivable in principle, but not on this machine
  none       asserted

Work figures from employment are asserted by definition: they were measured
inside systems this repository cannot reach. They carry the date they were
last affirmed and the masking the site uses, and nothing pretends otherwise.
build.py prints a warning for any asserted figure older than STALE_AFTER_DAYS.
It is a warning on purpose: an old measurement is not a wrong one, and the
build has no way to tell the difference."""

import datetime
import json
import sys
from dataclasses import dataclass, asdict

LEDGER_FORMAT = 1

# An asserted figure older than this is flagged by the build. Six months: long
# enough that a stable figure is not nagged about, short enough that a figure
# nobody can still vouch for surfaces before someone reads it in an interview.
STALE_AFTER_DAYS = 180


@dataclass(frozen=True)
class Claim:
    """One figure on the site, declared once."""

    # Stable key, 'subject.figure'. Never reused for a different figure. The
    # page data refers to a claim by this id, so it also has to read well.
    id: str
    # The value exactly as the site prints it.
    value: str
    # The words the site prints beside it.
    about: str
    # 'repo' | 'document' | 'asserted'
    origin: str
    # For 'repo': the sibling repository's directory name.
    # For 'document': a path, repo-relative if `source_repo` is set.
    source: str
    # How the figure is counted, or how it was established.
    method: str
    # 'here' | 'build' | 'elsewhere' | 'none'
    check: str
    # ISO date the value was last confirmed against its source.
    verified: str
    # The repository `method` runs in, when that is not `source`.
    source_repo: str = ''
    # The claim this one backs rather than being printed itself: the mechanism
    # behind a rule, or the second half of a figure's label. A supporting claim
    # is in use when the claim it supports is.
    supports: str = ''
    # What `method` must print, when that is not `value`.
    expect: str = ''
    note: str = ''

    def expected(self):
        return self.expect or self.value

    def age_days(self, today=None):
        today = today or datetime.date.today()
        return (today - datetime.date.fromisoformat(self.verified)).days

    def stale(self, today=None):
        return self.check == 'none' and self.age_days(today) > STALE_AFTER_DAYS


def C(**kw):
    return Claim(**kw)


# ---------------------------------------------------------------------------
# Work. Measured inside systems this repository cannot reach, so every one of
# these is asserted: a date and a person, not a command. The site masks client
# names and absolute notional; the ledger masks them the same way.
# ---------------------------------------------------------------------------

WORK = [
    C(id='setup-agent.time', value='3.5h → 8m', about='setup time',
      origin='asserted', source='', check='none', verified='2026-09-17',
      method='Median configuration time before and after the Setup Agent, '
             'from the run records of the compression service it configures.',
      note='Employer system. No client or product name is published.'),
    C(id='setup-agent.volume', value='3×', about='run volume',
      origin='asserted', source='', check='none', verified='2026-09-17',
      method='Runs per period after the agent shipped, against the same '
             'period before it.'),
    C(id='setup-agent.errors', value='0', about='AI config errors / 6 mo',
      origin='asserted', source='', check='none', verified='2026-09-17',
      method='Configuration errors attributable to the agent over the first '
             'six months live, counted from incident records.'),

    C(id='incident-agent.time', value='4.5h → 11m', about='investigation',
      origin='asserted', source='', check='none', verified='2026-09-17',
      method='Median time from alert to named cause, before and after.'),
    C(id='incident-agent.escalations', value='−78%', about='escalations',
      origin='asserted', source='', check='none', verified='2026-09-17',
      method='Escalations to engineering per period, after against before.'),
    C(id='incident-agent.hours', value='750+', about='eng hours / year',
      origin='asserted', source='', check='none', verified='2026-09-17',
      method='Engineering hours returned per year, from the escalation drop '
             'at the observed rate. A floor, not a point estimate.'),

    C(id='cross-currency.reduction', value='+34%', about='notional reduction / run',
      origin='asserted', source='', check='none', verified='2026-09-17',
      method='Notional removed per run after cross-currency eligibility, '
             'against the same population before it.'),
    C(id='cross-currency.scale', value='18 banks', about='12 currency pairs',
      origin='asserted', source='', check='none', verified='2026-09-17',
      method='Participants and pairs in the live cycle. Counts only; no '
             'participant is named.'),
    C(id='cross-currency.eligible', value='$X.XT', about='eligible notional',
      origin='asserted', source='', check='none', verified='2026-09-17',
      method='Eligible notional per cycle, masked. The order of magnitude is '
             'published; the figure is not.',
      note='Masked on purpose. Do not unmask.'),

    C(id='valuation.resubmissions', value='−91%', about='resubmissions',
      origin='asserted', source='', check='none', verified='2026-09-17',
      method='Resubmitted files per cycle after dual-source validation, '
             'against before.'),
    C(id='valuation.detection', value='48h', about='earlier detection',
      origin='asserted', source='', check='none', verified='2026-09-17',
      method='How much earlier a bad valuation is caught, from the cycle '
             'calendar.'),
    C(id='valuation.cycle', value='$XT+', about='cycle notional',
      origin='asserted', source='', check='none', verified='2026-09-17',
      method='Notional per cycle, masked.',
      note='Masked on purpose. Do not unmask.'),

    C(id='fx-compression.runs', value='40+', about='live runs',
      origin='asserted', source='', check='none', verified='2026-09-17',
      method='Live runs to date. A floor.'),
    C(id='fx-compression.acceptance', value='100%', about='proposal acceptance',
      origin='asserted', source='', check='none', verified='2026-09-17',
      method='Proposals accepted over proposals made, across those runs.'),
    C(id='fx-compression.failures', value='−94%', about='live failures',
      origin='asserted', source='', check='none', verified='2026-09-17',
      method='Run failures per period after the rebuild, against before.'),

    C(id='platform.systems', value='5', about='enterprise systems',
      origin='asserted', source='', check='none', verified='2026-09-17',
      method='Systems built on the shared platform. Counted from the six '
             'systems on this site, less the platform itself.'),

    C(id='margin-simulator.origination', value='0→1', about='originated and shipped',
      origin='asserted', source='', check='none', verified='2026-09-17',
      method='The product did not exist and then it shipped.'),
    C(id='margin-simulator.reduction', value='up to −30%', about='initial margin',
      origin='asserted', source='', check='none', verified='2026-09-17',
      method='Best observed initial-margin reduction on a simulated trade set. '
             '"up to" is load-bearing: it is a ceiling, not a typical result.'),
    C(id='margin-simulator.clients', value='20+', about='enterprise clients',
      origin='asserted', source='', check='none', verified='2026-09-17',
      method='Distinct client institutions using it. A floor. None is named.'),
]


# ---------------------------------------------------------------------------
# Products. These are built in repositories on disk, so most of them are a
# command away from being re-derived. Where they are not, the ledger says so.
# ---------------------------------------------------------------------------

PRODUCTS = [
    C(id='labs.live', value='eight', about='products on Labs',
      origin='repo', source='labs', check='here', verified='2026-09-25',
      expect='8',
      method='builds in BUILDS, tools/data.py in the Labs repository. This '
             'site carries case studies for four of them, so the count has to '
             'come from the other site rather than from this one.'),
    C(id='ridelens.providers', value='4', about='providers, one board',
      origin='repo', source='RideLens2', check='here', verified='2026-09-25',
      method="entries in SURFACEABLE_PROVIDERS, "
             "src/lib/sources/ratecard/public-rate-card-quote-source.ts"),
    C(id='ridelens.ranks', value='3', about='ways to rank a trip',
      origin='repo', source='RideLens2', check='here', verified='2026-09-25',
      method='members of type RankingMode, src/components/compare-form.tsx'),
    C(id='ridelens.ranges', value='Honest', about='ranges stay ranges',
      origin='repo', source='RideLens2', check='here', verified='2026-09-25',
      expect='1',
      method='src/lib/domain/money.ts carries rankingMidpointMinor, commented '
             '"never shown as the fare": the midpoint orders the board and is '
             'not printed. Counted as 1 occurrence of that comment.',
      note='A design claim, checked by the one line that enforces it.'),

    C(id='daylight.layers', value='6', about='layers, one fixed order',
      origin='repo', source='Daylight', check='here', verified='2026-09-25',
      method='cases in enum ControlLayer, Sources/DaylightCore/Policy.swift'),
    C(id='daylight.certainty', value='3', about='levels of certainty',
      origin='repo', source='Daylight', check='here', verified='2026-09-25',
      method='cases in enum ApplicationConfidence, '
             'Sources/DaylightCore/Device.swift'),
    C(id='daylight.tests', value='263', about='tests, no dependencies',
      origin='repo', source='Daylight', check='here', verified='2026-09-25',
      method='func test declarations in Sources/DaylightTests',
      note='Static count equals the runner count here because the suite has '
           'its own harness: every test is a func test, and AllTests.swift '
           'runs all of them. Daylight IMPROVEMENTS.md records the same 263.'),
    C(id='daylight.dependencies', value='0', about='no dependencies',
      origin='repo', source='Daylight', check='here', verified='2026-09-25',
      supports='daylight.tests',
      method='.package(url: entries in Package.swift'),

    C(id='raildrop.window', value='±1 day', about='default watch window',
      origin='repo', source='RailDrop3', check='here', verified='2026-09-25',
      expect='1',
      method='the day count marked recommended in the window selector, '
             'src/components/new-watch-form.tsx'),
    C(id='raildrop.email', value='1 email', about='only when it improves',
      origin='document', source='README.md', source_repo='RailDrop3',
      check='elsewhere', verified='2026-09-25',
      method='A behavioural claim about the alert path: one email is sent, and '
             'only when a listed fare beats what was paid. Re-deriving it '
             'means running the alert pipeline against a price feed, which '
             'this machine cannot do offline.'),
    C(id='raildrop.prices', value='0', about='invented prices',
      origin='repo', source='RailDrop3', check='here', verified='2026-09-25',
      expect='5',
      method='UNKNOWN members across the domain enumerations in '
             'src/lib/domain/types.ts: fare family, travel class, service '
             'type, availability and price semantics each admit "we do not '
             'know" as a value, so a missing fact is a status rather than a '
             'number.'),

    C(id='gridiron.sources', value='3', about='sources, each named',
      origin='document', source='README.md', source_repo='gridiron',
      check='elsewhere', verified='2026-09-25',
      method='ESPN win probability, DraftKings lines and Kalshi prices: three '
             'named sources of figures, fetched over two providers, because '
             'the DraftKings line arrives through ESPN. README "Data sources '
             'and coverage limits" names all three.',
      note='Three attributions, two hosts. The site says "sources, each '
           'named", which is the attribution count, and that is the honest '
           'reading only because every figure carries its source in the UI.'),
    C(id='gridiron.guessed', value='0', about='guessed ball spots',
      origin='repo', source='gridiron', check='here', verified='2026-09-25',
      expect='1',
      method='SPOT_UNAVAILABLE in shared/format.ts: a play with no reported '
             'spot renders "Ball spot unavailable" instead of a position. '
             'Held by tests/watch-delay.test.ts and e2e/slate.spec.ts.'),
    C(id='gridiron.tests', value='669', about='unit and integration tests',
      origin='repo', source='gridiron', check='build', verified='2026-09-25',
      method='the total vitest reports: npm test'),
    C(id='gridiron.journeys', value='144', about='end-to-end journeys',
      origin='repo', source='gridiron', check='build', verified='2026-09-25',
      method='journeys Playwright lists for the desktop-chrome project'),
    C(id='gridiron.version', value='0.6.0', about='version the tests ran at',
      origin='repo', source='gridiron', check='here', verified='2026-09-25',
      method='version in package.json'),
]

CLAIMS = WORK + PRODUCTS

# The command that re-derives each 'here' or 'build' claim, run from the root
# of its source repository. Kept beside the ledger rather than inside it so a
# claim reads as a sentence and the shell stays in one place.
DERIVE = {
    'labs.live':
        "grep -c \"^        slug='\" tools/data.py",
    'ridelens.providers':
        "sed -n 's/^const SURFACEABLE_PROVIDERS[^[]*\\[\\(.*\\)\\];$/\\1/p' "
        "src/lib/sources/ratecard/public-rate-card-quote-source.ts "
        "| tr ',' '\\n' | grep -c '\"'",
    'ridelens.ranks':
        "sed -n 's/^type RankingMode = //p' src/components/compare-form.tsx "
        "| tr '|' '\\n' | grep -c '\"'",
    'ridelens.ranges':
        "grep -c 'never shown as the fare' src/lib/domain/money.ts",
    'daylight.layers':
        "awk '/^public enum ControlLayer/,/^}/' "
        "Sources/DaylightCore/Policy.swift | grep -c '^    case '",
    'daylight.certainty':
        "awk '/^public enum ApplicationConfidence/,/^}/' "
        "Sources/DaylightCore/Device.swift | grep -c '^    case '",
    'daylight.tests':
        "grep -rho 'func test' Sources/DaylightTests | wc -l | tr -d ' '",
    'daylight.dependencies':
        "{ grep -c '\\.package(url:' Package.swift || true; }",
    'raildrop.window':
        "sed -n 's/.*\\[\\([0-9]*\\), \"\u00b11 day \u00b7 recommended\"\\].*/\\1/p' "
        "src/components/new-watch-form.tsx | head -1",
    'raildrop.prices':
        "grep -c '\"UNKNOWN\"' src/lib/domain/types.ts",
    'gridiron.guessed':
        "grep -c \"^export const SPOT_UNAVAILABLE = 'Ball spot unavailable';$\" "
        "shared/format.ts",
    'gridiron.tests':
        "npm test 2>&1 | sed -n 's/.*Tests  *\\([0-9][0-9]*\\) passed.*/\\1/p' "
        "| tail -1",
    'gridiron.journeys':
        "npx playwright test --list 2>/dev/null "
        "| grep -c '\\[desktop-chrome\\]'",
    'gridiron.version':
        "sed -n 's/.*\"version\": \"\\([^\"]*\\)\".*/\\1/p' package.json "
        "| head -1",
}


BY_ID = {c.id: c for c in CLAIMS}
assert len(BY_ID) == len(CLAIMS), 'duplicate claim id in the ledger'


def M(cid):
    """A (value, label) pair for a metrics row. The page data calls this so it
    carries no figure of its own."""
    c = BY_ID[cid]
    return (c.value, c.about)


def V(cid):
    """Just the value, for a figure inside a sentence."""
    return BY_ID[cid].value


def supporting(cid):
    """The claims that back this one: the mechanism behind a rule, or the
    evidence behind half a label."""
    return [c for c in CLAIMS if c.supports == cid]


def checked_on(*cids):
    """The date the given figures were last checked together, as the site
    prints it. The oldest one wins: a line that says "checked on" has to mean
    every figure beside it."""
    d = min(datetime.date.fromisoformat(BY_ID[c].verified) for c in cids)
    return d.strftime('%-d %B %Y')


def stale_claims(today=None):
    """Asserted figures older than STALE_AFTER_DAYS, for the build to warn
    about. Never an error: an old measurement is not a wrong one."""
    return [c for c in CLAIMS if c.stale(today)]


def main():
    if '--json' in sys.argv:
        print(json.dumps({'format': LEDGER_FORMAT,
                          'claims': [asdict(c) for c in CLAIMS]}, indent=2,
                         ensure_ascii=False))
        return
    w = max(len(c.id) for c in CLAIMS)
    for c in CLAIMS:
        print(f'{c.id:<{w}}  {c.value:<12}  {c.check:<9}  {c.verified}  {c.about}')
    n = len(CLAIMS)
    here = sum(1 for c in CLAIMS if c.check == 'here')
    build = sum(1 for c in CLAIMS if c.check == 'build')
    print(f'\n{n} claims: {here} checkable here, {build} on a build, '
          f'{n - here - build} neither.')
    for c in stale_claims():
        print(f'stale: {c.id} asserted {c.age_days()} days ago')


if __name__ == '__main__':
    main()
