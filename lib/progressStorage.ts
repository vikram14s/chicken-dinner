"use client";

import { appendAttempt, createEmptyProgress, PROGRESS_SCHEMA_VERSION } from "./progress";
import type { CurriculumProgress, LessonRecord, ScenarioResult, UserProgress } from "./types";

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

/* ── Curriculum progress ── */

const ALL_LESSON_IDS = Array.from({ length: 20 }, (_, i) => `lesson-${i + 1}`);

const createEmptyCurriculumProgress = (): CurriculumProgress => ({
  currentLessonId: "lesson-1",
  lessonRecords: {},
  unlockedLessonIds: ["lesson-1"]
});

const migrateTutorialToCurriculum = (progress: UserProgress): UserProgress => {
  if (progress.curriculum) return progress;
  if (!progress.tutorial?.completed) return progress;

  const curriculum = createEmptyCurriculumProgress();
  const unit1Ids = ALL_LESSON_IDS.slice(0, 5);

  for (const id of unit1Ids) {
    curriculum.lessonRecords[id] = {
      lessonId: id,
      completed: true,
      stars: 1,
      bestStars: 1,
      quizCorrect: 0,
      quizTotal: 0,
      scenariosCorrect: 0,
      scenariosTotal: 0,
      completedAt: new Date().toISOString()
    };
    if (!curriculum.unlockedLessonIds.includes(id)) {
      curriculum.unlockedLessonIds.push(id);
    }
  }

  // Unlock lesson-6 (first of unit 2)
  curriculum.unlockedLessonIds.push("lesson-6");
  curriculum.currentLessonId = "lesson-6";

  return { ...progress, curriculum };
};

export const getCurriculumProgress = (): CurriculumProgress => {
  let progress = loadProgress();
  progress = migrateTutorialToCurriculum(progress);

  if (progress.curriculum) {
    saveProgress(progress);
    return progress.curriculum;
  }

  const curriculum = createEmptyCurriculumProgress();
  saveProgress({ ...progress, curriculum });
  return curriculum;
};

export const saveLessonCompletion = (record: LessonRecord): void => {
  const progress = loadProgress();
  const curriculum = progress.curriculum ?? createEmptyCurriculumProgress();

  const existing = curriculum.lessonRecords[record.lessonId];
  const bestStars = Math.max(record.stars, existing?.bestStars ?? 0) as 0 | 1 | 2 | 3;

  curriculum.lessonRecords[record.lessonId] = { ...record, bestStars };

  // Unlock next lesson
  const idx = ALL_LESSON_IDS.indexOf(record.lessonId);
  if (idx >= 0 && idx < ALL_LESSON_IDS.length - 1) {
    const nextId = ALL_LESSON_IDS[idx + 1];
    if (!curriculum.unlockedLessonIds.includes(nextId)) {
      curriculum.unlockedLessonIds.push(nextId);
    }
    curriculum.currentLessonId = nextId;
  }

  saveProgress({ ...progress, curriculum });
};

export const isLessonUnlocked = (lessonId: string): boolean => {
  const curriculum = getCurriculumProgress();
  return curriculum.unlockedLessonIds.includes(lessonId);
};

export const getLessonRecord = (lessonId: string): LessonRecord | undefined => {
  const curriculum = getCurriculumProgress();
  return curriculum.lessonRecords[lessonId];
};
