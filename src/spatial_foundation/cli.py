from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Any

from .evaluator import SEVERITY_ORDER, evaluate, load_json, should_fail
from .graph import KnowledgeGraph, write_graph_artifacts


REPO_ROOT = Path(__file__).resolve().parents[2]
DEFAULT_FOUNDATION = REPO_ROOT / "foundation" / "spatial-environments-ai-foundation-v3.1.json"
DEFAULT_GRAPH = REPO_ROOT / "knowledge" / "spatial-knowledge-graph.json"
DEFAULT_INDEX = REPO_ROOT / "knowledge" / "spatial-retrieval-index.json"


def _write_json(value: Any, output: str | Path | None = None) -> None:
    rendered = json.dumps(value, ensure_ascii=False, indent=2) + "\n"
    if output:
        Path(output).write_text(rendered, encoding="utf-8")
    else:
        sys.stdout.write(rendered)


def _load_graph(args: argparse.Namespace) -> KnowledgeGraph:
    return KnowledgeGraph.from_paths(args.graph, args.index)


def _build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="spatial-foundation",
        description="Build, query, and evaluate the Browser Spatial Computing foundation.",
    )
    subparsers = parser.add_subparsers(dest="command", required=True)

    build = subparsers.add_parser("build-graph", help="Regenerate the graph and retrieval index.")
    build.add_argument("--foundation", default=str(DEFAULT_FOUNDATION))
    build.add_argument("--graph", default=str(DEFAULT_GRAPH))
    build.add_argument("--index", default=str(DEFAULT_INDEX))

    stats = subparsers.add_parser("stats", help="Print graph metadata and index sizes.")
    stats.add_argument("--graph", default=str(DEFAULT_GRAPH))
    stats.add_argument("--index", default=str(DEFAULT_INDEX))

    search = subparsers.add_parser("search", help="Search IDs, concepts, tags, and summaries.")
    search.add_argument("query")
    search.add_argument("--graph", default=str(DEFAULT_GRAPH))
    search.add_argument("--index", default=str(DEFAULT_INDEX))
    search.add_argument("--type", dest="node_type")
    search.add_argument("--tag")
    search.add_argument("--limit", type=int, default=20)

    neighbors = subparsers.add_parser("neighbors", help="Traverse a node neighborhood.")
    neighbors.add_argument("node_id")
    neighbors.add_argument("--graph", default=str(DEFAULT_GRAPH))
    neighbors.add_argument("--index", default=str(DEFAULT_INDEX))
    neighbors.add_argument("--depth", type=int, default=1)
    neighbors.add_argument("--direction", choices=("in", "out", "both"), default="both")
    neighbors.add_argument("--predicate", action="append", default=[])
    neighbors.add_argument("--limit", type=int, default=200)

    path = subparsers.add_parser("path", help="Find the shortest semantic path between two nodes.")
    path.add_argument("source")
    path.add_argument("target")
    path.add_argument("--graph", default=str(DEFAULT_GRAPH))
    path.add_argument("--index", default=str(DEFAULT_INDEX))
    path.add_argument("--max-depth", type=int, default=8)
    path.add_argument("--predicate", action="append", default=[])

    evaluation = subparsers.add_parser("evaluate", help="Evaluate an implementation manifest.")
    evaluation.add_argument("manifest")
    evaluation.add_argument("--foundation", default=str(DEFAULT_FOUNDATION))
    evaluation.add_argument("--repo", help="Optional web source root for conservative static diagnostics.")
    evaluation.add_argument("--output")
    evaluation.add_argument(
        "--fail-on",
        choices=tuple(SEVERITY_ORDER),
        help="Exit 1 when a confirmed finding meets this severity. Static signals never fail CI.",
    )
    return parser


def main(argv: list[str] | None = None) -> int:
    parser = _build_parser()
    args = parser.parse_args(argv)
    try:
        if args.command == "build-graph":
            graph, index = write_graph_artifacts(args.foundation, args.graph, args.index)
            _write_json(
                {
                    "graph": str(Path(args.graph).resolve()),
                    "index": str(Path(args.index).resolve()),
                    "node_count": len(graph["nodes"]),
                    "edge_count": len(graph["edges"]),
                    "term_count": len(index["terms"]),
                }
            )
            return 0

        graph = _load_graph(args) if args.command in {"stats", "search", "neighbors", "path"} else None
        if args.command == "stats":
            assert graph is not None
            _write_json(
                {
                    **graph.graph["metadata"],
                    "indexed_term_count": len(graph.index["terms"]),
                    "indexed_tag_count": len(graph.index["tags"]),
                }
            )
        elif args.command == "search":
            assert graph is not None
            _write_json(
                {
                    "query": args.query,
                    "filters": {"type": args.node_type, "tag": args.tag},
                    "results": graph.search(
                        args.query, node_type=args.node_type, tag=args.tag, limit=args.limit
                    ),
                }
            )
        elif args.command == "neighbors":
            assert graph is not None
            _write_json(
                graph.neighbors(
                    args.node_id,
                    depth=args.depth,
                    predicates=set(args.predicate) or None,
                    direction=args.direction,
                    limit=args.limit,
                )
            )
        elif args.command == "path":
            assert graph is not None
            result = graph.shortest_path(
                args.source,
                args.target,
                predicates=set(args.predicate) or None,
                max_depth=args.max_depth,
            )
            _write_json(result or {"source": args.source, "target": args.target, "path": None})
        elif args.command == "evaluate":
            report = evaluate(
                load_json(args.foundation),
                load_json(args.manifest),
                repository_root=args.repo,
            )
            _write_json(report, args.output)
            if args.output:
                _write_json(
                    {
                        "output": str(Path(args.output).resolve()),
                        "verdict": report["verdict"],
                        "summary": report["summary"],
                    }
                )
            return 1 if args.fail_on and should_fail(report, args.fail_on) else 0
        return 0
    except (KeyError, ValueError, OSError, json.JSONDecodeError) as error:
        parser.exit(2, f"error: {error}\n")


if __name__ == "__main__":
    raise SystemExit(main())
