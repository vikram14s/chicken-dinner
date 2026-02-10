import { NextResponse } from "next/server";
import { z } from "zod";
import { getScenarioById } from "@/lib/content";
import { evaluateScenarioDecision } from "@/lib/evaluator";

const bodySchema = z.object({
  scenarioId: z.string(),
  selectedActionId: z.string()
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request payload." }, { status: 400 });
  }

  const scenario = await getScenarioById(parsed.data.scenarioId);
  if (!scenario) {
    return NextResponse.json({ error: "Scenario not found." }, { status: 404 });
  }

  const result = evaluateScenarioDecision(scenario, parsed.data.selectedActionId);

  return NextResponse.json({ result });
}
