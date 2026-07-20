from __future__ import annotations

import json
import re
from collections import Counter
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Iterable


VALID_RULE_STATUSES = {"pass", "fail", "unverified", "not_applicable"}
VALID_TEST_STATUSES = {"pass", "fail", "unverified", "not_applicable"}
SEVERITY_ORDER = {"critical": 4, "high": 3, "medium": 2, "low": 1}
SCANNED_EXTENSIONS = {
    ".astro",
    ".css",
    ".html",
    ".htm",
    ".js",
    ".jsx",
    ".mjs",
    ".svelte",
    ".ts",
    ".tsx",
    ".vue",
}
IGNORED_DIRS = {
    ".git",
    ".next",
    ".nuxt",
    ".output",
    ".svelte-kit",
    "build",
    "coverage",
    "dist",
    "node_modules",
    "vendor",
}


def load_json(path: str | Path) -> dict[str, Any]:
    return json.loads(Path(path).read_text(encoding="utf-8"))


def _line_number(text: str, offset: int) -> int:
    return text.count("\n", 0, offset) + 1


def _finding(
    *,
    finding_id: str,
    rule_id: str,
    severity: str,
    finding: str,
    why: str,
    evidence: Iterable[str],
    fix: str,
    confirmed: bool,
    confidence: str = "high",
    finding_type: str = "rule_result",
) -> dict[str, Any]:
    return {
        "id": finding_id,
        "rule_id": rule_id,
        "severity": severity,
        "finding": finding,
        "why_it_matters": why,
        "evidence": list(evidence),
        "recommended_fix": fix,
        "confirmed": confirmed,
        "confidence": confidence,
        "finding_type": finding_type,
    }


@dataclass(frozen=True)
class StaticPattern:
    id: str
    rule_id: str
    severity: str
    pattern: re.Pattern[str]
    finding: str
    why: str
    fix: str
    confidence: str = "medium"


STATIC_PATTERNS = [
    StaticPattern(
        "STATIC-RAF-LOOP",
        "RUNTIME-008",
        "high",
        re.compile(r"requestAnimationFrame\s*\(\s*(?:loop|animate|render|tick)\s*\)", re.I),
        "Possible perpetual requestAnimationFrame loop",
        "A settled editor-like spatial surface should return to zero optional rendering work.",
        "Make rendering invalidation-driven, prove a settlement stop, and add an idle trace test.",
        "medium",
    ),
    StaticPattern(
        "STATIC-INTERVAL-RENDER",
        "RUNTIME-008",
        "high",
        re.compile(r"setInterval\s*\([^\n]*(?:render|draw|animate|tick)", re.I),
        "Timer appears to drive continuous rendering",
        "Continuous timers consume CPU and power even when spatial state is unchanged.",
        "Replace the timer with explicit invalidation and stop all optional work after settlement.",
        "medium",
    ),
    StaticPattern(
        "STATIC-THREE-IMPORT",
        "RUNTIME-007",
        "medium",
        re.compile(r"(?:from\s+['\"]three(?:/[^'\"]*)?['\"]|require\s*\(\s*['\"]three)", re.I),
        "Three.js appears in a static import path",
        "The default core should not pay the parsing, memory, and initialization cost of optional volumetric rendering.",
        "Move Three.js behind a dynamic import reached only by a requested volumetric projection.",
        "high",
    ),
    StaticPattern(
        "STATIC-UNCAPPED-DPR",
        "RUNTIME-016",
        "high",
        re.compile(r"setPixelRatio\s*\(\s*(?:window\.)?devicePixelRatio\s*\)", re.I),
        "WebGL pixel ratio appears to use the full device pixel ratio without a visible cap",
        "High-density displays can multiply drawing-buffer pixels and thermal cost far beyond the interaction budget.",
        "Cap physical drawing-buffer pixels or clamp pixel ratio against an explicit budget.",
        "high",
    ),
    StaticPattern(
        "STATIC-AUTOPLAY",
        "RUNTIME-008",
        "medium",
        re.compile(r"\bautoplay\b", re.I),
        "Autoplaying media signal found",
        "Hidden, warm, or settled frames must not own optional media work.",
        "Require explicit intent, stop media when inactive, and verify zero hidden-state work.",
        "medium",
    ),
    StaticPattern(
        "STATIC-WILL-CHANGE",
        "RUNTIME-008",
        "low",
        re.compile(r"will-change\s*:", re.I),
        "Persistent will-change declaration needs lifecycle review",
        "Permanent compositing hints across many frames can increase memory use and thermal pressure.",
        "Add will-change immediately before known motion and remove it after settlement.",
        "low",
    ),
    StaticPattern(
        "STATIC-WHEEL-CAPTURE",
        "GRAM-010",
        "high",
        re.compile(r"(?:wheel|mousewheel)[\s\S]{0,300}preventDefault\s*\(", re.I),
        "Wheel capture signal needs focus ownership and release verification",
        "Unscoped wheel capture can trap ordinary page or browser navigation.",
        "Require an explicitly focused stage, Esc or focus-release path, accumulated deltas, and visible alternate control.",
        "medium",
    ),
]


