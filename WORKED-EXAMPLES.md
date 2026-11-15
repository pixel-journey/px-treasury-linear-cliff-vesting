# Worked examples — linear cliff vesting

Grant: beneficiary alice, total **1000**, start `1_000_000`, cliff **100** s, duration **1000** s.

## vestedAmount

| nowTs | vested |
| --- | --- |
| 1_000_050 (before cliff) | 0 |
| 1_000_100 (cliff instant) | **100** = floor(1000 * 100 / 1000) |
| 1_000_500 | 500 |
| 2_000_000 or later | 1000 |

## claimVested

Permissionless: caller may be `bob` or `helperacct`; **payout always credits alice**.

| Step | Result |
| --- | --- |
| claim at 1_000_050 | nothing |
| claim at 1_000_500 | payout 500, claimed 500 |
| second claim same ts | nothing |
| claim at 1_001_000 or end | payout 500, claimed 1000 |

`claimable` with prior claimed 200 at t=1_000_500 → 300. If claimed 600 while vested 500 → claimable 0.

## Composition

Full lifecycle payouts sum to **1000**. Three partial times `1_000_250`, `1_000_750`, `1_001_000` also sum to 1000. Independent bob grant (total 200, cliff 0, duration 200) does not share claimed state with alice.

## assertGrant refusals

cliff > duration; total 0; claimed > total; duration 0.
