"use client";

import Link from "next/link";
import { ScenarioTrainer } from "@/components/ScenarioTrainer";
import { OddsWorkbenchLazy } from "@/components/OddsWorkbenchLazy";
import type { Scenario } from "@/lib/types";

interface PlayPageClientProps {
  scenarios: Scenario[];
  showOddsWorkbench: boolean;
}

export function PlayPageClient({ scenarios, showOddsWorkbench }: PlayPageClientProps) {
  return (
    <div style={{ display: "grid", gap: "1rem" }}>
      <div className="panel" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <p style={{ margin: 0 }}>
          <strong>Free Play Mode</strong>
          <span className="subtle"> — practice any scenario without structure.</span>
        </p>
        <Link className="button ghost" href="/learn" style={{ whiteSpace: "nowrap" }}>
          Back to Curriculum
        </Link>
      </div>
      <ScenarioTrainer initialScenarios={scenarios} />
      {showOddsWorkbench && <OddsWorkbenchLazy />}
    </div>
  );
}
