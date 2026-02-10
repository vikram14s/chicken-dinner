import Link from "next/link";
import { getLectureConcepts, listScenarios } from "@/lib/content";
import { BeginnerCTA } from "@/components/BeginnerCTA";

export default async function DashboardPage() {
  const [concepts, starterScenarios, oddsScenarios] = await Promise.all([
    getLectureConcepts(),
    listScenarios({ difficulty: 1, count: 4 }),
    listScenarios({ concept: "pot-odds", count: 4 })
  ]);

  return (
    <div className="card-grid">
      <BeginnerCTA />

      <section className="panel panel-strong">
        <p className="kv">Skill Path</p>
        <h2>Coach Mode Tournament Trainer</h2>
        <p className="subtle">
          Follow the structured curriculum or jump into free play to practice scenarios tied to your lectures.
        </p>
        <div className="h-stack">
          <Link className="button" href="/learn">
            Open Curriculum
          </Link>
          <Link className="button ghost" href="/play">
            Free Play
          </Link>
          <Link className="button ghost" href="/library">
            Browse Concepts
          </Link>
        </div>
      </section>

      <section className="panel">
        <p className="kv">Available Concepts</p>
        <p className="metric-number">{concepts.length}</p>
        <p className="subtle">Loaded from Lectures 1-9 and mapped into strategy tags.</p>
      </section>

      <section className="panel">
        <p className="kv">Starter Scenarios</p>
        <p className="metric-number">{starterScenarios.length}</p>
        <p className="subtle">Low-friction drills for preflop ranges, c-bets, and basic odds spots.</p>
      </section>

      <section className="panel">
        <p className="kv">Pot Odds Drills</p>
        <p className="metric-number">{oddsScenarios.length}</p>
        <p className="subtle">Math-heavy spots based on rule-of-4/2 and break-even thresholds.</p>
      </section>

      <section className="panel" style={{ gridColumn: "1 / -1" }}>
        <p className="kv">First Session Plan</p>
        <div className="split">
          <span className="tag">1. Preflop Range Discipline</span>
          <span className="tag">2. Flop C-Bet Logic</span>
          <span className="tag">3. Pot Odds and Outs</span>
          <span className="tag">4. Short-Stack Push/Fold</span>
        </div>
      </section>
    </div>
  );
}
