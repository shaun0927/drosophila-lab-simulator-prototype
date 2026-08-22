# Fly-Lab Product Thesis

This document supersedes the original phenomenon-first prototype direction for the R-series implementation work. The old `Publish or Perish` frame remains useful, but it is now a wrapper around a fly-lab procedure game rather than the main source of play.

## Product thesis

Plan crosses, protect stocks, collect the right flies, run messy assays, and make a claim that survives your notebook.

The game is about the pressure of doing traceable Drosophila work under time, attention, and resource constraints. The player should feel that a result is only as strong as the stock history, vial label, timing, controls, sample size, and raw observation record behind it.

## Build target

The current build target is a fly-lab procedure simulator with a publication wrapper.

It is not primarily a joke generator about absurd mutant behaviors. It is not a full educational genetics simulator. It is a narrow vertical slice where real bench habits produce game consequences:

- labels prevent future confusion
- vial age creates deadline and contamination pressure
- cross setup creates delayed payoff and possible failure
- virgin timing turns calendar discipline into tension
- sex and marker sorting create readable bench interaction
- CO2 exposure buys control at the cost of quality
- assay records become the only evidence the reviewer can attack

## Previous direction audit

| Previous element | Previous role | R-series role |
|---|---|---|
| Trait Cards | Main choice and content engine | Replaced by stock/genotype/marker materials for the first vertical slice |
| Weird named phenomena | Discovery reward | Demoted to optional flavor after a real assay record exists |
| Light-Induced Swarm Dance | Best first-run visual payoff | Placeholder only; must not be the first production reward unless backed by a real optogenetic/behavior protocol |
| Reviewer #2 | Comic boss battle | Final traceability audit against actual experiment weaknesses |
| Figure framing | Main puzzle | Downstream claim discipline based on notebook, controls, n, and noise |
| Hype/Suspicion economy | Core scoring system | Wrapper scoring that must be derived from experimental record quality |
| Publish or Perish | Core fantasy | End-state wrapper and tone, not the main simulation substrate |

## Science Design Contract

| Category | Included in R-series vertical slice | Game reason |
|---|---|---|
| Simulated | Stock room entries with genotype/name/marker notes | The player must know what material they are using |
| Simulated | Vial age, transfer status, contamination/overcrowding risk | Time creates visible lab consequences |
| Simulated | Cross setup with female/male counts and parent removal timing | The player makes a concrete experimental plan |
| Simulated | Virgin collection window | Calendar discipline becomes a game skill |
| Simulated | Sex and marker sorting | Bench work becomes embodied interaction, not menu fiction |
| Simulated | CO2 exposure duration as a quality risk | Convenience has a procedural cost |
| Simulated | Assay record with control, sample size, trial notes, and noisy readout | The reviewer attacks evidence, not vibes |
| Simulated | Claim strength tied to actual record weaknesses | Paper framing becomes accountable |
| Abstracted | Exact development biology beyond the first slice | Long waits are compressed into calendar ticks |
| Abstracted | Mendelian inheritance detail | Use one readable cross model before expanding allele logic |
| Abstracted | Full balancer chromosome behavior | Represent as stock stability/maintenance constraints first |
| Abstracted | Every possible phenotype marker | Use a small marker vocabulary for UI readability |
| Abstracted | Incubator temperature and food recipe details | Represent only when they affect a first-slice decision |
| Fictional | Reviewer voice and sarcastic paper comments | Keeps the original tone without falsifying the lab loop |
| Fictional | Some paper-title parody | Presentation layer only |
| Out of scope | Full molecular biology workflow | Too broad for the current vertical slice |
| Out of scope | Complete allele/stock-center catalog | Would create database work before the core loop is proven |
| Out of scope | Multi-month lab campaign simulation | The first target is a five-minute slice |
| Out of scope | Dozens of assays | Negative geotaxis is the first assay target |

## First five-minute UX curve

The first playable slice should no longer be:

```text
choose absurd traits -> discover weird behavior -> oversell a paper
```

It should be:

```text
read PI goal
-> choose the stock and experimental purpose
-> set up a labeled cross vial
-> advance the lab calendar
-> hit the virgin collection window
-> sort by sex/marker under CO2 time pressure
-> run one negative geotaxis assay with a control
-> receive a reviewer attack that names the weakest record field
```

The desired emotional sequence is:

1. "I know what experiment I am trying to run."
2. "This vial label and timing will matter later."
3. "I can make a small procedural mistake."
4. "The data is noisy, but I understand why."
5. "The reviewer is annoying because they found a real weakness."
6. "Next run, I can run a cleaner experiment."

## Minimal stock and protocol vocabulary

The first slice should use deliberately few scientific nouns:

| Term | First-slice use |
|---|---|
| Stock | A maintained fly line with a genotype/marker note |
| Vial | A physical container with age, label, parents, progeny, and risk flags |
| Cross | A planned pairing with female count, male count, setup day, and parent-removal day |
| Virgin | Required female collection state represented by a time window |
| Marker | A visible sorting cue used in the microscope/CO2 bench |
| Control | A comparison group that makes the assay interpretable |
| n | Count of scored flies or trial units |
| Record | The notebook object used by figure and reviewer systems |

## Evidence rules

Evidence must come from records, not button labels.

An assay result should include:

- source stock or cross
- control presence
- sample size
- scoring method
- raw or semi-raw result
- noise/confidence flag
- procedural warnings

Reviewer attacks should prefer specific record weaknesses:

| Weakness | Reviewer attack target |
|---|---|
| Missing control | "You cannot tell whether this is the genotype or the handling." |
| Low n | "This is a vignette, not an experiment." |
| Long CO2 exposure | "Your handling may have changed the behavior." |
| Ambiguous marker sort | "You may not have assayed the genotype you claim." |
| Old or crowded vial | "Culture condition is a confound." |
| Weak label | "Your chain of custody is broken." |

## External factual anchors

The contract uses conservative, game-facing interpretations of standard fly-lab practice. BDSC's fly-care guide is the primary anchor for stock maintenance, labeling, transfer cadence, overcrowding, contamination, and routine cross setup:

- stocks are maintained by periodic transfer to fresh food
- development time varies strongly with temperature
- room-temperature stocks should be transferred before old cultures become risky
- stock labels should include complete genotype information rather than cryptic-only identifiers
- routine crosses depend on appropriate female/male counts and avoiding overcrowding

Reference: https://bdsc.indiana.edu/information/fly-culture.html

## Guardrails for all R-series implementation

- Do not add a new funny phenomenon unless it is downstream of a concrete assay record.
- Do not implement a broad genetics engine until one readable cross loop works end to end.
- Do not let reviewer logic inspect abstract scores only; it must inspect experiment records.
- Do not make the UI explain laboratory procedure as trivia. Make procedure create choices, risks, and consequences.
- Do not delete the satire wrapper. Reassign it to claim pressure and reviewer voice.

## Acceptance checklist

- [x] Product thesis is locked.
- [x] The current target is fly-lab procedure simulator with publication wrapper.
- [x] Simulated, abstracted, fictional, and out-of-scope mechanics are separated.
- [x] `Light-Induced Swarm Dance` is explicitly demoted from core reward to placeholder.
- [x] The first five-minute UX curve is procedure-based.
- [x] R-series follow-up issues can use this as the parent contract.
