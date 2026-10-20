import type { WheelPrize } from '../types/index.ts';

export const ESCAPE_DIALOGUES = [
  'Hộp quà ngại quá, chạy mất rồi!',
  'Né đòn cấp độ Thách Đấu! Bắt được anh đi!',
  'Chưa mở được đâu nè lé le 😜',
  'Ui da suýt bấm trúng! Nhanh tay hơn nữa xem nào!',
  'Thôi thương em lắm rồi, đứng yên nè, mở đi nha! 🎁',
];

export const MAX_ESCAPE_ATTEMPTS = 5;

/**
 * Calculates the next evasive position for the runaway gift button.
 * After MAX_ESCAPE_ATTEMPTS, it stands still and signals isTired = true.
 */
export function getNextEscapePosition(
  currentTries: number,
  containerWidth: number = 320,
  containerHeight: number = 260,
  btnWidth: number = 140,
  btnHeight: number = 48,
  seedRandom: number = Math.random()
): { x: number; y: number; isTired: boolean; dialogue: string } {
  if (currentTries >= MAX_ESCAPE_ATTEMPTS - 1) {
    return {
      x: 0,
      y: 0,
      isTired: true,
      dialogue: ESCAPE_DIALOGUES[ESCAPE_DIALOGUES.length - 1],
    };
  }

  const dialogue = ESCAPE_DIALOGUES[currentTries % (ESCAPE_DIALOGUES.length - 1)];

  // Calculate safe bounds within container
  const maxX = Math.max(30, (containerWidth - btnWidth) / 2);
  const maxY = Math.max(30, (containerHeight - btnHeight) / 2);

  // Generate deterministic/pseudo-random offset
  const angle = (currentTries * 137.5 * Math.PI) / 180 + seedRandom * 0.5;
  const radiusX = (0.5 + 0.5 * ((seedRandom * 97) % 1)) * maxX;
  const radiusY = (0.5 + 0.5 * ((seedRandom * 53) % 1)) * maxY;

  const rawX = Math.cos(angle) * radiusX;
  const rawY = Math.sin(angle) * radiusY;

  // Clamp within bounds
  const x = Math.max(-maxX, Math.min(maxX, Math.round(rawX)));
  const y = Math.max(-maxY, Math.min(maxY, Math.round(rawY)));

  return {
    x,
    y,
    isTired: false,
    dialogue,
  };
}

/**
 * Calculates rigged wheel spin result.
 * Ensures the prize is always a good prize (or intentional funny troll with safe reroll),
 * and computes exact degrees so the pointer accurately aligns with the slice.
 */
export function calculateRiggedWheelResult(
  prizes: WheelPrize[],
  spinCount: number = 0,
  currentDegrees: number = 0,
  forcedIndex?: number
): {
  selectedPrize: WheelPrize;
  selectedIndex: number;
  targetRotationDegrees: number;
  isTroll: boolean;
} {
  const total = prizes.length;
  if (total === 0) {
    throw new Error('Prizes array cannot be empty');
  }

  let selectedIndex: number;

  if (typeof forcedIndex === 'number' && forcedIndex >= 0 && forcedIndex < total) {
    selectedIndex = forcedIndex;
  } else {
    // If first spin, pick a super sweet prize (e.g. food tour or special wish)
    // Troll occurs at most once every 3 spins to keep it funny but never frustrating!
    const nonTrollIndices = prizes
      .map((p, idx) => ({ p, idx }))
      .filter((item) => !item.p.isTroll)
      .map((item) => item.idx);

    const trollIndices = prizes
      .map((p, idx) => ({ p, idx }))
      .filter((item) => item.p.isTroll)
      .map((item) => item.idx);

    // If it's 2nd spin and we have a troll slice, give a fun troll once!
    if (spinCount === 1 && trollIndices.length > 0 && Math.random() > 0.4) {
      selectedIndex = trollIndices[0];
    } else {
      const randomNonTroll = nonTrollIndices[Math.floor(Math.random() * nonTrollIndices.length)];
      selectedIndex = randomNonTroll !== undefined ? randomNonTroll : 0;
    }
  }

  const selectedPrize = prizes[selectedIndex];
  const sliceAngle = 360 / total;

  // Pointer is at the top (270 deg or 90 deg depending on canvas orientation).
  // Standard wheel: slice 0 starts at angle 0. Center of slice i is (i + 0.5) * sliceAngle.
  // To rotate slice i to pointer at top (270 deg):
  // rotation = 270 - (selectedIndex + 0.5) * sliceAngle + fullSpins * 360
  const sliceCenter = (selectedIndex + 0.5) * sliceAngle;
  const basePointerAngle = 270; // Top position
  let desiredRemainder = (basePointerAngle - sliceCenter) % 360;
  if (desiredRemainder < 0) desiredRemainder += 360;

  // Add at least 5-7 full spins (1800 - 2520 deg)
  const fullSpins = (5 + (spinCount % 3)) * 360;
  const currentNormalized = currentDegrees % 360;
  let delta = desiredRemainder - currentNormalized;
  if (delta < 0) delta += 360;

  const targetRotationDegrees = currentDegrees + fullSpins + delta;

  return {
    selectedPrize,
    selectedIndex,
    targetRotationDegrees,
    isTroll: Boolean(selectedPrize.isTroll),
  };
}

