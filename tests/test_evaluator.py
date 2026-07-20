from __future__ import annotations

import sys
import unittest
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(REPO_ROOT / "src"))

from spatial_foundation.evaluator import evaluate, load_json, should_fail, static_scan  # noqa: E402


FOUNDATION = load_json(REPO_ROOT / "foundation" / "spatial-environments-ai-foundation-v3.1.json")


def manifest(rule_results: list[dict]) -> dict:
    return {
        "subject": {"name": "Test room", "version_or_revision": "test"},
        "claimed_conformance_classes": [],
        "evidence": [
            {
                "id": "EV-1",
                "kind": "test",
                "location": "test-output",
                "summary": "Verified test evidence.",
                "status": "verified",
            }
        ],
        "rule_results": rule_results,
        "acceptance_test_results": [],
    }


class EvaluatorTests(unittest.TestCase):
    def test_confirmed_high_failure_is_not_conformant_and_can_fail_ci(self) -> None:
        report = evaluate(
            FOUNDATION,
            manifest(
                [
                    {
                        "rule_id": "RUNTIME-008",
                        "status": "fail",
                        "evidence_ids": ["EV-1"],
                        "notes": "Idle trace proves a permanent loop.",
                    }
                ]
            ),
        )
        self.assertEqual(report["verdict"], "not_conformant")
        self.assertTrue(report["findings"][0]["confirmed"])
        self.assertTrue(should_fail(report, "high"))

    def test_pass_without_verified_evidence_is_not_claimed_as_conformant(self) -> None:
        report = evaluate(
            FOUNDATION,
            manifest([{"rule_id": "RUNTIME-009", "status": "pass", "evidence_ids": []}]),
        )
        self.assertEqual(report["verdict"], "insufficient_evidence")
        self.assertIn("RUNTIME-009", report["unverified_rule_ids"])

    def test_unknown_rule_is_rejected(self) -> None:
        with self.assertRaises(ValueError):
            evaluate(
                FOUNDATION,
                manifest([{"rule_id": "NOT-A-RULE", "status": "pass", "evidence_ids": ["EV-1"]}]),
            )

    def test_static_scan_reports_signals_without_calling_them_proof(self) -> None:
        report = static_scan(REPO_ROOT / "tests" / "fixtures" / "problematic_runtime")
        rules = {finding["rule_id"] for finding in report["diagnostics"]}
        self.assertTrue({"RUNTIME-003", "RUNTIME-007", "RUNTIME-008", "RUNTIME-016", "CONST-025"} <= rules)
        self.assertTrue(all(not finding["confirmed"] for finding in report["diagnostics"]))


if __name__ == "__main__":
    unittest.main()
