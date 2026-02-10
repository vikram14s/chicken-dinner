"use client";

import { useState } from "react";
import {
  getTutorialStep,
  markTutorialCompleted,
  saveTutorialStep,
} from "@/lib/progressStorage";
import { PlayingCard } from "./PlayingCard";

interface QuizOption {
  label: string;
  correct: boolean;
}

interface TutorialStep {
  title: string;
  body: string;
  visual: React.ReactNode;
  quiz: {
    question: string;
    options: QuizOption[];
  };
}

const STEPS: TutorialStep[] = [
  {
    title: "Hand Rankings",
    body: "In poker, the goal is to make the best five-card hand. Hands are ranked from highest to lowest. Memorize this order — it's the foundation of every decision.",
    visual: (
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
    ),
    quiz: {
      question: "Which hand beats a Full House?",
      options: [
        { label: "Flush", correct: false },
        { label: "Four of a Kind", correct: true },
        { label: "Straight", correct: false },
        { label: "Two Pair", correct: false },
      ],
    },
  },
  {
    title: "The Four Streets",
    body: "A hand of Texas Hold'em plays out over four rounds of betting, called 'streets'. Community cards are dealt face-up on the table for everyone to use.",
    visual: (
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
    ),
    quiz: {
      question: "How many community cards are on the board after the flop?",
      options: [
        { label: "1", correct: false },
        { label: "3", correct: true },
        { label: "5", correct: false },
        { label: "2", correct: false },
      ],
    },
  },
  {
    title: "Table Positions",
    body: "Where you sit relative to the dealer button determines when you act. Later positions are stronger because you see what others do first.",
    visual: (
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
    ),
    quiz: {
      question: "Which position acts last after the flop?",
      options: [
        { label: "Small Blind (SB)", correct: false },
        { label: "Under the Gun (UTG)", correct: false },
        { label: "Button (BTN)", correct: true },
        { label: "Big Blind (BB)", correct: false },
      ],
    },
  },
  {
    title: "Card Notation",
    body: "In this app, cards are written as two characters: a rank and a suit. For example, 'As' means Ace of Spades. Learning this shorthand makes scenarios quick to read.",
    visual: (
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
    ),
    quiz: {
      question: "What card does 'Jd' represent?",
      options: [
        { label: "Jack of Diamonds", correct: true },
        { label: "Jack of Spades", correct: false },
        { label: "Ten of Diamonds", correct: false },
        { label: "Queen of Diamonds", correct: false },
      ],
    },
  },
  {
    title: "Big Blinds & Stack Depth",
    body: "In tournaments, we measure everything in 'big blinds' (bb). If the big blind is 100 chips and you have 3,000 chips, your stack is 30bb. Short stacks (under 15bb) play very differently from deep stacks (50bb+).",
    visual: (
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
    ),
    quiz: {
      question: "If the big blind is 200 and you have 6,000 chips, what is your stack in bb?",
      options: [
        { label: "20bb", correct: false },
        { label: "30bb", correct: true },
        { label: "60bb", correct: false },
        { label: "12bb", correct: false },
      ],
    },
  },
];

interface TutorialFlowProps {
  onComplete: () => void;
}

export function TutorialFlow({ onComplete }: TutorialFlowProps) {
  const [step, setStep] = useState(() => getTutorialStep());
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);

  const current = STEPS[step];
  if (!current) {
    markTutorialCompleted();
    onComplete();
    return null;
  }

  const handleAnswer = (index: number) => {
    if (answered) return;
    setSelectedAnswer(index);
    setAnswered(true);
  };

  const advance = () => {
    const next = step + 1;
    if (next >= STEPS.length) {
      markTutorialCompleted();
      onComplete();
    } else {
      saveTutorialStep(next);
      setStep(next);
      setSelectedAnswer(null);
      setAnswered(false);
    }
  };

  const skip = () => {
    markTutorialCompleted();
    onComplete();
  };

  return (
    <div className="tutorial-shell">
      <div className="tutorial-progress">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className={`tutorial-dot ${i === step ? "active" : ""} ${i < step ? "done" : ""}`}
          />
        ))}
      </div>

      <div className="tutorial-card panel panel-strong">
        <p className="kv">
          Step {step + 1} of {STEPS.length}
        </p>
        <h2 style={{ marginTop: 0 }}>{current.title}</h2>
        <p>{current.body}</p>

        <div className="tutorial-visual">{current.visual}</div>

        <div className="tutorial-quiz">
          <p style={{ fontWeight: 600 }}>{current.quiz.question}</p>
          <div className="option-grid">
            {current.quiz.options.map((opt, i) => {
              let className = "option-button";
              if (answered && selectedAnswer === i) {
                className += opt.correct ? " quiz-correct" : " quiz-wrong";
              } else if (answered && opt.correct) {
                className += " quiz-correct";
              }
              if (!answered && selectedAnswer === i) {
                className += " active";
              }
              return (
                <button
                  key={i}
                  className={className}
                  type="button"
                  onClick={() => handleAnswer(i)}
                  disabled={answered}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
          {answered && selectedAnswer !== null && (
            <p className={current.quiz.options[selectedAnswer].correct ? "good" : "bad"} style={{ marginTop: "0.5rem" }}>
              {current.quiz.options[selectedAnswer].correct
                ? "That's right!"
                : `Not quite — the answer is "${current.quiz.options.find((o) => o.correct)?.label}".`}
            </p>
          )}
        </div>

        <div className="h-stack" style={{ marginTop: "1rem" }}>
          {answered && (
            <button className="button" type="button" onClick={advance}>
              {step === STEPS.length - 1 ? "Start Training" : "Next"}
            </button>
          )}
          <button className="button ghost" type="button" onClick={skip}>
            Skip Tutorial
          </button>
        </div>
      </div>
    </div>
  );
}
