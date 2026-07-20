# Knowledge graph and retrieval model

## Why a graph is useful

The foundation is already valid, complete JSON. A graph is not needed to store truth; it is useful to retrieve the smallest connected context an AI or tool needs for a decision.

For example, a request about cinematic performance can begin at `PRESET:cinematic`, traverse `configures` to the three user controls, traverse back to `P58`, and then reach grounded rules and source sections. The agent receives relevant meaning and provenance without loading the full book for every question.

## Efficiency and effectiveness

The two generated files divide the work:

- `spatial-knowledge-graph.json` preserves typed concepts, source pointers, and semantic edges.
- `spatial-retrieval-index.json` precomputes exact IDs, normalized terms, types, tags, and adjacency offsets.

Exact lookup and adjacency access are constant-time dictionary operations. Search intersects a small inverted index rather than scanning the 342 KB foundation. Neighborhood and path operations remain bounded by explicit depth and result limits.

Effectiveness comes from retaining typed relationships instead of returning isolated keyword hits. Every derived node points back to its principle or source section when one exists. The graph never silently overwrites canonical content.

## Node families

The projection includes the artifact, foundation layers, principles, source sections, normative rules, rule/test categories, domain entities, ownership planes, conformance classes, acceptance tests, evaluation scenarios, runtime controls, performance presets, build checkpoints, tags, and research references.

Common predicates include `grounded_in`, `explained_by`, `requires_principle`, `requires_rule`, `configures`, `validates_category`, `can_belong_to`, `precedes`, and `supports`.

## Query forms

```bash
# Ranked concept search
python3 scripts/query_graph.py search "transaction recovery"

# Exact node and outgoing structure
python3 scripts/query_graph.py neighbors CLASS:agentic_spatial --direction out --depth 1

# Restrict a traversal to named relationships
python3 scripts/query_graph.py neighbors P58 --predicate defines --depth 1

# Explain how two concepts connect
python3 scripts/query_graph.py path PRESET:cinematic CONTROL:loading_horizon
```

Filters are available with `search --type normative_rule` and `search --tag performance`.

## Determinism and integrity

`scripts/build_knowledge_graph.py` regenerates both files from the AI foundation. The output has no timestamp and is sorted deterministically. CI rebuilds the projection and fails if the committed output differs, preventing a stale retrieval layer.

Use a graph database later only if this becomes a live, shared, mutable graph; federates many foundation versions; or grows enough that local JSON startup and traversal are measured bottlenecks. Until measurement proves that need, a server would add latency and operational surface without improving the result.
