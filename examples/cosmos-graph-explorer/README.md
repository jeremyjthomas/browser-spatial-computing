# Cosmos GL knowledge-graph explorer

This example is an optional visual projection of the repository's generated
knowledge graph. It uses the committed retrieval index for search and Cosmos GL
for a dense, interactive relationship field.

It does not edit or replace:

- `foundation/spatial-environments-ai-foundation-v3.1.json`, the canonical
  machine-readable foundation;
- `knowledge/spatial-knowledge-graph.json`, the generated graph projection; or
- `knowledge/spatial-retrieval-index.json`, the generated retrieval index.

Canvas coordinates, zoom, and selection emphasis are view-local presentation
state. Stable node IDs and typed edges remain the only bridge between the
canvas and semantic interface.

## Run it

Node 20.19 or newer is required.

```bash
cd examples/cosmos-graph-explorer
npm ci
npm run dev
```

Open the local URL printed by Vite. Search is ready immediately. Choose
`Open graph` only when the visual overview is useful.

The two committed JSON projections build as hashed local data assets rather
than being compiled into the JavaScript entry. The semantic interface fetches
them from the same origin; it has no remote API or analytics dependency.

For a production build:

```bash
npm run check
```

`npm run check` type-checks the example, runs unit and DOM integration tests,
builds production assets, and verifies from Vite's manifest that Cosmos is an
async chunk rather than part of the initial static module graph.

The repository CI also runs:

```bash
npm audit --omit=dev
```

## Interaction model

- Search reproduces the Python `KnowledgeGraph.search` score contract for
  exact IDs, indexed tokens, label substrings, ID prefixes, type filtering, and
  deterministic ordering.
- Selecting a result or relationship changes one stable node ID and renders
  its complete one-hop incoming/outgoing relationship record.
- Opening Cosmos translates stable IDs to array offsets, typed endpoints to
  `Float32Array` pairs, and repository node/edge categories to visual
  attributes.
- Selecting a Cosmos point updates the same semantic selection. The canvas is
  `aria-hidden`; it is not a second assistive-technology tree or keyboard path.
- Closing Cosmos destroys the graph instance, removes its canvas, preserves
  search and selection, and returns focus to the open control.

The `/` key focuses search when focus is not already inside a form field.

## Visual encoding

Point color and shape both identify broad node families:

| Family | Included node types |
|---|---|
| Source | artifact, foundation layer, principle, source section |
| Rule or test | normative rule, rule category, acceptance test, conformance class |
| Model | domain entity, ownership plane |
| Runtime | performance control, performance preset, build checkpoint |
| Other | evaluation scenario, reference, tag |

Link patterns group relationship purpose:

- solid: structure, definition, configuration, and remaining typed links;
- dashed: evidence or explanatory lineage (`grounded_in`, `explained_by`,
  `specified_by`, `supports`);
- dotted: requirements, validation, categories, and tags.

The exact predicate, direction, peer identity, and provenance remain visible in
the DOM. Pattern or color is never the only source of relationship meaning.

## Runtime and recovery

`@cosmos.gl/graph` is dynamically imported from the `Open graph` action. The
adapter:

- caps pixel ratio at 1.5 and further reduces it to keep the drawing buffer
  within two million physical pixels;
- uses a deterministic initial layout and random seed;
- disables travel transitions and the force simulation for reduced motion;
- keeps the force simulation disabled and renders only on interaction or view
  invalidation;
- preserves semantic state if WebGL initialization fails; and
- calls `destroy()` on close, page disposal, and hot-module disposal.

Cosmos 3.3.0 depends on `gl-bench`, whose package metadata exposes both a
browser-global build and an ESM build. Vite 8's production resolver otherwise
chooses the browser-global file, which has no default ESM export. The Vite
configuration aliases `gl-bench` to its own declared module entry. This is a
build-compatibility boundary, not a fork or vendored dependency.

## Browser and accessibility boundary

The semantic explorer is the complete inspection path and does not require
WebGL. The optional canvas requires a browser/device supported by Cosmos GL and
its WebGL stack. On unsupported hardware, the interface reports the graphics
failure and retains search, selection, provenance, and relationships.

At narrow widths the order becomes search results, selected-node detail, then
the optional graph. Primary controls use 44 CSS-pixel targets. Reduced motion
uses a static deterministic layout and zero-duration programmatic view changes.

This example provides evidence for its bounded behavior. It is not a blanket
conformance claim for every Browser Spatial Computing class or acceptance test.

## Validation baseline (July 23, 2026)

At the baseline commit, a rendered 390 × 844 CSS-pixel viewport showed no
horizontal overflow and primary controls at least 44 CSS pixels tall. The
semantic inspector worked before opening the graph. Closing the graph removed
the canvas, kept selection, and returned focus to **Open graph**. The observed
desktop, narrow, graph-open, graph-close, selection and keyboard checks logged
no console warnings or errors.

Rendered QA led to a deterministic static layout instead of the planned
bounded force simulation, keeping the fitted overview legible and idle.
The browser did not support reduced-motion or unavailable-WebGL emulation;
those recovery paths were checked with automated adapter and DOM integration
tests, not observed on hardware. These are dated observations, not claims
about the current build. The initial JavaScript entry was 17,511 bytes; the
467,029-byte Cosmos entry was loaded separately.

[Original implementation plan and evidence at the baseline commit](https://github.com/jeremyjthomas/browser-spatial-computing/blob/3eb5fc6180223f27b27cf0924d6a262a7b0b10ea/plans/2026-07-23-cosmos-gl-knowledge-graph-explorer.md).

## Dependency license

Cosmos GL and `gl-bench` are MIT licensed. This repository currently grants no
general reuse license; dependency licenses do not change that repository-level
status.
