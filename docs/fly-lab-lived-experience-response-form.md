# Fly-Lab Lived Experience Response Form

Use this to complete the remaining user-experience portion of #27. The goal is not to collect general lab trivia. The goal is to identify real actions, mistakes, pressure, and delayed consequences that should change the game.

## How to Fill This Out

- Prefer concrete incidents over general statements.
- Mark whether the memory is firsthand, observed, or secondhand.
- If a detail is uncertain, say so. Uncertain details should become SME review items, not shipped rules.
- Do not add new spectacle content unless it came from an actual fly-lab experience.

## Short Interview

### 1. Repeated Hands-On Work

What fly-lab action did you repeat enough that it became muscle memory?

Response:

```text

```

Game translation:

```text

```

### 2. Costliest Mistake

Which mistake cost the most time or confidence?

Examples: wrong vial, missed virgin window, weak label, escaped flies, bad cross, bad sort, weak control, unusable assay.

Response:

```text

```

Delayed consequence:

```text

```

### 3. Hardest Visual Tell

What was hardest to visually distinguish when learning?

Examples: sex, age, marker, health, anesthesia state, contamination, progeny timing.

Response:

```text

```

SME risk:

```text

```

### 4. Real Criticism

What did a PI, senior lab member, collaborator, or reviewer actually criticize?

Response:

```text

```

Reviewer-rule implication:

```text

```

### 5. Funny Because Real

What moment was funny only because it was painfully real?

Response:

```text

```

Comedy boundary:

```text

```

### 6. Satisfying Competence

Which procedure felt good when done cleanly?

Response:

```text

```

Player-skill implication:

```text

```

### 7. Fake or Off-Limits Detail

Which detail would feel fake, disrespectful, or misleading if the game used it casually?

Response:

```text

```

Design guardrail:

```text

```

### 8. Assay Confidence

Which assay have you performed or observed enough that its friction can be represented confidently?

Response:

```text

```

Representable friction:

```text

```

## Event Conversion Table

After the interview, convert answers into the table below and then copy accepted rows into `docs/fly-lab-experience-map.md`.

| Source | Procedure event | game verb | player skill | failure mode | delayed consequence | comedy source | SME risk | Include in slice? |
|---|---|---|---|---|---|---|---|---|
| Firsthand |  |  |  |  |  |  |  | yes/no |
| Observed |  |  |  |  |  |  |  | yes/no |
| Secondhand |  |  |  |  |  |  |  | yes/no |

## Acceptance Gate for #27

#27 can close only after:

- at least 5 rows in the event map have user/lived-experience provenance, or the user explicitly says they have no relevant firsthand/observed experience to add
- any arbitrary phenomenon not supported by source or lived experience remains excluded from the first slice
- at least one response updates the design, guardrails, or SME risk column

If a response should become a tracked task instead of a direct document edit, open a new issue using `.github/ISSUE_TEMPLATE/fly_lab_lived_experience.yml`.
