# Cliff, then floor-linear unlock

> **Domain:** treasury vesting  
> **Sources:** [SOURCES.md](SOURCES.md)  
> **Catalog:** `px-contract-examples-vault` (private; not this public course)

**Goal:** Teach **cliff then linear unlock**, and a **permissionless claim** that still credits the beneficiary (helper callers cannot redirect the payout).

**Code under test:** `npm test` (unit + multi-claim composition).

**Build record, not this course:** a private compiler tree `pxvest` produced wasm SHA256 `f9c9e1d7df5b7cc2dc68374a182ce9135a704a713c6cd5f30255881116f80c92` (audit 0/0). That tree is not public and is **not deployed**. It does not transfer tokens. The course is the TypeScript under `npm test`.

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
