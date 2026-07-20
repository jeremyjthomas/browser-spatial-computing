from __future__ import annotations

import json
import re
from collections import Counter, defaultdict, deque
from pathlib import Path
from typing import Any, Iterable


TOKEN_RE = re.compile(r"[a-z0-9][a-z0-9_+.-]*")
STOP_WORDS = {
    "a",
    "an",
    "and",
    "are",
    "as",
    "at",
    "be",
    "by",
    "for",
    "from",
    "in",
    "is",
    "it",
    "of",
    "on",
    "or",
    "that",
    "the",
    "this",
    "to",
    "with",
}


def tokenize(value: str) -> list[str]:
    tokens: list[str] = []
    for token in TOKEN_RE.findall(value.lower()):
        candidates = [token, *re.split(r"[._+-]+", token)]
        tokens.extend(candidate for candidate in candidates if candidate and candidate not in STOP_WORDS)
    return tokens


def load_json(path: str | Path) -> dict[str, Any]:
    return json.loads(Path(path).read_text(encoding="utf-8"))


class GraphBuilder:
    def __init__(self) -> None:
        self.nodes: dict[str, dict[str, Any]] = {}
        self.edges: list[dict[str, Any]] = []
        self._edge_keys: set[tuple[str, str, str]] = set()

    def add_node(
        self,
        node_id: str,
        node_type: str,
        label: str,
        *,
        summary: str = "",
        tags: Iterable[str] = (),
        source_refs: Iterable[str] = (),
        data: dict[str, Any] | None = None,
    ) -> None:
        candidate = {
            "id": node_id,
            "type": node_type,
            "label": label,
            "summary": summary,
            "tags": sorted(set(tags)),
            "source_refs": sorted(set(source_refs)),
        }
        if data:
            candidate["data"] = data
        existing = self.nodes.get(node_id)
        if existing and existing != candidate:
            raise ValueError(f"Conflicting node definition: {node_id}")
        self.nodes[node_id] = candidate

    def add_edge(
        self,
        source: str,
        predicate: str,
        target: str,
        *,
        weight: float = 1.0,
        source_refs: Iterable[str] = (),
    ) -> None:
        key = (source, predicate, target)
        if key in self._edge_keys:
            return
        self._edge_keys.add(key)
        self.edges.append(
            {
                "id": f"E{len(self.edges) + 1:05d}",
                "source": source,
                "predicate": predicate,
                "target": target,
                "weight": weight,
                "source_refs": sorted(set(source_refs)),
            }
        )

    def validate(self) -> None:
        missing: list[str] = []
        for edge in self.edges:
            if edge["source"] not in self.nodes:
                missing.append(f"{edge['id']}:source:{edge['source']}")
            if edge["target"] not in self.nodes:
                missing.append(f"{edge['id']}:target:{edge['target']}")
        if missing:
            raise ValueError("Edges reference missing nodes: " + ", ".join(missing[:20]))

    def export(self, metadata: dict[str, Any]) -> dict[str, Any]:
        self.validate()
        nodes = sorted(self.nodes.values(), key=lambda item: item["id"])
        edges = sorted(self.edges, key=lambda item: item["id"])
        return {
            "format": "into.spatial.knowledge-graph",
            "version": "1.0.0",
            "metadata": {
                **metadata,
                "node_count": len(nodes),
                "edge_count": len(edges),
                "node_types": dict(sorted(Counter(node["type"] for node in nodes).items())),
                "edge_types": dict(sorted(Counter(edge["predicate"] for edge in edges).items())),
            },
            "nodes": nodes,
            "edges": edges,
        }


def _category_id(value: str) -> str:
    return f"CATEGORY:{value}"


def _tag_id(value: str) -> str:
    return f"TAG:{value}"


