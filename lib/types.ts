export type Street = "preflop" | "flop" | "turn" | "river";

export type PlayerPosition =
  | "UTG"
  | "HJ"
  | "CO"
  | "BTN"
  | "SB"
  | "BB"
  | "MP";

export type ActionType = "fold" | "check" | "call" | "bet" | "raise" | "shove";

export interface ScenarioOption {
  id: string;
  action: ActionType;
  size?: string;
  summary: string;
}

export interface ScenarioFeedback {
  whyGood: string;
  whyRisky: string;
  lectureRefs: string[];
  quickMath?: string;
}

export interface Scenario {
  id: string;
  title: string;
  street: Street;
  position: PlayerPosition;
  effectiveStackBB: number;
  heroHand: string;
  board: string[];
  potSizeBB: number;
  toCallBB: number;
  villainRange: string;
  options: ScenarioOption[];
  bestActionId: string;
  evDeltaByAction: Record<string, number>;
  feedbackByAction: Record<string, ScenarioFeedback>;
  conceptTags: string[];
  difficulty: 1 | 2 | 3;
}

export interface LectureConcept {
  id: string;
  lectureId: string;
  title: string;
  summary: string;
  tags: string[];
  sourceRefs: string[];
}

export interface ConceptStat {
  attempts: number;
  correct: number;
  rollingEvDelta: number;
}

export interface DecisionAttempt {
  scenarioId: string;
  selectedActionId: string;
  isCorrect: boolean;
  evDelta: number;
  conceptTags: string[];
  timestamp: string;
}

export interface TutorialState {
  completed: boolean;
  currentStep: number;
}

export interface UserProgress {
  schemaVersion: 1;
  tier: "Rookie" | "Apprentice" | "Grinder" | "Shark";
  attempts: DecisionAttempt[];
  conceptStats: Record<string, ConceptStat>;
  recentMistakes: string[];
  tutorial?: TutorialState;
}

export interface ScenarioResult {
  scenarioId: string;
  selectedActionId: string;
  isCorrect: boolean;
  evDelta: number;
  feedback: ScenarioFeedback;
  conceptTags: string[];
}

/* ── Curriculum types ── */

export interface QuizQuestion {
  id: string;
  question: string;
  options: { label: string; correct: boolean }[];
  explanation: string;
}

export interface LessonPhase {
  teach: { title: string; body: string; keyPoints: string[]; visualType?: string };
  quiz: QuizQuestion[];
  play: { conceptTags: string[]; difficulty?: (1 | 2 | 3)[]; count: number } | null;
}

export interface CurriculumLesson {
  id: string;
  unitId: string;
  order: number;
  title: string;
  subtitle: string;
  phase: LessonPhase;
}

export interface CurriculumUnit {
  id: string;
  title: string;
  description: string;
  lessonIds: string[];
}

export interface Curriculum {
  schemaVersion: 1;
  units: CurriculumUnit[];
  lessons: CurriculumLesson[];
}

export interface LessonRecord {
  lessonId: string;
  completed: boolean;
  stars: 0 | 1 | 2 | 3;
  bestStars: 0 | 1 | 2 | 3;
  quizCorrect: number;
  quizTotal: number;
  scenariosCorrect: number;
  scenariosTotal: number;
  completedAt?: string;
}

export interface CurriculumProgress {
  currentLessonId: string;
  lessonRecords: Record<string, LessonRecord>;
  unlockedLessonIds: string[];
}

export interface UserProgress {
  schemaVersion: 1;
  tier: "Rookie" | "Apprentice" | "Grinder" | "Shark";
  attempts: DecisionAttempt[];
  conceptStats: Record<string, ConceptStat>;
  recentMistakes: string[];
  tutorial?: TutorialState;
  curriculum?: CurriculumProgress;
}
