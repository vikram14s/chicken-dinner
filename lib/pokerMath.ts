export const calculateBreakEvenEquity = (potSizeBB: number, callSizeBB: number): number => {
  if (callSizeBB <= 0) {
    return 0;
  }

  return callSizeBB / (potSizeBB + callSizeBB);
};

export const estimateEquityFromOuts = (outs: number, cardsToCome: 1 | 2): number => {
  const boundedOuts = Math.max(0, Math.min(20, outs));
  if (cardsToCome === 2) {
    return Math.min(1, (boundedOuts * 4) / 100);
  }

  return Math.min(1, (boundedOuts * 2) / 100);
};

export const formatPercentage = (value: number): string => `${(value * 100).toFixed(1)}%`;

export const classifyPotOdds = (potSizeBB: number, callSizeBB: number, estimatedEquity: number): "call" | "fold" => {
  const breakEven = calculateBreakEvenEquity(potSizeBB, callSizeBB);
  return estimatedEquity >= breakEven ? "call" : "fold";
};
