# Fly-Lab Experience Map

This document translates real Drosophila lab procedure into game verbs, failure modes, delayed consequences, and reviewer-facing weaknesses. It follows the parent contract in [`fly-lab-product-thesis.md`](fly-lab-product-thesis.md).

## Status

Source-backed draft: complete enough for R2/R3/R4 implementation planning.

User lived-experience pass: pending user input. Do not treat the personal-experience column as validated until the user answers the interview prompts below.

## Interview prompts for lived experience

Ask these before locking final micro-interactions:

1. Which fly-lab task did you repeat so often that your hands remember it better than your notes?
2. Which mistake cost the most time: wrong vial, missed virgin window, escaped flies, bad cross, weak assay, bad label, or something else?
3. Which visual tell was hardest when you first learned sorting: sex, marker, age, health, anesthesia state, contamination, or progeny timing?
4. What did a senior lab member or PI actually criticize in your record or setup?
5. Which moment was funny only because it was painfully real?
6. Which procedure felt satisfying when done cleanly?
7. Which lab detail should never be turned into random comedy because it would feel fake?
8. Which assay did you actually perform or observe enough that its friction can be represented confidently?

## Source bibliography

| Source | Use in game design |
|---|---|
| Bloomington Drosophila Stock Center, Fly Care: https://bdsc.indiana.edu/information/fly-culture.html | Stock maintenance, vial transfer, genotype labels, contamination, overcrowding, cross setup, virgin collection timing |
| Protocol for screening facultative parthenogenesis in Drosophila: https://pmc.ncbi.nlm.nih.gov/articles/PMC10520562/ | Example of protocol-level virgin collection timing and staged experimental workflow |
| Metabolic effects of CO2 anaesthesia in Drosophila melanogaster: https://pmc.ncbi.nlm.nih.gov/articles/PMC3497127/ | CO2 exposure as a behavior/quality confound rather than a free pause button |
| Automated Rapid Iterative Negative Geotaxis assay: https://pmc.ncbi.nlm.nih.gov/articles/PMC5752225/ | Negative geotaxis/RING assay framing, multi-fly climbing measurement, repeatable readout |
| A day in the life of a Drosophila lab: https://thenode.biologists.com/a-day-in-the-life-of-a-drosophila-lab/lablife/ | Workday rhythm: virgin collection, crosses, offspring timing, routine labor |
| BDSC optogenetics teaching stocks: https://bdsc.indiana.edu/stocks/teach/teach_optogenetics.html | Only for later optogenetic content; not a first-slice replacement for actual user experience |

## Event map

