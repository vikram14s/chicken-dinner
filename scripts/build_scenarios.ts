import { promises as fs } from "node:fs";
import path from "node:path";

type LectureConcept = {
  id: string;
  lectureId: string;
  title: string;
  summary: string;
  tags: string[];
};

type ScenarioTemplate = {
  title: string;
  street: "preflop" | "flop" | "turn" | "river";
  tags: string[];
  position: "UTG" | "HJ" | "CO" | "BTN" | "SB" | "BB" | "MP";
  effectiveStackBB: number;
};

const templateByTag: Record<string, ScenarioTemplate> = {
  "pot-odds": {
    title: "Pot Odds Decision",
    street: "turn",
    tags: ["pot-odds", "outs"],
    position: "CO",
    effectiveStackBB: 24
  },
  preflop: {
    title: "Preflop Range Spot",
    street: "preflop",
    tags: ["preflop", "ranges"],
    position: "HJ",
    effectiveStackBB: 30
  },
  cbet: {
    title: "Flop C-Bet Spot",
    street: "flop",
    tags: ["cbet", "bet-sizing"],
    position: "BTN",
    effectiveStackBB: 28
  },
  "short-stack": {
    title: "Push/Fold Spot",
    street: "preflop",
    tags: ["short-stack", "shove-fold"],
    position: "SB",
    effectiveStackBB: 9
  },
  icm: {
    title: "ICM Pressure Spot",
    street: "preflop",
    tags: ["icm", "bubble"],
    position: "CO",
    effectiveStackBB: 14
  }
};

const defaultTemplate: ScenarioTemplate = {
  title: "Integrated Tournament Decision",
  street: "flop",
  tags: ["integrated-analysis"],
  position: "CO",
  effectiveStackBB: 25
};

const filePath = (...parts: string[]) => path.join(process.cwd(), ...parts);

async function main() {
  const conceptsRaw = await fs.readFile(filePath("content", "lectures", "concepts.v1.json"), "utf8");
  const concepts = JSON.parse(conceptsRaw) as LectureConcept[];

  const generated = concepts.slice(0, 20).map((concept, index) => {
    const matchingTag = concept.tags.find((tag) => templateByTag[tag]);
    const template = matchingTag ? templateByTag[matchingTag] : defaultTemplate;

    return {
      id: `gen-${String(index + 1).padStart(3, "0")}`,
      title: `${template.title}: ${concept.title}`,
      street: template.street,
      position: template.position,
      effectiveStackBB: template.effectiveStackBB,
      heroHand: "AsKd",
      board: template.street === "preflop" ? [] : ["Kh", "8d", "3c"],
      potSizeBB: 10,
      toCallBB: 5,
      villainRange: "Merged range from template assumptions",
      options: [
        { id: "fold", action: "fold", summary: "Fold" },
        { id: "call", action: "call", summary: "Call" },
        { id: "raise", action: "raise", size: "2.8x", summary: "Raise" }
      ],
      bestActionId: "call",
      evDeltaByAction: { fold: -0.4, call: 0.5, raise: 0.1 },
      feedbackByAction: {
        fold: {
          whyGood: "Avoids variance.",
          whyRisky: "Can be too tight in this context.",
          lectureRefs: [concept.lectureId]
        },
        call: {
          whyGood: "Balances risk and reward with this range interaction.",
          whyRisky: "Future streets still require discipline.",
          lectureRefs: [concept.lectureId]
        },
        raise: {
          whyGood: "Adds fold equity.",
          whyRisky: "Inflates pot versus stronger continues.",
          lectureRefs: [concept.lectureId]
        }
      },
      conceptTags: Array.from(new Set([...template.tags, ...concept.tags])).slice(0, 5),
      difficulty: ((index % 3) + 1) as 1 | 2 | 3
    };
  });

  await fs.writeFile(filePath("content", "scenarios", "generated.v1.json"), JSON.stringify(generated, null, 2));
  process.stdout.write(`Generated ${generated.length} scenarios to content/scenarios/generated.v1.json\n`);
}

main().catch((error) => {
  process.stderr.write(`${String(error)}\n`);
  process.exit(1);
});
