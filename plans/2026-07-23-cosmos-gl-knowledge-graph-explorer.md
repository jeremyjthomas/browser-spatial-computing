# Add an optional Cosmos GL knowledge-graph explorer

This ExecPlan is a living document. Keep `Progress`, `Surprises & Discoveries`,
`Decision Log`, `Outcomes & Retrospective`, and `Revision Notes` current as work
proceeds.

## Purpose / Observable Result

The repository already publishes a deterministic knowledge graph and compact
retrieval index, but a person must currently query them through JSON-producing
CLI commands. This change adds a local, browser-based reference explorer that
lets a person search the same index, inspect a node, follow its typed
relationships, and see the selected neighborhood through a Cosmos GL canvas.

The canvas is an optional projection, not a new source of truth. The canonical
foundation remains
`foundation/spatial-environments-ai-foundation-v3.1.json`; the committed graph
and index remain generated projections; the explorer imports both without
editing them. Opening the explorer first presents a semantic, keyboard-operable
DOM interface. Cosmos GL is dynamically imported only after the user chooses
`Open graph`. If WebGL initialization fails, the semantic relationship view
continues to support the complete inspection workflow.

## Completeness Standard

The result is complete when all of the following are true:

- A new contributor can install, run, test, and build the explorer from the
  repository documentation.
- Exact-ID and concept search use the committed retrieval index and match the
  Python `KnowledgeGraph.search` ranking contract for the supported query path.
- One selected node has a stable ID, an inspectable summary and provenance,
  typed incoming and outgoing relationships, and an equivalent keyboard path.
- Cosmos GL receives only an index-addressed projection made from typed arrays;
  no canvas coordinate or Cosmos object becomes persisted truth.
- The Cosmos dependency is absent from the initial application chunk and is
  requested only after explicit intent.
- Reduced motion uses zero-duration view changes and a deterministic static
  layout. Narrow viewports retain the same entities, relationship names, and
  selection actions in a coherent DOM projection.
- The optional renderer pauses after layout settlement and is destroyed when
  closed or when the page is disposed.
- Unit, integration, repository, build, dependency-audit, and rendered-browser
  checks pass with observed evidence.
- The plan, README, and explorer documentation identify the authority boundary,
  browser support boundary, recovery path, and known non-conformance claims.

## SMART Goals

1. By the end of this implementation run, add a locally runnable TypeScript
   reference explorer under `examples/cosmos-graph-explorer/` that loads the
   committed 551-node/1,607-edge projection, searches through the committed
   retrieval index, and lets a user inspect at least one one-hop neighborhood
   in both the Cosmos canvas and semantic DOM.
2. By the end of this implementation run, prove with automated tests that stable
   node IDs map bijectively to Cosmos point indices, every link endpoint
   resolves, concept-search ordering matches the Python contract on fixtures
   derived from the repository artifacts, and flat-mode selection exposes every
   selected relationship by predicate and direction.
3. By the end of this implementation run, prove with a production bundle report
   that `@cosmos.gl/graph` is split from the initial application chunk, and prove
   in a real browser that the explorer remains usable before opening the graph,
   after closing it, and at a narrow viewport. Prove reduced-motion and
   unavailable-WebGL behavior through the renderer/DOM test boundary when the
   connected browser cannot emulate those capabilities.
4. By the end of this implementation run, leave the repository with passing
   Python validation, passing explorer checks, a clean dependency audit for
   production dependencies, and updated instructions that another contributor
   can follow without reconstructing design decisions.

## Goal Readiness & Safety

- The user explicitly authorized adding the recommended Cosmos GL integration
  to Browser Spatial Computing.
- The repository checkout was clean and at the same commit as `origin/main`
  before changes began.
- The change is local only. This plan does not authorize commit, push, deploy,
  publication, release creation, or repository visibility changes.
- The knowledge artifacts contain public framework material rather than
  customer or private operational data.
- `@cosmos.gl/graph` is MIT licensed. This repository currently has no general
  reuse license, so the explorer will document its dependency without implying
  a license for the repository itself.
- The principal runtime risks are WebGL availability, GPU resource lifetime,
  a permanent render loop, initial-bundle growth, inaccessible canvas-only
  content, and accidental drift from the canonical retrieval semantics. Each
  has an explicit test or recovery path below.

