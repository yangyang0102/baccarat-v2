import type { GameState, Stats } from "./types.js";

export function newStats(): Stats {
  return {
    handNo: 0,
    bankerWins: 0,
    playerWins: 0,
    ties: 0,
    pickWins: 0,
    pickLosses: 0,
    pickTies: 0,
    pickSkipped: 0,
    courseWins: 0,
    courseProgress: 0,
    courseDone: false,
  };
}

export function newState(): GameState {
  return {
    prevP: null,
    prevB: null,
    pendingPick: null,
    stats: newStats(),
    log: [],
    keypad: { side: "P", p: [], b: [], seq: [] },
  };
}

export function normalizeState(input: Partial<GameState> | null | undefined): GameState {
  const base = newState();
  if (!input) return base;
  return {
    ...base,
    ...input,
    stats: { ...base.stats, ...(input.stats ?? {}) },
    log: Array.isArray(input.log) ? input.log.slice(0, 200) : [],
    keypad: {
      ...base.keypad,
      ...(input.keypad ?? {}),
      p: Array.isArray(input.keypad?.p) ? [...input.keypad.p] : [],
      b: Array.isArray(input.keypad?.b) ? [...input.keypad.b] : [],
      seq: Array.isArray(input.keypad?.seq) ? [...input.keypad.seq] : [],
    },
  };
}

export function cloneState(state: GameState): GameState {
  return structuredClone(state);
}
