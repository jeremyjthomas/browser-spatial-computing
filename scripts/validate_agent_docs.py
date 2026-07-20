#!/usr/bin/env python3
from __future__ import annotations

import json
import re
import sys
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parents[1]

REQUIRED_HEADINGS = {
    "AGENTS.md": [
        "## Mission",
        "## Read in this order",
        "## Authority and generated files",
        "## Non-negotiable model constraints",
        "## Change workflow",
        "## Definition of done",
    ],
    "CLAUDE.md": ["# Claude Code instructions", "## Claude loading strategy"],
    "SKILL.md": [
        "# Browser Spatial Computing",
        "## Select a task mode",
        "## Retrieval protocol",
        "## Core reasoning sequence",
        "## Evaluation protocol",
    ],
    "DESIGN.md": [
        "## Overview",
        "## Colors",
        "## Typography",
        "## Layout",
        "## Elevation & Depth",
        "## Shapes",
        "## Components",
        "## Do's and Don'ts",
        "## Accessibility",
        "## Motion and Interaction",
        "## Evidence and Maintenance",
    ],
}

REQUIRED_REFERENCES = {
    "AGENTS.md": ["SKILL.md", "DESIGN.md", "scripts/query_graph.py", "scripts/validate_agent_docs.py"],
    "CLAUDE.md": ["@AGENTS.md", "SKILL.md", "DESIGN.md"],
    "SKILL.md": [
        "foundation/spatial-environments-ai-foundation-v3.1.json",
        "scripts/query_graph.py",
        "scripts/evaluate_principles.py",
    ],
    "DESIGN.md": ["docs/principles.md", "foundation/spatial-environments-ai-foundation-v3.1.json"],
}


def _has_frontmatter(text: str) -> bool:
    return text.startswith("---\n") and "\n---\n" in text[4:]


def validate(root: Path = REPO_ROOT) -> dict[str, object]:
    errors: list[str] = []
    checked: list[str] = []
    texts: dict[str, str] = {}

    for filename in REQUIRED_HEADINGS:
        path = root / filename
        if not path.is_file():
            errors.append(f"missing:{filename}")
            continue
        text = path.read_text(encoding="utf-8")
        texts[filename] = text
        checked.append(filename)
        for heading in REQUIRED_HEADINGS[filename]:
            if heading not in text:
                errors.append(f"missing_heading:{filename}:{heading}")
        for reference in REQUIRED_REFERENCES[filename]:
            if reference not in text:
                errors.append(f"missing_reference:{filename}:{reference}")
        if re.search(r"\b(?:TODO|FIXME|TBD)\b", text):
            errors.append(f"unresolved_placeholder:{filename}")

    for filename in ("SKILL.md", "DESIGN.md"):
        if filename in texts and not _has_frontmatter(texts[filename]):
            errors.append(f"missing_frontmatter:{filename}")

    skill = texts.get("SKILL.md", "")
    if not re.search(r"^name:\s*browser-spatial-computing\s*$", skill, re.MULTILINE):
        errors.append("invalid_skill_name:SKILL.md")
    design = texts.get("DESIGN.md", "")
    if not re.search(r"^version:\s*alpha\s*$", design, re.MULTILINE):
        errors.append("invalid_design_version:DESIGN.md")

    for relative_path in (
        "foundation/spatial-environments-ai-foundation-v3.1.json",
        "knowledge/spatial-knowledge-graph.json",
        "scripts/query_graph.py",
        "scripts/evaluate_principles.py",
    ):
        if not (root / relative_path).exists():
            errors.append(f"broken_repository_reference:{relative_path}")

    return {
        "valid": not errors,
        "checked_files": checked,
        "error_count": len(errors),
        "errors": errors,
    }


def main() -> int:
    report = validate()
    sys.stdout.write(json.dumps(report, indent=2) + "\n")
    return 0 if report["valid"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
