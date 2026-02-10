"use client";

const SUIT_SYMBOLS: Record<string, string> = {
  s: "\u2660", // ♠
  h: "\u2665", // ♥
  d: "\u2666", // ♦
  c: "\u2663", // ♣
};

const SUIT_COLORS: Record<string, string> = {
  s: "#1a1a1a",
  h: "#c0392b",
  d: "#2980b9",
  c: "#27ae60",
};

const RANK_DISPLAY: Record<string, string> = {
  A: "A",
  K: "K",
  Q: "Q",
  J: "J",
  T: "10",
  "9": "9",
  "8": "8",
  "7": "7",
  "6": "6",
  "5": "5",
  "4": "4",
  "3": "3",
  "2": "2",
};

interface PlayingCardProps {
  card: string; // e.g. "Ks", "Ah"
}

export function PlayingCard({ card }: PlayingCardProps) {
  const rank = card[0];
  const suit = card[1];
  const suitSymbol = SUIT_SYMBOLS[suit] ?? suit;
  const color = SUIT_COLORS[suit] ?? "#1a1a1a";
  const rankDisplay = RANK_DISPLAY[rank] ?? rank;

  return (
    <span className="playing-card" style={{ color }}>
      <span className="playing-card-rank">{rankDisplay}</span>
      <span className="playing-card-suit">{suitSymbol}</span>
    </span>
  );
}
