from __future__ import annotations

import json
import sys
import tempfile
import unittest
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(REPO_ROOT / "src"))

from spatial_foundation.graph import (  # noqa: E402
    KnowledgeGraph,
    build_graph,
    build_retrieval_index,
    load_json,
    write_graph_artifacts,
)


FOUNDATION = REPO_ROOT / "foundation" / "spatial-environments-ai-foundation-v3.1.json"


class KnowledgeGraphTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.foundation = load_json(FOUNDATION)
        cls.graph = build_graph(cls.foundation)
        cls.index = build_retrieval_index(cls.graph)
        cls.knowledge = KnowledgeGraph(cls.graph, cls.index)

    def test_graph_has_unique_resolvable_nodes_and_edges(self) -> None:
        node_ids = [node["id"] for node in self.graph["nodes"]]
        self.assertEqual(len(node_ids), len(set(node_ids)))
        node_id_set = set(node_ids)
        for edge in self.graph["edges"]:
            self.assertIn(edge["source"], node_id_set)
            self.assertIn(edge["target"], node_id_set)
        self.assertEqual(self.graph["metadata"]["node_count"], len(node_ids))

    def test_exact_and_concept_search(self) -> None:
        self.assertEqual(self.knowledge.search("P58")[0]["node"]["id"], "P58")
        results = self.knowledge.search("active frame capacity")
        ids = {result["node"]["id"] for result in results}
        self.assertIn("CONTROL:active_frame_capacity", ids)

    def test_performance_neighborhood_and_path(self) -> None:
        neighborhood = self.knowledge.neighbors("P58", depth=1, direction="out")
        ids = {node["id"] for node in neighborhood["nodes"]}
        self.assertIn("PRESET:balanced", ids)
        self.assertIn("CONTROL:active_frame_capacity", ids)
        path = self.knowledge.shortest_path(
            "PRESET:cinematic", "CONTROL:active_frame_capacity", predicates={"configures"}
        )
        self.assertIsNotNone(path)
        self.assertEqual(path["length"], 1)

    def test_written_artifacts_round_trip(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            graph_path = Path(directory) / "graph.json"
            index_path = Path(directory) / "index.json"
            write_graph_artifacts(FOUNDATION, graph_path, index_path)
            knowledge = KnowledgeGraph.from_paths(graph_path, index_path)
            self.assertEqual(knowledge.graph["metadata"]["node_count"], len(knowledge.nodes))
            self.assertEqual(json.loads(index_path.read_text())["node_count"], len(knowledge.nodes))


if __name__ == "__main__":
    unittest.main()
