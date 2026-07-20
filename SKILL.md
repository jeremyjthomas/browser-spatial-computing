---
name: browser-spatial-computing
description: Use this repository to explain, research, design, build, resume, or evaluate browser-native spatial working environments. Trigger for spatial UI, 2.5D browser workspaces, depth and focus systems, grouped frames, spaces and sessions, DOM-first 3D, spatial AI collaboration, runtime capacity, accessibility projections, or conformance reviews.
metadata:
  version: "1.0.0"
  scope: repository
  foundation_version: "3.1-ai.1"
  outputs:
    - evidence-backed explanation
    - implementation guidance
    - conformance evaluation
    - resumable build state
---

# Browser Spatial Computing

## Purpose

Use the repository as a reasoning and implementation system, not as a visual-effects cookbook. The goal is a browser-native information world whose spatial projection improves context, relationships, collaboration, and recovery while remaining fast, accessible, and understandable without depth.

## Select a task mode

Choose one mode before loading context.

| Mode | Goal | Minimum sources |
|---|---|---|
| Explain | Answer a conceptual question with stable terminology | Graph search, relevant principles, canonical node |
| Research | Compare a claim with the framework and cited lineage | Relevant principle sections and reference nodes |
| Design | Define model, interaction, projection, and visual behavior | Foundation layers A–C, `DESIGN.md` |
| Build | Implement a bounded vertical slice | Foundation contracts, architecture, checkpoints, acceptance tests |
| Resume | Continue prior work without reconstructing state | Build-state JSON, current checkpoint, changed IDs, evidence |
| Evaluate | Diagnose an implementation and its proof gaps | Manifest schema, evaluator guide, claimed classes, source scan |

Do not mix modes silently. A request to review or explain does not authorize implementation or publication.

## Retrieval protocol

Begin with the compact graph.

```bash
python3 scripts/query_graph.py search "<concept>" --limit 10
python3 scripts/query_graph.py neighbors <NODE_ID> --depth 1
python3 scripts/query_graph.py path <SOURCE_ID> <TARGET_ID>
```

Then:

1. Prefer exact stable IDs when known: `P58`, `RUNTIME-008`, `ENTITY:placement`, `CLASS:core_spatial`, or `PRESET:balanced`.
2. Expand only one or two hops unless the task requires a broader system map.
3. Use node types and tags to narrow noisy results.
4. Follow `source_refs` before quoting, interpreting, changing, or evaluating a rule.
5. Load the full AI foundation only for cross-cutting builds, audits, migrations, or version changes.

The graph is a generated retrieval projection. It is never the source to edit.

## Core reasoning sequence

For any proposed spatial behavior, answer in order:

1. **Truth:** What canonical object or relationship exists independently of presentation?
2. **Appearance:** Is this an object, placement, frame, group, space, or session?
3. **Ownership:** Is the state canonical, shared-session, personal-view, or ephemeral-interaction?
4. **Meaning:** What state does position, containment, depth, color, or motion encode?
5. **Focus:** Which context, camera, work, input, and shared-attention states change?
6. **Authority:** Is the action view-local, shared-arrangement, canonical-content, or external?
7. **Recovery:** How do cancel, undo, interruption, refresh, disconnect, and return behave?
8. **Projection:** What are the spatial, flat, reduced-motion, narrow, and assistive-technology equivalents?
9. **Runtime:** What renders, loads, settles, virtualizes, and stops?
10. **Evidence:** Which rule IDs and acceptance tests prove the outcome?

If these answers are not explicit, the design is not ready to implement.

## Build protocol

Use the checkpoint sequence in `foundation/spatial-environments-ai-foundation-v3.1.json`:

1. Scope and baseline.
2. Canonical and session models.
3. Transactions and persistence.
4. DOM-first flat projection.
5. Spatial projection and focus.
6. Frames, lens, and responsive projections.
7. AI, collaboration, and runtime capacity.
8. Conformance and release evidence.

Start with one reference session that exercises grouping, occupied focus stops, a tethered detail, frame lifecycle, flat mode, AI proposal/commit/undo, and the three performance controls. Do not build an unconstrained platform before that slice proves the model.

The default implementation path is semantic DOM + CSS transforms + the Web Animations API. Use SVG or Canvas for relationship volume and atmosphere. Dynamically import Three.js only for genuine volumetric content. GSAP may coordinate motion, but it must not own state or become required for correctness.

## Evaluation protocol

Use `schemas/implementation-manifest.schema.json` and run:

```bash
python3 scripts/evaluate_principles.py implementation-manifest.json \
  --repo path/to/implementation \
  --output evaluation-report.json
```

Evaluation rules:

- A pass counts only when it references verified evidence.
- Missing required results are evidence gaps, not implied failures or passes.
- Declared failures are confirmed findings.
- Static source diagnostics are conservative signals and never proof.
- Conformance claims must name their class and cover its required rules and acceptance tests.
- Severity and confidence are different dimensions; preserve both.

## Foundation maintenance

When changing the framework itself:

1. Name every affected stable ID.
2. Keep the AI foundation and human principles semantically aligned.
3. Update conformance tests and schemas when the observable contract changes.
4. Rebuild the graph and index with `scripts/build_knowledge_graph.py`.
5. Run the complete test suite.
6. Record compatibility or migration consequences instead of silently reusing an old ID for new meaning.

## Output contract

Return the smallest useful artifact for the mode, plus:

- foundation version;
- relevant principle, rule, entity, class, test, preset, and checkpoint IDs;
- evidence used and gaps remaining;
- assumptions clearly marked as assumptions;
- spatial and flat/accessibility consequences;
- runtime and capacity consequences;
- recovery or rollback behavior;
- next checkpoint only when work genuinely remains.

Never claim a build, test, public state, or conformance result that was not observed.
