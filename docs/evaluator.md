# Principles evaluator

The evaluator answers two separate questions:

1. What has been demonstrated with evidence?
2. What source patterns deserve inspection?

Keeping those questions separate prevents a regex match from masquerading as an observed usability or performance failure.

## Manifest workflow

Copy `examples/implementation-manifest.example.json`, identify the build, claim only the conformance classes actually in scope, and attach evidence to rule and acceptance-test results. Evidence can be a test output, implementation location, interaction trace, accessibility audit, screenshot set, performance recording, transaction log, or observed behavior record.

Evidence has `verified` or `unverified` status. A passing result counts only when it references at least one verified evidence item. A failed result is a confirmed finding because the author explicitly declared it against identified evidence. Required items with no result become evidence gaps.

## Verdicts

| Verdict | Meaning |
|---|---|
| `conformant` | Required results are evidenced and no findings remain. |
| `conformant_with_conditions` | Coverage is sufficient, but lower-severity confirmed issues or static review signals remain. |
| `insufficient_evidence` | Too many required results are absent or unverified to support a claim. |
| `not_conformant` | At least one confirmed high- or critical-severity finding exists. |

The evaluator does not certify a product by itself. It produces a reproducible review packet.

## Static diagnostic coverage

The optional repository scan currently identifies:

- likely perpetual animation-frame or render timer loops;
- eager Three.js imports in the default source path;
- WebGL pixel ratio set directly to uncapped device pixel ratio;
- autoplay and persistent compositing hints that need lifecycle review;
- wheel capture that needs focus ownership and release verification;
- blur and `preserve-3d` in the same stylesheet, which may expose flattening boundaries;
- CSS motion with no detected `prefers-reduced-motion` handling.

Each is reported with `confirmed: false` and a confidence value. The scan skips dependencies, build output, generated directories, unsupported formats, and files over 1 MB.

## CI behavior

Without `--fail-on`, the evaluator always writes its report unless the manifest is invalid. With `--fail-on`, only confirmed evidence-backed findings at or above the threshold cause exit code 1. Static signals never fail CI.

```bash
python3 scripts/evaluate_principles.py manifest.json \
  --repo ./app \
  --output report.json \
  --fail-on high
```

Exit code 2 means the input or referenced IDs were invalid. The JSON schemas in `schemas/` provide editor-time validation, while the evaluator performs foundation-aware checks such as known rule IDs, known acceptance-test IDs, unique results, and valid evidence references.
