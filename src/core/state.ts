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
  };
}

function numberOrZero(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function normalizeStats(input: unknown): Stats {
  const source = input && typeof input === "object" ? input as Record<string, unknown> : {};
  return {
    handNo: numberOrZero(source.handNo),
    bankerWins: numberOrZero(source.bankerWins),
    playerWins: numberOrZero(source.playerWins),
    ties: numberOrZero(source.ties),
    pickWins: numberOrZero(source.pickWins),
    pickLosses: numberOrZero(source.pickLosses),
    pickTies: numberOrZero(source.pickTies),
    pickSkipped: numberOrZero(source.pickSkipped),
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
    stats: normalizeStats(input.stats),
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