def build_graph(foundation: dict[str, Any]) -> dict[str, Any]:
    builder = GraphBuilder()
    artifact = foundation["artifact"]
    artifact_id = "ARTIFACT:FOUNDATION"
    builder.add_node(
        artifact_id,
        "artifact",
        artifact["title"],
        summary=foundation["scope"]["purpose"],
        tags=["foundation", "browser", "spatial_computing", "ai_first"],
        data={"version": artifact["version"], "source_version": artifact["source_version"]},
    )

    for layer in foundation["foundation_layers"]:
        node_id = layer["id"]
        builder.add_node(
            node_id,
            "foundation_layer",
            layer["name"],
            summary=layer["purpose"],
            tags=["foundation_layer"],
            data={"examples": layer["examples"]},
        )
        builder.add_edge(artifact_id, "contains", node_id)

    section_by_id = {section["id"]: section for section in foundation["source_book"]["sections"]}
    for section in foundation["source_book"]["sections"]:
        node_id = f"SECTION:{section['id']}"
        builder.add_node(
            node_id,
            "source_section",
            section["title"],
            summary="Source-book section",
            tags=section.get("tags", []),
            source_refs=[section["id"]],
            data={
                "logical_id": section["id"],
                "level": section["level"],
                "line_start": section["line_start"],
                "line_end": section["line_end"],
            },
        )
        builder.add_edge(artifact_id, "contains_source_section", node_id, source_refs=[section["id"]])
        if section.get("parent_id"):
            builder.add_edge(
                f"SECTION:{section['parent_id']}",
                "parent_of",
                node_id,
                source_refs=[section["id"]],
            )

    for principle in foundation["source_book"]["principle_index"]:
        node_id = principle["id"]
        builder.add_node(
            node_id,
            "principle",
            principle["title"],
            summary=principle["abstract"],
            tags=principle["tags"],
            source_refs=[principle["source_section_id"]],
            data={"number": principle["number"]},
        )
        builder.add_edge(artifact_id, "contains_principle", node_id)
        builder.add_edge(node_id, "explained_by", f"SECTION:{principle['source_section_id']}")
        for tag in principle["tags"]:
            tag_id = _tag_id(tag)
            builder.add_node(tag_id, "tag", tag, tags=[tag])
            builder.add_edge(node_id, "tagged_with", tag_id)

    for rule in foundation["normative_rule_registry"]:
        node_id = rule["id"]
        builder.add_node(
            node_id,
            "normative_rule",
            rule["statement"],
            summary=rule["validation"],
            tags=[rule["category"], rule["level"].lower(), rule["severity_if_violated"]],
            source_refs=rule["source_principle_ids"],
            data={
                "level": rule["level"],
                "category": rule["category"],
                "severity_if_violated": rule["severity_if_violated"],
                "validation": rule["validation"],
            },
        )
        builder.add_edge(artifact_id, "contains_rule", node_id)
        category_id = _category_id(rule["category"])
        builder.add_node(category_id, "rule_category", rule["category"], tags=[rule["category"]])
        builder.add_edge(node_id, "categorized_as", category_id)
        for source_id in rule["source_principle_ids"]:
            target_id = source_id if source_id in builder.nodes else f"SECTION:{source_id}"
            if target_id in builder.nodes:
                builder.add_edge(node_id, "grounded_in", target_id, source_refs=[source_id])

    for plane_id, plane in foundation["domain_model"]["ownership_planes"].items():
        node_id = f"PLANE:{plane_id}"
        builder.add_node(
            node_id,
            "ownership_plane",
            plane_id,
            summary=f"{plane['persistence']} — {plane['authority']}",
            tags=["state_ownership", plane_id],
            data=plane,
        )
        builder.add_edge("P30", "defines", node_id)

    entity_plane_hints = {
        "object": ["canonical_truth"],
        "link": ["canonical_truth"],
        "session": ["shared_session"],
        "space": ["shared_session"],
        "group": ["shared_session", "personal_view"],
        "placement": ["shared_session", "personal_view"],
        "portal": ["shared_session"],
        "frame": ["personal_view"],
        "lens": ["personal_view"],
        "plane": ["ephemeral_interaction"],
        "proposal": ["ephemeral_interaction", "shared_session"],
        "actor": ["shared_session"],
        "environment": ["canonical_truth"],
    }
    for entity_id, entity in foundation["domain_model"]["entities"].items():
        node_id = f"ENTITY:{entity_id}"
        builder.add_node(
            node_id,
            "domain_entity",
            entity_id,
            summary="; ".join(entity.get("invariants", [])),
            tags=["domain_model", entity_id],
            data=entity,
        )
        builder.add_edge("P29", "defines", node_id)
        for plane_id in entity_plane_hints.get(entity_id, []):
            builder.add_edge(node_id, "can_belong_to", f"PLANE:{plane_id}")

    for class_id, conformance_class in foundation["conformance"]["classes"].items():
        node_id = f"CLASS:{class_id}"
        builder.add_node(
            node_id,
            "conformance_class",
            class_id,
            summary=conformance_class["description"],
            tags=["conformance", class_id],
        )
        builder.add_edge(artifact_id, "defines_conformance_class", node_id)
        for principle_id in conformance_class["required_principles"]:
            builder.add_edge(node_id, "requires_principle", principle_id)
        for rule in foundation["normative_rule_registry"]:
            if set(rule["source_principle_ids"]) & set(conformance_class["required_principles"]):
                builder.add_edge(node_id, "requires_rule", rule["id"], weight=0.9)

    for test in foundation["conformance"]["acceptance_tests"]:
        node_id = test["id"]
        builder.add_node(
            node_id,
            "acceptance_test",
            test["assertion"],
            summary="Required evidence: " + ", ".join(test["evidence_required"]),
            tags=["acceptance_test", test["category"]],
            source_refs=[test["source_section_id"]],
            data={"category": test["category"]},
        )
        category_id = _category_id(test["category"])
        builder.add_node(category_id, "rule_category", test["category"], tags=[test["category"]])
        builder.add_edge(node_id, "validates_category", category_id)
        builder.add_edge(node_id, "specified_by", f"SECTION:{test['source_section_id']}")

    for scenario in foundation["conformance"]["evaluation_scenarios"]:
        node_id = scenario["id"]
        tags = ["evaluation", *tokenize(scenario["task"])]
        builder.add_node(
            node_id,
            "evaluation_scenario",
            scenario["task"],
            summary="Compare spatial and flat projections.",
            tags=tags,
            data={"record": scenario["record"]},
        )
        builder.add_edge("P70", "defines", node_id)

    controls = foundation["browser_runtime_contract"]["performance"]["controls"]
    for control in controls:
        node_id = f"CONTROL:{control['id']}"
        builder.add_node(
            node_id,
            "performance_control",
            control["id"],
            summary=control["meaning"],
            tags=["performance", "user_control", control["id"]],
            data=control,
        )
        builder.add_edge("P58", "defines", node_id)
    for preset_id, preset in foundation["browser_runtime_contract"]["performance"]["presets"].items():
        node_id = f"PRESET:{preset_id}"
        builder.add_node(
            node_id,
            "performance_preset",
            preset_id,
            summary="; ".join(preset["notes"]),
            tags=["performance", "preset", preset_id],
            data={key: value for key, value in preset.items() if key != "notes"},
        )
        builder.add_edge("P58", "defines", node_id)
        for control in controls:
            builder.add_edge(node_id, "configures", f"CONTROL:{control['id']}")

    previous_checkpoint: str | None = None
    for checkpoint in foundation["build_contract"]["checkpoints"]:
        node_id = checkpoint["id"]
        builder.add_node(
            node_id,
            "build_checkpoint",
            checkpoint["name"],
            summary="Exit: " + "; ".join(checkpoint["exit"]),
            tags=["build", "checkpoint"],
            data={"deliverables": checkpoint["deliverables"], "exit": checkpoint["exit"]},
        )
        builder.add_edge(artifact_id, "defines_checkpoint", node_id)
        if previous_checkpoint:
            builder.add_edge(previous_checkpoint, "precedes", node_id)
        previous_checkpoint = node_id

    for reference in foundation["reference_index"]:
        node_id = reference["id"]
        builder.add_node(
            node_id,
            "reference",
            reference["label"],
            summary=reference["url"],
            tags=["research_reference"],
            source_refs=reference["source_section_ids"],
            data={"url": reference["url"]},
        )
        for section_id in reference["source_section_ids"]:
            if section_id in section_by_id:
                builder.add_edge(node_id, "supports", f"SECTION:{section_id}")

    metadata = {
        "foundation_artifact_id": artifact["id"],
        "foundation_version": artifact["version"],
        "foundation_source_sha256": artifact["integrity"]["source_sha256"],
        "purpose": "Compact navigable projection of the AI foundation for exact lookup, concept search, neighborhood traversal, and path discovery.",
    }
    return builder.export(metadata)


