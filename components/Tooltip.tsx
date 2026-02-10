"use client";

import glossary from "@/lib/glossary";

interface TooltipProps {
  term: string;
  children: React.ReactNode;
}

/** CSS-only hover tooltip that shows a glossary definition. */
export function Tooltip({ term, children }: TooltipProps) {
  const definition = glossary[term];
  if (!definition) {
    return <>{children}</>;
  }

  return (
    <span className="glossary-tip" data-tip={definition}>
      {children}
    </span>
  );
}
