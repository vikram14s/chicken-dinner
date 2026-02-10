import type { Scenario } from "./types";

const positionNames: Record<string, string> = {
  UTG: "Under the Gun (earliest position)",
  MP: "Middle Position",
  HJ: "the Hijack (late-middle position)",
  CO: "the Cutoff (late position, one before the dealer)",
  BTN: "the Button (dealer position, best seat)",
  SB: "the Small Blind",
  BB: "the Big Blind",
};

const streetNames: Record<string, string> = {
  preflop: "before any community cards have been dealt",
  flop: "after the first three community cards have been dealt",
  turn: "after the fourth community card has been dealt",
  river: "after the fifth and final community card has been dealt",
};

const suitSymbols: Record<string, string> = {
  s: "Spades",
  h: "Hearts",
  d: "Diamonds",
  c: "Clubs",
};

const rankNames: Record<string, string> = {
  A: "Ace",
  K: "King",
  Q: "Queen",
  J: "Jack",
  T: "Ten",
  "9": "Nine",
  "8": "Eight",
  "7": "Seven",
  "6": "Six",
  "5": "Five",
  "4": "Four",
  "3": "Three",
  "2": "Two",
};

function describeCard(card: string): string {
  const rank = rankNames[card[0]] ?? card[0];
  const suit = suitSymbols[card[1]] ?? card[1];
  return `${rank} of ${suit}`;
}

function describeHeroHand(heroHand: string): string {
  const card1 = heroHand.slice(0, 2);
  const card2 = heroHand.slice(2);
  return `${describeCard(card1)} and ${describeCard(card2)}`;
}

/** Builds a plain-English narration of a poker scenario for beginners. */
export function narrateScenario(scenario: Scenario): string {
  const position = positionNames[scenario.position] ?? scenario.position;
  const street = streetNames[scenario.street] ?? scenario.street;
  const hand = describeHeroHand(scenario.heroHand);

  let narration = `You are sitting in ${position} with ${scenario.effectiveStackBB} big blinds. `;
  narration += `It is ${street}. `;
  narration += `Your hand is ${hand}. `;

  if (scenario.board.length > 0) {
    const boardCards = scenario.board.map(describeCard).join(", ");
    narration += `The board shows: ${boardCards}. `;
  }

  narration += `The pot is ${scenario.potSizeBB}bb`;
  if (scenario.toCallBB > 0) {
    narration += ` and it costs ${scenario.toCallBB}bb to call`;
  }
  narration += ".";

  return narration;
}
