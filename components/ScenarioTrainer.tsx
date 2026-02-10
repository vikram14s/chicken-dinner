"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { pickWeakConcepts } from "@/lib/progress";
import { applyResultToStorage, loadProgress } from "@/lib/progressStorage";
import { narrateScenario } from "@/lib/narrate";
import type { Scenario, ScenarioResult, UserProgress } from "@/lib/types";
import { PokerTableView } from "./PokerTableView";

interface ScenarioTrainerProps {
  initialScenarios: Scenario[];
}

const initialProgress: UserProgress = {
  schemaVersion: 1,
  tier: "Rookie",
  attempts: [],
  conceptStats: {},
  recentMistakes: []
};

export function ScenarioTrainer({ initialScenarios }: ScenarioTrainerProps) {
  const [scenarioQueue, setScenarioQueue] = useState<Scenario[]>(initialScenarios);
  const [index, setIndex] = useState(0);
  const [selectedActionId, setSelectedActionId] = useState<string | null>(null);
  const [result, setResult] = useState<ScenarioResult | null>(null);
  const [progress, setProgress] = useState<UserProgress>(initialProgress);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [isSubmitting, startSubmitTransition] = useTransition();
  const [isDrillLoading, startDrillTransition] = useTransition();

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  const scenario = useMemo(() => scenarioQueue[index], [scenarioQueue, index]);
  const weakConcepts = useMemo(() => pickWeakConcepts(progress, 3), [progress]);
  const narration = useMemo(() => scenario ? narrateScenario(scenario) : "", [scenario]);

  if (!scenario) {
    return (
      <section className="panel">
        <h2>No scenarios available</h2>
        <p>Use the content scripts to generate scenarios or reload the seed data.</p>
      </section>
    );
  }

  const submitDecision = () => {
    if (!selectedActionId) {
      setStatusMessage("Choose an action before submitting.");
      return;
    }

    startSubmitTransition(async () => {
      setStatusMessage("");

      const response = await fetch("/api/attempt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          scenarioId: scenario.id,
          selectedActionId
        })
      });

      if (!response.ok) {
        setStatusMessage("Failed to evaluate hand. Try again.");
        return;
      }

      const data = (await response.json()) as { result: ScenarioResult };
      const nextProgress = applyResultToStorage(data.result);

      setResult(data.result);
      setProgress(nextProgress);
    });
  };

  const nextScenario = () => {
    setSelectedActionId(null);
    setResult(null);
    setStatusMessage("");
    setIndex((current) => (current + 1) % scenarioQueue.length);
  };

  const loadWeakSpotDrills = () => {
    if (weakConcepts.length === 0) {
      setStatusMessage("Play at least a few hands before drill recommendations appear.");
      return;
    }

    startDrillTransition(async () => {
      const params = new URLSearchParams({
        weakConcepts: weakConcepts.join(","),
        count: "6"
      });

      const response = await fetch(`/api/drills?${params.toString()}`);
      if (!response.ok) {
        setStatusMessage("Could not load targeted drills.");
        return;
      }

      const data = (await response.json()) as { scenarios: Scenario[] };
      if (data.scenarios.length > 0) {
        setScenarioQueue(data.scenarios);
        setIndex(0);
        setSelectedActionId(null);
        setResult(null);
        setStatusMessage("Loaded weak-spot drill pack.");
      }
    });
  };

  const accuracy =
    progress.attempts.length === 0
      ? 0
      : Math.round((progress.attempts.filter((attempt) => attempt.isCorrect).length / progress.attempts.length) * 100);

  return (
    <div className="table-layout">
      <PokerTableView scenario={scenario} />

      <section className="panel">
        <div className="narration-box">
          <p className="kv" style={{ marginBottom: "0.25rem" }}>What&apos;s happening</p>
          <p style={{ margin: 0 }}>{narration}</p>
        </div>

        <p className="kv">Coach Panel</p>
        <h3 style={{ marginTop: 0 }}>What is your best action?</h3>
        <div className="option-grid">
          {scenario.options.map((option) => (
            <button
              className={`option-button ${selectedActionId === option.id ? "active" : ""}`}
              key={option.id}
              onClick={() => setSelectedActionId(option.id)}
              type="button"
              disabled={isSubmitting}
            >
              <strong>{option.action.toUpperCase()}</strong>
              {option.size ? ` ${option.size}` : ""} - {option.summary}
            </button>
          ))}
        </div>

        <div className="h-stack" style={{ marginTop: "0.8rem" }}>
          <button className="button" type="button" onClick={submitDecision} disabled={isSubmitting}>
            {isSubmitting ? "Evaluating..." : "Submit Decision"}
          </button>
          <button className="button ghost" type="button" onClick={nextScenario}>
            Next Spot
          </button>
          <button className="button secondary" type="button" onClick={loadWeakSpotDrills} disabled={isDrillLoading}>
            {isDrillLoading ? "Loading..." : "Load Weak-Spot Drills"}
          </button>
        </div>

        {statusMessage ? <p className="subtle">{statusMessage}</p> : null}

        {result ? (
          <section className="panel panel-strong" style={{ marginTop: "1rem" }}>
            <p className="kv">Feedback</p>
            <p className={result.isCorrect ? "good" : "bad"} style={{ fontWeight: 600 }}>
              {result.isCorrect
                ? "Nice work! That's the best play here."
                : "Not the best play — here's why:"}
            </p>
            <p className="kv" style={{ marginTop: "0.6rem", marginBottom: "0.15rem" }}>Why this works:</p>
            <p className="subtle">{result.feedback.whyGood}</p>
            <p className="kv" style={{ marginBottom: "0.15rem" }}>Watch out for:</p>
            <p className="subtle">{result.feedback.whyRisky}</p>
            {result.feedback.quickMath ? (
              <>
                <p className="kv" style={{ marginBottom: "0.15rem" }}>The math:</p>
                <p className="code">{result.feedback.quickMath}</p>
              </>
            ) : null}
            <div className="split">
              {result.feedback.lectureRefs.map((ref) => (
                <span className="tag" key={ref}>
                  {ref}
                </span>
              ))}
            </div>
            <p className="code">EV Delta: {result.evDelta.toFixed(2)} bb</p>
          </section>
        ) : null}

        <section className="panel" style={{ marginTop: "1rem" }}>
          <p className="kv">Session Metrics</p>
          <p className="metric-number">{progress.tier}</p>
          <p className="subtle">Accuracy: {accuracy}% over {progress.attempts.length} attempts</p>
          <div className="split">
            {weakConcepts.map((concept) => (
              <span className="tag" key={concept}>
                Weak: {concept}
              </span>
            ))}
          </div>
        </section>
      </section>
    </div>
  );
}
