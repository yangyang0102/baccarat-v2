export type Side = "P" | "B";
export type Winner = "閒家" | "莊家" | "和";
export type Pick = "閒家" | "莊家" | "看一局";
export type PickResult = "贏" | "輸" | "和" | "略過";

export interface Stats {
  handNo: number;
  bankerWins: number;
  playerWins: number;
  ties: number;
  pickWins: number;
  pickLosses: number;
  pickTies: number;
  pickSkipped: number;
}

export interface KeypadState {
  side: Side;
  p: number[];
  b: number[];
  seq: Side[];
}

export interface LogRow {
  n: number;
  input: string;
  pTotal: number;
  bTotal: number;
  win: Winner;
  prevPick: Pick | "（無）";
  prevPickResult: PickResult;
  nextPick: Pick | "（前兩手不足）";
  tpP: number | null;
  tpB: number | null;
  ts: number;
}

export interface GameState {
  prevP: number | null;
  prevB: number | null;
  pendingPick: Pick | null;
  stats: Stats;
  log: LogRow[];
  keypad: KeypadState;
}

export interface StrategyResult {
  pTotal: number;
  bTotal: number;
  tpP: number | null;
  tpB: number | null;
  nextPick: Pick | null;
}
