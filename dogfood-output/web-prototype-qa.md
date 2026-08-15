# Web Prototype QA Report

## Why this iteration exists

Unity WebGL/IMGUI was useful as a technical proof, but repeated browser QA exposed fragility: clicks were hard to verify, some sessions showed blank/black Unity content, and full-loop QA was not reliable enough to judge the game idea.

So I built a stable HTML/CSS/JS decision-grade prototype inside `web-prototype/` to test the actual game loop without Unity runtime noise.

## Implemented in web prototype

- Trait selection with a recommended first-run path.
- Phenomenon discovery: `Light-Induced Swarm Dance`.
- Live canvas assay chamber with animated fly dots and blue-light region.
- Assay choices: Quick Replicate, Careful Control, Flashy Recording.
- Figure framing choices: Conservative, Big Claim, Beautiful/Vague, Data Massage.
- Reviewer #2 attack and response choices.
- Final submit decision.
- Result screen with ending, paper title, stats, impact score, catalog update, and rerun button.

## Browser QA result

Local browser QA completed one full run through DOM-triggered actions:

1. Start recommended first run.
2. Discovery screen appeared.
3. Proceeded to assay.
4. Ran Careful Control and Flashy Recording.
5. Framed as Big Claim Figure.
6. Responded to Reviewer #2 by weakening title.
7. Submitted manuscript.
8. Reached final result: `VIRAL PREPRINT`.

Final observed text included:

- Paper title: `A Neural Switch for Collective Decision-Making in Drosophila`
- Ending: `VIRAL PREPRINT`
- Catalog updated: `Light-Induced Swarm Dance`
- Impact Score: `67`

Vision QA confirmed the end-to-end loop was visible and readable.

## Remaining issues

- This is now a web-native prototype, not the Unity build. It is better for deciding game direction, but not yet the target Unity vertical slice.
- It still needs more phenomenon variety and stronger first-run visual surprise.
- The result screen works, but the intermediate screens need more punch and sound/animation.
- The bottom footer can be partially cut off on shorter viewports.

## Decision value

This prototype is now good enough to judge the core concept at a rough level: the loop is readable, playable, and has a clear replay prompt. It should be used for game-design decisions before porting the stable loop back into Unity/uGUI or UI Toolkit.
