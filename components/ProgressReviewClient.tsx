"use client";

import { useEffect, useMemo, useState } from "react";
import { loadProgress } from "@/lib/progressStorage";
import type { UserProgress } from "@/lib/types";

const emptyProgress: UserProgress = {
  schemaVersion: 1,
  tier: "Rookie",
  attempts: [],
  conceptStats: {},
  recentMistakes: []
};

export function ProgressReviewClient() {
  const [progress, setProgress] = useState<UserProgress>(emptyProgress);

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  const orderedConcepts = useMemo(() => {
    return Object.entries(progress.conceptStats)
      .map(([concept, stat]) => ({
        concept,
        attempts: stat.attempts,
        accuracy: stat.attempts === 0 ? 0 : Math.round((stat.correct / stat.attempts) * 100),
        ev: stat.rollingEvDelta
      }))
      .sort((a, b) => a.accuracy - b.accuracy || b.attempts - a.attempts);
  }, [progress.conceptStats]);

  return (
    <div className="card-grid">
      <section className="panel panel-strong">
        <p className="kv">Current Tier</p>
        <p className="metric-number">{progress.tier}</p>
        <p className="subtle">Attempts tracked: {progress.attempts.length}</p>
      </section>

      <section className="panel">
        <p className="kv">Recent Mistakes</p>
        {progress.recentMistakes.length === 0 ? (
          <p className="subtle">No mistakes tracked yet. Play hands to generate targeted drills.</p>
        ) : (
          progress.recentMistakes.map((scenarioId) => (
            <span className="tag" key={scenarioId}>
              {scenarioId}
            </span>
          ))
        )}
      </section>

      <section className="panel" style={{ gridColumn: "1 / -1" }}>
        <p className="kv">Concept Performance</p>
        {orderedConcepts.length === 0 ? (
          <p className="subtle">No concept stats yet.</p>
        ) : (
          <div style={{ display: "grid", gap: "0.55rem" }}>
            {orderedConcepts.map((item) => (
              <div key={item.concept} className="panel">
                <div className="h-stack" style={{ justifyContent: "space-between" }}>
                  <strong>{item.concept}</strong>
                  <span className={item.accuracy >= 60 ? "good" : "bad"}>{item.accuracy}%</span>
                </div>
                <p className="subtle">
                  Attempts: {item.attempts} | Rolling EV delta: {item.ev.toFixed(2)} bb
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
