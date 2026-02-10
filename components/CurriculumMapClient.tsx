"use client";

import { useEffect, useState } from "react";
import { getCurriculumProgress } from "@/lib/progressStorage";
import type { Curriculum, CurriculumProgress } from "@/lib/types";
import { UnitHeader } from "./UnitHeader";
import { LessonNode } from "./LessonNode";

interface CurriculumMapClientProps {
  curriculum: Curriculum;
}

export function CurriculumMapClient({ curriculum }: CurriculumMapClientProps) {
  const [progress, setProgress] = useState<CurriculumProgress | null>(null);

  useEffect(() => {
    setProgress(getCurriculumProgress());
  }, []);

  if (!progress) return null;

  return (
    <div className="curriculum-map">
      <h2>Learn Poker</h2>
      <p className="subtle">Master poker one lesson at a time. Complete each lesson to unlock the next.</p>

      {curriculum.units.map((unit) => {
        const unitLessons = curriculum.lessons.filter((l) => unit.lessonIds.includes(l.id));
        const completedCount = unitLessons.filter(
          (l) => progress.lessonRecords[l.id]?.completed
        ).length;

        return (
          <div key={unit.id} className="curriculum-unit">
            <UnitHeader
              title={unit.title}
              completedCount={completedCount}
              totalCount={unitLessons.length}
            />
            <div className="lesson-list">
              {unitLessons.map((lesson) => {
                const record = progress.lessonRecords[lesson.id];
                const unlocked = progress.unlockedLessonIds.includes(lesson.id);
                const status = record?.completed
                  ? "completed"
                  : unlocked
                    ? "unlocked"
                    : "locked";

                return (
                  <LessonNode
                    key={lesson.id}
                    lessonId={lesson.id}
                    title={lesson.title}
                    subtitle={lesson.subtitle}
                    status={status}
                    stars={record?.bestStars ?? 0}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
