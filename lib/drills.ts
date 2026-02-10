import type { Scenario } from "./types";

export const rankDrillScenarios = (
  scenarios: Scenario[],
  weakConcepts: string[],
  count: number
): Scenario[] => {
  const weakSet = new Set(weakConcepts);

  const scored = scenarios.map((scenario) => {
    const weakMatchCount = scenario.conceptTags.filter((tag) => weakSet.has(tag)).length;
    const score = weakMatchCount * 10 + scenario.difficulty;
    return { scenario, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .map((item) => item.scenario);
};
