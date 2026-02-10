"use client";

import { TeachVisual } from "./TeachVisual";

interface TeachCardProps {
  title: string;
  body: string;
  keyPoints: string[];
  visualType?: string | null;
  onReady: () => void;
}

export function TeachCard({ title, body, keyPoints, visualType, onReady }: TeachCardProps) {
  return (
    <div className="lesson-phase-card panel panel-strong">
      <p className="kv">Learn</p>
      <h2 style={{ marginTop: 0 }}>{title}</h2>
      <p>{body}</p>

      {visualType && (
        <div className="tutorial-visual">
          <TeachVisual visualType={visualType} />
        </div>
      )}

      <div className="teach-key-points">
        <p style={{ fontWeight: 600, marginBottom: "0.35rem" }}>Key Points</p>
        <ul>
          {keyPoints.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      </div>

      <button className="button" type="button" onClick={onReady} style={{ marginTop: "1rem" }}>
        Ready for Quiz
      </button>
    </div>
  );
}