## Agent Contract

This run uses one primary agent. No subagents are authorized or required. The
agent owns research, implementation, tests, documentation, rendered inspection,
and plan maintenance.

The agent may use local package installation, local HTTP servers, and browser
automation. It must not mutate generated knowledge artifacts directly, make
canonical foundation changes, commit, push, deploy, or perform external account
actions.

Evidence labels stay literal:

- `implemented` means source exists.
- `validated` means the named automated checks passed.
- `rendered` means a real browser was inspected.
- Nothing in this plan implies saved, pushed, deployed, published, or
  production-approved state.

## Progress

- [x] (2026-07-23) Read the ExecPlan and SMART-goal standards.
- [x] (2026-07-23) Verified the clean canonical checkout, repository authority
  rules, build protocol, UI profile, graph architecture, generated artifact
  shape, and existing tests.
- [x] (2026-07-23) Queried the graph for the governing runtime,
  relationship-layout, accessibility, responsive, keyboard, and settlement
  rules; followed them into the canonical foundation and human principles.
- [x] (2026-07-23) Reviewed Cosmos GL v3.3.0 source, API examples, initialization,
  typed-array input, interaction callbacks, simulation lifecycle, dynamic
  configuration, and `destroy()` behavior.
- [x] (2026-07-23) Scaffolded the optional explorer and pinned its dependencies.
- [x] (2026-07-23) Implemented the deterministic graph/index adapter and
  Python-parity search.
- [x] (2026-07-23) Implemented semantic DOM exploration and the intent-loaded Cosmos
  projection.
- [x] (2026-07-23) Added automated tests, production bundle checks, and
  WebGL-failure coverage.
- [x] (2026-07-23) Updated repository guidance, explorer documentation,
  changelog, CI, and ignore rules.
- [x] (2026-07-23) Ran repository validation, dependency audit, generated-file
  freshness, rendered desktop/narrow/keyboard/lifecycle checks, automated
  reduced-motion/no-WebGL checks, and final diff hygiene.

## Surprises & Discoveries

- Cosmos GL v3 initializes asynchronously. Calls made before initialization are
  queued, and `graph.ready` / `graph.isReady` expose readiness. The integration
  must not treat constructor return as proof that WebGL is usable.
- Cosmos GL v3.3 adds per-link solid, dashed, and dotted styles. These can pair a
  predicate family with a non-color cue, but the DOM relationship record remains
  the authoritative accessible representation.
- Cosmos automatically stops its internal rendering when no simulation,
  transition, resize, or interaction invalidation remains. The integration must
  still call `pause()` at layout settlement and `destroy()` on close.
- The repository graph has 551 nodes and 1,607 edges in one connected component.
  The raw position and link typed arrays are small enough for a full graph
  projection, while semantic DOM should remain scoped to search results and the
  selected node's local neighborhood.
- The repository has no JavaScript toolchain today. Keeping the toolchain inside
  an executable example preserves the dependency-free Python core and makes the
  optional nature of Cosmos explicit.
- The upstream package's own lock snapshot reported one moderate DOMPurify
  advisory through a permissive range. This repository must resolve a patched
  version and verify its own production dependency tree rather than inherit that
  snapshot as a conclusion.
- Cosmos 3.3.0 imports `gl-bench` by package name. Vite 8's Rolldown resolver
  selected that dependency's browser-global file, which has no ESM default
  export. Aliasing to `gl-bench`'s own declared module build fixed production
  compilation without patching or vendoring either dependency.
- A bounded automatic force run was less useful than the deterministic
  type-cluster layout: rendered inspection showed several seconds of poor
  orientation while points moved beyond the fitted camera. Disabling the force
  simulation produced an immediate, meaningful overview and a stronger
  zero-idle-work guarantee.
- `scalePointsOnZoom: true` made the fitted overview nearly invisible.
  Constant screen-space point sizes made the selected neighborhood legible
  while non-selected clusters remained subdued.
- Importing both JSON files as modules produced a 646 KB JavaScript entry.
  Emitting them as hashed same-origin data assets reduced the initial
  application entry to 17,511 bytes without changing total source data or
  adding an API.

