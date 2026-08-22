# Drosophila Lab Simulator: Publish or Perish

A browser prototype repo for exploring a Drosophila lab game. The current playable build opens with the R-series Procedure Lab route: protect stocks, manage vial age and labels, sort flies under CO2, run a simplified assay, and let Reviewer #2 attack the experiment record. The original publication-satire loop remains available as a historical route.

The R-series implementation direction now shifts the core game toward real fly-lab procedure: plan crosses, protect stocks, collect the right flies, run messy assays, and make claims that survive the experiment record. See [`docs/fly-lab-product-thesis.md`](docs/fly-lab-product-thesis.md).

## Current playable links

- Main stable prototype: https://shaun0927.github.io/drosophila-lab-simulator-prototype/
- 15-loop playtest index: https://shaun0927.github.io/drosophila-lab-simulator-prototype/micro-prototypes/
- 200-idea playtest index: https://shaun0927.github.io/drosophila-lab-simulator-prototype/micro-prototypes/ideas200.html
- 200-idea selection workbench: https://shaun0927.github.io/drosophila-lab-simulator-prototype/micro-prototypes/workbench.html
- Prototyping strategy: https://shaun0927.github.io/drosophila-lab-simulator-prototype/micro-prototypes/prototyping-plan.md
- Commercial reference method: https://shaun0927.github.io/drosophila-lab-simulator-prototype/micro-prototypes/commercial-reference-method.md

## 15 core loop micro-prototypes

These are intentionally tiny playable loop tests. The goal is not polish; the goal is to decide which fun engine is worth developing into the competition build.

Each candidate now shows a **motivation hypothesis** and a **judge-this question** so it is easier to evaluate from a motivation-psychology perspective. Evaluation guide: [`micro-prototypes/evaluation-guide.md`](micro-prototypes/evaluation-guide.md)

1. [Discover & Publish](https://shaun0927.github.io/drosophila-lab-simulator-prototype/micro-prototypes/prototype.html?id=01-discover-publish)
2. [Phenomenon Catalog Collector](https://shaun0927.github.io/drosophila-lab-simulator-prototype/micro-prototypes/prototype.html?id=02-phenomenon-catalog)
3. [Reviewer Boss Battle](https://shaun0927.github.io/drosophila-lab-simulator-prototype/micro-prototypes/prototype.html?id=03-reviewer-battle)
4. [Figure Framing Puzzle](https://shaun0927.github.io/drosophila-lab-simulator-prototype/micro-prototypes/prototype.html?id=04-figure-framing)
5. [Fly Behavior Spread](https://shaun0927.github.io/drosophila-lab-simulator-prototype/micro-prototypes/prototype.html?id=05-fly-spread)
6. [Lab Disaster Survival](https://shaun0927.github.io/drosophila-lab-simulator-prototype/micro-prototypes/prototype.html?id=06-lab-disaster)
7. [Mutant Behavior Sandbox](https://shaun0927.github.io/drosophila-lab-simulator-prototype/micro-prototypes/prototype.html?id=07-mutant-sandbox)
8. [Grant Hype Economy](https://shaun0927.github.io/drosophila-lab-simulator-prototype/micro-prototypes/prototype.html?id=08-grant-hype)
9. [Publish-or-Perish Roguelite](https://shaun0927.github.io/drosophila-lab-simulator-prototype/micro-prototypes/prototype.html?id=09-roguelite-run)
10. [Fly Stock Deckbuilder](https://shaun0927.github.io/drosophila-lab-simulator-prototype/micro-prototypes/prototype.html?id=10-stock-deckbuilder)
11. [Reviewer Roulette](https://shaun0927.github.io/drosophila-lab-simulator-prototype/micro-prototypes/prototype.html?id=11-reviewer-roulette)
12. [Lab Automation Puzzle](https://shaun0927.github.io/drosophila-lab-simulator-prototype/micro-prototypes/prototype.html?id=12-lab-automation)
13. [PI Email Simulator](https://shaun0927.github.io/drosophila-lab-simulator-prototype/micro-prototypes/prototype.html?id=13-pi-email)
14. [Behavior Assay Arcade](https://shaun0927.github.io/drosophila-lab-simulator-prototype/micro-prototypes/prototype.html?id=14-assay-arcade)
15. [Scientific Claim Tuning](https://shaun0927.github.io/drosophila-lab-simulator-prototype/micro-prototypes/prototype.html?id=15-claim-tuning)

## Core tension

> Weird enough to be exciting, credible enough to survive review.

The player repeatedly chooses whether to make the phenomenon more believable or more sensational before the deadline.

## Design docs

- `docs/fly-lab-product-thesis.md` — R-series product contract. Supersedes the phenomenon-first prototype direction for future implementation.
- `docs/fly-lab-experience-map.md` — R-series source-backed UX incident map for stock, cross, sorting, and assay work.
- `docs/fly-lab-lived-experience-response-form.md` — User response form for closing the remaining lived-experience gap in R1.
- `docs/r-series-progress-audit.md` — Current completion, verification, drift, and remaining-work audit for R0-R7.
- `docs/goal-completion-audit-2026-08-22.md` — Top-level audit of the active thread goal, including why the goal is not yet complete.
- `docs/fly-lab-external-evidence-ledger.md` — Intake ledger for the #27 lived-experience and #33 player/SME evidence gates.
- `docs/open-issue-triage-2026-08-22.md` — Current open-issue classification so old Unity/phenomenon work does not steer R-series implementation by accident.
- `docs/fly-lab-playtest-sheet.md` — R7 player validation script.
- `docs/fly-lab-sme-validation-sheet.md` — R7 biology-aware validation rubric.
- `docs/fly-lab-validation-runbook.md` — Step-by-step protocol for player/SME validation and follow-up issue creation.
- `docs/fly-lab-validation-results.md` — Validation status and result log.
- `docs/00-competition-scope.md`
- `docs/01-core-fun-loop-paper-design.md`
- `docs/design-verdict.md`
- `dogfood-output/web-prototype-qa.md`
- `micro-prototypes/README.md`

## Unity note

Unity version verified locally: `6000.3.20f1`. A Unity WebGL scaffold remains in the repo, but current fun-loop exploration is intentionally browser-native for faster QA and iteration.
