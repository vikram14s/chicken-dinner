#!/usr/bin/env python3
"""Extract poker concepts from lecture PDFs into structured app content.

Usage:
  python3 scripts/extract_lectures.py
  python3 scripts/extract_lectures.py --lectures-dir Lectures --output content/lectures/concepts.v1.json
"""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path
from typing import Dict, Iterable, List

try:
    from pypdf import PdfReader
except ModuleNotFoundError as exc:
    raise SystemExit(
        "pypdf is not installed. Run: python3 -m pip install pypdf"
    ) from exc

KEYWORDS = {
    "pot-odds": ["pot odds", "odds", "break-even"],
    "ev": ["expected value", "ev"],
    "preflop": ["starting hand", "pre-flop", "preflop", "open"],
    "ranges": ["range", "ranges"],
    "position": ["position", "in position", "out of position"],
    "cbet": ["continuation", "c-bet", "cbet"],
    "bet-sizing": ["bet sizing", "size"],
    "outs": ["outs", "rule of four", "rule of 4", "rule of two", "rule of 2"],
    "tournament-basics": ["tournament", "blind levels", "stack"],
    "icm": ["icm", "payout", "bubble"],
    "mental-game": ["tilt", "discipline"],
    "etiquette": ["etiquette", "in turn", "out of turn", "show hand"],
}


def extract_text(reader: PdfReader) -> Iterable[str]:
    for page in reader.pages:
        raw = page.extract_text() or ""
        for line in raw.splitlines():
            line = re.sub(r"\s+", " ", line).strip()
            if len(line) >= 18:
                yield line


def detect_tags(text: str) -> List[str]:
    low = text.lower()
    tags = [tag for tag, hints in KEYWORDS.items() if any(hint in low for hint in hints)]
    return tags[:4]


def score_line(text: str) -> int:
    low = text.lower()
    score = 0
    if any(c.isdigit() for c in low):
        score += 1
    for hints in KEYWORDS.values():
        if any(h in low for h in hints):
            score += 3
    if len(text) > 130:
        score -= 1
    if text.endswith(":"):
        score -= 1
    return score


def normalize_title(line: str) -> str:
    words = line.split()
    cleaned = " ".join(words[:10]).strip("-:,. ")
    return cleaned[:68] if cleaned else "Extracted Concept"


def build_concepts(lecture_pdf: Path) -> List[Dict[str, object]]:
    reader = PdfReader(str(lecture_pdf))
    lecture_id = lecture_pdf.stem
    lines = list(extract_text(reader))

    candidates = sorted(lines, key=score_line, reverse=True)
    selected = []
    seen_titles = set()

    for line in candidates:
        tags = detect_tags(line)
        if not tags:
            continue

        title = normalize_title(line)
        key = title.lower()
        if key in seen_titles:
            continue

        seen_titles.add(key)
        concept_id = re.sub(r"[^a-z0-9]+", "-", f"{lecture_id}-{title.lower()}").strip("-")
        selected.append(
            {
                "id": concept_id,
                "lectureId": lecture_id,
                "title": title,
                "summary": line,
                "tags": tags,
                "sourceRefs": [f"{lecture_id}"]
            }
        )

        if len(selected) >= 8:
            break

    return selected


def main() -> None:
    parser = argparse.ArgumentParser(description="Extract concepts from lecture PDFs with pypdf.")
    parser.add_argument("--lectures-dir", default="Lectures", help="Directory containing lecture PDFs")
    parser.add_argument(
        "--output",
        default="content/lectures/concepts.v1.json",
        help="Output JSON path used directly by the app"
    )

    args = parser.parse_args()
    lectures_dir = Path(args.lectures_dir)
    output_path = Path(args.output)

    if not lectures_dir.exists():
        raise SystemExit(f"Lectures directory not found: {lectures_dir}")

    pdf_files = sorted(lectures_dir.glob("*.pdf"))
    if not pdf_files:
        raise SystemExit(f"No PDF files found in {lectures_dir}")

    all_concepts: List[Dict[str, object]] = []
    for pdf_file in pdf_files:
        all_concepts.extend(build_concepts(pdf_file))

    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(all_concepts, indent=2), encoding="utf-8")

    print(f"Extracted {len(all_concepts)} concepts from {len(pdf_files)} PDFs.")
    print(f"Wrote {output_path}")


if __name__ == "__main__":
    main()
