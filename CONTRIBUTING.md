# Contributing

Issues and evidence-backed proposals are welcome.

Before proposing a foundation change:

1. Identify the principle, rule, domain entity, or runtime contract affected.
2. Explain the user or system failure the change prevents.
3. Update the human reasoning and canonical AI JSON together.
4. Preserve stable IDs unless the compatibility policy explicitly permits a break.
5. Rebuild the graph with `python3 scripts/build_knowledge_graph.py`.
6. Run `python3 -m unittest discover -s tests -v`.
7. Include observable acceptance evidence for new normative behavior.

Generated knowledge files should never be edited directly. Static evaluator patterns must remain conservative, identify their confidence, map to an existing normative rule, and avoid claiming runtime proof from source text alone.

Please do not include credentials, customer information, proprietary source, private conversation transcripts, or evidence you do not have permission to publish.
