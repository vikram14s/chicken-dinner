import { NextResponse } from "next/server";
import { z } from "zod";
import { getScenarios } from "@/lib/content";
import { rankDrillScenarios } from "@/lib/drills";

const querySchema = z.object({
  weakConcepts: z.string().optional(),
  count: z
    .string()
    .regex(/^\d+$/)
    .transform((value) => Number(value))
    .optional()
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const parsed = querySchema.safeParse({
    weakConcepts: searchParams.get("weakConcepts") ?? undefined,
    count: searchParams.get("count") ?? undefined
  });

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid query parameters." }, { status: 400 });
  }

  const weakConcepts = parsed.data.weakConcepts
    ? parsed.data.weakConcepts
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    : [];

  const count = parsed.data.count ?? 6;
  const allScenarios = await getScenarios();
  const scenarios = weakConcepts.length > 0
    ? rankDrillScenarios(allScenarios, weakConcepts, count)
    : allScenarios.slice(0, count);

  return NextResponse.json({ scenarios, weakConcepts });
}