def _iter_source_files(root: Path) -> Iterable[Path]:
    for path in root.rglob("*"):
        if not path.is_file() or path.suffix.lower() not in SCANNED_EXTENSIONS:
            continue
        if any(part in IGNORED_DIRS for part in path.parts):
            continue
        if path.stat().st_size > 1_000_000:
            continue
        yield path


def static_scan(root: str | Path) -> dict[str, Any]:
    supplied_root = Path(root)
    root_path = supplied_root.resolve()
    display_root = str(supplied_root)
    if not root_path.exists() or not root_path.is_dir():
        raise ValueError(f"Repository scan root is not a directory: {root_path}")
    diagnostics: list[dict[str, Any]] = []
    css_motion_found = False
    reduced_motion_found = False
    preserve_3d_files: set[Path] = set()
    blur_filter_files: set[Path] = set()
    scanned_files = 0

    for path in _iter_source_files(root_path):
        scanned_files += 1
        try:
            text = path.read_text(encoding="utf-8")
        except UnicodeDecodeError:
            continue
        relative = str(path.relative_to(root_path))
        if path.suffix.lower() == ".css":
            css_motion_found = css_motion_found or bool(re.search(r"(?:animation|transition)\s*:", text, re.I))
            reduced_motion_found = reduced_motion_found or "prefers-reduced-motion" in text
            if "preserve-3d" in text:
                preserve_3d_files.add(path)
            if re.search(r"filter\s*:\s*[^;]*blur\s*\(", text, re.I):
                blur_filter_files.add(path)
        for pattern in STATIC_PATTERNS:
            for occurrence, match in enumerate(pattern.pattern.finditer(text), start=1):
                line = _line_number(text, match.start())
                diagnostics.append(
                    _finding(
                        finding_id=f"{pattern.id}-{scanned_files:04d}-{occurrence:02d}",
                        rule_id=pattern.rule_id,
                        severity=pattern.severity,
                        finding=pattern.finding,
                        why=pattern.why,
                        evidence=[f"{relative}:{line}: {match.group(0)[:160]}"],
                        fix=pattern.fix,
                        confirmed=False,
                        confidence=pattern.confidence,
                        finding_type="static_signal",
                    )
                )

    for path in sorted(preserve_3d_files & blur_filter_files):
        relative = str(path.relative_to(root_path))
        diagnostics.append(
            _finding(
                finding_id=f"STATIC-FLATTEN-{len(diagnostics) + 1:04d}",
                rule_id="RUNTIME-003",
                severity="medium",
                finding="Blur filters and preserve-3d occur in the same stylesheet",
                why="CSS grouping properties can flatten a preserved 3D subtree depending on where they are applied.",
                evidence=[relative],
                fix="Separate optics from transform-preservation boundaries and add a cross-browser flattening fixture.",
                confirmed=False,
                confidence="medium",
                finding_type="static_signal",
            )
        )

    if css_motion_found and not reduced_motion_found:
        diagnostics.append(
            _finding(
                finding_id="STATIC-REDUCED-MOTION-001",
                rule_id="CONST-025",
                severity="high",
                finding="CSS motion exists but no prefers-reduced-motion handling was found",
                why="The spatial grammar requires an equivalent comfortable projection, not mandatory travel or ambient motion.",
                evidence=[f"Scanned {scanned_files} supported source files under {display_root}"],
                fix="Add reduced-motion behavior that removes travel, blur animation, tilt, and ambient loops while preserving navigation meaning.",
                confirmed=False,
                confidence="medium",
                finding_type="static_signal",
            )
        )

    counts = Counter(item["rule_id"] for item in diagnostics)
    return {
        "root": display_root,
        "scanned_files": scanned_files,
        "diagnostic_count": len(diagnostics),
        "diagnostics_by_rule": dict(sorted(counts.items())),
        "diagnostics": diagnostics,
        "disclaimer": "Static diagnostics are conservative signals. They require review and do not prove runtime failure or conformance by themselves.",
    }


