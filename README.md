# Cliff, then floor-linear unlock

> **Domain:** treasury vesting  
> **Sources:** [SOURCES.md](SOURCES.md)  
> **Catalog:** [px-contract-examples-vault](https://github.com/pixel-journey/px-contract-examples-vault)

**Goal:** Teach **cliff then linear unlock**, and a **permissionless claim** that still credits the beneficiary (helper callers cannot redirect the payout).

**Code under test:** `npm test` (unit + multi-claim composition).

**Production mirror (C++ → wasm):** [wax-contract-compiler `pxvest`](https://github.com/pixel-journey/wax-contract-compiler/tree/main/contracts/pxvest) — [run 28](https://github.com/pixel-journey/wax-contract-compiler/actions/runs/43213090195). WASM SHA256 `f9c9e1d7df5b7cc2dc68374a182ce9135a704a713c6cd5f30255881116f80c92`. Audit 0 errors / 0 warnings. Preview math only — does **not** transfer tokens; **not deployed**.

**Docs:** [docs.wax.io](https://docs.wax.io/). Paying out still needs a token contract — [eosio.token](https://github.com/eosio/eosio.contracts).

## Composition

`vest.composition.test.ts` walks a full grant: refuse before cliff, mid claim, same-timestamp refuse, final claim. Sum of payouts equals `total`. A helper caller still credits the beneficiary. Separate grants do not share `claimed`.

## What is true (executed)

| Rule | Result |
| --- | --- |
| Before cliff | vested `0` |
| Mid schedule | `floor(total * elapsed / duration)` from `startTs` |
| After end | full `total` |
| Claim by helper account | pays **beneficiary**; second claim is delta only |
| Sequential claims | sum of payouts === total |

## Related

- [px-treasury-incoming-fee-splitter](https://github.com/pixel-journey/px-treasury-incoming-fee-splitter)

```bash
npm test
```

MIT — Pixel Journey
