import { handTotal } from "./cards.js";
import type { Pick, StrategyResult } from "./types.js";

export function nextPick(
  pRanks: readonly number[],
  bRanks: readonly number[],
  _prevP: number | null,
  _prevB: number | null,
): StrategyResult {
  const pTotal = handTotal(pRanks);
  const bTotal = handTotal(bRanks);
  const adjustedTotal = pTotal + bTotal + 3;

  const pick: Pick = adjustedTotal % 2 === 0 ? "閒家" : "莊家";

  return {
    pTotal,
    bTotal,
    tpP: null,
    tpB: null,
    nextPick: pick,
  };
}
