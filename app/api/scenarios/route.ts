import { NextResponse } from "next/server";
import { z } from "zod";
import { listScenarios } from "@/lib/content";

const querySchema = z.object({
  concept: z.string().optional(),
  difficulty: z
    .string()
    .regex(/^[1-3]$/)
    .transform((value) => Number(value) as 1 | 2 | 3)
    .optional(),
  count: z
    .string()
    .regex(/^\d+$/)
    .transform((value) => Number(value))
    .optional()
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const parsed = querySchema.safeParse({
    concept: searchParams.get("concept") ?? undefined,
    difficulty: searchParams.get("difficulty") ?? undefined,
    count: searchParams.get("count") ?? undefined
  });

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid query parameters." }, { status: 400 });
  }

  const scenarios = await listScenarios(parsed.data);

  return NextResponse.json({ scenarios });
}
