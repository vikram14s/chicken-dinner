import { describe, expect, it } from "vitest";
import {
  calculateBreakEvenEquity,
  classifyPotOdds,
  estimateEquityFromOuts
} from "@/lib/pokerMath";

describe("pokerMath", () => {
  it("calculates break-even equity", () => {
    expect(calculateBreakEvenEquity(12, 6)).toBeCloseTo(0.3333, 3);
  });

  it("estimates equity by outs", () => {
    expect(estimateEquityFromOuts(9, 2)).toBeCloseTo(0.36, 2);
    expect(estimateEquityFromOuts(8, 1)).toBeCloseTo(0.16, 2);
  });

  it("classifies profitable calls", () => {
    expect(classifyPotOdds(12, 6, 0.36)).toBe("call");
    expect(classifyPotOdds(12, 6, 0.22)).toBe("fold");
  });
});