def build_retrieval_index(graph: dict[str, Any]) -> dict[str, Any]:
    exact_id: dict[str, int] = {}
    terms: defaultdict[str, set[str]] = defaultdict(set)
    tags: defaultdict[str, set[str]] = defaultdict(set)
    types: defaultdict[str, list[str]] = defaultdict(list)
    outgoing: defaultdict[str, list[int]] = defaultdict(list)
    incoming: defaultdict[str, list[int]] = defaultdict(list)

    for offset, node in enumerate(graph["nodes"]):
        node_id = node["id"]
        exact_id[node_id.lower()] = offset
        types[node["type"]].append(node_id)
        for tag in node.get("tags", []):
            tags[tag.lower()].add(node_id)
        searchable = " ".join(
            [node_id, node["label"], node.get("summary", ""), " ".join(node.get("tags", []))]
        )
        for term in set(tokenize(searchable)):
            terms[term].add(node_id)

    for offset, edge in enumerate(graph["edges"]):
        outgoing[edge["source"]].append(offset)
        incoming[edge["target"]].append(offset)

    return {
        "format": "into.spatial.retrieval-index",
        "version": "1.0.0",
        "graph_version": graph["version"],
        "node_count": len(graph["nodes"]),
        "edge_count": len(graph["edges"]),
        "exact_id": exact_id,
        "terms": {key: sorted(value) for key, value in sorted(terms.items())},
        "tags": {key: sorted(value) for key, value in sorted(tags.items())},
        "types": {key: sorted(value) for key, value in sorted(types.items())},
        "outgoing": {key: value for key, value in sorted(outgoing.items())},
        "incoming": {key: value for key, value in sorted(incoming.items())},
    }


