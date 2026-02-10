# Poker Coach Trainer

Interactive No-Limit Hold'em tournament decision trainer built with Next.js.

## Quick Start

1. Install dependencies:

```bash
npm install
```

2. Run development server:

```bash
npm run dev
```

3. Open `http://localhost:3000`.

## Core Scripts

- `npm run extract:lectures` - Extract lecture concepts from PDFs with `pypdf`.
- `npm run build:scenarios` - Generate scenarios from concept tags.
- `npm run test` - Run unit tests.

## Project Structure

- `app/` - Next.js App Router pages and API routes.
- `components/` - Client and server UI components.
- `content/` - Lecture concepts, scenarios, ranges.
- `lib/` - Domain types, math, scoring, content utilities.
- `scripts/` - Data extraction and scenario generation.
- `tests/` - Unit tests for math/scoring logic.

## Notes

`pypdf` is required for PDF extraction:

```bash
python3 -m pip install pypdf
```
