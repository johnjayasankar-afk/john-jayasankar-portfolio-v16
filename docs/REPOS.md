# Repositories

Which repository serves which live thing, and what should be archived. Taken
from the local clones, the live deployments and GitHub's public pages on
25 September 2026. Nothing here has been deleted or archived: this is the map
and the recommendation, and the deletions come after the Vercel side is checked.

## How this was gathered, and what it cannot see

Local clones under `~/Documents/GitHub` gave the remote, the branch, the commit
count and the date of the last commit. Public or private was read from whether
`github.com/johnjayasankar-afk/<name>` answers 200 without a session. The live
deployments were requested directly.

**The Vercel side was not readable.** No `vercel` CLI and no authenticated API
access from here, so the connection from each Vercel project to its Git
repository is inferred from what each hostname serves, not confirmed. Before
archiving anything, open Vercel and confirm the project behind each live
hostname. An archived repository still deploys, but a deleted one does not, and
the failure is silent until the next push.

## The live map

| Live | Canonical repository | Commits | Last commit | Note |
|---|---|---|---|---|
| johnjayasankar.com | `john-jayasankar-portfolio-v16` | 21 | 2026-09-25 | The name says v16; it is the only live portfolio |
| labs.johnjayasankar.com | `labs` | 7 | 2026-09-25 | |
| ride-lens2.vercel.app | `RideLens2` | 21 | 2026-09-25 | |
| daylight-app-wine.vercel.app | `daylightapp2` | 2 | 2026-09-13 | The marketing site, not the app |
| (the macOS app itself) | `Daylight` | 22 | 2026-09-12 | See the warning below |
| rail-drop3.vercel.app | `RailDrop3` | 40 | 2026-09-25 | |
| gridiron-pink-chi.vercel.app | `gridiron` | 14 | 2026-09-25 | Also serves gridiron-ntsq; see docs/DOMAINS.md |
| agent-fit2.vercel.app | `AgentFit2` | 8 | 2026-09-13 | |
| cartonry.vercel.app | `-cartonry2` | 1 | 2026-09-14 | The repository name begins with a dash |
| keep-floor.vercel.app | `KeepFloor` | 2 | 2026-09-13 | |
| pricing-hub-seven.vercel.app | `pricinghub3` | 1 | 2026-09-14 | |

## Two things to fix before anything is archived

**`Daylight` has no remote on the local clone.** It is 22 commits of Swift, the
most substantial single codebase after Gridiron, and `git remote -v` in the
local clone returns nothing. A repository called `Daylight` is public on GitHub,
so the code is almost certainly pushed, but this clone is not wired to it and
cannot be pushed from. Confirm the two are the same before relying on either.
Until then the only copy of any unpushed work is this disk.

**`gridiron` has `node_modules` committed to it.** 12,792 files, tracked at
HEAD. `.gitignore` lists `node_modules/`, which does nothing for files already
tracked: the rule only applies to untracked ones. The cost is a repository an
order of magnitude larger than the code in it, a clone that is mostly other
people's packages, and an enormous diff on every `npm install`. It also means
`git add -A` in that repository stages thirteen thousand files, so any careless
commit buries the real change.

The fix is `git rm -r --cached node_modules` and one commit. It removes nothing
from disk and nothing from the build. It does rewrite what a future clone gets,
and it is a large commit, so it is left here as a recommendation rather than
done in passing. The same check came back clean for `RideLens2`, `RailDrop3`,
`labs` and this repository.

**Two repository names begin with a dash**: `-cartonry2`, which is public and
live, and `-john-jayasankar-portfolio-v6`, which is private. A leading dash
makes the name look like a flag to every command-line tool: `ls -cartonry2` and
`grep pattern -cartonry2` both fail, and `rm -cartonry2` does something
unintended. Rename both. GitHub keeps a redirect from the old name, and the
Vercel project keeps building.

## The portfolio problem

Fifteen public repositories hold a version of this site:

