# Official sources

Vesting schedules are dapp policy. On WAX, paying a claim still needs a token contract and custody of the grant.

| Source | Use |
| --- | --- |
| [docs.wax.io](https://docs.wax.io/) | WAX development |
| [docs.eosnetwork.com](https://docs.eosnetwork.com/) | Time, actions, permissions |
| [eosio.token reference](https://github.com/eosio/eosio.contracts) | Paying vested amounts |

## Domain map

| Repo | Role |
| --- | --- |
| [px-treasury-incoming-fee-splitter](https://github.com/pixel-journey/px-treasury-incoming-fee-splitter) | Incoming bps fan-out |
| **This repo** | Cliff then linear unlock; permissionless claim to beneficiary |
| [px-invariant-kit](https://github.com/pixel-journey/px-invariant-kit) | Shared time-window / math ideas |
