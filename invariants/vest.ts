/**
 * Cliff then linear vesting (educational).
 * Before cliff: vested = 0.
 * After cliff: linear to total over durationSec.
 * claimvested is permissionless for the beneficiary (anyone may call; credit goes to beneficiary).
 */

export type VestGrant = {
  beneficiary: string;
  total: bigint;
  claimed: bigint;
  /** Unix seconds */
  startTs: number;
  cliffSec: number;
  durationSec: number;
};

const NAME = /^[a-z1-5.]{1,12}$/;

export function assertName(name: string): string {
  if (!NAME.test(name) || name.startsWith(".") || name.endsWith(".")) {
    throw new Error("bad account name");
  }
  return name;
}

export function assertGrant(g: VestGrant): VestGrant {
  assertName(g.beneficiary);
  if (typeof g.total !== "bigint" || g.total <= 0n) throw new Error("total must be positive");
  if (typeof g.claimed !== "bigint" || g.claimed < 0n) throw new Error("bad claimed");
  if (g.claimed > g.total) throw new Error("claimed exceeds total");
  if (!Number.isInteger(g.startTs) || g.startTs < 0) throw new Error("bad startTs");
  if (!Number.isInteger(g.cliffSec) || g.cliffSec < 0) throw new Error("bad cliffSec");
  if (!Number.isInteger(g.durationSec) || g.durationSec <= 0) {
    throw new Error("durationSec must be positive");
  }
  if (g.cliffSec > g.durationSec) throw new Error("cliff cannot exceed duration");
  return g;
}

/** Amount vested at `nowTs` (not yet subtracting claimed). */
export function vestedAmount(g: VestGrant, nowTs: number): bigint {
  assertGrant(g);
  if (!Number.isInteger(nowTs) || nowTs < 0) throw new Error("bad nowTs");
  const cliffEnd = g.startTs + g.cliffSec;
  if (nowTs < cliffEnd) return 0n;
  const end = g.startTs + g.durationSec;
  if (nowTs >= end) return g.total;
  const elapsed = BigInt(nowTs - g.startTs);
  const dur = BigInt(g.durationSec);
  return (g.total * elapsed) / dur;
}

/** Claimable = vested - claimed. */
export function claimable(g: VestGrant, nowTs: number): bigint {
  const v = vestedAmount(g, nowTs);
  if (v <= g.claimed) return 0n;
  return v - g.claimed;
}

/**
 * Permissionless claim for beneficiary: caller may be anyone;
 * payout is always credited to grant.beneficiary semantics (returned in result).
 */
export function claimVested(
  g: VestGrant,
  nowTs: number,
  _caller: string
): { grant: VestGrant; payout: bigint; beneficiary: string } {
  assertName(_caller);
  const payout = claimable(g, nowTs);
  if (payout === 0n) throw new Error("nothing to claim");
  return {
    grant: { ...g, claimed: g.claimed + payout },
    payout,
    beneficiary: g.beneficiary,
  };
}
