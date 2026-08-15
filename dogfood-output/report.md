# Prototype QA Report — Pass 1

## Scope

Published WebGL build at `https://shaun0927.github.io/drosophila-lab-simulator-prototype/`.

## Current implementation state

Implemented:

- Unity WebGL build and GitHub Pages deployment.
- First-screen trait selection loop.
- Core stats: Time, Budget, Evidence, Weirdness, Credibility, Hype, Suspicion.
- Trait → phenomenon → assay → figure framing → reviewer → result flow in code.
- Basic live assay chamber visualization after a mutant line exists.
- Multiple endings and paper titles.

Observed from browser:

- WebGL loads successfully.
- No JavaScript console errors were observed via page-level check.
- Initial UI is visible and readable enough for inspection.

## Issues found

### P0 — Trait selection did not visibly register in browser QA

Steps:
1. Open published build.
2. Click the first visible trait card, Blue Light Switch.
3. Observe selected counter.

Expected:
- Selected counter should change from `Selected: none` to include Blue Light Switch.
- Card should visually mark selected state.

Actual:
- After click/double-click attempts, visible UI still showed `Selected: none`.

Likely contributors:
- The scrollable/IMGUI layout may be hard to hit in WebGL embed.
- Click target affordance is weak.
- The first UI used a cramped scroll list.

Fix applied in next iteration:
- Replaced scroll list with a 3x3 visible trait grid.
- Added explicit `Selected traits: 0/3` counter.
- Added `+` / `✓` prefixes on cards.
- Added disabled reason on Create Mutant Line.

### P1 — First action is under-emphasized

The UI explains the premise, but the required action was not dominant enough.

Fix applied:
- Added `Step 1 — Select 3 traits` header.
- Moved all trait cards into visible grid.

### P1 — Trait list was cramped and clipped

Visible cards were partly cut off, and the player had to scroll to follow the first-run hint.

Fix applied:
- Removed first-screen scroll dependency.
- All 9 traits now visible.

### P1 — Resource meanings are not explained

The stats are thematically strong but not yet self-explanatory.

Recommended next improvement:
- Add short stat legend or colored stat labels.

### P2 — Live assay chamber starts too static

The empty chamber is readable but does not create immediate excitement.

Recommended next improvement:
- Add idle flies or a lab instrument silhouette before mutant creation.

### P2 — Unity default WebGL footer makes build feel unfinished

The default Unity template footer is visible.

Recommended later polish:
- Add custom WebGL template.

## Verdict after pass 1

The concept remains promising, but the first published build was not decision-ready because the first interaction did not visibly register during QA. The next iteration must verify the full clickable loop end-to-end before judging game potential.
