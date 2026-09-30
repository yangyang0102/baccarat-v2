import type { Pick, PickResult, Stats, Winner } from "./types.js";

export function settlePendingPick(
  stats: Stats,
  pendingPick: Pick | null,
  win: Winner,
): { stats: Stats; evaluated: Pick | "（無）"; result: PickResult } {
  const next = { ...stats };

  if (!pendingPick || pendingPick === "看一局") {
    next.pickSkipped += 1;
    return { stats: next, evaluated: pendingPick ?? "（無）", result: "略過" };
  }

  if (win === "和") {
    next.pickTies += 1;
    return { stats: next, evaluated: pendingPick, result: "和" };
  }

  if (pendingPick === win) {
    next.pickWins += 1;
    return { stats: next, evaluated: pendingPick, result: "贏" };
  }

  next.pickLosses += 1;
  return { stats: next, evaluated: pendingPick, result: "輸" };
}
