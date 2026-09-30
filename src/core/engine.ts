import { assertCardRank, handTotal, winnerLabel } from "./cards.js";
import { settlePendingPick } from "./course.js";
import { nextPick } from "./strategy.js";
import type { GameState, Winner } from "./types.js";

function applyHandResult(state: GameState, win: Winner): void {
  state.stats.handNo += 1;
  if (win === "莊家") state.stats.bankerWins += 1;
  else if (win === "閒家") state.stats.playerWins += 1;
  else state.stats.ties += 1;
}

export function submitHand(
  current: GameState,
  p: readonly number[],
  b: readonly number[],
  now = Date.now(),
): GameState {
  p.forEach(assertCardRank);
  b.forEach(assertCardRank);
  if (p.length < 2 || p.length > 3 || b.length < 2 || b.length > 3) {
    throw new Error("閒家與莊家都必須是 2~3 張牌");
  }

  const state = structuredClone(current);
  const pTotal = handTotal(p);
  const bTotal = handTotal(b);
  const win = winnerLabel(pTotal, bTotal);

  const settled = settlePendingPick(state.stats, state.pendingPick, win);
  state.stats = settled.stats;
  applyHandResult(state, win);

  const strategy = nextPick(p, b, state.prevP, state.prevB);
  state.prevP = strategy.pTotal;
  state.prevB = strategy.bTotal;
  state.pendingPick = strategy.nextPick;

  state.log.unshift({
    n: state.stats.handNo,
    input: `${p.join(".")} ${b.join(".")}`,
    pTotal: strategy.pTotal,
    bTotal: strategy.bTotal,
    win,
    prevPick: settled.evaluated,
    prevPickResult: settled.result,
    nextPick: strategy.nextPick ?? "（前兩手不足）",
    tpP: strategy.tpP,
    tpB: strategy.tpB,
    ts: now,
  });
  state.log = state.log.slice(0, 200);
  return state;
}
