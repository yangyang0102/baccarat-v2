# Baccarat V2

從 `yangyang0102/baccarat` v1.47 抽離核心邏輯後重建的乾淨版本。

## 原則

- HV / AG / TP 決策邏輯不變。
- 保留標準百家樂補牌規則與舊版輸入順序。
- 保留「上一局建議 → 本局結算」的統計方式。
- 保留 A-F 六桌、localStorage 與牌局統計。
- 已移除舊版「課程 6 勝 / 7 局進度」功能。
- UI 與核心完全分離，之後可以重做 UI 而不碰算法。
- 不需要後端、不需要 API，能作為靜態 PWA 部署。

## 結構

- `src/core/`：純邏輯，與 UI 無關。
- `src/data/`：localStorage。
- `src/ui/`：畫面輸出。
- `src/main.ts`：操作流程與事件。
- `static/`：HTML / CSS / PWA。
- `tests/`：核心相容性測試。

## 建置

```bash
npm run build
npm test
npm run dev
```

輸出在 `dist/`，可直接部署到 Vercel / GitHub Pages / 任意靜態主機。

## 舊版清理

新版不帶入以下舊版技術債：

- HTML 結構殘留與重複 CSS。
- 已不存在的 DOM 元素事件綁定。
- state fixup 判斷順序造成舊資料重建無法觸發的問題。

## 還未主動改變的行為

舊版的初始牌輸入順序是：閒、閒、莊、莊，再依規則補牌；並不是實際發牌桌面的 P/B/P/B 順序。V2 暫時保留此行為，以避免操作習慣與演算法驗證同時變動。
