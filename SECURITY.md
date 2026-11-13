# Security notes — vesting

## Mitigated in the lab

| Issue | Behavior |
| --- | --- |
| Claim before cliff | payout 0 / refuse |
| Double claim same timestamp | nothing to claim |
| Helper redirects funds | beneficiary field fixed on grant |
| Invalid schedule | cliff ≤ duration, positive total/duration |
| Over-claim | claimed never exceeds total via claimable math |

## Production still needs

| Concern | Guidance |
| --- | --- |
| Token movement | Actual `transfer` to beneficiary after claim math |
| Grant funding | Escrow total at open; refuse underfunded claims |
| Auth | Decide permissionless vs beneficiary-only |
| Admin | setconfig / cancel / pause under msig-friendly paths |
| Time | Prefer `current_time_point()`; lab `nowTs` is for tests only |
| Overflow | 128-bit for `total * elapsed` |

C++ mirror: [pxvest](https://github.com/pixel-journey/wax-contract-compiler/tree/main/contracts/pxvest) — accounting only, not deployed.
