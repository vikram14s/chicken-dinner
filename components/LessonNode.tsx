"use client";

import Link from "next/link";
import { StarDisplay } from "./StarDisplay";

interface LessonNodeProps {
  lessonId: string;
  title: string;
  subtitle: string;
  status: "locked" | "unlocked" | "completed";
  stars: number;
}

export function LessonNode({ lessonId, title, subtitle, status, stars }: LessonNodeProps) {
  const content = (
    <div className={`lesson-node lesson-${status}`}>
      <div className="lesson-node-icon">
        {status === "locked" && <span className="lock-icon">&#x1F512;</span>}
        {status === "completed" && <span className="check-icon">&#x2713;</span>}
        {status === "unlocked" && <span className="play-icon">&#x25B6;</span>}
      </div>
      <div className="lesson-node-info">
        <p className="lesson-node-title">{title}</p>
        <p className="lesson-node-subtitle subtle">{subtitle}</p>
      </div>
      {status === "completed" && (
        <div className="lesson-node-stars">
          <StarDisplay stars={stars} />
        </div>
      )}
    </div>
  );

  if (status === "locked") {
    return content;
  }

  return <Link href={`/learn/${lessonId}`}>{content}</Link>;
}
