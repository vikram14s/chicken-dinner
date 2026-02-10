"use client";

interface UnitHeaderProps {
  title: string;
  completedCount: number;
  totalCount: number;
}

export function UnitHeader({ title, completedCount, totalCount }: UnitHeaderProps) {
  return (
    <div className="unit-header">
      <h3 className="unit-title">{title}</h3>
      <p className="subtle unit-progress-text">
        {completedCount}/{totalCount} completed
      </p>
    </div>
  );
}
