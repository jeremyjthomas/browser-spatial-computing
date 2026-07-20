# Browser Spatial Computing

[![Foundation integrity](https://github.com/jeremyjthomas/browser-spatial-computing/actions/workflows/ci.yml/badge.svg)](https://github.com/jeremyjthomas/browser-spatial-computing/actions/workflows/ci.yml)

An AI-first foundation for building spatial working environments in an ordinary browser—without requiring a headset, defaulting to WebGL, or turning every product into a GPU-heavy game.

The central idea is simple: a browser viewport can behave like a camera into a structured room, but depth must encode useful state. Information stays canonical and addressable. Placements, frames, lenses, groups, spaces, AI actions, collaboration, accessibility, recovery, and runtime budgets are explicit parts of one system.

This repository includes:

- a 71-principle human-readable book and its complete AI-readable JSON twin;
- 111 normative rules, 67 acceptance tests, and 21 comparison scenarios;
- a generated knowledge graph with 551 typed nodes and 1,607 typed edges;
- a compact retrieval index for exact lookup, concept search, filters, neighborhoods, and semantic paths;
- a manifest-driven principles evaluator with conservative source diagnostics;
- three runtime levers—visual richness, active-frame capacity, and loading horizon—with efficient, balanced, and cinematic presets;
- schemas, examples, tests, and continuous integrity checks.

## Start here

No dependencies are required for the included tools; Python 3.10+ is enough.

```bash
python3 scripts/query_graph.py search "active frame capacity"
python3 scripts/query_graph.py neighbors P58 --depth 2
python3 scripts/query_graph.py path PRESET:cinematic CONTROL:active_frame_capacity
python3 scripts/evaluate_principles.py examples/implementation-manifest.example.json \
  --repo tests/fixtures/problematic_runtime
python3 -m unittest discover -s tests -v
```

Or install the command locally:

```bash
python3 -m pip install -e .
spatial-foundation search "reduced motion"
spatial-foundation evaluate examples/implementation-manifest.example.json
```

All commands emit JSON so an agent can consume the result directly.

## Which artifact should an AI use?

| Need | Artifact |
|---|---|
| Understand or build the system | `foundation/spatial-environments-ai-foundation-v3.1.json` |
| Validate the foundation shape | `foundation/spatial-environments-ai-foundation-v3.1.schema.json` |
| Resume a multi-session build | `foundation/spatial-environments-ai-build-state-v1.template.json` |
| Retrieve a precise neighborhood quickly | `knowledge/spatial-knowledge-graph.json` + `knowledge/spatial-retrieval-index.json` |
| Judge an implementation | `scripts/evaluate_principles.py` + an implementation manifest |
| Read the reasoning as a person | `docs/principles.md` or the PDF |

The AI foundation is canonical. The knowledge graph is a deterministic projection for retrieval, not a second source of truth. Rebuild it after foundation changes:

```bash
python3 scripts/build_knowledge_graph.py
```

The graph deliberately uses portable JSON rather than a graph database. At this scale, precomputed ID, term, type, tag, incoming-edge, and outgoing-edge indexes are faster to load, easier to audit, and simpler to give to an AI. A database becomes useful only when multiple foundations, live multi-user mutations, or substantially larger graphs require concurrent querying.

## Evaluating an implementation

The evaluator combines two evidence channels:

1. **Declared evidence:** a manifest records claimed conformance classes, rule results, acceptance-test results, and the evidence supporting them. A `pass` without verified evidence remains unverified.
2. **Static diagnostics:** an optional source scan flags patterns worth reviewing, such as perpetual render loops, eager Three.js imports, uncapped WebGL pixel ratios, CSS flattening risks, or missing reduced-motion handling.

Static diagnostics are intentionally signals, not proof. They cannot make a build fail by themselves. Confirmed manifest findings can fail CI at a chosen threshold:

```bash
python3 scripts/evaluate_principles.py implementation-manifest.json \
  --repo path/to/web-app \
  --fail-on high \
  --output evaluation-report.json
```

See [the evaluator guide](docs/evaluator.md) for verdicts and evidence expectations.

## The three performance levers

| Lever | What it controls | Efficient | Balanced (default) | Cinematic |
|---|---|---:|---:|---:|
| Visual richness | atmosphere, optics, optional graphics | minimal | restrained | rich but bounded |
| Active-frame capacity | fully live readable/interactive DOM frames | 4 | 8 | 6 |
| Loading horizon | prepared content beyond current attention | focal group + current shell | current space + likely neighbor | current space + visible neighbors |

These are independent controls, not a single quality slider. A user may want richer lighting with fewer open frames, or a larger working set with minimal optics. Accessibility requirements and measured device pressure always override a preset. Three.js is an optional projection loaded on intent; the default room uses DOM, CSS transforms, and event-driven JavaScript.

## Repository map

```text
foundation/  canonical AI contract, schema, and resumable build state
knowledge/   generated graph and compact retrieval index
docs/        human principles, architecture, evaluator, and PDF book
schemas/     evaluator and graph interchange contracts
examples/    implementation manifest and generated evaluation report
src/         dependency-free graph and evaluation library
scripts/     direct command-line entry points
tests/       graph, retrieval, evaluator, and diagnostic fixtures
```

## Design stance

- Reading surfaces stay flat; spatial depth is reserved for working state.
- Groups, not loose cards, are the primary depth unit.
- Spaces are bounded working contexts; a new session is required when authority, persistence, security, or task continuity changes.
- Focus has a readable range and snaps to useful stops; empty blur is not navigation.
- World elements can recede and lose focus; HUD controls remain on the lens.
- DOM/CSS is the default renderer. Canvas and WebGL are isolated, optional projections.
- Settled work should settle computationally: no permanent optional animation loop.
- AI acts through proposals, visible locus, bounded authority, reversible transactions, and human-readable receipts.
- Reduced motion and flat projection preserve the information architecture rather than deleting it.

## Contributing

Read [CONTRIBUTING.md](CONTRIBUTING.md). Foundation changes should update the canonical JSON and human reasoning together, rebuild generated artifacts, and include executable evidence.

## License

No license has been selected. This repository is public for review and discussion; do not assume permission to copy, redistribute, or create derivative works beyond rights provided by applicable law or GitHub's terms.
