# AI prompts

Non-negotiables:

- Before the cliff, vested is **0**.
- After the cliff, the line is measured from **`start`**, not from the cliff instant.
- Permissionless claim still credits the **beneficiary**, not the caller.
- Lab `nowTs` is an argument. A real contract uses chain time.
- **PXJ precision is always 8.** Port the math, not the symbol.
- No wasm, no live transfer, no client clock as consensus time.

Prompt seeds:

1. Show vested amount one second before and one second after the cliff.
2. Explain why the cliff instant can jump when the line starts at `start`.
3. Caller is not the beneficiary — who is credited?
4. Port the schedule to precision 4 without changing cliff-from-start.