## Decision Log

- Decision: Add an executable example at
  `examples/cosmos-graph-explorer/`, not a root runtime dependency.
  Rationale: the repository is a framework and reference implementation, and
  its included core tools intentionally require only Python.
  Date/Author: 2026-07-23 / Codex.

- Decision: Keep the complete semantic inspector available before, during, and
  after Cosmos initialization.
  Rationale: `RUNTIME-004`, `CONST-025`, and `P23` require graphics to have an
  equivalent DOM projection; WebGL failure must remove atmosphere, not
  information.
  Date/Author: 2026-07-23 / Codex.

- Decision: Use the committed retrieval index for exact and token candidates,
  while reproducing the Python label-substring and ID-prefix scoring in
  TypeScript.
  Rationale: this makes the existing deterministic retrieval projection the
  search authority and permits parity tests without introducing a server.
  Date/Author: 2026-07-23 / Codex.

- Decision: Use stable graph-array order as the sole ID-to-index mapping and
  expose adapter functions that can be tested without WebGL.
  Rationale: Cosmos consumes numeric typed arrays while repository meaning uses
  stable string IDs; isolating that translation prevents index leakage into
  domain state.
  Date/Author: 2026-07-23 / Codex.

- Decision: Use the deterministic type-cluster layout in every projection and
  keep Cosmos's force simulation disabled.
  Rationale: coordinates are local projection state, reproducibility aids
  testing and recovery, reduced motion must not become a diminished information
  path, and rendered QA showed the automatic force run reduced orientation
  before returning to idle.
  Date/Author: 2026-07-23 / Codex.

- Decision: Dynamically import Cosmos from an explicit user action and destroy
  the instance on close.
  Rationale: this satisfies the repository's optional-renderer boundary and
  provides a concrete rollback/recovery action.
  Date/Author: 2026-07-23 / Codex.

- Decision: Build the graph and index as hashed same-origin JSON assets rather
  than JavaScript module literals.
  Rationale: the semantic explorer still loads the committed artifacts before
  use, while the initial JavaScript entry remains small and data parsing stays
  data parsing.
  Date/Author: 2026-07-23 / Codex.

## Outcomes & Retrospective

The optional Cosmos explorer is implemented as a complete executable example.
It preserves the foundation/graph/index authority order, reproduces Python
search scoring, exposes every selected incoming/outgoing typed relationship in
semantic DOM, and opens Cosmos only after explicit intent.

Observed automated results:

- 14/14 Python repository tests passed.
- 14/14 explorer tests passed across search parity, graph integrity,
  deterministic typed-array projection, DOM behavior, renderer lifecycle,
  reduced motion, cleanup, and intentional initialization failure.
- Agent entry-point validation passed with zero errors.
- Regenerating the 551-node/1,607-edge artifacts produced no committed diff.
- `npm audit --omit=dev` reported zero vulnerabilities.
- Production build and manifest checks passed. The initial JavaScript entry is
  17,511 bytes; Cosmos is a separate 467,029-byte async entry with its WebGL
  support chunks also outside the initial static graph.

Observed rendered results in the in-app browser:

- Clean entry state aligned query, selected result, and detail on `P58`.
- Before intent, no canvas existed and the complete semantic inspector worked.
- Opening produced one `aria-hidden` canvas, a legible type-cluster overview,
  the selected P58 neighborhood, and an idle on-demand-rendering status.
- DOM selection updated the stable hash, selected detail, relationship list, and
  graph highlight without moving keyboard focus into the canvas.
- `/` focused search; exact-ID search selected P57; type filtering returned only
  normative rules.
- At 390 × 844 CSS pixels there was no horizontal overflow; panel order was
  results, detail, graph; primary controls measured 44 CSS pixels or taller; and
  the optional graph used a 360 × 320 secondary stage.
- Closing removed the canvas, preserved selection, returned focus to
  `Open graph`, and produced no console warnings or errors.

The connected browser exposes viewport control but not reduced-motion or WebGL
capability emulation. Those two recovery paths were therefore validated through
the production adapter and DOM integration tests rather than mislabeled as
rendered hardware observations. No blanket conformance claim is made.

