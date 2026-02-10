"use client";

import { useEffect, useMemo, useState } from "react";
import { loadProgress, getCurriculumProgress } from "@/lib/progressStorage";
import type { CurriculumProgress, UserProgress } from "@/lib/types";
import { StarDisplay } from "./StarDisplay";

const emptyProgress: UserProgress = {
  schemaVersion: 1,
  tier: "Rookie",
  attempts: [],
  conceptStats: {},
  recentMistakes: []
};

const UNITS = [
  { id: "unit-1", title: "Poker Basics", lessonIds: ["lesson-1", "lesson-2", "lesson-3", "lesson-4", "lesson-5"] },
  { id: "unit-2", title: "Preflop Fundamentals", lessonIds: ["lesson-6", "lesson-7", "lesson-8"] },
  { id: "unit-3", title: "Math Foundations", lessonIds: ["lesson-9", "lesson-10", "lesson-11"] },
  { id: "unit-4", title: "Postflop Play", lessonIds: ["lesson-12", "lesson-13", "lesson-14"] },
  { id: "unit-5", title: "Tournament Strategy", lessonIds: ["lesson-15", "lesson-16", "lesson-17"] },
  { id: "unit-6", title: "Advanced", lessonIds: ["lesson-18", "lesson-19", "lesson-20"] },
];

export function ProgressReviewClient() {
  const [progress, setProgress] = useState<UserProgress>(emptyProgress);
  const [curriculum, setCurriculum] = useState<CurriculumProgress | null>(null);

  useEffect(() => {
    setProgress(loadProgress());
    setCurriculum(getCurriculumProgress());
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
      {curriculum && (
        <section className="panel panel-strong" style={{ gridColumn: "1 / -1" }}>
          <p className="kv">Curriculum Progress</p>
          <div style={{ display: "grid", gap: "0.55rem", marginTop: "0.5rem" }}>
            {UNITS.map((unit) => {
              const completedCount = unit.lessonIds.filter(
                (id) => curriculum.lessonRecords[id]?.completed
              ).length;
              const totalStars = unit.lessonIds.reduce(
                (sum, id) => sum + (curriculum.lessonRecords[id]?.bestStars ?? 0),
                0
              );
              const maxStars = unit.lessonIds.length * 3;

              return (
                <div key={unit.id} className="panel">
                  <div className="h-stack" style={{ justifyContent: "space-between" }}>
                    <strong>{unit.title}</strong>
                    <span className="subtle">
                      {completedCount}/{unit.lessonIds.length} lessons
                    </span>
                  </div>
                  <div className="h-stack" style={{ marginTop: "0.3rem" }}>
                    <div
                      style={{
                        flex: 1,
                        height: "6px",
                        borderRadius: "3px",
                        background: "var(--border)"
                      }}
                    >
                      <div
                        style={{
                          width: `${(completedCount / unit.lessonIds.length) * 100}%`,
                          height: "100%",
                          borderRadius: "3px",
                          background: completedCount === unit.lessonIds.length ? "var(--good)" : "var(--accent)"
                        }}
                      />
                    </div>
                    <span className="subtle" style={{ fontSize: "0.78rem" }}>
                      <StarDisplay stars={Math.round(totalStars / unit.lessonIds.length)} /> {totalStars}/{maxStars}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

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
