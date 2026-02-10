import { describe, expect, it } from "vitest";
import { evaluateScenarioDecision } from "@/lib/evaluator";
import type { Scenario } from "@/lib/types";

const scenario: Scenario = {
  id: "scn-test",
  title: "Test Spot",
  street: "preflop",
  position: "CO",
  effectiveStackBB: 20,
  heroHand: "AsKs",
  board: [],
  potSizeBB: 1.5,
  toCallBB: 0,
  villainRange: "blinds",
  options: [
    { id: "fold", action: "fold", summary: "Fold" },
    { id: "raise", action: "raise", summary: "Raise" }
  ],
  bestActionId: "raise",
  evDeltaByAction: { fold: -1, raise: 1 },
  feedbackByAction: {
    fold: { whyGood: "none", whyRisky: "too tight", lectureRefs: ["Lecture 3"] },
    raise: { whyGood: "standard", whyRisky: "n/a", lectureRefs: ["Lecture 3"] }
  },
  conceptTags: ["preflop"],
  difficulty: 1
};

describe("evaluateScenarioDecision", () => {
  it("returns correct result fields", () => {
    const result = evaluateScenarioDecision(scenario, "raise");
    expect(result.isCorrect).toBe(true);
    expect(result.evDelta).toBe(1);
    expect(result.conceptTags).toEqual(["preflop"]);
  });

  it("throws on invalid action", () => {
    expect(() => evaluateScenarioDecision(scenario, "bad-id")).toThrow();
  });
});
