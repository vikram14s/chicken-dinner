"use client";

import { useEffect, useState } from "react";
import { isTutorialCompleted } from "@/lib/progressStorage";
import { ScenarioTrainer } from "@/components/ScenarioTrainer";
import { OddsWorkbenchLazy } from "@/components/OddsWorkbenchLazy";
import { TutorialFlow } from "@/components/TutorialFlow";
import type { Scenario } from "@/lib/types";

interface PlayPageClientProps {
  scenarios: Scenario[];
  showOddsWorkbench: boolean;
}

export function PlayPageClient({ scenarios, showOddsWorkbench }: PlayPageClientProps) {
  const [showTutorial, setShowTutorial] = useState<boolean | null>(null);

  useEffect(() => {
    setShowTutorial(!isTutorialCompleted());
  }, []);

  // Avoid flash while checking localStorage
  if (showTutorial === null) return null;

  if (showTutorial) {
    return <TutorialFlow onComplete={() => setShowTutorial(false)} />;
  }

  return (
    <div style={{ display: "grid", gap: "1rem" }}>
      <ScenarioTrainer initialScenarios={scenarios} />
      {showOddsWorkbench && <OddsWorkbenchLazy />}
    </div>
  );
}
