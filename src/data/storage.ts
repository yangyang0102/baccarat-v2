import { normalizeState, newState } from "../core/state.js";
import type { GameState } from "../core/types.js";

export const TABS = ["A", "B", "C", "D", "E", "F"] as const;
export type TabId = (typeof TABS)[number];

const STORAGE_KEY_BASE = "baccarat_v2_state";
const ACTIVE_TAB_KEY = "baccarat_v2_active_tab";
const LEGACY_STORAGE_KEY_BASE = "baccarat_main_only_v3";

function key(tab: TabId): string {
  return `${STORAGE_KEY_BASE}__${tab}`;
}

function legacyKey(tab: TabId): string {
  return `${LEGACY_STORAGE_KEY_BASE}__${tab}`;
}

export function loadTab(tab: TabId): GameState {
  try {
    const raw = localStorage.getItem(key(tab));
    if (raw) return normalizeState(JSON.parse(raw) as GameState);

    // 一次性相容舊版 A-F 資料，讀到後會在下次 save 時轉入 v2 key。
    const legacy = localStorage.getItem(legacyKey(tab)) ?? (tab === "A" ? localStorage.getItem(LEGACY_STORAGE_KEY_BASE) : null);
    if (legacy) return normalizeState(JSON.parse(legacy) as GameState);
  } catch {
    // Ignore corrupted local state and start fresh.
  }
  return newState();
}

export function saveTab(tab: TabId, state: GameState): void {
  localStorage.setItem(key(tab), JSON.stringify(state));
}

export function loadActiveTab(): TabId {
  const candidate = (localStorage.getItem(ACTIVE_TAB_KEY) || "A").toUpperCase();
  return (TABS as readonly string[]).includes(candidate) ? (candidate as TabId) : "A";
}

export function saveActiveTab(tab: TabId): void {
  localStorage.setItem(ACTIVE_TAB_KEY, tab);
}
