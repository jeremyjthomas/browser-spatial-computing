# Repository instructions for AI agents

## Mission

This repository is the reference foundation for browser-native spatial computing on ordinary displays. Help people understand, evaluate, or build spatial working environments without turning depth into decoration, duplicating information truth, or requiring a permanent GPU render loop.

The information model is primary. The room is one projection of that model.

## Read in this order

Load only the context needed for the task.

1. Read this file for repository rules.
2. Read `SKILL.md` for the tool-neutral task and retrieval workflow.
3. Query `knowledge/spatial-knowledge-graph.json` through `scripts/query_graph.py` before loading the entire foundation.
4. Follow graph `source_refs` into `foundation/spatial-environments-ai-foundation-v3.1.json` for machine-readable requirements.
5. Read the relevant section of `docs/principles.md` when judgment or rationale matters.
6. For UI, visual, motion, layout, component, or accessibility work, read `DESIGN.md` before editing.
7. For runtime boundaries, read `docs/architecture.md`; for reviews, read `docs/evaluator.md`.

Do not load every large artifact by default. Exact lookup, concept search, and one- or two-hop neighborhoods are the normal first move.

## Authority and generated files

Use this authority order:

1. The current human request and explicitly approved decisions.
2. The AI foundation's normative rules, domain model, contracts, and conformance tests.
3. The human principles book's reasoning and judgment guidance.
4. `DESIGN.md` for the INTO visual profile and UI application rules.
5. Examples and generated retrieval artifacts.

The AI foundation and human principles are maintained as semantic twins. If they conflict, report the conflict; do not silently choose or invent a reconciliation.

Never edit these generated files directly:

- `knowledge/spatial-knowledge-graph.json`
- `knowledge/spatial-retrieval-index.json`
- `examples/evaluation-report.example.json`

Regenerate them with the repository scripts.

## Fast retrieval

```bash
python3 scripts/query_graph.py stats
python3 scripts/query_graph.py search "active frame capacity"
python3 scripts/query_graph.py neighbors P58 --depth 2
python3 scripts/query_graph.py path PRESET:cinematic CONTROL:active_frame_capacity
```

Search results are orientation, not authority. Before making a normative claim, inspect the returned node, its `source_refs`, and the canonical source.

## Non-negotiable model constraints

- Object truth, placements, frames, groups, spaces, sessions, focus, lens state, and transactions remain distinct.
- One object may have multiple placements without duplicating identity, provenance, history, or actions.
- Groups—not loose cards scattered through depth—are the normal unit of spatial movement.
- Depth encodes attention and interaction availability. It does not encode arbitrary hierarchy, time, or decoration.
- Camera focus, work selection, DOM input focus, context focus, and shared attention remain independently inspectable.
- Travel snaps to occupied focus stops. No stable state may leave all useful work out of focus.
- Lens controls remain camera-fixed and reachable; recessed or occluded world controls become inert.
- Personal view changes do not mutate canonical truth or shared topology.
- Consequential human or AI changes follow intent, preview, validation, authority, commit, announcement, record, and recovery.
- Flat and reduced-motion projections preserve entities, relationships, state, and actions.
- The core renderer is semantic DOM, CSS transforms, and event-driven JavaScript. Three.js and GSAP are optional adapters loaded only when earned.
- A settled environment returns to zero optional rendering work.

## Change workflow

For a foundation change:

1. Name the affected principle IDs, rule IDs, entities, conformance classes, and acceptance tests.
2. Update the human reasoning and AI contract together.
3. Preserve stable IDs unless the change is explicitly versioned as breaking.
4. Rebuild the graph and retrieval index.
5. Update schemas, examples, `DESIGN.md`, or agent guidance when their contracts changed.
6. Run all tests and inspect the generated diff.

For an implementation review:

1. Create or update an implementation manifest conforming to `schemas/implementation-manifest.schema.json`.
2. Attach verified evidence to every claimed pass.
3. Use static diagnostics as review signals, never as proof.
4. Report confirmed failures, evidence gaps, and unverified signals separately.

For a UI implementation:

1. Preserve semantic DOM and logical reading order.
2. Implement flat/reduced-motion behavior alongside spatial behavior.
3. Keep readable content at the focal representation.
4. Apply optics to isolated surfaces, not the preserved 3D world root.
5. Prove settlement, capacity, focus, restoration, and keyboard behavior on baseline hardware.

## Commands

The runtime tools have no mandatory third-party dependencies and support Python 3.10+.

```bash
# Build deterministic retrieval artifacts
python3 scripts/build_knowledge_graph.py

# Run the complete test suite (install validation extras first)
python3 -m pip install '.[validation]'
python3 -m unittest discover -s tests -v

# Evaluate an implementation
python3 scripts/evaluate_principles.py path/to/implementation-manifest.json \
  --repo path/to/web-app \
  --output evaluation-report.json \
  --fail-on high

# Validate these AI entry-point documents
python3 scripts/validate_agent_docs.py
```

## Definition of done

- The smallest correct source of truth was changed; generated artifacts were rebuilt rather than hand-edited.
- Relevant IDs and authority boundaries are explicit.
- Tests pass, schemas validate, and generated files are current.
- Spatial, flat, keyboard, reduced-motion, settlement, and restoration behavior are covered when relevant.
- No secrets, customer data, private transcripts, or unlicensed third-party material were introduced.
- Documentation lets another agent resume without reconstructing hidden reasoning.

## Repository safety

Do not publish, deploy, create releases, change repository visibility, or push unless the user has authorized that external action. Never interpret public visibility as an open-source license; this repository currently grants no general reuse license.
