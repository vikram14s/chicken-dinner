"use client";

import { appendAttempt, createEmptyProgress, PROGRESS_SCHEMA_VERSION } from "./progress";
import type { ScenarioResult, UserProgress } from "./types";

const STORAGE_KEY = "progress.v1";

export const loadProgress = (): UserProgress => {
  if (typeof window === "undefined") {
    return createEmptyProgress();
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return createEmptyProgress();
  }

  try {
    const parsed = JSON.parse(raw) as UserProgress;
    if (parsed.schemaVersion !== PROGRESS_SCHEMA_VERSION) {
      return createEmptyProgress();
    }

    return parsed;
  } catch {
    return createEmptyProgress();
  }
};

export const saveProgress = (progress: UserProgress): void => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
};

export const applyResultToStorage = (result: ScenarioResult): UserProgress => {
  const current = loadProgress();
  const next = appendAttempt(current, result);
  saveProgress(next);
  return next;
};

export const isTutorialCompleted = (): boolean => {
  const progress = loadProgress();
  return progress.tutorial?.completed === true;
};

export const markTutorialCompleted = (): void => {
  const progress = loadProgress();
  progress.tutorial = { completed: true, currentStep: 5 };
  saveProgress(progress);
};

export const saveTutorialStep = (step: number): void => {
  const progress = loadProgress();
  progress.tutorial = { completed: false, currentStep: step };
  saveProgress(progress);
};

export const getTutorialStep = (): number => {
  const progress = loadProgress();
  return progress.tutorial?.currentStep ?? 0;
};
