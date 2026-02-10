"use client";

import { useState } from "react";
import { computeLessonStars } from "@/lib/progress";
import { saveLessonCompletion } from "@/lib/progressStorage";
import type { CurriculumLesson, Scenario } from "@/lib/types";
import { TeachCard } from "./TeachCard";
import { QuizPhase } from "./QuizPhase";
import { PlayPhase } from "./PlayPhase";
import { LessonComplete } from "./LessonComplete";

type Phase = "teach" | "quiz" | "play" | "complete";

interface LessonFlowProps {
  lesson: CurriculumLesson;
  scenarios: Scenario[];
}

export function LessonFlow({ lesson, scenarios }: LessonFlowProps) {
  const [phase, setPhase] = useState<Phase>("teach");
  const [quizResults, setQuizResults] = useState<boolean[]>([]);
  const [scenarioResults, setScenarioResults] = useState<boolean[]>([]);

  const hasPlayPhase = lesson.phase.play !== null && scenarios.length > 0;

  const handleQuizComplete = (results: boolean[]) => {
    setQuizResults(results);
    if (hasPlayPhase) {
      setPhase("play");
    } else {
      finishLesson(results, []);
    }
  };

  const handlePlayComplete = (results: boolean[]) => {
    setScenarioResults(results);
    finishLesson(quizResults, results);
  };

  const finishLesson = (qResults: boolean[], sResults: boolean[]) => {
    const quizCorrect = qResults.filter(Boolean).length;
    const quizTotal = qResults.length;
    const scenariosCorrect = sResults.filter(Boolean).length;
    const scenariosTotal = sResults.length;
    const stars = computeLessonStars(quizCorrect, quizTotal, scenariosCorrect, scenariosTotal);

    saveLessonCompletion({
      lessonId: lesson.id,
      completed: true,
      stars,
      bestStars: stars,
      quizCorrect,
      quizTotal,
      scenariosCorrect,
      scenariosTotal,
      completedAt: new Date().toISOString()
    });

    setPhase("complete");
  };

  const quizCorrect = quizResults.filter(Boolean).length;
  const scenariosCorrect = scenarioResults.filter(Boolean).length;
  const stars = computeLessonStars(
    quizCorrect,
    quizResults.length,
    scenariosCorrect,
    scenarioResults.length
  );

  return (
    <div className="lesson-flow">
      <div className="lesson-flow-header">
        <p className="kv">Lesson {lesson.order}</p>
        <h2 style={{ marginTop: 0 }}>{lesson.title}</h2>
        <div className="phase-indicators">
          <span className={`phase-dot ${phase === "teach" ? "active" : "done"}`}>Learn</span>
          <span className={`phase-dot ${phase === "quiz" ? "active" : ["play", "complete"].includes(phase) ? "done" : ""}`}>Quiz</span>
          {hasPlayPhase && (
            <span className={`phase-dot ${phase === "play" ? "active" : phase === "complete" ? "done" : ""}`}>Practice</span>
          )}
        </div>
      </div>

      {phase === "teach" && (
        <TeachCard
          title={lesson.phase.teach.title}
          body={lesson.phase.teach.body}
          keyPoints={lesson.phase.teach.keyPoints}
          visualType={lesson.phase.teach.visualType}
          onReady={() => setPhase("quiz")}
        />
      )}

      {phase === "quiz" && (
        <QuizPhase questions={lesson.phase.quiz} onComplete={handleQuizComplete} />
      )}

      {phase === "play" && (
        <PlayPhase scenarios={scenarios} onComplete={handlePlayComplete} />
      )}

      {phase === "complete" && (
        <LessonComplete
          lessonTitle={lesson.title}
          stars={stars}
          quizCorrect={quizCorrect}
          quizTotal={quizResults.length}
          scenariosCorrect={scenariosCorrect}
          scenariosTotal={scenarioResults.length}
          lessonId={lesson.id}
        />
      )}
    </div>
  );
}
