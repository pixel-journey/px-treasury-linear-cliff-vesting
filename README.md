# Cliff, then a floor-linear unlock

> **Trust:** private educational lab (Tier B)  
> **Domain:** treasury vesting  
> **Sources:** [SOURCES.md](SOURCES.md)  
> **Vault:** [px-contract-examples-vault](https://github.com/pixel-journey/px-contract-examples-vault)

**One-sentence goal:** Teach **cliff then linear unlock**, and a **permissionless claim** that still credits the beneficiary.

**Real code:** `npm test`. **Not** a live treasury, **not** token custody, **not** wasm.

Docs: [docs.wax.io](https://docs.wax.io/). Paying out still needs a token — [eosio.token reference](https://github.com/eosio/eosio.contracts).

## What is true (executed)

| Rule | Result |
| --- | --- |
| Before cliff | vested `0` |
| Mid schedule | `floor(total * elapsed / duration)` from `startTs` |
| After end | full `total` |
| Claim by helper account | pays **beneficiary**; second claim is delta only |

## Related

- [px-treasury-incoming-fee-splitter](https://github.com/pixel-journey/px-treasury-incoming-fee-splitter)

## Run

```bash
npm test
```

MIT — Pixel Journey
