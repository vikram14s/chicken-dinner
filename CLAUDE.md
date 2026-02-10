# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Poker Coach Trainer — an interactive No-Limit Hold'em tournament decision trainer built with Next.js 15 (App Router) and React 19. Users practice poker scenarios, receive coaching feedback tied to lecture material, and track progress across concept areas.

## Commands

```bash
npm run dev              # Start Next.js dev server (localhost:3000)
npm run build            # Production build
npm run lint             # ESLint (next lint)
npm run typecheck        # TypeScript type check (tsc --noEmit)
npm run test             # Run all tests (vitest run)
npm run test:watch       # Run tests in watch mode (vitest)
npx vitest run tests/pokerMath.test.ts   # Run a single test file
```

### Content pipeline (run sequentially)

```bash
python3 -m pip install pypdf              # One-time dependency
npm run extract:lectures                  # Extract concepts from Lectures/*.pdf → content/lectures/concepts.v1.json
npm run build:scenarios                   # Generate scenarios from concepts → content/scenarios/generated.v1.json
```

## Architecture

### Data flow

1. **PDF extraction** (`scripts/extract_lectures.py`) — reads `Lectures/*.pdf` with pypdf, scores lines by keyword relevance, outputs `content/lectures/concepts.v1.json`
2. **Scenario generation** (`scripts/build_scenarios.ts`) — reads concepts, maps concept tags to scenario templates, outputs `content/scenarios/generated.v1.json`
3. **Runtime content loading** (`lib/content.ts`) — reads JSON from `content/` at request time, validates with Zod schemas, uses React `cache()` for deduplication within a request
4. **Client progress** (`lib/progressStorage.ts`) — user progress is stored entirely in `localStorage` (key: `progress.v1`), no database

### Key lib modules

- `lib/types.ts` — all domain types (`Scenario`, `UserProgress`, `LectureConcept`, etc.)
- `lib/content.ts` — server-only content loading with Zod validation; all content accessors are here
- `lib/evaluator.ts` — compares user's selected action to `bestActionId`, returns `ScenarioResult` with feedback
- `lib/pokerMath.ts` — break-even equity, outs-to-equity (rule of 4/2), pot odds classification
- `lib/progress.ts` — pure functions: `appendAttempt` (updates stats/tier), `pickWeakConcepts` (finds lowest-accuracy concepts)
- `lib/drills.ts` — `rankDrillScenarios` scores scenarios by overlap with user's weak concepts

### API routes

- `POST /api/attempt` — evaluates a decision (`scenarioId` + `selectedActionId`), returns `ScenarioResult`
- `GET /api/scenarios` — lists scenarios with optional `concept`, `difficulty`, `count` filters
- `GET /api/drills` — returns scenarios ranked by weak concept overlap (`weakConcepts` comma-separated, `count`)

### Pages

- `/` — dashboard with concept/scenario counts
- `/play` — main training interface: `ScenarioTrainer` (client) + `OddsWorkbench` (dynamically imported, SSR disabled)
- `/library` — browse lecture concepts grouped by lecture
- `/review` — client-side progress review from localStorage

### Content files

All content lives in `content/` as versioned JSON:
- `content/lectures/concepts.v1.json` — extracted lecture concepts
- `content/scenarios/seed.v1.json` — hand-authored seed scenarios (loaded by the app)
- `content/scenarios/generated.v1.json` — script-generated scenarios
- `content/ranges/tournament-openings.v1.json` — reference range data

## Conventions

- Path alias: `@/*` maps to project root (e.g., `@/lib/types`)
- Next.js experimental typed routes are enabled
- Tests live in `tests/` (not co-located), run with Vitest in Node environment
- Client components use `"use client"` directive; server components are the default
- Fonts: Space Grotesk (headings) and JetBrains Mono (code/metrics), loaded via `next/font/google`
- User tier progression: Rookie → Apprentice → Grinder → Shark (based on accuracy thresholds in `lib/progress.ts`)
