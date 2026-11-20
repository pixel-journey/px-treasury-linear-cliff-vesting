# Tips — cliff then linear vesting

## Math

- Before `start + cliff`, vested is **0**.
- After the cliff, this lab reveals `floor(total * (now - start) / duration)` — the slope is measured from **start**, not restarted at the cliff.
- At the cliff instant the amount can **jump** to `floor(total * cliff / duration)`. Say that in the product copy if the cliff is long.
- Claim pays **delta** (`vested - claimed`) only.
- `cliffSec > durationSec` is refused.

## Auth

| Design | Behavior |
| --- | --- |
| Permissionless claim | Anyone may call; tokens go to **beneficiary** (this lab) |
| Beneficiary-only | `require_auth(beneficiary)` |
| Revoke / clawback | Separate action; do not strand `claimed` |

## Common mistakes

1. Crediting the **caller** instead of the beneficiary.
2. Letting the user pass `nowTs` on chain (this lab does, on purpose, in tests).
3. Updating `claimed` before the token transfer succeeds, then retrying and paying twice — or the reverse and stranding a claim. Same action.
4. Advertising "vesting starts after the cliff" while the formula is hide-then-reveal from `start`.
5. Forgetting dust: a tiny total over a long duration can claim 0 for many ticks ([px-token-dust-truncation-visualizer](https://github.com/pixel-journey/px-token-dust-truncation-visualizer)).

## Nice-to-have extensions (not in this repo)

| Idea | Note |
| --- | --- |
| Fresh line after cliff | Different formula; tests would change |
| Revoke | Freeze further vesting; return unvested |
| Multiple tranches | One row per cliff |
| Fund from a splitter leg | [fee splitter](https://github.com/pixel-journey/px-treasury-incoming-fee-splitter) |
| Pause new claims | [pausable](https://github.com/pixel-journey/px-token-pausable-emergency-guard) |

Use wide integers for `total * elapsed` before dividing.