No commit, push, deployment, publication, or release was performed.

## Context and Orientation

The authoritative model is
`foundation/spatial-environments-ai-foundation-v3.1.json`. Running
`python3 scripts/build_knowledge_graph.py` deterministically generates
`knowledge/spatial-knowledge-graph.json` and
`knowledge/spatial-retrieval-index.json`; neither generated file may be edited
by hand.

`src/spatial_foundation/graph.py` defines the retrieval behavior. Exact IDs earn
1,000 points, each normalized query token found in the inverted index earns 25,
a full normalized query substring in the node label earns 80, and a node-ID
prefix earns 60. Results sort by descending score and then stable ID.

Cosmos GL consumes one `Float32Array` of x/y positions, one `Float32Array` of
numeric source/target pairs, and optional point/link attribute arrays. Its
selection API refers to numeric point and link indices. The adapter must
therefore maintain:

    stable repository node ID <-> graph.nodes array offset <-> Cosmos point index

The initial browser path must not import Cosmos. The semantic app imports the
JSON artifacts, performs search and neighborhood queries, and renders:

- search input and type filter;
- deterministic result list;
- selected-node identity, type, summary, tags, and source references;
- typed incoming and outgoing relationship lists;
- graph-open/close control and explicit renderer status.

After `Open graph`, a dynamic import creates a Cosmos instance in an
`aria-hidden` graphics container. Clicking a point changes the same selected
stable node ID used by the DOM. Selecting a DOM result highlights and optionally
centers the corresponding Cosmos point without moving programmatic focus.

The governing foundation evidence is:

- `GRAM-007` / `P36`: typed, named, provenance-aware relationships with
  non-color and flat representations.
- `CONST-025` / `P23`: an equivalent flat projection.
- `RUNTIME-004` / `P53`: semantic DOM for readable and actionable content.
- `RUNTIME-005` / `P54`: responsive projection rather than a squeezed room.
- `RUNTIME-008`, `RUNTIME-016`, `P57`, and `P61`: on-demand rendering,
  settlement, pixel cap, and disposal.
- `AT-NAVIGATION-01`, `AT-ACCESSIBILITY-05`,
  `AT-FRAMES_AND_LENS-04`, and `AT-PERFORMANCE-02`: keyboard operation,
  non-duplicated assistive output, declared graph layout behavior, and no idle
  optional loop.

## Plan of Work

### Milestone 1: Toolchain and pure data adapter

Create a vanilla TypeScript/Vite example with pinned versions, a local README,
and no framework. Import both knowledge artifacts from the repository. Define
validated TypeScript shapes, tokenization/search parity, one-hop neighborhood
queries, stable ID/index maps, deterministic positions, color/size arrays, link
style arrays, and predicate metadata. Keep all pure logic in modules that tests
can exercise in Node without browser or WebGL globals.

Milestone exit: type checking passes; adapter tests prove referential integrity,
ID/index round trips, deterministic layouts, Python-parity search cases, and
complete relationship records.

### Milestone 2: Semantic explorer

Build a restrained DOM application with a landmark/heading hierarchy, search
and type filter, status text, result buttons, a selected-node detail, and
separate incoming/outgoing relationship lists. Preserve stable focus order and
44px primary targets. Search and selection work before any graphics module is
requested.

Milestone exit: component/integration tests prove the first load has no canvas,
search returns expected IDs, keyboard activation selects a node, typed
relationships render, and the DOM workflow works in flat/narrow mode.

### Milestone 3: Optional Cosmos projection

Add an explicit `Open graph` control whose handler dynamically imports a small
renderer adapter. Configure capped pixel ratio, deterministic random seed,
typed point/link arrays, semantic colors plus size/shape/style cues,
deterministic static layout, neighborhood highlighting, click-to-select,
background clear, and non-animated programmatic zoom when reduced motion is
active. Track lifecycle state in visible status text. Keep force simulation
disabled and call `destroy()` on close, unload, and hot-module disposal.

If WebGL cannot initialize, show a concise renderer-unavailable status and keep
the DOM explorer unchanged. Do not retry automatically in a loop.