```
john-jayasankar-portfolio-v2   PUBLIC   1 commit    2026-08-29
john-jayasankar-portfolio-v3   PUBLIC   1 commit    2026-08-29
john-jayasankar-portfolio-v4   PUBLIC   1 commit    2026-08-29
john-jayasankar-portfolio-v5   PUBLIC   1 commit    2026-08-29
john-jayasankar-portfolio-v6   PUBLIC   1 commit    2026-08-31
john-jayasankar-portfolio-v7   PUBLIC   1 commit    2026-08-31
john-jayasankar-portfolio-v8   PUBLIC   1 commit    2026-08-31
john-jayasankar-portfolio-v10  PUBLIC   1 commit    2026-08-31
john-jayasankar-portfolio-v11  PUBLIC   1 commit    2026-09-01
john-jayasankar-portfolio-v12  PUBLIC   1 commit    2026-09-01
john-jayasankar-portfolio-v13  PUBLIC   1 commit    2026-09-01
john-jayasankar-portfolio-v14  PUBLIC   1 commit    2026-09-01
john-jayasankar-portfolio-v15  PUBLIC   2 commits   2026-09-01
john-jayasankar-portfolio-v16  PUBLIC   21 commits  2026-09-25   <- live
john-jayasankar-portfolio-v17  PUBLIC   1 commit    2026-09-02
```

Twelve of them hold exactly one commit. `v17` is a month older than `v16` and
carries one commit, so the highest number is not the live one and there is no
way to tell that from outside. Someone who looks at this GitHub account before
an interview sees fifteen near-identical repositories and a naming scheme that
points them at the wrong one.

`john-jayasankar-portfolio`, the name the live repository should have, is
already taken by a **private** repository holding a different, earlier site:
hand-written `index.html` and `404.html`, a `research/` directory, a
`set-domain.sh`, and three commits ending 2026-09-08. It has no generator and
no `tools/`. It is not an earlier version of v16; it is a different site.

### Recommended sequence

1. **Confirm in Vercel** which project serves johnjayasankar.com and which
   repository it is connected to. Everything below assumes it is `v16`.
2. **Rename the private `john-jayasankar-portfolio`** to something that says
   what it is, for example `john-jayasankar-portfolio-first-site`. It is private,
   nothing links it, and renaming frees the good name.
3. **Rename `john-jayasankar-portfolio-v16` to `john-jayasankar-portfolio`.**
   GitHub redirects the old name, and Vercel follows a rename on a connected
   repository. Confirm the next deploy succeeds before step 4.
4. **Archive, do not delete, the other fourteen.** Archiving makes a repository
   read only and marks it archived on the profile, which is the honest signal:
   these are superseded, not hidden. Deleting also works, and loses the history
   of how the site got here, which is the one thing they are good for.
5. If the fourteen should not appear at all, make them **private** rather than
   deleting them. A private repository keeps the history and shows nobody.

Archiving is reversible. Deleting is not. Recommendation: archive.

## The rest of the account

Each product has more than one repository, for the same reason the portfolio
does. The pattern is the same everywhere: the working repository is the one with
commits, and the rest are single-commit snapshots.

| Family | Canonical | Superseded | Recommendation |
|---|---|---|---|
| RideLens | `RideLens2` (21) | `ridelens` (6), `rideshare` (2) | Archive both |
| Daylight | `Daylight` (22, the app), `daylightapp2` (2, the site) | `DaylightApp` (7) | Establish what `DaylightApp` is before archiving; 7 commits is not a snapshot |
| RailDrop | `RailDrop3` (40) | `RailDrop` (2), `RailDrop2` (9), `rail-drop4` (1) | Archive all three. `rail-drop4` is the trap: a higher number, one commit |
| Gridiron | `gridiron` (14) | none | Delete the duplicate **Vercel project**, not a repository |
| AgentFit | `AgentFit2` (8) | `agentfit` (2, private, on branch `v1-decision-instrument`) | Leave; it is private and holds a different design |
| Cartonry | `-cartonry2` (1) | `Cartonry` (2) | Rename `-cartonry2` first, then archive `Cartonry` |
| KeepFloor | `KeepFloor` (2) | none | Nothing to do |
| Pricing Hub | `pricinghub3` (1) | `PricingHub` (8), `pricinghub2` (1) | `PricingHub` has 8 commits and `pricinghub3` has 1; check which holds the real history before archiving anything |

Not products, listed so the account map is complete: `FollowThrough`,
`jobSearchOS`, `jobsearchOS2`, `jobsearchOS3`, `jobsearchOS4`, `profit`. Six
repositories, none linked from either site. `profit` has no commits on any
branch. They are separate from this work and are named here only so that a
future pass does not have to rediscover them.

## What is counted where

The figures on both sites are counted from these repositories by
`tools/claims.py` and re-derived by `tools/verify_claims.py`. The verifier
resolves each one under the parent directory of this repository, or under
`CLAIMS_REPO_ROOT`. Renaming a repository therefore breaks the verifier until
`source=` in the ledger is updated to match, and the verifier will say so
rather than passing quietly.
