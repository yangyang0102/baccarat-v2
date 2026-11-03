import test from "node:test";
import assert from "node:assert/strict";
import { handTotal, winnerLabel } from "../dist/js/core/cards.js";
import { bankerShouldDraw, isNatural } from "../dist/js/core/baccaratRules.js";
import { nextPick } from "../dist/js/core/strategy.js";
import { newState, normalizeState } from "../dist/js/core/state.js";
import { submitHand } from "../dist/js/core/engine.js";

test("baccarat card totals", () => {
  assert.equal(handTotal([1,9]), 0);
  assert.equal(handTotal([10,11,9]), 9);
  assert.equal(winnerLabel(7,4), "閒家");
});

test("natural and banker third-card table", () => {
  assert.equal(isNatural(8,2), true);
  assert.equal(bankerShouldDraw(3,8), false);
  assert.equal(bankerShouldDraw(4,7), true);
  assert.equal(bankerShouldDraw(6,5), false);
});

test("strategy uses player + banker + 3 parity rule", () => {
  const even = nextPick([2,3], [1,5], null, null);
  assert.equal(even.pTotal, 5);
  assert.equal(even.bTotal, 6);
  assert.equal(even.pTotal + even.bTotal + 3, 14);
  assert.equal(even.nextPick, "閒家");
  assert.equal(even.tpP, null);
  assert.equal(even.tpB, null);

  const odd = nextPick([1,3], [1,5], null, null);
  assert.equal(odd.pTotal, 4);
  assert.equal(odd.bTotal, 6);
  assert.equal(odd.pTotal + odd.bTotal + 3, 13);
  assert.equal(odd.nextPick, "莊家");
});

test("pending pick settles against the following hand", () => {
  let state = newState();

  state = submitHand(state, [1,2], [3,4], 1);
  assert.equal(state.pendingPick, "莊家");

  state = submitHand(state, [5,2], [7,1], 2);
  assert.equal(state.stats.pickWins, 1);
  assert.equal(state.pendingPick, "閒家");

  state = submitHand(state, [9,8], [2,2], 3);
  assert.equal(state.stats.pickWins, 2);
});

test("legacy course fields are discarded when loading old state", () => {
  const state = normalizeState({
    ...newState(),
    stats: {
      ...newState().stats,
      courseWins: 6,
      courseProgress: 4,
      courseDone: true,
    },
  });
  assert.equal("courseWins" in state.stats, false);
  assert.equal("courseProgress" in state.stats, false);
  assert.equal("courseDone" in state.stats, false);
});
