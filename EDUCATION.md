# Education — cliff, then linear vesting

> **Rung:** `npm test` passes. No tokens move. `nowTs` is an argument, not a chain clock.  
> **The test is the rule.**

## What you should be able to do

| Level | After this file |
| --- | --- |
| Beginner | Compute vested before the cliff, at the midpoint, and after the end |
| Intermediate | Explain why the slope starts at `startTs`, and why a second claim pays only the delta |
| Masterclass | Say why a caller-supplied timestamp is not `now()`, and what custody still requires |

---

## Beginner — one scene

Alice is owed 1000 units. The grant starts at timestamp `1000000`. Nothing is claimable for 100 seconds (the cliff). The whole grant finishes at `1001000` (duration 1000 seconds).

| Time | Elapsed | Vested | Why |
| --- | --- | --- | --- |
| `1000050` | 50 | 0 | Still before the cliff. The test asserts this |
| `1000500` | 500 | 500 | `floor(1000 * 500 / 1000)`. The test asserts this |
| `2000000` | past the end | 1000 | The test asserts this |

Bob can submit the claim at `1000500`. The payout is 500 and the beneficiary on the result is still `alice`. Bob is not paid. That is the permissionless claim: the helper pays the grant, not the caller.

### Words

| Word | Meaning here |
| --- | --- |
| Cliff | `startTs + cliffSec`. Before that instant, vested is 0 |
| Duration | Seconds from **start**, not from the cliff, until vested equals total |
| Claimed | What previous claims already took |
| Claimable | `vested - claimed`, or 0 if claimed is already ahead |
| Permissionless | Any well-formed account name may call. The credit name does not change |

### Predict, then run

```bash
npm test
```

1. Claim at `1000050` throws `nothing to claim`.
2. After a claim at `1000500`, `claimed` is 500. A later claim at `1001000` pays 500 more, and `claimed` is 1000.
3. If `claimed` is already 200 at time `1000500`, claimable is 300, not 500.

---

## Intermediate — the cliff does not restart the clock

```text
if now < start + cliffSec:     vested = 0
else if now >= start + duration: vested = total
else:                            vested = floor(total * (now - start) / duration)
```

People often write "linear starts at the cliff," meaning the first post-cliff second vests a tiny slice. This lab does not do that. It hides the amount until the cliff, then reveals the linear amount measured from `startTs`.

Derived, not asserted: at the cliff instant `now = 1000100`, elapsed is 100, vested is `floor(1000 * 100 / 1000) = 100`. One second earlier the test's region is still 0. The amount jumps. If you wanted "zero until the cliff, then a fresh 1000-second line," this formula is the wrong one, and the tests would change.

### `claimVested`

Checks the caller is a well-formed name. Does not compare the caller to `beneficiary`. Pays `claimable`. Refuses 0. Returns a new grant with `claimed` increased, plus `payout` and `beneficiary`.

A second call on the same timestamp pays nothing, because vested has not moved and claimed has. The test shows the delta across two different timestamps instead.

### Config refusals (source)

`assertGrant` rejects a non-positive total, a negative claimed, claimed above total, bad timestamps, a non-positive duration, and `cliffSec > durationSec`. The test file does not walk every rejection. Do not claim it does.

### Attack → test

| Attack | Naive code | This lab | Test |
| --- | --- | --- | --- |
| Claim during the cliff | Early unlock | vested 0, then `nothing to claim` | `refuses when nothing claimable` |
| Replay the same slice | Double pay | claimed offset | `second claim only pays the delta` |
| Caller inserts their own name as payee | Theft | result beneficiary is the grant's | `pays claimable…` asserts `alice` while caller is `bob` |
| Ignore prior claimed | Over-pay | `claimable` subtracts | `accounts for prior claimed` |

---

## Masterclass — clocks, custody, and jumps

### The timestamp is an argument

Every function takes `nowTs` from the caller. In this lab Bob can pass `2000000` and vest the entire grant immediately. The tests do that on purpose for `vestedAmount`. A contract must use the chain's current time, not a user field. Until you do, "cliff" is a function of whatever integer the test passed.

Time addition can overflow a 32-bit `uint32` if `startTs + durationSec` wraps. This TypeScript uses numbers and checks they are non-negative integers. It does not model `uint32` wrap. The vault's production note is overflow-safe time math. It is not implemented here.

### The cliff jump is a product decision

At the instant the cliff opens, this formula vests `floor(total * cliffSec / duration)`, not 1 unit. For a cliff that is half the duration, half the grant appears in one timestamp. That can be what you want (a one-year cliff on a four-year line reveals year one). It is a surprise if you told holders "vesting starts after the cliff." Write the sentence that matches the formula you shipped.

### Custody

`payout` is a bigint on a return value. Nobody's balance changes. A real claim:

- Holds the unvested tokens in the contract or a custodian.
- Transfers `payout` to `beneficiary` under the same action that increases `claimed`.
- Refuses a claim when the contract's token balance is short (the math can be right and the box can be empty).
- Defines revoke: freeze further vesting, or return unvested tokens, and do not strand `claimed`.

Permissionless claim is safe only if the transfer destination is the stored beneficiary and not `caller`. It is useful because the beneficiary does not have to own WAX CPU to receive. It is unsafe if any memo or "payee" argument overrides the grant.

### Exercise

Grant total 1000, cliff 100, duration 1000, start `1000000`, claimed 0.

1. Vested at `1000099`? (0. Still before cliff end `1000100`.)
2. Vested at `1000100`? (100. Derived. No test asserts this instant.)
3. Who receives the tokens if `carol` calls at `1000500`? (The result says `alice`. No token transfer exists in the repo.)

---

## What this course will not teach

- That the caller cannot choose the time (they can, here)
- A token balance
- A revoke action