class KnowledgeGraph:
    def __init__(self, graph: dict[str, Any], index: dict[str, Any]) -> None:
        self.graph = graph
        self.index = index
        self.nodes = {node["id"]: node for node in graph["nodes"]}
        self.edges = graph["edges"]

    @classmethod
    def from_paths(cls, graph_path: str | Path, index_path: str | Path) -> "KnowledgeGraph":
        return cls(load_json(graph_path), load_json(index_path))

    def search(
        self,
        query: str,
        *,
        node_type: str | None = None,
        tag: str | None = None,
        limit: int = 20,
    ) -> list[dict[str, Any]]:
        normalized = query.strip().lower()
        scores: Counter[str] = Counter()
        exact_offset = self.index["exact_id"].get(normalized)
        if exact_offset is not None:
            scores[self.graph["nodes"][exact_offset]["id"]] += 1000
        query_tokens = tokenize(normalized)
        for token in query_tokens:
            for node_id in self.index["terms"].get(token, []):
                scores[node_id] += 25
        for node in self.graph["nodes"]:
            label = node["label"].lower()
            if normalized and normalized in label:
                scores[node["id"]] += 80
            if normalized and node["id"].lower().startswith(normalized):
                scores[node["id"]] += 60
        if node_type:
            allowed = set(self.index["types"].get(node_type, []))
            scores = Counter({node_id: score for node_id, score in scores.items() if node_id in allowed})
        if tag:
            allowed = set(self.index["tags"].get(tag.lower(), []))
            scores = Counter({node_id: score for node_id, score in scores.items() if node_id in allowed})
        results = []
        for node_id, score in sorted(scores.items(), key=lambda item: (-item[1], item[0]))[:limit]:
            results.append({"score": score, "node": self.nodes[node_id]})
        return results

    def neighbors(
        self,
        node_id: str,
        *,
        depth: int = 1,
        predicates: set[str] | None = None,
        direction: str = "both",
        limit: int = 200,
    ) -> dict[str, Any]:
        if node_id not in self.nodes:
            raise KeyError(node_id)
        queue = deque([(node_id, 0)])
        seen = {node_id}
        edge_ids: set[int] = set()
        while queue and len(seen) < limit:
            current, current_depth = queue.popleft()
            if current_depth >= depth:
                continue
            offsets: list[int] = []
            if direction in {"out", "both"}:
                offsets.extend(self.index["outgoing"].get(current, []))
            if direction in {"in", "both"}:
                offsets.extend(self.index["incoming"].get(current, []))
            for offset in offsets:
                edge = self.edges[offset]
                if predicates and edge["predicate"] not in predicates:
                    continue
                edge_ids.add(offset)
                neighbor = edge["target"] if edge["source"] == current else edge["source"]
                if neighbor not in seen:
                    seen.add(neighbor)
                    queue.append((neighbor, current_depth + 1))
        return {
            "root": node_id,
            "depth": depth,
            "nodes": [self.nodes[value] for value in sorted(seen)],
            "edges": [self.edges[offset] for offset in sorted(edge_ids)],
        }

    def shortest_path(
        self,
        source: str,
        target: str,
        *,
        predicates: set[str] | None = None,
        max_depth: int = 8,
    ) -> dict[str, Any] | None:
        if source not in self.nodes or target not in self.nodes:
            missing = source if source not in self.nodes else target
            raise KeyError(missing)
        queue = deque([(source, [])])
        seen = {source}
        while queue:
            current, path = queue.popleft()
            if len(path) >= max_depth:
                continue
            offsets = self.index["outgoing"].get(current, []) + self.index["incoming"].get(current, [])
            for offset in offsets:
                edge = self.edges[offset]
                if predicates and edge["predicate"] not in predicates:
                    continue
                neighbor = edge["target"] if edge["source"] == current else edge["source"]
                step = {
                    "edge": edge,
                    "from": current,
                    "to": neighbor,
                    "traversal": "forward" if edge["source"] == current else "reverse",
                }
                if neighbor == target:
                    steps = path + [step]
                    return {
                        "source": source,
                        "target": target,
                        "length": len(steps),
                        "steps": steps,
                    }
                if neighbor not in seen:
                    seen.add(neighbor)
                    queue.append((neighbor, path + [step]))
        return None


def write_graph_artifacts(
    foundation_path: str | Path,
    graph_path: str | Path,
    index_path: str | Path,
) -> tuple[dict[str, Any], dict[str, Any]]:
    foundation = load_json(foundation_path)
    graph = build_graph(foundation)
    index = build_retrieval_index(graph)
    Path(graph_path).write_text(json.dumps(graph, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    Path(index_path).write_text(json.dumps(index, ensure_ascii=False, separators=(",", ":")) + "\n", encoding="utf-8")
    return graph, index
