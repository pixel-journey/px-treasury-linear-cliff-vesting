# Official sources

Vesting is a **dapp treasury pattern**. Token movement uses your configured token contract.

| Source | Use |
| --- | --- |
| [docs.wax.io](https://docs.wax.io/) | WAX development |
| [docs.eosnetwork.com](https://docs.eosnetwork.com/) | Actions, time points, permissions |
| [eosio.token](https://github.com/eosio/eosio.contracts) | Transfer / balance primitives |
| [Antelope CDT](https://docs.eosnetwork.com/docs/latest/smart-contracts/) | Contract structure |

## Production mirror

| Artifact | Link |
| --- | --- |
| C++ `pxvest` | [wax-contract-compiler/contracts/pxvest](https://github.com/pixel-journey/wax-contract-compiler/tree/main/contracts/pxvest) |
| CI run | [run 28](https://github.com/pixel-journey/wax-contract-compiler/actions/runs/43213090195) |
| WASM SHA256 | `f9c9e1d7df5b7cc2dc68374a182ce9135a704a713c6cd5f30255881116f80c92` |

## Domain map

| Repo | Role |
| --- | --- |
| **This repo** | Cliff + linear + permissionless claim |
| [px-treasury-incoming-fee-splitter](https://github.com/pixel-journey/px-treasury-incoming-fee-splitter) | Fund allocation |
| [px-token-dust-truncation-visualizer](https://github.com/pixel-journey/px-token-dust-truncation-visualizer) | Zero claims on tiny amounts |
| [px-token-pausable-emergency-guard](https://github.com/pixel-journey/px-token-pausable-emergency-guard) | Emergency pause |
