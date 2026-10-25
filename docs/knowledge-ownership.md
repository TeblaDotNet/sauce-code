# Canonical and editorial ownership

Sauce Code owns canonical vocabulary and language behaviour. Open Sauce Food Knowledge owns articles, source registries, photographs, their attribution and selection metadata, culinary browsing taxonomy, regional comparisons and quantitative observations. Knowledge is an optional explicit provider; Core has no sibling-repository discovery or runtime dependency.

The former assets/references/ATTRIBUTION.md and photographs were present in Core when the historical image reports were written. They are preserved in Core Git history at bc6060a29223a2a52443ad62f5e566a2114ffcc6. For example, use git show bc6060a29223a2a52443ad62f5e566a2114ffcc6:assets/references/ATTRIBUTION.md. Current attribution is maintained as assets/references/ATTRIBUTION.md in the separate, currently unpublished Knowledge repository. Its provenance/core directory preserves the original extraction notices. No public repository URL is implied.

Historical reports still describe the original work. Their links lead here because the active files moved, not because their historical origin changed. Existing image licences, exact versions, creator credits and derivative notices continue to apply. Original article prose is intended for CC BY 4.0 only where the necessary rights are held; uncertain and third-party rights are not broadened.

Canonical-only loading omits editorial categories and regional comparisons. The optional provider carries a structurally validated taxonomy on its Vocabulary instance and ReferencePage projection. browsingCategories accepts that explicit taxonomy; its unconfigured default has no display labels. Historical compatibility category IDs remain available for structural compatibility. Parser, resolver, scaling and conversion algorithms remain independent.

Core tests run without Knowledge. Complete historical editorial and combined-reference assertions now live in Knowledge, with immutable extraction/source fixtures. Corpus ordinary validation is canonical-only; its explicit test:knowledge command covers article expectations.
