import type { Winner } from "./types.js";

export function rankToVal(rank: number): number {
  if (rank === 1) return 1;
  if (rank >= 2 && rank <= 9) return rank;
  return 0;
}

export function handTotal(ranks: readonly number[]): number {
  return ranks.reduce((sum, rank) => sum + rankToVal(rank), 0) % 10;
}

export function max1to9(ranks: readonly number[]): number | null {
  const filtered = ranks.filter((rank) => rank >= 1 && rank <= 9);
  return filtered.length ? Math.max(...filtered) : null;
}

export function winnerLabel(pTotal: number, bTotal: number): Winner {
  if (pTotal > bTotal) return "閒家";
  if (bTotal > pTotal) return "莊家";
  return "和";
}

export function toFaceLabel(value: number): string {
  if (value === 1) return "A";
  if (value === 11) return "J";
  if (value === 12) return "Q";
  if (value === 13) return "K";
  return String(value);
}

export function assertCardRank(value: number): void {
  if (!Number.isInteger(value) || value < 1 || value > 13) {
    throw new Error("牌面需為 1~13 的整數");
  }
}
