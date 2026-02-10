"use client";

import type { Scenario } from "@/lib/types";
import { PlayingCard } from "./PlayingCard";
import { Tooltip } from "./Tooltip";

interface PokerTableViewProps {
  scenario: Scenario;
}

export function PokerTableView({ scenario }: PokerTableViewProps) {
  return (
    <section className="table-visual">
      <p className="kv" style={{ color: "#d7e9d8" }}>
        <Tooltip term={scenario.street}>{scenario.street.toUpperCase()}</Tooltip>{" | "}
        <Tooltip term={scenario.position}>{scenario.position}</Tooltip>{" | "}
        <Tooltip term="effective stack">{scenario.effectiveStackBB}<Tooltip term="bb">bb</Tooltip> effective</Tooltip>
      </p>
      <h3 style={{ marginTop: 0 }}>{scenario.title}</h3>
      <p className="subtle" style={{ color: "#edf3eb" }}>
        Villain range: {scenario.villainRange}
      </p>
      <div style={{ marginTop: "0.7rem" }}>
        <p className="kv" style={{ color: "#d7e9d8" }}>
          Board
        </p>
        {scenario.board.length > 0 ? (
          <div className="h-stack" style={{ gap: "0.15rem" }}>
            {scenario.board.map((card) => (
              <PlayingCard card={card} key={card} />
            ))}
          </div>
        ) : (
          <span className="subtle" style={{ color: "#edf3eb" }}>
            <Tooltip term="preflop">Preflop (no board cards)</Tooltip>
          </span>
        )}
      </div>
      <div style={{ marginTop: "0.8rem" }}>
        <p className="kv" style={{ color: "#d7e9d8" }}>
          Hero Hand
        </p>
        <div className="h-stack" style={{ gap: "0.15rem" }}>
          <PlayingCard card={scenario.heroHand.slice(0, 2)} />
          <PlayingCard card={scenario.heroHand.slice(2)} />
        </div>
      </div>
      <div className="h-stack" style={{ marginTop: "0.9rem" }}>
        <span className="tag"><Tooltip term="pot odds">Pot {scenario.potSizeBB}bb</Tooltip></span>
        <span className="tag">To Call {scenario.toCallBB}<Tooltip term="bb">bb</Tooltip></span>
        <span className="tag">Difficulty {scenario.difficulty}</span>
      </div>
    </section>
  );
}
