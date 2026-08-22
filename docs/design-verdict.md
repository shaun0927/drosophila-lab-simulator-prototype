# Design Verdict

## R-series supersession note

This verdict applied to the original competition prototype. It is no longer the implementation contract for the R-series work. The current contract is [`fly-lab-product-thesis.md`](fly-lab-product-thesis.md), which deliberately moves the build target toward a fly-lab procedure simulator with a publication wrapper.

The useful part of this verdict is the warning that the game must remain playable and motivated. The obsolete part is the claim that the game should avoid realistic lab procedure as a core direction.

## Verdict

The current direction is sound **if** the game is treated as a discovery-and-framing game, not as a realistic lab-procedure simulator.

The earlier figure-completion version was structurally coherent but motivationally weak: it asked the player to satisfy an administrative requirement (`Data Quality >= threshold`) rather than giving them a fantasy worth pursuing. The revised design fixes that by making the primary reward a funny, surprising discovery:

> I made flies do something impossible-looking, and now I must decide how hard to sell it.

That gives the prototype a stronger motivational core:

- **Curiosity:** what behavior will this trait combination produce?
- **Autonomy:** do I play as careful scientist, hype merchant, or suspicious data alchemist?
- **Competence:** can I learn the stat system well enough to produce a breakthrough instead of a rejection?
- **Risk/reward:** do I collect more evidence or submit before the deadline?
- **Identity/fantasy:** I am a deadline-haunted Drosophila researcher turning absurd lab results into publishable claims.

## Why it fits the competition

The competition rewards playability, originality, Codex collaboration, release potential, and presentation. This concept maps cleanly:

- **Playability:** a five-minute UI-driven loop can run as Unity WebGL.
- **Originality:** Drosophila neuroscience + publication satire is specific and personal.
- **Codex collaboration:** Codex can help implement stat tuning, phenomenon tables, reviewer logic, UI state, and WebGL QA.
- **Release potential:** the slice can expand into campaigns, trait catalogs, lab upgrades, journal tiers, reviewer archetypes, and Steam achievements.
- **Presentation:** the pitch is compact: “discover absurd fly behaviors and sell them as science before Reviewer #2 destroys you.”

## Main risk

The central risk is that the prototype becomes a text menu with jokes rather than a game. To avoid that, every step needs a visible consequence:

- trait choices produce a named phenomenon
- assay choices move stats clearly
- figure framing changes the paper title and reviewer attack
- submission yields a memorable ending

The vertical slice should prioritize one delightful run over broad content.

## Design constraint

Every mechanic must answer one of two questions:

1. Does this make the phenomenon more believable?
2. Does this make the phenomenon more sensational?

If a feature does neither, it belongs in a later Steam build, not the competition prototype.
