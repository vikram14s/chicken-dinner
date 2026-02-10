import { describe, expect, it } from "vitest";
import { appendAttempt, createEmptyProgress, pickWeakConcepts } from "@/lib/progress";

const resultTemplate = {
  scenarioId: "scn-1",
  selectedActionId: "call",
  isCorrect: false,
  evDelta: -0.5,
  feedback: {
    whyGood: "",
    whyRisky: "",
    lectureRefs: []
  },
  conceptTags: ["pot-odds", "outs"]
};

describe("progress", () => {
  it("appends attempts and updates concept stats", () => {
    const start = createEmptyProgress();
    const next = appendAttempt(start, resultTemplate);
    expect(next.attempts).toHaveLength(1);
    expect(next.conceptStats["pot-odds"].attempts).toBe(1);
    expect(next.recentMistakes).toContain("scn-1");
  });

  it("picks weak concepts after enough attempts", () => {
    let progress = createEmptyProgress();
    progress = appendAttempt(progress, resultTemplate, "2020-01-01T00:00:00.000Z");
    progress = appendAttempt(progress, resultTemplate, "2020-01-01T00:00:01.000Z");
    const weak = pickWeakConcepts(progress);
    expect(weak).toContain("pot-odds");
  });
});
