import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  vestedAmount,
  claimable,
  claimVested,
  assertGrant,
} from "./vest.ts";

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

  it("at cliff instant is floor of cliff fraction, not zero", () => {
    // nowTs = start + cliffSec = 1_000_100
    // floor(1000 * 100 / 1000) = 100
    assert.equal(vestedAmount(grant, 1_000_100), 100n);
  });

  it("is proportional after cliff", () => {
    assert.equal(vestedAmount(grant, 1_000_500), 500n);
  });

  it("is total after end", () => {
    assert.equal(vestedAmount(grant, 2_000_000), 1000n);
  });

  it("does not exceed total past the end", () => {
    assert.equal(vestedAmount(grant, 9_999_999), 1000n);
  });
});

describe("claimVested", () => {
  it("pays claimable and advances claimed", () => {
    const r = claimVested(grant, 1_000_500, "bob");
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

  it("refuses a second claim at the same timestamp", () => {
    const mid = claimVested(grant, 1_000_500, "bob");
    assert.throws(() => claimVested(mid.grant, 1_000_500, "bob"), /nothing/);
  });
});

describe("claimable", () => {
  it("accounts for prior claimed", () => {
    const g = { ...grant, claimed: 200n };
    assert.equal(claimable(g, 1_000_500), 300n);
  });

  it("is zero when claimed is ahead of vested", () => {
    const g = { ...grant, claimed: 600n };
    assert.equal(claimable(g, 1_000_500), 0n);
  });
});

describe("assertGrant", () => {
  it("refuses cliff above duration", () => {
    assert.throws(
      () => assertGrant({ ...grant, cliffSec: 1001 }),
      /cliff cannot exceed duration/,
    );
  });

  it("refuses non-positive total", () => {
    assert.throws(() => assertGrant({ ...grant, total: 0n }), /total must be positive/);
  });

  it("refuses claimed above total", () => {
    assert.throws(
      () => assertGrant({ ...grant, claimed: 1001n }),
      /claimed exceeds total/,
    );
  });

  it("refuses non-positive duration", () => {
    assert.throws(
      () => assertGrant({ ...grant, durationSec: 0 }),
      /durationSec must be positive/,
    );
  });
});
