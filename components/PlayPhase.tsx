"use client";

import { useState, useTransition, useMemo } from "react";
import { narrateScenario } from "@/lib/narrate";
import type { Scenario, ScenarioResult } from "@/lib/types";
import { PokerTableView } from "./PokerTableView";

interface PlayPhaseProps {
  scenarios: Scenario[];
  onComplete: (results: boolean[]) => void;
}

export function PlayPhase({ scenarios, onComplete }: PlayPhaseProps) {
  const [index, setIndex] = useState(0);
  const [selectedActionId, setSelectedActionId] = useState<string | null>(null);
  const [result, setResult] = useState<ScenarioResult | null>(null);
  const [results, setResults] = useState<boolean[]>([]);
  const [isSubmitting, startTransition] = useTransition();

  const scenario = scenarios[index];
  const narration = useMemo(() => (scenario ? narrateScenario(scenario) : ""), [scenario]);

  if (!scenario) return null;

  const submitDecision = () => {
    if (!selectedActionId) return;

    startTransition(async () => {
      const response = await fetch("/api/attempt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenarioId: scenario.id, selectedActionId })
      });

      if (!response.ok) return;

      const data = (await response.json()) as { result: ScenarioResult };
      setResult(data.result);
    });
  };

  const nextScenario = () => {
    const isCorrect = result?.isCorrect ?? false;
    const nextResults = [...results, isCorrect];

    if (index + 1 >= scenarios.length) {
      onComplete(nextResults);
    } else {
      setResults(nextResults);
      setIndex(index + 1);
      setSelectedActionId(null);
      setResult(null);
    }
  };

  return (
    <div className="lesson-phase-card">
      <p className="kv">Practice — Scenario {index + 1} of {scenarios.length}</p>

      <div className="table-layout">
        <PokerTableView scenario={scenario} />

        <section className="panel">
          <div className="narration-box">
            <p className="kv" style={{ marginBottom: "0.25rem" }}>What&apos;s happening</p>
            <p style={{ margin: 0 }}>{narration}</p>
          </div>

          <h3 style={{ marginTop: 0 }}>What is your best action?</h3>
          <div className="option-grid">
            {scenario.options.map((option) => (
              <button
                className={`option-button ${selectedActionId === option.id ? "active" : ""}`}
                key={option.id}
                onClick={() => setSelectedActionId(option.id)}
                type="button"
                disabled={!!result || isSubmitting}
              >
                <strong>{option.action.toUpperCase()}</strong>
                {option.size ? ` ${option.size}` : ""} - {option.summary}
              </button>
            ))}
          </div>

          {!result && (
            <button
              className="button"
              type="button"
              onClick={submitDecision}
              disabled={!selectedActionId || isSubmitting}
              style={{ marginTop: "0.8rem" }}
            >
              {isSubmitting ? "Evaluating..." : "Submit Decision"}
            </button>
          )}

          {result && (
            <section className="panel panel-strong" style={{ marginTop: "1rem" }}>
              <p className={result.isCorrect ? "good" : "bad"} style={{ fontWeight: 600 }}>
                {result.isCorrect ? "Nice work!" : "Not the best play — here's why:"}
              </p>
              <p className="subtle">{result.feedback.whyGood}</p>
              {result.feedback.quickMath && (
                <p className="code">{result.feedback.quickMath}</p>
              )}
            </section>
          )}

          {result && (
            <button className="button" type="button" onClick={nextScenario} style={{ marginTop: "0.8rem" }}>
              {index + 1 >= scenarios.length ? "See Results" : "Next Scenario"}
            </button>
          )}
        </section>
      </div>
    </div>
  );
}
