import type { Scenario, ScenarioResult } from "./types";

export const evaluateScenarioDecision = (
  scenario: Scenario,
  selectedActionId: string
): ScenarioResult => {
  const option = scenario.options.find((item) => item.id === selectedActionId);
  if (!option) {
    throw new Error(`Invalid action '${selectedActionId}' for scenario '${scenario.id}'.`);
  }

  const feedback = scenario.feedbackByAction[selectedActionId];
  if (!feedback) {
    throw new Error(`Missing feedback for action '${selectedActionId}' in scenario '${scenario.id}'.`);
  }

  const evDelta = scenario.evDeltaByAction[selectedActionId] ?? -2;

  return {
    scenarioId: scenario.id,
    selectedActionId,
    isCorrect: scenario.bestActionId === selectedActionId,
    evDelta,
    feedback,
    conceptTags: scenario.conceptTags
  };
};
