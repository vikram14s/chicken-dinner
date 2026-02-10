"use client";

interface StarDisplayProps {
  stars: number;
  max?: number;
}

export function StarDisplay({ stars, max = 3 }: StarDisplayProps) {
  return (
    <span className="star-display" aria-label={`${stars} of ${max} stars`}>
      {Array.from({ length: max }, (_, i) => (
        <span key={i} className={i < stars ? "star filled" : "star empty"}>
          {i < stars ? "\u2605" : "\u2606"}
        </span>
      ))}
    </span>
  );
}