/**
 * Calculates progress for the 20 love reasons cards.
 */
export function calculateReasonsProgress(
  openedIds: number[],
  totalCount: number = 20
): { openedCount: number; percent: number; isComplete: boolean } {
  const uniqueOpened = new Set(openedIds);
  const openedCount = Math.min(uniqueOpened.size, totalCount);
  const percent = Math.round((openedCount / totalCount) * 100);
  const isComplete = openedCount >= totalCount;

  return {
    openedCount,
    percent,
    isComplete,
  };
}

/**
 * Checks if all three family candles are lit.
 */
export function checkFamilyCandlesComplete(
  litCandleIds: string[],
  requiredIds: string[] = ['candle-ba', 'candle-me', 'candle-con']
): { isAllLit: boolean; litCount: number; total: number } {
  const litSet = new Set(litCandleIds);
  const litCount = requiredIds.filter((id) => litSet.has(id)).length;
  return {
    isAllLit: litCount === requiredIds.length,
    litCount,
    total: requiredIds.length,
  };
}

/**
 * Calculates physical perceived illumination (0 to 1) for a position/sticker near a specific candle.
 * When this candle is lit: 1.0.
 * When neighboring candles are lit: receives light spillover.
 * When all 3 are lit: full 1.0 room illumination.
 */
export function calculateCandleIllumination(
  litCandleIds: string[],
  targetCandleId: string
): number {
  if (litCandleIds.length === 0) return 0.1; // Deep night darkness
  if (litCandleIds.length >= 3) return 1.0; // Whole room brightly illuminated

  const isTargetLit = litCandleIds.includes(targetCandleId);
  if (isTargetLit) return 1.0;

  // Neighbor spillover light (Mẹ is in the middle, neighbors with both Ba and Con)
  if (targetCandleId === 'candle-me') {
    // Spillover from Ba or Con
    return 0.35 + (litCandleIds.length - 1) * 0.25;
  } else {
    // Ba or Con receives spillover from Mẹ or distant candle
    const isMeLit = litCandleIds.includes('candle-me');
    return isMeLit ? 0.32 : 0.18;
  }
}

/**
 * Calculates progress through multi-layer gift unwrapping.
 */
export function calculateGiftLayerProgress(
  currentLayerStep: number,
  totalLayers: number = 5
): { isCompleted: boolean; currentStep: number; remaining: number } {
  const isCompleted = currentLayerStep >= totalLayers;
  const remaining = Math.max(0, totalLayers - currentLayerStep);
  return {
    isCompleted,
    currentStep: currentLayerStep,
    remaining,
  };
}