def _required_rules(foundation: dict[str, Any], claimed_classes: list[str]) -> set[str]:
    classes = foundation["conformance"]["classes"]
    unknown = sorted(set(claimed_classes) - set(classes))
    if unknown:
        raise ValueError("Unknown conformance classes: " + ", ".join(unknown))
    principle_ids: set[str] = set()
    for class_id in claimed_classes:
        principle_ids.update(classes[class_id]["required_principles"])
    required = {
        rule["id"]
        for rule in foundation["normative_rule_registry"]
        if rule["level"] in {"MUST", "MUST_NOT"}
        and (
            set(rule["source_principle_ids"]) & principle_ids
            or "PART_VII" in rule["source_principle_ids"]
        )
    }
    return required


def _required_tests(foundation: dict[str, Any], claimed_classes: list[str]) -> set[str]:
    class_categories = {
        "core_spatial": {
            "structure",
            "navigation",
            "depth_and_focus",
            "frames_and_lens",
            "transactions_and_recovery",
            "accessibility",
        },
        "collaborative_spatial": {"collaboration", "transactions_and_recovery"},
        "agentic_spatial": {"ai", "transactions_and_recovery"},
        "into_visual_profile": set(),
        "runtime_performance_capacity": {"performance"},
    }
    categories: set[str] = set()
    for class_id in claimed_classes:
        categories.update(class_categories.get(class_id, set()))
    return {
        test["id"]
        for test in foundation["conformance"]["acceptance_tests"]
        if test["category"] in categories
    }


def _index_results(
    results: list[dict[str, Any]],
    *,
    id_key: str,
    allowed_ids: set[str],
    allowed_statuses: set[str],
) -> dict[str, dict[str, Any]]:
    indexed: dict[str, dict[str, Any]] = {}
    for result in results:
        result_id = result.get(id_key)
        if not result_id or result_id not in allowed_ids:
            raise ValueError(f"Unknown or missing {id_key}: {result_id!r}")
        if result_id in indexed:
            raise ValueError(f"Duplicate result for {result_id}")
        status = result.get("status")
        if status not in allowed_statuses:
            raise ValueError(f"Invalid status for {result_id}: {status!r}")
        indexed[result_id] = result
    return indexed


