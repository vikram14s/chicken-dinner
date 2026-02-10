import type { DecisionAttempt, ScenarioResult, UserProgress } from "./types";

export const PROGRESS_SCHEMA_VERSION = 1 as const;

export const createEmptyProgress = (): UserProgress => ({
  schemaVersion: PROGRESS_SCHEMA_VERSION,
  tier: "Rookie",
  attempts: [],
  conceptStats: {},
  recentMistakes: []
});

const deriveTier = (accuracy: number): UserProgress["tier"] => {
  if (accuracy >= 0.75) {
    return "Shark";
  }
  if (accuracy >= 0.6) {
    return "Grinder";
  }
  if (accuracy >= 0.45) {
    return "Apprentice";
  }
  return "Rookie";
};

export const appendAttempt = (
  progress: UserProgress,
  result: ScenarioResult,
  timestampIso: string = new Date().toISOString()
): UserProgress => {
  const attempt: DecisionAttempt = {
    scenarioId: result.scenarioId,
    selectedActionId: result.selectedActionId,
    isCorrect: result.isCorrect,
    evDelta: result.evDelta,
    conceptTags: result.conceptTags,
    timestamp: timestampIso
  };

  const attempts = [...progress.attempts, attempt].slice(-400);
  const conceptStats = { ...progress.conceptStats };

  for (const concept of result.conceptTags) {
    const current = conceptStats[concept] ?? { attempts: 0, correct: 0, rollingEvDelta: 0 };
    conceptStats[concept] = {
      attempts: current.attempts + 1,
      correct: current.correct + (result.isCorrect ? 1 : 0),
      rollingEvDelta: Number((current.rollingEvDelta + result.evDelta).toFixed(2))
    };
  }

  const mistakes = !result.isCorrect
    ? [result.scenarioId, ...progress.recentMistakes.filter((id) => id !== result.scenarioId)]
    : progress.recentMistakes;

  const trimmedMistakes = mistakes.slice(0, 20);
  const totalCorrect = attempts.filter((item) => item.isCorrect).length;
  const accuracy = attempts.length === 0 ? 0 : totalCorrect / attempts.length;

  return {
    schemaVersion: PROGRESS_SCHEMA_VERSION,
    tier: deriveTier(accuracy),
    attempts,
    conceptStats,
    recentMistakes: trimmedMistakes
  };
};

export const pickWeakConcepts = (progress: UserProgress, limit = 3): string[] => {
  const entries = Object.entries(progress.conceptStats);
  const sorted = entries
    .map(([concept, stat]) => {
      const accuracy = stat.attempts === 0 ? 0 : stat.correct / stat.attempts;
      return { concept, accuracy, attempts: stat.attempts };
    })
    .filter((item) => item.attempts >= 2)
    .sort((a, b) => a.accuracy - b.accuracy || b.attempts - a.attempts);

  return sorted.slice(0, limit).map((item) => item.concept);
};
