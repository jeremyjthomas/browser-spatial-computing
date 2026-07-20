# Claude Code instructions

@AGENTS.md

Use `AGENTS.md` as the shared repository contract. Do not restate or override it here.

## Claude loading strategy

- Read `SKILL.md` before a substantial explanation, review, foundation change, or implementation task.
- Start with graph search and a bounded neighborhood; do not load the full foundation or embedded source book unless the task truly spans it.
- When a graph result informs a decision, follow its `source_refs` to the canonical foundation or relevant section of `docs/principles.md`.
- Read `DESIGN.md` before generating or reviewing UI, visual tokens, layout, depth treatment, motion, components, or accessibility behavior.
- Keep proposals explicit: identify what would change, its authority plane, affected IDs, evidence, recovery path, and whether the action is local, shared, canonical, or external.

## Claude completion check

Before declaring work complete, run the relevant commands from `AGENTS.md`, rebuild generated artifacts after canonical changes, and report any unverified assumption rather than converting it into a fact.