def evaluate(
    foundation: dict[str, Any],
    manifest: dict[str, Any],
    *,
    repository_root: str | Path | None = None,
) -> dict[str, Any]:
    subject = manifest.get("subject") or {}
    if not subject.get("name") or not subject.get("version_or_revision"):
        raise ValueError("Manifest subject.name and subject.version_or_revision are required")
    claimed_classes = manifest.get("claimed_conformance_classes", [])
    all_rules = {rule["id"]: rule for rule in foundation["normative_rule_registry"]}
    all_tests = {test["id"]: test for test in foundation["conformance"]["acceptance_tests"]}
    evidence = {item["id"]: item for item in manifest.get("evidence", []) if item.get("id")}
    if len(evidence) != len(manifest.get("evidence", [])):
        raise ValueError("Every evidence item requires a unique id")

    rule_results = _index_results(
        manifest.get("rule_results", []),
        id_key="rule_id",
        allowed_ids=set(all_rules),
        allowed_statuses=VALID_RULE_STATUSES,
    )
    test_results = _index_results(
        manifest.get("acceptance_test_results", []),
        id_key="test_id",
        allowed_ids=set(all_tests),
        allowed_statuses=VALID_TEST_STATUSES,
    )
    required_rule_ids = _required_rules(foundation, claimed_classes)
    required_test_ids = _required_tests(foundation, claimed_classes)
    required_rule_ids.update(rule_results)
    required_test_ids.update(test_results)

    findings: list[dict[str, Any]] = []
    passed_rule_ids: list[str] = []
    unverified_rule_ids: list[str] = []
    evidence_gaps: list[str] = []
    verified_required = 0

    for rule_id in sorted(required_rule_ids):
        rule = all_rules[rule_id]
        result = rule_results.get(rule_id)
        if not result or result["status"] == "unverified":
            unverified_rule_ids.append(rule_id)
            evidence_gaps.append(f"{rule_id}: no verified rule result")
            continue
        result_evidence_ids = result.get("evidence_ids", [])
        unknown_evidence = sorted(set(result_evidence_ids) - set(evidence))
        if unknown_evidence:
            raise ValueError(f"{rule_id} references unknown evidence IDs: {', '.join(unknown_evidence)}")
        verified_evidence = [
            evidence_id
            for evidence_id in result_evidence_ids
            if evidence[evidence_id].get("status", "verified") == "verified"
        ]
        if result["status"] == "pass":
            if verified_evidence:
                passed_rule_ids.append(rule_id)
                verified_required += 1
            else:
                unverified_rule_ids.append(rule_id)
                evidence_gaps.append(f"{rule_id}: marked pass without verified evidence")
            continue
        if result["status"] == "not_applicable":
            rationale = result.get("notes", "").strip()
            if not rationale:
                findings.append(
                    _finding(
                        finding_id=f"F-{len(findings) + 1:03d}",
                        rule_id=rule_id,
                        severity="medium",
                        finding="Mandatory rule marked not applicable without rationale",
                        why="Conformance scope cannot silently omit mandatory invariants.",
                        evidence=result_evidence_ids,
                        fix="Provide a bounded scope rationale or evaluate the rule.",
                        confirmed=True,
                    )
                )
            else:
                evidence_gaps.append(f"{rule_id}: not applicable — {rationale}")
            continue
        if result["status"] == "fail":
            findings.append(
                _finding(
                    finding_id=f"F-{len(findings) + 1:03d}",
                    rule_id=rule_id,
                    severity=rule["severity_if_violated"],
                    finding=result.get("notes") or f"Failed rule: {rule['statement']}",
                    why=rule["statement"],
                    evidence=result_evidence_ids,
                    fix=rule["validation"],
                    confirmed=True,
                )
            )

    passed_test_ids: list[str] = []
    unverified_test_ids: list[str] = []
    verified_tests = 0
    for test_id in sorted(required_test_ids):
        test = all_tests[test_id]
        result = test_results.get(test_id)
        if not result or result["status"] == "unverified":
            unverified_test_ids.append(test_id)
            evidence_gaps.append(f"{test_id}: no verified acceptance-test result")
            continue
        result_evidence_ids = result.get("evidence_ids", [])
        unknown_evidence = sorted(set(result_evidence_ids) - set(evidence))
        if unknown_evidence:
            raise ValueError(f"{test_id} references unknown evidence IDs: {', '.join(unknown_evidence)}")
        verified_evidence = [
            evidence_id
            for evidence_id in result_evidence_ids
            if evidence[evidence_id].get("status", "verified") == "verified"
        ]
        if result["status"] == "pass" and verified_evidence:
            passed_test_ids.append(test_id)
            verified_tests += 1
        elif result["status"] == "pass":
            unverified_test_ids.append(test_id)
            evidence_gaps.append(f"{test_id}: marked pass without verified evidence")
        elif result["status"] == "fail":
            findings.append(
                _finding(
                    finding_id=f"F-{len(findings) + 1:03d}",
                    rule_id=test_id,
                    severity="high",
                    finding=result.get("notes") or f"Failed acceptance test: {test['assertion']}",
                    why="A claimed conformance class requires this observable behavior.",
                    evidence=result_evidence_ids,
                    fix="Implement the required behavior and attach a passing test result with observed evidence.",
                    confirmed=True,
                )
            )
        elif result["status"] == "not_applicable" and not result.get("notes", "").strip():
            findings.append(
                _finding(
                    finding_id=f"F-{len(findings) + 1:03d}",
                    rule_id=test_id,
                    severity="medium",
                    finding="Required acceptance test marked not applicable without rationale",
                    why="Observable conformance cannot be skipped silently.",
                    evidence=result_evidence_ids,
                    fix="Provide a scope rationale or execute the test.",
                    confirmed=True,
                )
            )

    static_result = None
    if repository_root:
        static_result = static_scan(repository_root)
        for diagnostic in static_result["diagnostics"]:
            diagnostic = dict(diagnostic)
            diagnostic["id"] = f"F-{len(findings) + 1:03d}"
            findings.append(diagnostic)

    required_total = len(required_rule_ids) + len(required_test_ids)
    verified_total = verified_required + verified_tests
    coverage = 1.0 if required_total == 0 else verified_total / required_total
    confirmed_findings = [item for item in findings if item["confirmed"]]
    confirmed_max = max((SEVERITY_ORDER[item["severity"]] for item in confirmed_findings), default=0)
    signal_findings = [item for item in findings if not item["confirmed"]]

    if confirmed_max >= SEVERITY_ORDER["high"]:
        verdict = "not_conformant"
    elif coverage < 0.8 or unverified_rule_ids or unverified_test_ids:
        verdict = "insufficient_evidence"
    elif confirmed_findings or signal_findings:
        verdict = "conformant_with_conditions"
    else:
        verdict = "conformant"

    severity_counts = Counter(item["severity"] for item in findings)
    summary = (
        f"{verdict.replace('_', ' ').title()}: {verified_total}/{required_total} required checks have verified evidence; "
        f"{len(confirmed_findings)} confirmed finding(s), {len(signal_findings)} static signal(s), "
        f"and {len(evidence_gaps)} evidence gap(s)."
    )
    evidence_reviewed = [item.get("location", item["id"]) for item in evidence.values()]
    if repository_root:
        evidence_reviewed.append(f"static_scan:{static_result['root']}")
    return {
        "foundation_version": foundation["artifact"]["version"],
        "subject": {
            "name": subject["name"],
            "version_or_revision": subject["version_or_revision"],
            "evidence_reviewed": evidence_reviewed,
        },
        "claimed_conformance_classes": claimed_classes,
        "verdict": verdict,
        "summary": summary,
        "coverage": {
            "required_rule_count": len(required_rule_ids),
            "required_test_count": len(required_test_ids),
            "verified_rule_count": verified_required,
            "verified_test_count": verified_tests,
            "fraction": round(coverage, 4),
        },
        "finding_counts": dict(sorted(severity_counts.items(), key=lambda item: -SEVERITY_ORDER[item[0]])),
        "findings": findings,
        "passed_rule_ids": sorted(passed_rule_ids),
        "passed_acceptance_test_ids": sorted(passed_test_ids),
        "unverified_rule_ids": sorted(unverified_rule_ids),
        "unverified_acceptance_test_ids": sorted(unverified_test_ids),
        "evidence_gaps": evidence_gaps,
        "static_scan": static_result,
        "recommended_next_checkpoint": manifest.get("current_checkpoint"),
    }


def should_fail(report: dict[str, Any], threshold: str) -> bool:
    threshold_value = SEVERITY_ORDER[threshold]
    return any(
        item.get("confirmed") and SEVERITY_ORDER[item["severity"]] >= threshold_value
        for item in report["findings"]
    )
