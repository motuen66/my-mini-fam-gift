import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getNextEscapePosition,
  calculateRiggedWheelResult,
  calculateReasonsProgress,
  checkFamilyCandlesComplete,
  calculateCandleIllumination,
  calculateGiftLayerProgress,
  MAX_ESCAPE_ATTEMPTS,
} from './logic.ts';

import { INITIAL_WHEEL_PRIZES } from '../content/config.ts';

test('runaway gift button evades for first attempts and gives in on final attempt', () => {
  // Test attempt 0 to 3
  for (let attempt = 0; attempt < MAX_ESCAPE_ATTEMPTS - 1; attempt++) {
    const res = getNextEscapePosition(attempt, 320, 240, 120, 44, 0.42);
    assert.equal(res.isTired, false);
    assert.ok(typeof res.dialogue === 'string' && res.dialogue.length > 0);
  }

  // Final attempt: button must stay still (0, 0) and isTired = true
  const finalRes = getNextEscapePosition(MAX_ESCAPE_ATTEMPTS - 1, 320, 240, 120, 44, 0.42);
  assert.equal(finalRes.isTired, true);
  assert.equal(finalRes.x, 0);
  assert.equal(finalRes.y, 0);
  assert.ok(finalRes.dialogue.includes('thương em'));
});

test('rigged wheel calculation rotates accurately to selected slice and adds full rotations', () => {
  const prizes = INITIAL_WHEEL_PRIZES;
  const result = calculateRiggedWheelResult(prizes, 0, 0, 0); // slice 0

  assert.equal(result.selectedIndex, 0);
  assert.equal(result.selectedPrize.id, prizes[0].id);
  assert.ok(result.targetRotationDegrees > 1800, 'Must do multiple full spins');

  // Verify slice math: slice 0 has sliceAngle = 360 / 8 = 45 deg, center = 22.5 deg.
  // Top pointer is 270 deg. So 270 - 22.5 = 247.5 deg.
  // Target rotation mod 360 should equal 247.5 deg!
  const remainder = result.targetRotationDegrees % 360;
  assert.ok(Math.abs(remainder - 247.5) < 0.001, `Expected ~247.5 deg, got ${remainder}`);
});

test('calculateReasonsProgress tracks opened cards accurately', () => {
  const p0 = calculateReasonsProgress([], 20);
  assert.equal(p0.openedCount, 0);
  assert.equal(p0.percent, 0);
  assert.equal(p0.isComplete, false);

  const p10 = calculateReasonsProgress([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 20);
  assert.equal(p10.openedCount, 10);
  assert.equal(p10.percent, 50);
  assert.equal(p10.isComplete, false);

  // Duplicates handled gracefully
  const pDup = calculateReasonsProgress([1, 1, 1, 2, 2], 20);
  assert.equal(pDup.openedCount, 2);
  assert.equal(pDup.percent, 10);

  // All 20 opened
  const allIds = Array.from({ length: 20 }, (_, i) => i + 1);
  const p20 = calculateReasonsProgress(allIds, 20);
  assert.equal(p20.openedCount, 20);
  assert.equal(p20.percent, 100);
  assert.equal(p20.isComplete, true);
});

test('checkFamilyCandlesComplete validates all 3 required candles', () => {
  const step0 = checkFamilyCandlesComplete([]);
  assert.equal(step0.isAllLit, false);
  assert.equal(step0.litCount, 0);

  const step1 = checkFamilyCandlesComplete(['candle-ba']);
  assert.equal(step1.isAllLit, false);
  assert.equal(step1.litCount, 1);

  const step2 = checkFamilyCandlesComplete(['candle-ba', 'candle-me']);
  assert.equal(step2.isAllLit, false);
  assert.equal(step2.litCount, 2);

  const step3 = checkFamilyCandlesComplete(['candle-ba', 'candle-me', 'candle-con']);
  assert.equal(step3.isAllLit, true);
  assert.equal(step3.litCount, 3);
});

test('calculateCandleIllumination models realistic light levels and neighbor spillover', () => {
  // All dark
  assert.equal(calculateCandleIllumination([], 'candle-ba'), 0.1);

  // When candle-ba is lit, it gets 1.0; candle-me gets spillover; candle-con is distant
  assert.equal(calculateCandleIllumination(['candle-ba'], 'candle-ba'), 1.0);
  assert.ok(calculateCandleIllumination(['candle-ba'], 'candle-me') > 0.3);
  assert.ok(calculateCandleIllumination(['candle-ba'], 'candle-con') < 0.2);

  // When all 3 are lit, everything is fully 1.0
  assert.equal(calculateCandleIllumination(['candle-ba', 'candle-me', 'candle-con'], 'candle-ba'), 1.0);
  assert.equal(calculateCandleIllumination(['candle-ba', 'candle-me', 'candle-con'], 'candle-me'), 1.0);
  assert.equal(calculateCandleIllumination(['candle-ba', 'candle-me', 'candle-con'], 'candle-con'), 1.0);
});

test('calculateGiftLayerProgress tracks unwrapping progression', () => {
  const layer1 = calculateGiftLayerProgress(1, 5);
  assert.equal(layer1.isCompleted, false);
  assert.equal(layer1.remaining, 4);

  const layer5 = calculateGiftLayerProgress(5, 5);
  assert.equal(layer5.isCompleted, true);
  assert.equal(layer5.remaining, 0);
});

