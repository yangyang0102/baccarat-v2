import type { Pick, PickResult, Stats, Winner } from "./types.js";

export function updateCourseAfterPickResult(stats: Stats, result: "贏" | "輸"): Stats {
  if (stats.courseDone) return { ...stats };
  const next = { ...stats };

  if (result === "贏") {
    next.courseWins += 1;
    if (next.courseWins >= 6) {
      next.courseWins = 6;
      next.courseDone = true;
    }
    next.courseProgress = 0;
  } else {
    next.courseProgress += 1;
    if (next.courseProgress >= 7) next.courseProgress = 0;
  }
  return next;
}

export function settlePendingPick(
  stats: Stats,
  pendingPick: Pick | null,
  win: Winner,
): { stats: Stats; evaluated: Pick | "（無）"; result: PickResult } {
  let next = { ...stats };
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
    next = updateCourseAfterPickResult(next, "贏");
    return { stats: next, evaluated: pendingPick, result: "贏" };
  }

  next.pickLosses += 1;
  next = updateCourseAfterPickResult(next, "輸");
  return { stats: next, evaluated: pendingPick, result: "輸" };
}
