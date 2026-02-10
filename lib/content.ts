import { cache } from "react";
import { promises as fs } from "node:fs";
import path from "node:path";
import { z } from "zod";
import type { LectureConcept, Scenario } from "./types";

const lectureConceptSchema = z.object({
  id: z.string(),
  lectureId: z.string(),
  title: z.string(),
  summary: z.string(),
  tags: z.array(z.string()),
  sourceRefs: z.array(z.string())
});

const scenarioOptionSchema = z.object({
  id: z.string(),
  action: z.enum(["fold", "check", "call", "bet", "raise", "shove"]),
  size: z.string().optional(),
  summary: z.string()
});

const scenarioFeedbackSchema = z.object({
  whyGood: z.string(),
  whyRisky: z.string(),
  lectureRefs: z.array(z.string()),
  quickMath: z.string().optional()
});

const scenarioSchema = z.object({
  id: z.string(),
  title: z.string(),
  street: z.enum(["preflop", "flop", "turn", "river"]),
  position: z.enum(["UTG", "HJ", "CO", "BTN", "SB", "BB", "MP"]),
  effectiveStackBB: z.number(),
  heroHand: z.string(),
  board: z.array(z.string()),
  potSizeBB: z.number(),
  toCallBB: z.number(),
  villainRange: z.string(),
  options: z.array(scenarioOptionSchema),
  bestActionId: z.string(),
  evDeltaByAction: z.record(z.string(), z.number()),
  feedbackByAction: z.record(z.string(), scenarioFeedbackSchema),
  conceptTags: z.array(z.string()),
  difficulty: z.union([z.literal(1), z.literal(2), z.literal(3)])
});

const scenarioFilterSchema = z.object({
  concept: z.string().optional(),
  difficulty: z.union([z.literal(1), z.literal(2), z.literal(3)]).optional(),
  count: z.number().int().positive().max(100).optional()
});

const contentPath = (...parts: string[]): string => path.join(process.cwd(), "content", ...parts);

const readJson = async <T>(filePath: string): Promise<T> => {
  const raw = await fs.readFile(filePath, "utf8");
  return JSON.parse(raw) as T;
};

export const getLectureConcepts = cache(async (): Promise<LectureConcept[]> => {
  const data = await readJson<unknown>(contentPath("lectures", "concepts.v1.json"));
  return z.array(lectureConceptSchema).parse(data);
});

export const getScenarios = cache(async (): Promise<Scenario[]> => {
  const data = await readJson<unknown>(contentPath("scenarios", "seed.v1.json"));
  return z.array(scenarioSchema).parse(data);
});

export const listScenarios = async (filters: {
  concept?: string;
  difficulty?: 1 | 2 | 3;
  count?: number;
}): Promise<Scenario[]> => {
  const normalized = scenarioFilterSchema.parse(filters);
  const allScenarios = await getScenarios();

  const filteredByConcept = normalized.concept
    ? allScenarios.filter((scenario) => scenario.conceptTags.includes(normalized.concept as string))
    : allScenarios;

  const filteredByDifficulty = normalized.difficulty
    ? filteredByConcept.filter((scenario) => scenario.difficulty === normalized.difficulty)
    : filteredByConcept;

  const finalCount = normalized.count ?? filteredByDifficulty.length;
  return filteredByDifficulty.slice(0, finalCount);
};

export const getScenarioById = async (id: string): Promise<Scenario | undefined> => {
  const allScenarios = await getScenarios();
  return allScenarios.find((scenario) => scenario.id === id);
};
