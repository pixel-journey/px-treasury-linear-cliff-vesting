# px-treasury-linear-cliff-vesting

> **Trust:** private educational lab (Tier B)  
> **Quest:** 089 — cliff + linear vesting  
> **Vault:** [px-contract-examples-vault](https://github.com/pixel-journey/px-contract-examples-vault)

**One-sentence goal:** Teach **cliff then linear unlock**, with **claimvested** paying the beneficiary even when a third party submits the claim.

**Real code:** `npm test`. **Not** a live treasury or wasm.

---

## What is true (executed)

| Rule | Result |
|------|--------|
| Before cliff | vested 0 |
| Mid schedule | floor proportional |
| After end | full total |
| claimVested | permissionless caller; payout to beneficiary |
| Nothing claimable | refused |

```bash
npm test
```

## License

MIT — Pixel Journey
