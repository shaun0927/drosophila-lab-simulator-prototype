# Drosophila Lab Simulator: Publish or Perish

A Unity WebGL vertical-slice prototype for an OpenAI Game Builders Seoul competition concept.

## One-sentence pitch

Engineer absurd Drosophila neural traits, discover a bizarre behavior, package it as a suspiciously publishable figure, survive Reviewer #2, and submit before midnight.

## Prototype scope

This repository intentionally implements a small competition slice, not the full Steam-scale simulator:

- choose 3 neural/behavioral trait cards
- create one mutant line
- discover one behavior phenomenon
- run optional assays to adjust Evidence/Credibility/Hype/Suspicion
- frame the figure with conservative or sensational claims
- respond to one Reviewer #2 attack
- submit and receive an ending

## Core tension

> Weird enough to be exciting, credible enough to survive review.

The player repeatedly chooses whether to make the phenomenon more believable or more sensational before the deadline.

## Build

Unity version verified locally: `6000.3.20f1`.

Open this folder in Unity, then build for WebGL. The project includes an editor build script:

```bash
/Applications/Unity/Hub/Editor/6000.3.20f1/Unity.app/Contents/MacOS/Unity \
  -batchmode -quit \
  -projectPath /path/to/drosophila-lab-simulator-prototype \
  -executeMethod BuildScript.BuildWebGL
```

Output path: `Builds/WebGLDeploy`.

## Design docs

- `docs/00-competition-scope.md`
- `docs/01-core-fun-loop-paper-design.md`
- `docs/design-verdict.md`

## Status

Playable prototype scaffold created by Hermes Agent. Intended as a foundation for the competition vertical slice.
