"use client";

import { useState } from "react";
import type { QuizQuestion } from "@/lib/types";

interface QuizPhaseProps {
  questions: QuizQuestion[];
  onComplete: (results: boolean[]) => void;
}

export function QuizPhase({ questions, onComplete }: QuizPhaseProps) {
  const [qIndex, setQIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [results, setResults] = useState<boolean[]>([]);

  const question = questions[qIndex];
  if (!question) return null;

  const handleAnswer = (index: number) => {
    if (answered) return;
    setSelectedAnswer(index);
    setAnswered(true);
  };

  const advance = () => {
    const isCorrect = selectedAnswer !== null && question.options[selectedAnswer].correct;
    const nextResults = [...results, isCorrect];

    if (qIndex + 1 >= questions.length) {
      onComplete(nextResults);
    } else {
      setResults(nextResults);
      setQIndex(qIndex + 1);
      setSelectedAnswer(null);
      setAnswered(false);
    }
  };

  return (
    <div className="lesson-phase-card panel panel-strong">
      <p className="kv">Quiz — Question {qIndex + 1} of {questions.length}</p>
      <p style={{ fontWeight: 600, fontSize: "1.05rem" }}>{question.question}</p>

      <div className="option-grid">
        {question.options.map((opt, i) => {
          let className = "option-button";
          if (answered && selectedAnswer === i) {
            className += opt.correct ? " quiz-correct" : " quiz-wrong";
          } else if (answered && opt.correct) {
            className += " quiz-correct";
          }
          return (
            <button
              key={i}
              className={className}
              type="button"
              onClick={() => handleAnswer(i)}
              disabled={answered}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      {answered && selectedAnswer !== null && (
        <div style={{ marginTop: "0.5rem" }}>
          <p className={question.options[selectedAnswer].correct ? "good" : "bad"} style={{ fontWeight: 600 }}>
            {question.options[selectedAnswer].correct
              ? "Correct!"
              : `Not quite — the answer is "${question.options.find((o) => o.correct)?.label}".`}
          </p>
          <p className="subtle">{question.explanation}</p>
        </div>
      )}

      {answered && (
        <button className="button" type="button" onClick={advance} style={{ marginTop: "0.8rem" }}>
          {qIndex + 1 >= questions.length ? "Continue" : "Next Question"}
        </button>
      )}
    </div>
  );
}
