import { handTotal, rankToVal } from "./cards.js";
import type { GameState, Side } from "./types.js";

export function isNatural(p2: number, b2: number): boolean {
  return p2 === 8 || p2 === 9 || b2 === 8 || b2 === 9;
}

export function bankerShouldDraw(b2: number, p3Point: number): boolean {
  if (b2 <= 2) return true;
  if (b2 === 3) return p3Point !== 8;
  if (b2 === 4) return p3Point >= 2 && p3Point <= 7;
  if (b2 === 5) return p3Point >= 4 && p3Point <= 7;
  if (b2 === 6) return p3Point === 6 || p3Point === 7;
  return false;
}

/**
 * 完整保留舊版 v1.47 的輸入流程：先輸入閒家兩張，再輸入莊家兩張，
 * 接著依標準補牌規則決定是否輸入第三張。
 */
export function expectedSide(state: Pick<GameState, "keypad">): Side | null {
  const p = state.keypad.p;
  const b = state.keypad.b;
  const total = p.length + b.length;

  if (total < 2) return "P";
  if (total < 4) return "B";
  if (p.length < 2 || b.length < 2) return null;

  const p2 = handTotal(p.slice(0, 2));
  const b2 = handTotal(b.slice(0, 2));
  if (isNatural(p2, b2)) return null;

  if (p.length === 2 && b.length === 2) {
    if (p2 <= 5) return "P";
    if (b2 <= 5) return "B";
    return null;
  }

  if (p.length === 3 && b.length === 2) {
    const p3 = rankToVal(p[2] ?? 0);
    return bankerShouldDraw(b2, p3) ? "B" : null;
  }

  return null;
}
