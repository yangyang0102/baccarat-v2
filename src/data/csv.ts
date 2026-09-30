import type { GameState } from "../core/types.js";

function pad(n: number): string { return String(n).padStart(2, "0"); }

function formatTime(ts: number): string {
  const d = new Date(ts || Date.now());
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function csvEscape(value: unknown): string {
  const s = value == null ? "" : String(value);
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function buildCsv(state: GameState): string {
  const rows: unknown[][] = [["局號", "輸入", "閒點", "莊點", "本局勝利", "上局建議", "上局結果", "下局建議", "時間"]];
  for (const row of [...state.log].reverse()) {
    rows.push([row.n, row.input, row.pTotal, row.bTotal, row.win, row.prevPick, row.prevPickResult, row.nextPick, formatTime(row.ts)]);
  }
  return "\ufeff" + rows.map((row) => row.map(csvEscape).join(",")).join("\n");
}
