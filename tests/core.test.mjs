import test from "node:test";
import assert from "node:assert/strict";
import { handTotal, winnerLabel } from "../dist/js/core/cards.js";
import { bankerShouldDraw, isNatural } from "../dist/js/core/baccaratRules.js";
import { nextPick } from "../dist/js/core/strategy.js";
import { newState } from "../dist/js/core/state.js";
import { submitHand } from "../dist/js/core/engine.js";
import { updateCourseAfterPickResult } from "../dist/js/core/course.js";

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

test("strategy remains compatible with HV/AG/TP logic", () => {
  const first = nextPick([1,2], [3,4], null, null);
  assert.equal(first.nextPick, null);
  const second = nextPick([5,2], [7,1], first.pTotal, first.bTotal);
  assert.equal(second.tpP, -5);
  assert.equal(second.tpB, -0.6);
  assert.equal(second.nextPick, "閒家");
});

test("pending pick settles against the following hand", () => {
  let state = newState();
  state = submitHand(state, [1,2], [3,4], 1);
  assert.equal(state.pendingPick, null);
  state = submitHand(state, [5,2], [7,1], 2);
  assert.equal(state.pendingPick, "閒家");
  state = submitHand(state, [9,8], [2,2], 3);
  assert.equal(state.stats.pickWins, 1);
  assert.equal(state.stats.courseWins, 1);
});

test("course completes at six wins and loss progress wraps at seven", () => {
  let stats = newState().stats;
  for (let i=0;i<6;i++) stats = updateCourseAfterPickResult(stats, "贏");
  assert.equal(stats.courseDone, true);
  assert.equal(stats.courseWins, 6);

  let lossStats = newState().stats;
  for (let i=0;i<7;i++) lossStats = updateCourseAfterPickResult(lossStats, "輸");
  assert.equal(lossStats.courseProgress, 0);
});