Milestone exit: unit tests cover the renderer boundary with a fake Cosmos
implementation; a production build produces a separate Cosmos chunk; browser
tests observe intent loading, synchronized selection, close/disposal, and
failure recovery.

### Milestone 4: Documentation and proof

Update the root README and repository map with the optional explorer. Document
commands, authority boundaries, browser requirements, accessibility model,
performance lifecycle, and recovery. Run both Python and JavaScript validation,
rebuild generated artifacts and confirm no diff, audit production dependencies,
inspect production chunk sizes, and perform rendered browser validation at
wide and narrow viewports plus automated reduced-motion and WebGL-disabled
conditions.

Milestone exit: all commands below pass, screenshots or browser observations
are recorded in this plan, the final diff contains no generated drift or build
output, and no unverified conformance claim remains.

## Concrete Steps

Run from the repository root:

    python3 scripts/query_graph.py search "optional canvas webgl projection settlement" --limit 10
    python3 scripts/query_graph.py search "flat reduced motion equivalent projection" --limit 10

Create files only through reviewed patches, then install the example:

    cd examples/cosmos-graph-explorer
    npm install

During implementation:

    npm run typecheck
    npm test
    npm run build
    npm run check:bundle

Repository-wide validation:

    cd ../..
    .venv/bin/python -m unittest discover -s tests -v
    .venv/bin/python scripts/validate_agent_docs.py
    .venv/bin/python scripts/build_knowledge_graph.py
    /opt/homebrew/bin/git diff --exit-code -- knowledge/
    cd examples/cosmos-graph-explorer
    npm audit --omit=dev

Rendered validation:

    npm run dev -- --host 127.0.0.1

Open the printed local URL in a real browser. Verify the initial DOM explorer,
explicit Cosmos load, canvas point-to-DOM and DOM-to-canvas selection, graph
close/reopen, keyboard path, and 390px narrow viewport. Use automated adapter
and DOM tests for reduced motion and an intentionally unavailable WebGL
constructor when the connected browser exposes no such emulation. Record the
evidence boundary in this plan.

## Validation and Acceptance

Automated acceptance:

- Python repository tests pass without canonical or generated artifact changes.
- TypeScript type checking and unit/integration tests pass.
- Production build completes and a bundle assertion finds no
  `@cosmos.gl/graph` code in the initial entry chunk while finding it in an async
  chunk.
- Production dependency audit reports no known vulnerabilities.
- Adapter validation reports exactly 551 nodes and 1,607 links, with every
  source and target resolved.
- Search tests include exact `P58`, concept `active frame capacity`, a type
  filter, an empty query, and deterministic tie ordering.
- DOM tests prove typed relationship direction/predicate text and no canvas on
  initial load.
- Renderer lifecycle tests prove open, ready, selection synchronization,
  zero-simulation idle state, close disposal, reduced motion, and initialization
  failure.

Rendered acceptance:

- Before `Open graph`, search, selection, provenance, and relationship
  inspection are usable and no canvas exists.
- After `Open graph`, a meaningful full-graph overview appears; selecting `P58`
  exposes its local typed neighborhood in both projections.
- Keyboard operation never depends on canvas focus, and closing the graph
  returns focus to the open control.
- At 390 CSS pixels, controls remain at least 44px, the selected node remains
  readable, relationship lists remain operable, and the canvas is secondary.
- After settlement and after close, no continuing optional animation work is
  observed; close removes the canvas and releases the Cosmos instance.

Automated capability acceptance:

- With reduced motion, selection and view changes snap without travel
  animation, and the static deterministic layout remains unchanged.
- With WebGL unavailable, the page reports that only the visual projection is
  unavailable and the complete DOM workflow still succeeds.

This example demonstrates a bounded subset of the framework. Passing these
checks is evidence for the behaviors observed here, not a blanket conformance
claim for every foundation class.

## Idempotence and Recovery

`npm install`, tests, type checking, and production builds are repeatable.
Generated `dist/`, coverage, and `node_modules/` content must remain ignored.

If package installation or build fails, remove only the example's disposable
generated directories after confirming their exact paths; preserve source and
lockfile. If Cosmos initialization fails at runtime, destroy any partial
instance, remove its canvas container content, set the renderer status to
unavailable, and leave semantic state intact.

