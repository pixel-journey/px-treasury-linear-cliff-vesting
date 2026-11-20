# Sources

| Source | Use |
| --- | --- |
| [docs.wax.io](https://docs.wax.io/) | Time, actions, token custody |
| [eosio.token](https://github.com/eosio/eosio.contracts) | Transfer the claim payout |
| [docs.eosnetwork.com](https://docs.eosnetwork.com/) | `current_time_point`, not a user timestamp |

**Product facts locked by tests:**

- Before the cliff, vested amount is **0**.
- After the cliff, the line is measured from **`start`**, not from the cliff instant — so the cliff moment can jump.
- Claim may be permissionless; the credit still goes to the **beneficiary**, not the caller.
- Beneficiary is fixed at schedule creation.

This lab takes `nowTs` as an argument. A contract must use chain time. C++ mirror: `wax-contract-compiler` (private; not this public course) — accounting only, not deployed.

## Related labs

| Lab | Topic |
| --- | --- |
| [fee splitter](https://github.com/pixel-journey/px-treasury-incoming-fee-splitter) | Incoming fee legs |
| [pausable](https://github.com/pixel-journey/px-token-pausable-emergency-guard) | Pause claims without a single-key deadlock |
| [px-token-dust-truncation-visualizer](https://github.com/pixel-journey/px-token-dust-truncation-visualizer) | Floor on a small claim |
| [token ledger](https://github.com/pixel-journey/px-token-balance-ledger) | Where the payout is conserved |
| `px-contract-examples-vault` (private; not this public course) | Step 8 |
