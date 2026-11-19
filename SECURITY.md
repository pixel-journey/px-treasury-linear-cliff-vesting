# Security — linear cliff vesting

## Closed in tests

| Issue | Behavior |
| --- | --- |
| Claim before cliff | payout 0 / refuse |
| Double claim same timestamp | nothing to claim |
| Helper redirects funds | **beneficiary** field fixed on grant |
| Invalid schedule | cliff ≤ duration; positive total/duration |
| Over-claim | claimed never exceeds total via claimable math |

## Not closed (production)

| Concern | Guidance |
| --- | --- |
| Token movement | Actual `transfer` to beneficiary after claim math |
| Grant funding | Escrow total at open; refuse underfunded claims |
| Auth | Permissionless claim vs beneficiary-only |
| Admin | setconfig / cancel / pause under msig-friendly paths |
| Time | Prefer `current_time_point()`; lab `nowTs` is for tests only |
| Overflow | 128-bit for `total * elapsed` |

## Attack angles

1. Crediting the **caller** instead of the beneficiary.
2. Letting the user pass `nowTs` on chain.
3. Updating `claimed` before the token transfer succeeds (or the reverse without recovery).
4. Advertising “vesting starts after the cliff” while the formula is hide-then-reveal from `start`.
5. Dust: tiny totals over long durations claim 0 for many ticks (`px-token-dust-truncation-visualizer` (private; not this public course)).

## Honesty limits

Accounting only. C++ mirror: `wax-contract-compiler` (private; not this public course) — not deployed.