Closing the graph is the runtime rollback: it destroys the optional projection
without changing selected stable node ID, query, type filter, or repository
data. Reopening reconstructs the projection from committed artifacts.

No canonical JSON or generated graph/index edits are expected. If the generated
artifact freshness check produces a diff, stop and diagnose it rather than
accepting unrelated foundation changes.

## Artifacts and Notes

Research baseline observed on 2026-07-23:

- `@cosmos.gl/graph` version selected: `3.3.0`.
- Upstream license: MIT.
- Upstream package requires Node 18 or newer and ships ESM.
- Local environment: Node 26.3.1, npm 11.16.0, Python 3.10.5.
- Upstream source build observed: approximately 406 KB ESM / 82 KB gzip with
  dependencies external, and approximately 688 KB UMD / 179 KB gzip.
- Repository projection: 551 nodes, 1,607 edges, graph format 1.0.0, foundation
  version 3.1-ai.1.
- Known browser caveat: WebGL capability varies; upstream documents unsupported
  devices lacking required float-texture support. This is why the DOM path is
  primary and initialization failure is an acceptance case.

Final evidence:

- Initial entry: `17,511` bytes / `6.50` KB gzip.
- Cosmos async entry: `467,029` bytes / `118.04` KB gzip.
- Local graph asset: `577.10` KB / `51.56` KB gzip.
- Local retrieval-index asset: `269.62` KB / `52.18` KB gzip.
- Explorer tests: 14 passed in 4 files.
- Foundation tests: 14 passed.
- Production dependency audit: 0 vulnerabilities.
- Browser diagnostics after desktop, graph-open, selection, close, narrow, and
  keyboard checks: 0 warnings or errors.

## Interfaces and Dependencies

The example will expose these pure interfaces:

    type KnowledgeNode = {
      id: string
      type: string
      label: string
      summary: string
      tags: string[]
      source_refs: string[]
      data?: Record<string, unknown>
    }

    type KnowledgeEdge = {
      id: string
      source: string
      predicate: string
      target: string
      weight: number
      source_refs: string[]
    }

    type GraphProjection = {
      nodeIds: string[]
      indexByNodeId: Map<string, number>
      pointPositions: Float32Array
      pointColors: Float32Array
      pointSizes: Float32Array
      links: Float32Array
      linkColors: Float32Array
      linkStyles: Float32Array
    }

    function searchNodes(
      graph: KnowledgeGraph,
      index: RetrievalIndex,
      query: string,
      options?: { nodeType?: string; limit?: number }
    ): SearchResult[]

    function getNeighborhood(
      graph: KnowledgeGraph,
      index: RetrievalIndex,
      nodeId: string
    ): Neighborhood

    function buildGraphProjection(graph: KnowledgeGraph): GraphProjection

The browser renderer boundary will expose:

    type GraphRenderer = {
      selectNode(nodeId: string | undefined): void
      fit(): void
      setReducedMotion(reducedMotion: boolean): void
      destroy(): void
    }

    async function createGraphRenderer(options: {
      container: HTMLDivElement
      projection: GraphProjection
      reducedMotion: boolean
      onSelectNode(nodeId: string): void
      onStatus(status: RendererStatus): void
    }): Promise<GraphRenderer>

Direct runtime dependency:

- `@cosmos.gl/graph@3.3.0`, dynamically imported.

Build/test dependencies will be pinned in the example lockfile. The explorer
must not add a runtime server, framework, analytics, telemetry, or remote CDN.

## Revision Notes

- 2026-07-23: Initial plan created after repository retrieval, canonical-source
  review, and Cosmos GL v3.3.0 source/API research. The scope was narrowed to an
  executable optional-projection example so the dependency-free Python core and
  source-of-truth boundary remain intact.
- 2026-07-23: Completed implementation and validation. Rendered QA replaced the
  proposed bounded force run with a deterministic static layout, changed point
  sizing to remain legible at fitted scale, and moved JSON from the JavaScript
  entry into hashed local assets. Recorded exact automated and browser evidence
  plus the reduced-motion/WebGL-emulation boundary.
