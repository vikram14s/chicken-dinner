"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getCurriculumProgress } from "@/lib/progressStorage";
import type { CurriculumProgress } from "@/lib/types";

export function BeginnerCTA() {
  const [progress, setProgress] = useState<CurriculumProgress | null>(null);

  useEffect(() => {
    setProgress(getCurriculumProgress());
  }, []);

  if (!progress) return null;

  const completedCount = Object.values(progress.lessonRecords).filter((r) => r.completed).length;
  const isNew = completedCount === 0;
  const allDone = completedCount >= 20;

  if (allDone) return null;

  return (
    <section className="panel panel-strong beginner-cta" style={{ gridColumn: "1 / -1" }}>
      <p className="kv">{isNew ? "New Here?" : "Continue Learning"}</p>
      <h2 style={{ marginTop: 0 }}>
        {isNew ? "Start the Poker Curriculum" : `Lesson ${completedCount + 1} awaits`}
      </h2>
      <p className="subtle">
        {isNew
          ? "Learn poker step by step — hand rankings, positions, math, and tournament strategy — in structured lessons with quizzes and practice."
          : `You've completed ${completedCount}/20 lessons. Keep going to unlock more concepts and sharpen your game.`}
      </p>
      <div className="h-stack">
        <Link className="button" href="/learn">
          {isNew ? "Start Learning" : "Continue"}
        </Link>
        <Link className="button ghost" href="/play">
          Free Play
        </Link>
      </div>
    </section>
  );
}
