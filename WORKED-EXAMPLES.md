# Worked examples — cliff then linear unlock

Grant shape:

```text
beneficiary: alice
total: 1000n
startTs: 1_000_000
cliffSec: 100
durationSec: 1000
```

Cliff ends at `1_000_100`. Fully vested at `1_001_000`.

## Example 1 — before cliff

`nowTs = 1_000_050` → `vestedAmount = 0` → claim throws `nothing to claim`.

## Example 2 — mid schedule

`nowTs = 1_000_500` → elapsed 500 → `vested = floor(1000 * 500 / 1000) = 500`.

First claim pays `500`, `claimed` becomes `500`.

## Example 3 — same timestamp second claim

Claim again at `1_000_500` → claimable 0 → refused. Composition locks this.

## Example 4 — final claim

`nowTs = 1_001_000` (or later) → vested `1000` → claim pays `500` (delta only). Sum of payouts `1000`.

## Example 5 — helper caller

`claimVested(grant, now, "bob")` still returns `beneficiary: "alice"`. Bob cannot redirect the credit.

## Example 6 — independent grants

Two grants for alice and carol do not share `claimed`. Composition covers separate schedules.

## Example 7 — production mirror

[pxvest](https://github.com/pixel-journey/wax-contract-compiler/tree/main/contracts/pxvest) implements open/claim preview math with educational `now_ts`. It does **not** transfer tokens and is **not deployed**.
