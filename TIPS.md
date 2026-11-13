# Tips — vesting schedules

## Math

- Vested before cliff is **0**, not a pro-rata from `startTs` unless you intentionally design a no-cliff schedule (`cliffSec = 0`).
- Use integer math: `(total * elapsed) / duration` with wide intermediates on chain.
- Claim pays **delta** (`vested - claimed`), never the full vested amount again.

## Auth product choices

| Design | Behavior |
| --- | --- |
| Permissionless claim | Anyone may call; tokens always to beneficiary (this lab) |
| Beneficiary-only | `require_auth(beneficiary)` |
| Admin clawback | Separate action; document carefully |

## Pairing with other treasury labs

- Fund the grant from a [fee splitter](https://github.com/pixel-journey/px-treasury-incoming-fee-splitter) leg.
- Pause new grants with [pausable guard](https://github.com/pixel-journey/px-token-pausable-emergency-guard) patterns.
- Watch dust: tiny totals over long durations may claim 0 for many ticks ([dust visualizer](https://github.com/pixel-journey/px-token-dust-truncation-visualizer)).

## Common mistakes

1. Allowing `cliffSec > durationSec`.
2. Crediting the **caller** instead of the **beneficiary**.
3. Updating `claimed` before a successful token transfer without a recovery path.
4. Using wall-clock in tests without an injectable `nowTs` (this lab injects it on purpose).
