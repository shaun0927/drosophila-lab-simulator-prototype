# Decision Status — Prototype QA Iteration

## Current state

The prototype is deployed at:

- https://shaun0927.github.io/drosophila-lab-simulator-prototype/

Repository:

- https://github.com/shaun0927/drosophila-lab-simulator-prototype

## Implemented

- Unity WebGL project and Pages deployment.
- Design docs for competition scope and paper-loop prototype.
- Trait-selection UI.
- Core stats: Time, Budget, Evidence, Weirdness, Credibility, Hype, Suspicion.
- Core logic for:
  - trait selection
  - mutant line creation
  - phenomenon resolution
  - assay choices
  - figure framing
  - reviewer response
  - submission endings
- QA report pass 1.
- Several UX fixes:
  - 3x3 trait grid instead of cramped scroll list
  - selected-trait counter
  - explicit create mutant button
  - recommended first-run shortcut
  - UI exception fallback
  - auto-demo discovery attempt

## QA findings

### Confirmed good

- Initial Unity WebGL page loads in fresh sessions.
- First-screen premise is visible and readable.
- 3x3 trait grid is visible.
- Selection visual state can update.
- GitHub Pages deployment is functional.

### Not yet acceptable

The prototype is not yet reliable enough for a go/no-go decision on game fun, because full-loop browser QA is still unstable.

Observed issues:

1. Browser QA initially could not visibly trigger trait selection.
2. After layout fixes, selected traits became visible, but creation did not reliably advance during manual coordinate QA.
3. After additional changes, some browser harness sessions hung or displayed black/blank Unity content, likely due WebGL/IMGUI/runtime instability in repeated test sessions.
4. The game loop logic exists in code, but the end-to-end browser interaction loop has not been verified reliably.

## Design verdict

The concept is still promising:

> discover absurd Drosophila behavior → gather evidence → package as a scientific figure → survive Reviewer #2.

But this Unity IMGUI prototype is currently a fragile technical proof, not yet a decision-grade gameplay prototype.

## Recommendation

Before judging the idea, the next iteration should replace the IMGUI-based UI with a more stable Unity UI Toolkit/uGUI screen or a web-native React prototype. The decision-grade target should be:

1. One click starts the recommended first run.
2. Discovery screen appears reliably.
3. Assay choice changes stats visibly.
4. Figure framing changes paper title visibly.
5. Reviewer response appears.
6. Submission ending appears.
7. Entire loop can be completed in under 2 minutes.

Only after that should we judge whether the concept is worth continuing.
