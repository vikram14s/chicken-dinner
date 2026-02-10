/** Plain-English definitions for poker terms shown in tooltips. */
const glossary: Record<string, string> = {
  // Positions
  UTG: "Under the Gun — first player to act preflop, the earliest and tightest position.",
  MP: "Middle Position — acts after UTG but before late position. Moderate opening range.",
  HJ: "Hijack — two seats before the dealer button. A late-middle position that can open wider.",
  CO: "Cutoff — one seat before the dealer button. Strong late position for stealing blinds.",
  BTN: "Button (Dealer) — last to act after the flop. The most profitable seat at the table.",
  SB: "Small Blind — forced half-bet posted before cards are dealt. Acts second-to-last preflop but first postflop.",
  BB: "Big Blind — forced full bet posted before cards are dealt. Defends the widest range.",

  // Streets
  preflop: "Before any community cards are dealt. Each player has only their two hole cards.",
  flop: "The first three community cards dealt face-up in the center of the table.",
  turn: "The fourth community card, dealt after the flop betting round.",
  river: "The fifth and final community card. Last chance to bet or bluff.",

  // Actions
  fold: "Give up your hand and forfeit any chips already in the pot.",
  check: "Pass the action without betting, only possible if no one has bet yet.",
  call: "Match the current bet to stay in the hand.",
  bet: "Put chips into the pot when no one else has bet this round.",
  raise: "Increase the current bet, forcing others to put in more chips or fold.",
  shove: "Go all-in — push all your remaining chips into the pot.",

  // Sizing & stack
  bb: "Big blind — the standard unit for measuring bets and stack sizes in tournaments.",
  "effective stack": "The smaller stack in a heads-up pot. Determines the maximum you can win or lose.",
  "pot odds": "The ratio of the current pot to the cost of a call. Tells you how often you need to win.",
  equity: "Your chance of winning the hand if all cards were dealt out right now.",
  outs: "Cards remaining in the deck that will improve your hand to a likely winner.",
  "c-bet": "Continuation bet — a bet on the flop by the preflop raiser to maintain aggression.",
  "3-bet": "A re-raise over an initial raise. Shows strength or is used as a bluff.",
  "push/fold": "Short-stack strategy: either go all-in or fold. Used when stacks are below ~10bb.",

  // Hand notation
  suited: "Both hole cards share the same suit (e.g., AhKh). Written as 's' in hand notation.",
  offsuit: "Hole cards of different suits (e.g., AhKd). Written as 'o' in hand notation.",
};

export default glossary;
