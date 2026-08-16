# Human-Readable Correction Pass

## Problem found

Junghwan pointed at `008-codex-co-pilot-optogenetic-rhythm-lab` and correctly noted that the prototype was not understandable as an ideation artifact.

The root causes were:

1. **Abstract generated text**
   - phrases like `play light pulses like music and make swarms dance` were technically descriptive but not enough to understand the actual game screen.

2. **Too much meta-design language first**
   - motivation, commercial references, 0/1-stage notes, and generic QA appeared before the player could understand the game.

3. **No concrete player verbs**
   - candidates said what the concept was, but not what the player literally clicks, drags, routes, times, inspects, or decides.

4. **Generic runner hid the idea**
   - all candidates used the same safe/expressive/risky interface, making very different ideas feel identical.

5. **The index was not scannable**
   - it showed promise/judge text instead of plain-language actions and signature moments.

## Correction applied

Every candidate now has a `human_review_card` with:

- plain title
- one-sentence explanation
- variant focus
- first screen model
- actual player actions
- signature moment
- why it is not just a skin
- readability fix

The individual idea page now shows this card first, before commercial references and long dossier text.

The 200-idea index now shows:

- Plain explanation
- Do: concrete player actions
- Signature: memorable moment

## Example: Optogenetic Rhythm Lab

Before:

- Codex Co-Pilot: Optogenetic Rhythm Lab
- play light pulses like music and make swarms dance
- safe / expressive / risky

After:

- Plain title: 광유전학 리듬 랩
- What you actually do: 빛 자극을 리듬처럼 입력해 파리 군집 움직임을 만들고, 가장 이상하지만 그럴듯한 패턴을 찾는다.
- First screen model: pulse sequencer + fly chamber
- Actual player actions:
  - 빛 pulse를 찍는다
  - tempo를 바꾼다
  - swarm 반응을 기록한다
- Signature moment: 파리들이 박자에 맞춰 갑자기 원형 군무를 시작하는 순간

## Remaining limitation

This is still not 200 bespoke prototypes. It is a corrected readable ideation board. The next pass should choose 20-40 candidates and build custom screens for them.
