"use client";

import { PlayingCard } from "./PlayingCard";

interface TeachVisualProps {
  visualType: string;
}

function HandRankings() {
  return (
    <div className="tutorial-ranks">
      {[
        ["Royal Flush", "A K Q J T, all same suit"],
        ["Straight Flush", "Five in a row, same suit"],
        ["Four of a Kind", "Four cards of one rank"],
        ["Full House", "Three of a kind + a pair"],
        ["Flush", "Five cards, all same suit"],
        ["Straight", "Five in a row, mixed suits"],
        ["Three of a Kind", "Three cards of one rank"],
        ["Two Pair", "Two different pairs"],
        ["One Pair", "Two cards of one rank"],
        ["High Card", "Nothing — highest card plays"],
      ].map(([name, desc], i) => (
        <div key={name} className="rank-row">
          <span className="rank-number">{i + 1}.</span>
          <strong>{name}</strong>
          <span className="subtle"> — {desc}</span>
        </div>
      ))}
    </div>
  );
}

function FourStreets() {
  return (
    <div className="tutorial-streets">
      {[
        ["Preflop", "Each player gets 2 private cards. First betting round."],
        ["Flop", "3 community cards are dealt. Second betting round."],
        ["Turn", "1 more community card (4 total). Third betting round."],
        ["River", "Final community card (5 total). Last betting round."],
      ].map(([name, desc]) => (
        <div key={name} className="street-row">
          <strong>{name}</strong>
          <span className="subtle"> — {desc}</span>
        </div>
      ))}
    </div>
  );
}

function TablePositions() {
  return (
    <div className="tutorial-positions">
      <div className="position-table">
        {[
          ["UTG", "First to act — play tight"],
          ["HJ", "Hijack — late middle"],
          ["CO", "Cutoff — strong late seat"],
          ["BTN", "Button — best position"],
          ["SB", "Small Blind — forced bet"],
          ["BB", "Big Blind — forced bet"],
        ].map(([pos, desc]) => (
          <div key={pos} className="pos-chip">
            <strong>{pos}</strong>
            <span className="subtle">{desc}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CardNotation() {
  return (
    <div className="tutorial-notation">
      <div className="notation-grid">
        <div className="notation-example">
          <PlayingCard card="As" />
          <span>= Ace of Spades</span>
        </div>
        <div className="notation-example">
          <PlayingCard card="Kh" />
          <span>= King of Hearts</span>
        </div>
        <div className="notation-example">
          <PlayingCard card="Qd" />
          <span>= Queen of Diamonds</span>
        </div>
        <div className="notation-example">
          <PlayingCard card="Tc" />
          <span>= Ten of Clubs</span>
        </div>
      </div>
      <p className="subtle" style={{ marginTop: "0.5rem" }}>
        Ranks: A K Q J T 9 8 7 6 5 4 3 2 &nbsp;|&nbsp; Suits: s(Spades) h(Hearts) d(Diamonds) c(Clubs)
      </p>
    </div>
  );
}

function StackDepth() {
  return (
    <div className="tutorial-stacks">
      {[
        ["50bb+", "Deep — lots of room to play postflop"],
        ["25-50bb", "Medium — standard tournament play"],
        ["15-25bb", "Getting short — tighten up, look for spots"],
        ["Under 15bb", "Short — push/fold territory"],
      ].map(([range, desc]) => (
        <div key={range} className="stack-row">
          <strong>{range}</strong>
          <span className="subtle"> — {desc}</span>
        </div>
      ))}
    </div>
  );
}

function RangeChart() {
  const tiers = [
    { label: "Premium", hands: "AA, KK, QQ, JJ, AKs, AKo", color: "var(--good)" },
    { label: "Strong", hands: "TT, 99, AQs, AQo, AJs, KQs", color: "var(--accent-2)" },
    { label: "Playable", hands: "88-22, ATs, KJs, QJs, suited connectors", color: "var(--ink-soft)" },
  ];

  return (
    <div className="teach-range-chart">
      {tiers.map((tier) => (
        <div key={tier.label} className="range-tier">
          <span className="range-tier-label" style={{ color: tier.color }}>{tier.label}</span>
          <span className="subtle">{tier.hands}</span>
        </div>
      ))}
    </div>
  );
}

function OddsTable() {
  const rows = [
    ["Flush draw", "9", "36%", "18%"],
    ["Open-ended straight", "8", "32%", "16%"],
    ["Gutshot", "4", "16%", "8%"],
    ["Two overcards", "6", "24%", "12%"],
  ];

  return (
    <div className="teach-odds-table">
      <div className="odds-header">
        <span>Draw</span><span>Outs</span><span>Flop (×4)</span><span>Turn (×2)</span>
      </div>
      {rows.map(([draw, outs, flop, turn]) => (
        <div key={draw} className="odds-row">
          <span>{draw}</span><span className="code">{outs}</span><span className="code">{flop}</span><span className="code">{turn}</span>
        </div>
      ))}
    </div>
  );
}

export function TeachVisual({ visualType }: TeachVisualProps) {
  switch (visualType) {
    case "hand-rankings":
      return <HandRankings />;
    case "four-streets":
      return <FourStreets />;
    case "table-positions":
      return <TablePositions />;
    case "card-notation":
      return <CardNotation />;
    case "stack-depth":
      return <StackDepth />;
    case "range-chart":
      return <RangeChart />;
    case "odds-table":
      return <OddsTable />;
    default:
      return null;
  }
}
