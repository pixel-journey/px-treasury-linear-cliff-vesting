# Cliff, then a floor-linear unlock

> **Trust:** private educational lab (Tier B)  
> **Quest:** 089 — cliff + linear vesting  
> **Vault:** [px-contract-examples-vault](https://github.com/pixel-journey/px-contract-examples-vault)

**One-sentence goal:** Teach **cliff then linear unlock**, and a **permissionless claim** that still credits the beneficiary.

**Real code:** `npm test`. **Not** a live treasury, **not** token custody, **not** wasm.

## What you can learn

- Why vested is zero until the cliff timestamp, then jumps to the linear amount from `startTs`.
- Why the linear leg is `floor(total * elapsed / duration)`, measured from the start, not from the cliff.
- Why a second claim pays only the new delta.
- Why the caller can be anyone, and the payout name is still `grant.beneficiary`.

## What is actually in the repo

| Piece | Role |
| --- | --- |
| `invariants/vest.ts` | `vestedAmount`, `claimable`, `claimVested` |
| `invariants/vest.test.ts` | Executed claims |
| `EDUCATION.md` | The four formulas |
| `SECURITY.md` | Over-claim and the production gaps |

## What is true (executed)

Grant: beneficiary `alice`, total `1000n`, claimed `0n`, `startTs` `1000000`, cliff `100` seconds, duration `1000` seconds.

| Rule | Result |
| --- | --- |
| `nowTs` `1000050` (before cliff) | vested `0` |
| `nowTs` `1000500` (elapsed 500 of 1000) | vested `500` |
| `nowTs` `2000000` (after end) | vested `1000` |
| `claimVested` at `1000500` called by `bob` | payout `500` to `alice`; claimed becomes `500` |
| Claim before the cliff | `nothing to claim` |
| Second claim at `1001000` after the mid claim | payout `500`; claimed becomes `1000` |
| Same mid time with claimed already `200` | claimable `300` |

## The rule, in order

```text
before start + cliffSec:  vested = 0
from cliff through end:   vested = floor(total * (now - start) / durationSec)
at or after start + durationSec: vested = total
claimable = vested - claimed, or 0 if claimed is already ahead
```

`claimVested` checks that the caller is a well-formed account name. It does not require the caller to be the beneficiary. A zero claimable amount throws. The returned grant increases `claimed` by the payout.

A grant is refused when total is not a positive `bigint`, claimed is negative or above total, timestamps are not non-negative integers, duration is not positive, or `cliffSec` is above `durationSec`.

```ts
import { vestedAmount, claimVested } from "./invariants/vest.ts";

const grant = {
  beneficiary: "alice",
  total: 1000n,
  claimed: 0n,
  startTs: 1_000_000,
  cliffSec: 100,
  durationSec: 1000,
};

vestedAmount(grant, 1_000_050); // 0n
claimVested(grant, 1_000_500, "bob");
// payout 500n, beneficiary "alice", claimed 500n
```

## Edge cases

- At the cliff instant the amount is not still zero. It becomes `floor(total * cliffSec / durationSec)`. The tests cover one second-range before the cliff, not that instant.
- Linear time starts at `startTs`. A long cliff does not restart the clock. It only hides the vested amount until the cliff.
- After the end, further time does not vest more than `total`.
- Nothing here moves a token. `payout` is a number on the return value.

## Best practice and the opposite

**Do** subtract `claimed` before paying, so a second call cannot replay the first slice.  
**Do** keep the credit name on the grant even when a helper account submits the claim.

**Do not** treat a passing `claimVested` as a transfer. There is no balance table.  
**Do not** assume the slope starts at the cliff. Read `elapsed` from `startTs`.

## Live path, not shipped

```
vestedAmount + claimVested     [tested]
    → token custody of the grant    [not in this repo]
    → revoke / admin rules          [not in this repo]
    → on-chain time overflow        [not in this repo]
```

See [EDUCATION.md](EDUCATION.md) and [SECURITY.md](SECURITY.md).

## Related

- Vault index: `px-contract-examples-vault`

## Run

```bash
npm test
```

MIT — Pixel Journey
