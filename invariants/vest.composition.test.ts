/**
 * Composition: multi-step vest claims over time.
 * Sum of payouts never exceeds total. Permissionless caller still credits beneficiary.
 * Independent grants do not share claimed state.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { claimVested, claimable, type VestGrant } from "./vest.ts";

const base: VestGrant = {
  beneficiary: "alice",
  total: 1000n,
  claimed: 0n,
  startTs: 1_000_000,
  cliffSec: 100,
  durationSec: 1000,
};

describe("composition: sequential vest claims", () => {
  it("full lifecycle: cliff refuse, mid claim, final claim, total conserved", () => {
    let g = { ...base };
    let paid = 0n;
    assert.throws(() => claimVested(g, 1_000_050, "alice"), /nothing/);
    const mid = claimVested(g, 1_000_500, "alice");
    paid += mid.payout;
    g = mid.grant;
    assert.equal(mid.payout, 500n);
    assert.throws(() => claimVested(g, 1_000_500, "alice"), /nothing/);
    const end = claimVested(g, 2_000_000, "bob");
    paid += end.payout;
    g = end.grant;
    assert.equal(end.beneficiary, "alice");
    assert.equal(paid, 1000n);
    assert.equal(g.claimed, 1000n);
    assert.equal(claimable(g, 9_999_999), 0n);
    assert.throws(() => claimVested(g, 9_999_999, "alice"), /nothing/);
  });

  it("permissionless helper credits beneficiary, not the caller", () => {
    const r = claimVested(base, 1_000_500, "helperacct");
    assert.equal(r.beneficiary, "alice");
    assert.equal(r.payout, 500n);
    assert.notEqual(r.beneficiary, "helperacct");
  });

  it("two grants stay independent", () => {
    const alice = { ...base };
    const bob: VestGrant = {
      ...base,
      beneficiary: "bob",
      total: 200n,
      durationSec: 200,
      cliffSec: 0,
    };
    const a = claimVested(alice, 1_000_500, "x");
    const b = claimVested(bob, 1_000_100, "x");
    assert.equal(a.grant.claimed, 500n);
    assert.equal(b.grant.claimed, 100n);
    assert.equal(a.beneficiary, "alice");
    assert.equal(b.beneficiary, "bob");
  });

  it("three partial claims sum exactly to total", () => {
    let g = { ...base };
    let paid = 0n;
    for (const t of [1_000_250, 1_000_750, 1_001_000] as const) {
      const r = claimVested(g, t, "alice");
      paid += r.payout;
      g = r.grant;
    }
    assert.equal(paid, 1000n);
    assert.equal(g.claimed, 1000n);
  });
});