| # | Procedure event | Provenance | game verb | player skill | failure mode | delayed consequence | comedy source | SME risk |
|---|---|---|---|---|---|---|---|---|
| 1 | Flip an aging stock vial before the culture gets risky | Source-backed | Transfer adults into a fresh labeled vial | Fast but controlled handling | Too many escapees, wrong amount transferred, old vial ignored | Stock health drops; contamination or overcrowding flags appear | Everyone knows the panic of tapping too hard or too soft | Do not imply exact day limits are universal across all genotypes/temperatures |
| 2 | Write or move a complete stock label | Source-backed | Compose label fields: genotype, date, purpose, owner | Traceability discipline | Cryptic label, missing genotype, mismatched date | Later cross/assay confidence drops; reviewer attacks chain of custody | The label looked obvious yesterday and useless today | Avoid fake genotype notation that teaches wrong conventions as real |
| 3 | Decide whether a stock needs backup culture | Source-backed | Allocate one extra vial slot and food cost | Risk management | No backup made | Rare stock loss or failed cross forces restart | The boring backup becomes the hero | Do not overstate cryopreservation or backup practices in a five-minute slice |
| 4 | Inspect for mites, mold, or bad food | Source-backed | Scan vial surface and mark quarantine/discard | Visual diagnosis | Contaminated stock used anyway | Assay variance increases; stock may be locked | Shame of finding the problem after setup | Keep contamination as lab-risk abstraction, not gross-out spectacle |
| 5 | Set up a routine cross with sensible counts | Source-backed | Choose females, males, vial, setup day | Planning and proportion | Too few males, too many females, crowded vial | Low yield, slow development, ambiguous progeny | The cross was doomed politely, not dramatically | Cross ratios must be simplified and labeled as first-slice model |
| 6 | Remove parents before progeny timing confounds the cross | Source-backed | Calendar a parent-removal action | Calendar discipline | Parents left too long | Second-generation ambiguity; record becomes hard to trust | "I made data, but I also made a mystery" | Timing compression must stay transparent |
| 7 | Clear a vial before virgin collection | Source-backed | Clear adults, start collection timer | Setup timing | Clear too late or forget clear action | Virgin confidence decreases | The important task is doing nothing, then returning on time | Must not promise all genotypes share the same window |
| 8 | Collect virgin females inside the window | Source-backed | Sort newly eclosed females into a holding vial | Timing plus visual ID | Missed window, overcrowded holding vial, wrong sex | Cross confidence drops or vial must be discarded | A whole plan depends on a tiny calendar window | Virginity rule is genotype/temperature dependent; expose this as uncertainty |
| 9 | Sex flies under anesthesia | Source-backed plus user validation needed | Drag/sort flies by visual tells | Pattern recognition under time pressure | Male/female mis-sort | Wrong cross or noisy progeny scoring | Confidently sorting wrong is funnier than random chaos | Needs SME review of visual markers and UI silhouettes |
| 10 | Sort by visible marker | Source-backed plus user validation needed | Identify marker phenotype before timer pressure rises | Visual comparison | Ambiguous marker call | Assayed group may not match claimed genotype | The data is only as real as the sorting | Must avoid inventing marker visuals that contradict common teaching examples |
| 11 | Manage CO2 exposure while sorting | Source-backed | Use CO2 to slow flies, then stop before quality warning | Trade speed against assay validity | Overexposure | Behavior assay gets handling-confound flag | The pause button poisons the result | Need exact values tuned as game abstraction, not real protocol advice |
| 12 | Let flies recover before behavior assay | Source-backed | Decide whether to wait or rush | Patience under deadline | Run assay too soon | Climbing performance may be depressed by handling | The player caused the phenotype they want to publish | Recovery timing is simplified and must be validated |
| 13 | Run negative geotaxis assay | Source-backed | Tap, start timer, score climb height/count | Standardized execution | Uneven tap, mixed age/sex, poor sample size | Noisy or non-comparable record | The result depends on a very unglamorous tap | Need assay-specific SME review before claiming realism |
| 14 | Record control group alongside experimental group | Source-backed | Pair assay result with control record | Experimental discipline | Missing control | Reviewer attack: genotype vs handling cannot be separated | The missing boring tube ruins the exciting tube | Controls must be represented as useful, not bureaucratic |
| 15 | Decide whether to exclude bad trials | Source-backed plus user validation needed | Mark exclusion reason before seeing final claim | Integrity under pressure | Exclude after outcome, hide reason, keep bad trial | Reviewer suspicion rises; figure confidence falls | The notebook knows when the player cheats | Needs careful tone; do not gamify misconduct as optimal play |
| 16 | Assemble figure from notebook records | R0-derived | Select claim strength based on record quality | Claim discipline | Strong title from weak record | Reviewer attacks exact mismatch | The reviewer reads the same notebook you tried to ignore | Keep satire downstream of actual data |

## First slice candidate selection

These are the only first slice candidate events. Other events stay as supporting or later content.

| first slice candidate | Why it belongs first | Required systems | Reject if |
|---|---|---|---|
| Vial flip plus label traceability | Establishes that physical lab state matters before any result exists | Stock room, vial age, label fields, simple risk flags | It becomes only a form-filling screen |
| CO2 sorting pressure | Turns bench handling into embodied play and creates a real assay confound | Sorting UI, CO2 timer, sex/marker targets, exposure warning | It becomes a twitch minigame disconnected from records |
| Negative geotaxis assay with control | Produces the first evidence object for figure/reviewer logic | Assay record, control slot, n, noisy readout, handling warnings | It produces abstract Evidence points without raw record fields |

## Excluded from first slice

| Candidate | Reason for exclusion |
|---|---|
| Light-Induced Swarm Dance | User explicitly identified it as not grounded in their experience; keep only as later optogenetic content if backed by protocol and controls |
| Full courtship behavior loop | Rich but too specialized for the first five-minute procedure slice |
| Full balancer genetics | Important later, but it would bury the first vertical slice under notation |
| Grant, journal, or PI email systems | Wrapper pressure only; not the first mechanical substrate |
| Broad phenomenon catalog | Recreates the old prototype's drift risk |

## Implementation notes for R2-R5

- R2 should implement stock/vial/label/calendar state first because every later record needs provenance.
- R3 should use one readable cross model with confidence flags, not a general genetics solver.
- R4 should make sorting produce a record artifact, not merely a score.
- R5 should make negative geotaxis output inspectable fields: control, n, climb readout, noise, and procedural warnings.

## Completion audit

- [x] At least 12 lab events are mapped.
- [x] Each event has a game verb, failure mode, delayed consequence, and SME risk.
- [x] First slice candidates are limited to 3.
- [x] Arbitrary phenomenon-first content is excluded from first-slice candidates.
- [x] Minimum five source links are listed.
- [ ] User lived-experience answers have been collected and reflected.
