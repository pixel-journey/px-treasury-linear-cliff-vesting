import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { vestedAmount, claimable, claimVested } from "./vest.ts";

const grant = {
  beneficiary: "alice",
  total: 1000n,
  claimed: 0n,
  startTs: 1_000_000,
  cliffSec: 100,
  durationSec: 1000,
};

describe("vestedAmount", () => {
  it("is zero before cliff", () => {
    assert.equal(vestedAmount(grant, 1_000_050), 0n);
  });

  it("is proportional after cliff", () => {
    // elapsed 500 of 1000 → 500
    assert.equal(vestedAmount(grant, 1_000_500), 500n);
  });

  it("is total after end", () => {
    assert.equal(vestedAmount(grant, 2_000_000), 1000n);
  });
});

describe("claimVested", () => {
  it("pays claimable and advances claimed", () => {
    const r = claimVested(grant, 1_000_500, "bob"); // permissionless caller
    assert.equal(r.payout, 500n);
    assert.equal(r.beneficiary, "alice");
    assert.equal(r.grant.claimed, 500n);
  });

  it("refuses when nothing claimable", () => {
    assert.throws(() => claimVested(grant, 1_000_050, "alice"), /nothing/);
  });

  it("second claim only pays the delta", () => {
    const mid = claimVested(grant, 1_000_500, "alice");
    const later = claimVested(mid.grant, 1_001_000, "alice");
    assert.equal(later.payout, 500n);
    assert.equal(later.grant.claimed, 1000n);
  });
});

describe("claimable", () => {
  it("accounts for prior claimed", () => {
    const g = { ...grant, claimed: 200n };
    assert.equal(claimable(g, 1_000_500), 300n);
  });
});
