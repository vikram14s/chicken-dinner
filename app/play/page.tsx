import { listScenarios } from "@/lib/content";
import { PlayPageClient } from "@/components/PlayPageClient";

export default async function PlayPage() {
  const scenariosPromise = listScenarios({ count: 8 });
  const oddsScenariosPromise = listScenarios({ concept: "pot-odds", count: 2 });

  const [scenarios, oddsScenarios] = await Promise.all([scenariosPromise, oddsScenariosPromise]);

  return (
    <PlayPageClient
      scenarios={scenarios}
      showOddsWorkbench={oddsScenarios.length > 0}
    />
  );
}
