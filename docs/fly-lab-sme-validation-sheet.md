# Fly-Lab SME Validation Sheet

Use this for biology-aware review. This is separate from playtest fun validation.

## Review target

Review the Procedure Lab vertical slice against the parent contract in [`fly-lab-product-thesis.md`](fly-lab-product-thesis.md).

The reviewer should classify each mechanic:

- Accurate enough
- Acceptable simplification
- Misleading
- Unsafe or ethically wrong framing

## Mechanics to review

| Mechanic | Accurate enough | Acceptable simplification | Misleading | Unsafe/ethically wrong | Notes |
|---|---|---|---|---|---|
| Stock/vial age warnings | | | | | |
| Label completeness and lineage confidence | | | | | |
| Vial flip as maintenance action | | | | | |
| Virgin collection window | | | | | |
| Cross setup confidence | | | | | |
| CO2 exposure as downstream behavior caveat | | | | | |
| Sex/marker sorting abstraction | | | | | |
| Batch purity/confidence summary | | | | | |
| Negative geotaxis n/control/confidence | | | | | |
| Reviewer attacks tied to record caveats | | | | | |

## SME questions

1. Which simplification is acceptable for a five-minute game slice?
2. Which simplification would teach the wrong intuition?
3. Which visual tell needs correction before player testing?
4. Does CO2 exposure as an assay caveat feel directionally fair?
5. Does the reviewer attack the right kind of experimental weakness?
6. Which mechanic should be cut rather than explained with more text?

## Required follow-up handling

Any `Misleading` or `Unsafe/ethically wrong` mark on a core mechanic must create a fix/cut issue before #33 can close.

## Required validation result record

After review, append one accepted `SME-*` row to `docs/fly-lab-validation-results.md` with the same review id, fixture coverage, and five core ratings recorded in `docs/fly-lab-external-evidence-ledger.md`:

| Review id | Fixtures reviewed | Stock/vial/calendar | Virgin/cross timing | CO2/sorting | Negative geotaxis | Record/reviewer logic | Result | Notes |
|---|---|---|---|---|---|---|---|---|
