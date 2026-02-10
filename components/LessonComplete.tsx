"use client";

import Link from "next/link";
import { StarDisplay } from "./StarDisplay";

interface LessonCompleteProps {
  lessonTitle: string;
  stars: number;
  quizCorrect: number;
  quizTotal: number;
  scenariosCorrect: number;
  scenariosTotal: number;
  lessonId: string;
}

export function LessonComplete({
  lessonTitle,
  stars,
  quizCorrect,
  quizTotal,
  scenariosCorrect,
  scenariosTotal,
  lessonId
}: LessonCompleteProps) {
  return (
    <div className="lesson-complete panel panel-strong">
      <h2 style={{ marginTop: 0 }}>Lesson Complete!</h2>
      <p className="subtle">{lessonTitle}</p>

      <div className="lesson-complete-stars">
        <StarDisplay stars={stars} />
      </div>

      <div className="lesson-complete-summary">
        <div className="summary-row">
          <span>Quiz</span>
          <span className="code">{quizCorrect}/{quizTotal} correct</span>
        </div>
        {scenariosTotal > 0 && (
          <div className="summary-row">
            <span>Scenarios</span>
            <span className="code">{scenariosCorrect}/{scenariosTotal} correct</span>
          </div>
        )}
      </div>

      <div className="h-stack" style={{ marginTop: "1rem" }}>
        <Link className="button" href="/learn">
          Back to Curriculum
        </Link>
        <Link className="button ghost" href={`/learn/${lessonId}`}>
          Retry
        </Link>
      </div>
    </div>
  );
}
