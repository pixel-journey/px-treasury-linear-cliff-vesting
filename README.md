# Cliff, then floor-linear unlock

> **Domain:** treasury vesting  
> **Sources:** [SOURCES.md](SOURCES.md)  
> **Catalog:** [px-contract-examples-vault](https://github.com/pixel-journey/px-contract-examples-vault)

**Goal:** Teach **cliff then linear unlock**, and a **permissionless claim** that still credits the beneficiary (helper callers cannot redirect the payout).

**Code under test:** `npm test` (unit + multi-claim composition).

**Production mirror (C++ → wasm):** [wax-contract-compiler `pxvest`](https://github.com/pixel-journey/wax-contract-compiler/tree/main/contracts/pxvest) — [run 28](https://github.com/pixel-journey/wax-contract-compiler/actions/runs/43213090195). WASM SHA256 `f9c9e1d7df5b7cc2dc68374a182ce9135a704a713c6cd5f30255881116f80c92`. Audit 0/0. Preview math only — does **not** transfer tokens; **not deployed**.

**Docs:** [docs.wax.io](https://docs.wax.io/). Token reference: [eosio.token](https://github.com/eosio/eosio.contracts).

## Learning materials

| Doc | Role |
| --- | --- |
| [EDUCATION.md](EDUCATION.md) | Beginner → masterclass |
| [WORKED-EXAMPLES.md](WORKED-EXAMPLES.md) | Cliff, mid, final, helper caller |
| [TIPS.md](TIPS.md) | Math, auth product choices |
| [SECURITY.md](SECURITY.md) | Over-claim and production gaps |
| [SOURCES.md](SOURCES.md) | Official docs + pxvest mirror |

## Composition

`vest.composition.test.ts` walks refuse-before-cliff → mid claim → same-timestamp refuse → final claim. Sum of payouts equals `total`. Separate grants do not share `claimed`.

## What is true (executed)

| Rule | Result |
| --- | --- |
| Before cliff | vested `0` |
| Mid schedule | `floor(total * elapsed / duration)` from `startTs` |
| After end | full `total` |
| Claim by helper | pays **beneficiary**; second claim is delta only |
| Sequential claims | sum of payouts === total |

```bash
npm test
```

MIT — Pixel Journey
