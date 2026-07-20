from __future__ import annotations

import json
import unittest
from pathlib import Path

import jsonschema


REPO_ROOT = Path(__file__).resolve().parents[1]


class SchemaTests(unittest.TestCase):
    def validate_pair(self, schema_path: str, instance_path: str) -> None:
        schema = json.loads((REPO_ROOT / schema_path).read_text(encoding="utf-8"))
        instance = json.loads((REPO_ROOT / instance_path).read_text(encoding="utf-8"))
        validator = jsonschema.validators.validator_for(schema)
        validator.check_schema(schema)
        validator(schema).validate(instance)

    def test_foundation(self) -> None:
        self.validate_pair(
            "foundation/spatial-environments-ai-foundation-v3.1.schema.json",
            "foundation/spatial-environments-ai-foundation-v3.1.json",
        )

    def test_knowledge_graph(self) -> None:
        self.validate_pair("schemas/knowledge-graph.schema.json", "knowledge/spatial-knowledge-graph.json")

    def test_retrieval_index(self) -> None:
        self.validate_pair("schemas/retrieval-index.schema.json", "knowledge/spatial-retrieval-index.json")

    def test_implementation_manifest(self) -> None:
        self.validate_pair(
            "schemas/implementation-manifest.schema.json",
            "examples/implementation-manifest.example.json",
        )

    def test_evaluation_report(self) -> None:
        self.validate_pair(
            "schemas/evaluation-report.schema.json",
            "examples/evaluation-report.example.json",
        )


if __name__ == "__main__":
    unittest.main()
