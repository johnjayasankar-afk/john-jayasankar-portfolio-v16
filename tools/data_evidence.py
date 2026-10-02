#!/usr/bin/env python3
"""Copy for /evidence, the page that prints the claims ledger.

Every figure on this site is already declared once in claims.py with its
source, its method and the date it was last confirmed. Until this page existed
a reader had no way to see any of that: the ledger shipped in tools/, which
.vercelignore keeps out of the deploy. This page is the ledger, in public.

No count is written here. The headline numbers and the group sizes are counted
from the ledger at build time, so this page cannot drift from the thing it
claims to describe."""

KICKER = 'Evidence'

H1 = ('Every figure, declared once.', 'With how each one was established.')

LEDE = ('Each number printed on this site is declared in a single ledger with where it came from, how it is '
        'counted, and the date it was last confirmed. This page is that ledger, in full and unedited.')

# The three honest states a figure can be in. The ledger never blurs them, so
# neither does the page. `key` matches the group the build sorts rows into.
GROUPS = [
    dict(key='checked', n=1,
         kicker='Re-derived here',
         h2=('Counted from source.', 'Offline, in under a second.'),
         lede='A script in this repository counts each of these from source, offline, in well under a second. '
              'If one of these numbers moved and the site did not, the check would say so.'),
    dict(key='unchecked', n=2,
         kicker='Re-derivable, not here',
         h2=('Countable, but not here.', 'The method is still written down.'),
         lede='These are real counts with real methods. Some need installed dependencies and real time to run; '
              'some live in another repository on another machine. The ledger records the method and does not '
              'claim a check it did not perform.'),
    dict(key='asserted', n=3,
         kicker='Asserted',
         h2=('My word, with a date on it.', 'No command can check these.'),
         lede='Work figures measured inside employer systems this repository cannot reach. Each carries the date '
              'it was last affirmed and the masking the site uses for client names and absolute notional. '
              'No command can check them, and nothing here pretends one can.'),
]

# What each `check` value means, printed beside the row that carries it.
CHECK_WORDS = dict(
    here='runs in this repository, offline',
    build='runs, but needs installed dependencies',
    elsewhere='re-derivable in principle, not on this machine',
    none='no machine source',
)

ORIGIN_WORDS = dict(
    repo='counted from a repository',
    document='read from a document',
    asserted='affirmed by me',
)

# The closing note. It says the one thing a ledger cannot say about itself.
NOTE_H = 'What this page does not prove'
NOTE = ['A ledger is a record of method, not a guarantee of truth. It shows that every figure on this site has '
        'one declared source and one declared way of being counted, and that the countable ones are counted. '
        'It cannot vouch for the asserted figures, which came out of systems neither you nor this repository can reach. '
        'Those are my word, with a date on them.',
        'If a number here matters to you, ask me how it was measured. The method is already written down, which '
        'is the point of writing it down.']

BAND_LABEL = 'The ledger at a glance'
