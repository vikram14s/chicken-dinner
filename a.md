# Poker Coach Trainer Handoff

## 1) What We Planned

Goal: build an interactive frontend trainer that helps you get good at No-Limit Hold'em tournament decisions by using concepts from `Lectures/Lecture 1.pdf` through `Lectures/Lecture 9.pdf`.

Primary product direction chosen:
- Decision Trainer first (not full simulator).
- Coach Mode first (pause at decision points and teach immediately).
- Stack: Next.js + TypeScript.
- Variant: No-Limit Hold'em Tournaments.
- V1 scope: single-player scenarios + scoring.
- Progress storage: local device only.
- Motivation: skill tiers + weak-spot drills.
- PDF pipeline preference: direct `pypdf` extraction into app content for V1.

## 2) Curriculum Mapping From Lectures

Lecture themes extracted and mapped into app concepts:
- Lecture 1-2: game flow and expected value.
- Lecture 3-5: starting ranges, position, preflop discipline, bet purpose, c-bets.
- Lecture 6: tournaments, structure, ICM intro.
- Lecture 7: outs, rule of 4/2, pot odds.
- Lecture 8: tilt, tells, etiquette.
- Lecture 9: integrated multi-factor spot analysis.

## 3) What Was Implemented In This Repo

A working project scaffold and core app logic were created.

### App and config
- `package.json`
- `tsconfig.json`
- `next.config.ts`
- `next-env.d.ts`
- `.gitignore`
- `README.md`
- `requirements.txt`
- `vitest.config.ts`

### Next.js app pages/routes
- `app/layout.tsx`
- `app/globals.css`
- `app/page.tsx` (dashboard)
- `app/play/page.tsx` (trainer page)
- `app/review/page.tsx` (progress review)
- `app/library/page.tsx` (lecture concept library)
- `app/api/scenarios/route.ts`
- `app/api/attempt/route.ts`
- `app/api/drills/route.ts`

### Components
- `components/ScenarioTrainer.tsx`
- `components/PokerTableView.tsx`
- `components/OddsWorkbench.tsx`
- `components/ProgressReviewClient.tsx`

### Domain logic
- `lib/types.ts` (core types: scenarios, concepts, progress)
- `lib/content.ts` (content loading + filtering with zod validation)
- `lib/evaluator.ts` (decision evaluation)
- `lib/pokerMath.ts` (pot odds/equity helpers)
- `lib/progress.ts` (tiering, concept stats, weak concept selection)
- `lib/progressStorage.ts` (localStorage)
- `lib/drills.ts` (weak-spot drill ranking)

### Content seeds
- `content/lectures/concepts.v1.json` (seed concept corpus)
- `content/scenarios/seed.v1.json` (15 training scenarios)
- `content/ranges/tournament-openings.v1.json` (baseline opening ranges)

### Pipeline scripts
- `scripts/extract_lectures.py` (pypdf extraction to concept JSON)
- `scripts/build_scenarios.ts` (concept-based scenario generation)

### Tests
- `tests/pokerMath.test.ts`
- `tests/evaluator.test.ts`
- `tests/progress.test.ts`

## 4) Product Behavior Currently Designed

- Dashboard summarizes available concepts and drills.
- Play screen renders a poker scenario, asks for action, and evaluates through `/api/attempt`.
- Coach feedback explains why action is good/risky and references lecture tags.
- Local progress tracks attempts, concept accuracy, EV deltas, tier, and recent mistakes.
- Weak concepts can request targeted drills from `/api/drills`.
- Concept library displays lecture-derived strategy notes.
- Odds workbench provides quick outs/pot-odds calculation.

## 5) Technical Notes About Performance Choices

Aligned with `vercel-react-best-practices` direction:
- Parallel data loading with `Promise.all` on server pages.
- `react` cache usage in content loader for dedup reads.
- Dynamic import for odds workbench (`next/dynamic`) to keep base page lean.
- No barrel import pattern used in hot paths.
- Validation via zod on content and API inputs.

## 6) What Could Not Be Verified Here (Environment Blockers)

Install and runtime checks were blocked by network restrictions in this environment:
- `npm install` failed with `ENOTFOUND registry.npmjs.org`.
- `pypdf` not installed in this environment yet.

Because of that, the following are unverified here:
- `npm run dev`
- `npm run typecheck`
- `npm run test`
- `npm run build`
- `npm run extract:lectures`

## 7) Exact Next Steps For The Next Agent

1. Install dependencies:
- `npm install`
- `python3 -m pip install -r requirements.txt`

2. Verify app and quality gates:
- `npm run typecheck`
- `npm run test`
- `npm run build`
- `npm run dev`

3. Run lecture extraction pipeline:
- `npm run extract:lectures`
- Inspect `content/lectures/concepts.v1.json`

4. Generate additional scenario set:
- `npm run build:scenarios`
- Review `content/scenarios/generated.v1.json`

5. Improve content quality for coaching correctness:
- Replace auto-extracted noisy summaries with curated concept summaries.
- Calibrate EV/action labels on scenarios.
- Add acceptance tests for API routes and trainer flow.

## 8) Suggested Immediate Priorities

- Priority A: dependency install + run app.
- Priority B: validate and refine extracted concepts from PDFs.
- Priority C: expand scenario bank from 15 to 50+ high-quality spots.
- Priority D: add integration tests for API + client flow.

## 9) Handoff Summary

The repo now contains a full V1 implementation scaffold for the planned poker trainer, including UI, APIs, domain logic, local progress, seed content, and extraction/generation scripts. The main remaining work is environment setup, validation, and content quality refinement.
