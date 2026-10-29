# Education

```text
before cliffEnd:  vested = 0
cliffEnd..end:    vested = total * (now - start) / duration   (floor)
after end:        vested = total
claimable:        vested - claimed
```

**Permissionless claim:** anyone may call `claimVested`; funds are still attributed to `beneficiary`. That prevents a stuck grant if the beneficiary never sends a tx, while keeping the economic recipient fixed.
