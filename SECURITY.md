# Security notes

| Issue | Lab mitigation |
|-------|----------------|
| Claim before cliff | vested 0 → nothing to claim |
| Over-claim | claimable uses claimed offset |
| Wrong beneficiary credit | result always names grant.beneficiary |

Production needs token custody, revoke/admin rules, and overflow-safe time math on-chain.
