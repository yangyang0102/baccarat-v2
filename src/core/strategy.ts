import { handTotal, max1to9 } from "./cards.js";
import type { Pick, StrategyResult } from "./types.js";

export const HV_MAP: Readonly<Record<number, number>> = Object.freeze({
  1: 9, 2: 8, 3: 7, 4: 6, 5: 5, 6: 1, 7: 3, 8: 2, 9: 2,
});

export const AG_MAP: Readonly<Record<number, number>> = Object.freeze({
  0: -4, 1: -5, 2: -5, 3: -2, 4: -1, 5: -1, 6: 3, 7: 4, 8: 5, 9: 6,
});

export function nextPick(
  pRanks: readonly number[],
  bRanks: readonly number[],
  prevP: number | null,
  prevB: number | null,
): StrategyResult {
  const pTotal = handTotal(pRanks);
  const bTotal = handTotal(bRanks);
  const pMax = max1to9(pRanks);
  const bMax = max1to9(bRanks);

  const pHv = pMax == null ? null : (HV_MAP[pMax] ?? null);
  const bHv = bMax == null ? null : (HV_MAP[bMax] ?? null);
  const pAg = prevP == null ? null : (AG_MAP[Math.abs(pTotal - prevP)] ?? null);
  const bAg = prevB == null ? null : (AG_MAP[Math.abs(bTotal - prevB)] ?? null);

  const tpP = pHv == null || pAg == null || pAg === 0 ? null : pHv / pAg;
  const tpB = bHv == null || bAg == null || bAg === 0 ? null : bHv / bAg;

  let pick: Pick | null = null;
  if (tpP != null && tpB != null) {
    if (tpP > tpB) pick = "莊家";
    else if (tpB > tpP) pick = "閒家";
    else pick = "看一局";
  }

  return { pTotal, bTotal, tpP, tpB, nextPick: pick };
}
