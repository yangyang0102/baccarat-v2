import { expectedSide } from "./core/baccaratRules.js";
import { cloneState, newState } from "./core/state.js";
import { submitHand } from "./core/engine.js";
import { buildCsv } from "./data/csv.js";
import { loadActiveTab, loadTab, saveActiveTab, saveTab, type TabId } from "./data/storage.js";
import { renderState, renderTabs } from "./ui/render.js";

type Snapshot = ReturnType<typeof cloneState>;

let activeTab = loadActiveTab();
let state = loadTab(activeTab);
let undo: Snapshot[] = [];
let redo: Snapshot[] = [];

function persist(): void { saveTab(activeTab, state); }
function rerender(): void { renderState(state); }

function switchTab(tab: TabId): void {
  if (tab === activeTab) return;
  persist();
  activeTab = tab;
  saveActiveTab(tab);
  state = loadTab(tab);
  undo = [];
  redo = [];
  renderTabs(activeTab, switchTab);
  rerender();
}

function pushCard(value: number): void {
  const side = expectedSide(state);
  if (!side) return;
  if (side === "P" && state.keypad.p.length < 3) state.keypad.p.push(value);
  if (side === "B" && state.keypad.b.length < 3) state.keypad.b.push(value);
  state.keypad.seq.push(side);
  persist();
  rerender();
}

function backspace(): void {
  const side = state.keypad.seq.pop();
  if (side === "P") state.keypad.p.pop();
  if (side === "B") state.keypad.b.pop();
  persist();
  rerender();
}

function clearInput(): void {
  state.keypad = { side: "P", p: [], b: [], seq: [] };
  persist();
  rerender();
}

function submitCurrent(): void {
  if (state.keypad.p.length < 2 || state.keypad.b.length < 2) {
    alert("請先輸入閒家兩張、莊家兩張");
    return;
  }
  const next = expectedSide(state);
  if (next === "P") { alert("依補牌規則，閒家需要補一張"); return; }
  if (next === "B") { alert("依補牌規則，莊家需要補一張"); return; }

  undo.push(cloneState(state));
  redo = [];
  state = submitHand(state, state.keypad.p, state.keypad.b);
  state.keypad = { side: "P", p: [], b: [], seq: [] };
  persist();
  rerender();
}

function undoHand(): void {
  const previous = undo.pop();
  if (!previous) { alert("沒有可撤銷的本局"); return; }
  redo.push(cloneState(state));
  state = previous;
  persist();
  rerender();
}

function redoHand(): void {
  const next = redo.pop();
  if (!next) { alert("沒有可復原的本局"); return; }
  undo.push(cloneState(state));
  state = next;
  persist();
  rerender();
}

function resetShoe(): void {
  if (!confirm("確定重置這一桌的牌靴與統計？")) return;
  undo.push(cloneState(state));
  state = newState();
  redo = [];
  persist();
  rerender();
}

function clearHistory(): void {
  if (!confirm("只清除紀錄列表，不重置統計與策略狀態？")) return;
  state.log = [];
  persist();
  rerender();
}

function exportCsv(): void {
  if (!state.log.length) return;
  const blob = new Blob([buildCsv(state)], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Monster_V2_Tab${activeTab}_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function bind(): void {
  document.querySelectorAll<HTMLButtonElement>("[data-card]").forEach((button) => {
    button.addEventListener("click", () => pushCard(Number(button.dataset.card)));
  });
  document.querySelector("#backspaceBtn")?.addEventListener("click", backspace);
  document.querySelector("#clearInputBtn")?.addEventListener("click", clearInput);
  document.querySelector("#submitBtn")?.addEventListener("click", submitCurrent);
  document.querySelector("#undoBtn")?.addEventListener("click", undoHand);
  document.querySelector("#redoBtn")?.addEventListener("click", redoHand);
  document.querySelector("#resetBtn")?.addEventListener("click", resetShoe);
  document.querySelector("#clearHistoryBtn")?.addEventListener("click", clearHistory);
  document.querySelector("#exportBtn")?.addEventListener("click", exportCsv);
}

renderTabs(activeTab, switchTab);
bind();
rerender();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js").catch(() => {}));
}
