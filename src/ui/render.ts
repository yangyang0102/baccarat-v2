import { expectedSide } from "../core/baccaratRules.js";
import { handTotal, toFaceLabel } from "../core/cards.js";
import type { GameState, Pick } from "../core/types.js";
import type { TabId } from "../data/storage.js";
import { TABS } from "../data/storage.js";

function el<T extends HTMLElement>(selector: string): T {
  const node = document.querySelector<T>(selector);
  if (!node) throw new Error(`找不到介面元素：${selector}`);
  return node;
}

function text(selector: string, value: string): void {
  el(selector).textContent = value;
}

function handHtml(cards: readonly number[], side: "P" | "B"): string {
  if (!cards.length) return `<span class="empty">尚未輸入</span>`;
  return cards.map((card, i) => `<span class="mini-card ${side === "P" ? "player" : "banker"} ${i === 2 ? "third" : ""}">${toFaceLabel(card)}</span>`).join("");
}

function pickClass(pick: Pick | null): string {
  if (pick === "莊家") return "banker";
  if (pick === "閒家") return "player";
  return "watch";
}

export function renderTabs(active: TabId, onSwitch: (tab: TabId) => void): void {
  const root = el<HTMLDivElement>("#tabs");
  root.innerHTML = "";
  for (const tab of TABS) {
    const button = document.createElement("button");
    button.className = `tab ${tab === active ? "active" : ""}`;
    button.textContent = tab;
    button.addEventListener("click", () => onSwitch(tab));
    root.appendChild(button);
  }
}

export function renderState(state: GameState): void {
  const pick = state.pendingPick;
  const hero = el<HTMLDivElement>("#nextPickHero");
  hero.className = `pick-hero ${pickClass(pick)}`;
  hero.innerHTML = `<span class="eyebrow">下局建議</span><strong>${pick ?? "等待資料"}</strong>`;

  text("#handNo", String(state.stats.handNo));
  text("#wlt", `${state.stats.bankerWins} / ${state.stats.playerWins} / ${state.stats.ties}`);
  text("#pickStats", `${state.stats.pickWins} / ${state.stats.pickLosses} / ${state.stats.pickTies} / ${state.stats.pickSkipped}`);

  el("#pCards").innerHTML = handHtml(state.keypad.p, "P");
  el("#bCards").innerHTML = handHtml(state.keypad.b, "B");
  text("#pTotal", String(handTotal(state.keypad.p)));
  text("#bTotal", String(handTotal(state.keypad.b)));

  const next = expectedSide(state);
  let status = "本局輸入完成，可以送出";
  if (state.keypad.p.length + state.keypad.b.length < 2) status = `請輸入閒家第 ${state.keypad.p.length + 1} 張`;
  else if (state.keypad.p.length + state.keypad.b.length < 4) status = `請輸入莊家第 ${state.keypad.b.length + 1} 張`;
  else if (next === "P") status = "閒家需要補牌";
  else if (next === "B") status = "莊家需要補牌";
  text("#inputStatus", status);

  renderHistory(state);
}

function renderHistory(state: GameState): void {
  const root = el<HTMLDivElement>("#history");
  if (!state.log.length) {
    root.innerHTML = `<div class="empty-history">尚無牌局紀錄</div>`;
    return;
  }
  root.innerHTML = state.log.map((row, index) => `
    <article class="history-row ${index === 0 ? "latest" : ""}">
      <div class="history-main">
        <span class="hand-index">#${row.n}</span>
        <strong class="winner ${row.win === "莊家" ? "banker" : row.win === "閒家" ? "player" : "tie"}">${row.win}</strong>
        <span>上局 ${row.prevPick} → ${row.prevPickResult}</span>
        <span>下局 ${row.nextPick}</span>
      </div>
      <div class="history-sub">閒 ${row.pTotal} ・ 莊 ${row.bTotal} ・ TP ${row.tpP ?? "—"} / ${row.tpB ?? "—"}</div>
    </article>
  `).join("");
}
