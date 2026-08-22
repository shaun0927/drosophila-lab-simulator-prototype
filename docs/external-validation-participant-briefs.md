# External Validation Participant Briefs

Date opened: 2026-08-23

Purpose: provide copy-ready invitation and session-start language for #35 through #39 without leaking the answer key or turning moderator guidance into evidence.

These briefs are not evidence. Do not raise accepted counts from invitations, screenshots, smoke tests, implementer walkthroughs, or packet visibility. Evidence starts only when real answers are captured, staged, copied into the target docs, and verified.

Use with:

- `docs/external-validation-launch-matrix.md`
- `docs/external-validation-session-packets.md`
- `docs/external-validation-intake-staging.md`
- `docs/external-validation-intake-runbook.md`

## Global Moderator Rules

- Do not explain the goal, correct causal interpretation, or name clean/dirty/missing-control during the first 30 seconds of player sessions.
- Do not tell a fresh player that the session is testing whether they understand controls, CO2, labels, or Reviewer #2.
- Do preserve exact phrases before paraphrasing.
- Do tell participants that unfinished, confused, or critical feedback is useful.
- Do not ask participants to validate screenshots; ask them to play, review, or answer from experience.
- Do not count any row until `node tools/external-validation-full-check.js --live-issues` passes after the target docs are updated.

## #35 Lived-Experience Invitation

Use for: `LE-01` through `LE-05`.

Send:

> I am collecting concrete fly-lab procedure memories to improve a small Drosophila lab game prototype. I am not looking for general game ideas. I need specific actions, mistakes, visual tells, timing pressure, record criticism, or things that felt real in a fly lab. If you have no relevant firsthand or observed experience, saying that explicitly is also useful.

Before the session, open:

- `web-prototype/index.html?validation=lived`
- `docs/external-validation-session-packets.md` #35 packet

Ask only the prompts in the #35 packet. Do not suggest Light-Induced Swarm Dance, optogenetics, or broad spectacle unless the participant brings it up as a real experience.

After the session:

- Stage rows in `docs/external-validation-intake-staging.md`.
- Copy accepted rows to `docs/fly-lab-external-evidence-ledger.md`.
- Copy the same accepted rows to `docs/fly-lab-experience-map.md`.
- Comment on #35 and #27 with accepted/rejected `LE-*` row ids and remaining counts.

## #36-#38 Fresh-Player Invitation

Use for: `P-01` clean, `P-02` dirty, and `P-03` missing-control.

Send:

> I am testing whether a first-time player can understand a five-minute fly-lab procedure game. Please play one run and think aloud if comfortable. I will not explain the goal at first. After the run, I will ask what you think the experiment was trying to prove, why the reviewer criticized it, and what you would change in a second run.

Do not send the route meaning or answer key. Use the launch matrix to assign exactly one target:

| Issue | Row | URL | Do not reveal |
|---|---|---|---|
| #36 | `P-01` clean | `web-prototype/index.html?fixture=clean&validation=capture` | That this is the clean route |
| #37 | `P-02` dirty | `web-prototype/index.html?fixture=dirty&validation=capture` | That CO2/dirty handling is the intended weakness |
| #38 | `P-03` missing-control | `web-prototype/index.html?fixture=missing-control&validation=capture` | That missing control is the intended weakness |

During the first 30 seconds, say only:

> Please play one run until the prototype gives you a reviewer finding. Say what you are trying to do if you want, but I will stay quiet unless you are completely stuck.

After the reviewer finding appears, ask:

1. What was the experiment trying to prove?
2. What caused the reviewer attack?
3. What would you do differently in a second run?
4. Which part felt most like real lab friction?
5. Which part felt fake, arbitrary, or disconnected?

After the session:

- Stage the row in `docs/external-validation-intake-staging.md`.
- Copy accepted rows to `docs/fly-lab-external-evidence-ledger.md`.
- Copy the same route, phrases, decision, and follow-up disposition to `docs/fly-lab-validation-results.md`.
- Comment on the execution issue and #33 with accepted/rejected `P-*` row id and remaining route coverage.

## #39 SME Reviewer Invitation

Use for: `SME-01`.

Send:

> I am looking for a biology-aware review of whether a small Drosophila lab game prototype teaches acceptable simplifications or misleading intuitions. Please review three controlled fixtures and rate five mechanic groups. The goal is not polish feedback; it is whether the stock/vial/calendar, virgin/cross timing, CO2/sorting, negative geotaxis, and record/reviewer logic are acceptable enough for a game prototype.

Before the session, open all three fixtures:

- `web-prototype/index.html?fixture=clean`
- `web-prototype/index.html?fixture=dirty`
- `web-prototype/index.html?fixture=missing-control`

Ask the SME to rate each mechanic as:

- `Accurate enough`
- `Acceptable simplification`
- `Misleading`
- `Unsafe/ethically wrong`

Any `Misleading` or `Unsafe/ethically wrong` rating needs a concrete Fix/Cut follow-up issue and disposition before `SME-01` can count.

After the session:

- Stage `SME-01` in `docs/external-validation-intake-staging.md`.
- Copy accepted row fields to `docs/fly-lab-external-evidence-ledger.md`.
- Copy the same fixture coverage, five ratings, decision, and follow-up disposition to `docs/fly-lab-validation-results.md`.
- Comment on #39 and #33 with the accepted/rejected `SME-01` status and remaining counts.

## Drift Checks

- Do not convert participant recruitment into broad feature brainstorming.
- Do not let a player-session brief teach the answer that the player is supposed to discover.
- Do not let an SME review become visual polish review only.
- Do not use the same implementer walkthrough as a fresh-player session.
- Do not close #27, #33, or the thread goal from completed invitations.
