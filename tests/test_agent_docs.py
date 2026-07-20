from __future__ import annotations

import sys
import unittest
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(REPO_ROOT))

from scripts.validate_agent_docs import validate  # noqa: E402


class AgentDocumentTests(unittest.TestCase):
    def test_agent_entry_points_are_complete_and_connected(self) -> None:
        report = validate(REPO_ROOT)
        self.assertTrue(report["valid"], report["errors"])
        self.assertEqual(
            set(report["checked_files"]),
            {"AGENTS.md", "CLAUDE.md", "SKILL.md", "DESIGN.md"},
        )


if __name__ == "__main__":
    unittest.main()
