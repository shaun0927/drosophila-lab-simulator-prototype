# 1. Core Fun Loop Paper Design

## R-series supersession note

This document describes the original paper-loop prototype and should be read as historical context. The R-series implementation target is now defined by [`fly-lab-product-thesis.md`](fly-lab-product-thesis.md): a fly-lab procedure simulator with a publication wrapper.

Do not use `Light-Induced Swarm Dance`, trait-card selection, or abstract hype/suspicion scores as the next production core unless they are rebuilt downstream of stock, cross, sorting, assay-record, control, sample-size, and notebook systems.

## Loop diagram

```text
[PI Demand]
   ↓
[Choose 3 Trait Cards]
   ↓
[Create Mutant Line]
   ↓
[Observe Behavior]
   ↓
[Run Assay / Collect Evidence]
   ↓
[Frame Figure]
   ↓
[Reviewer Attack]
   ↓
[Respond or Submit]
   ↓
[Result Ending + Score]
```

## The recurring player question

> Should I make this phenomenon more believable, or make it more sensational?

Each step must move at least one of these stats: Evidence, Weirdness, Credibility, Hype, Suspicion, Time, Budget.

## First five-minute script

### 0:00–0:20 — PI demand

```text
PI:
“We need a publishable behavior by midnight.
Make the flies do something weird.
Then make it look rigorous.”
```

Player understands:

- find an abnormal behavior
- package it as a figure
- beat the deadline

### 0:20–0:50 — Trait selection

Player chooses 3 out of 9 trait cards.

First-run recommended route:

- Blue Light Switch
- Hyperactive Motor Circuit
- Social Bias

Prediction shown before confirmation:

```text
Predicted Weirdness: High
Predicted Credibility: Medium
Possible behavior: ???
```

The game should preserve curiosity by not revealing the phenomenon name until the assay chamber resolves.

### 0:50–1:20 — Mutant line creation

Example result:

```text
Mutant Line Created: BL-HYP-SOC
Stability: 62%
Ethical Concern: 28%
Behavioral Volatility: High
```

### 1:20–1:50 — Discovery moment

Assay chamber displays the flies moving in a group pattern under blue light.

```text
NEW PHENOMENON DISCOVERED
Light-Induced Swarm Dance
```

Base stats:

```text
Evidence: 20
Weirdness: 75
Credibility: 35
Hype: 40
Suspicion: 15
```

This is the first emotional payoff. The player should think: “What did I just make?”

### 1:50–2:30 — Assay action

The player picks one assay action:

```text
Quick Replicate
- Time -20
- Budget -5
- Evidence +15
- Suspicion +5
```

```text
Careful Control
- Time -45
- Budget -15
- Evidence +25
- Credibility +20
- Hype -5
```

```text
Flashy Recording
- Time -25
- Budget -10
- Hype +25
- Evidence +5
- Suspicion +10
```

### 2:30–3:10 — Figure framing

The player chooses how to sell the phenomenon.

```text
Conservative Figure
“Blue Light Modulates Locomotor Synchrony”
Credibility +25, Hype -10, Suspicion -10
```

```text
Big Claim Figure
“A Neural Switch for Collective Decision-Making”
Hype +30, Weirdness +10, Suspicion +20
```

```text
Beautiful But Vague Figure
“Emergent Behavioral Dynamics in Engineered Flies”
Hype +20, Credibility +5, Suspicion +10
```

```text
Data Massage
“Robust Evidence for Social Phototaxis”
Evidence +10, Credibility +15, Suspicion +30
```

### 3:10–4:00 — Reviewer attack

Reviewer attacks the weak point created by the player's stats/framing.

Example for Big Claim:

```text
Reviewer #2:
“Correlation is not neural circuitry.”
```

Responses:

```text
Add speculative model diagram
Credibility +10, Hype +5, Suspicion +10
```

```text
Weaken the title
Credibility +20, Hype -20, Suspicion -10
```

```text
Invoke mushroom body
Credibility +5, Reviewer Confusion +20, Suspicion +5
```

### 4:00–4:40 — Final push-your-luck

Player sees current prediction:

```text
Acceptance chance: 61%
Viral chance: 35%
Scandal chance: 12%
```

Final options:

- Submit Manuscript
- Run One More Assay
- Polish Figure

### 4:40–5:00 — Submission result

Example:

```text
MAJOR REVISION

Impact Score: 74
Evidence: 65
Weirdness: 82
Credibility: 58
Hype: 79
Suspicion: 31

Reviewer #2:
“The dancing is undeniable.
The interpretation is clinically unwell.”
```

The discovered phenomenon is registered in the catalog.

## Paper card set

### Trait cards

Use the 9 cards defined in `00-competition-scope.md`.

### Phenomenon cards

Each card contains:

- required tags
- phenomenon name
- base stats
- one visual description
- one default paper-title seed

Example:

```text
Light-Induced Swarm Dance
Requires: light + hyperactive + social/swarm
Base: Evidence 20, Weirdness 75, Credibility 35, Hype 40, Suspicion 15
Visual: flies circle under pulsing blue light
Title seed: optogenetic locomotor synchrony
```

### Assay cards

- Quick Replicate
- Careful Control
- Flashy Recording

### Figure cards

- Conservative Figure
- Big Claim Figure
- Beautiful But Vague Figure
- Data Massage

### Reviewer cards

- Sample Size Attack
- Control Attack
- Mechanism Attack
- Replication Attack
- Ethics Attack

### Ending cards

- Breakthrough
- Viral Preprint
- Solid but Boring
- Desk Rejected
- Replication Crisis
- Ethics Committee Summoned

## Starting numbers

```text
Time: 300
Budget: 100
Evidence: 0
Weirdness: 0
Credibility: 0
Hype: 0
Suspicion: 0
```

## Ending logic draft

```text
Breakthrough:
Evidence >= 60
Weirdness >= 70
Credibility >= 60
Suspicion < 40
```

```text
Viral Preprint:
Hype >= 75
Suspicion < 60
```

```text
Replication Crisis:
Hype >= 70
Suspicion >= 60
Evidence < 70
```

```text
Desk Rejected:
Credibility < 40 or Evidence < 40
```

```text
Solid but Boring:
Evidence >= 70
Credibility >= 70
Weirdness < 50
```

```text
Ethics Committee Summoned:
Suspicion >= 80
or Weirdness >= 95 and Credibility < 50
```

## Impact score

```text
Impact =
Evidence * 0.25
+ Weirdness * 0.25
+ Credibility * 0.25
+ Hype * 0.25
- Suspicion * 0.35
```

Ending type is more important than raw score.

## Tutorial text

Use at most five tutorial messages:

1. Choose 3 neural traits to engineer a fly line.
2. Run an assay to discover what your flies actually do.
3. More evidence makes your claim believable. More weirdness makes it publishable.
4. Frame your figure carefully. Big claims attract big reviewers.
5. Submit before midnight. Science can wait. The deadline cannot.

## Fun-test questions

After one paper-playtest, ask:

- Did the discovery name make the player curious or amused?
- Did they want to try a different trait combination?
- Did they hesitate before submitting?
- Did figure framing feel like a meaningful identity choice?
- Did the reviewer attack feel like a funny but fair consequence?
- Did the ending make them want another run?

## Minimum viable delight

The prototype succeeds only if the first run produces this emotional sequence:

1. “What is this fly paper game?”
2. “I can combine weird neural traits?”
3. “Wait, the flies are doing something absurd.”
4. “I can oversell this as a paper?”
5. “Reviewer #2 is attacking my claim.”
6. “I should try a different combination.”
