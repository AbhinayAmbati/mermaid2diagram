# ADR 0002 — CodeMirror 6 rather than Monaco

- **Status:** Accepted
- **Date:** 2025-01

## Context

The editor must be a real code editor with syntax highlighting, not a styled
textarea. The two credible options are Monaco and CodeMirror 6.

## Decision

Use CodeMirror 6 via `@uiw/react-codemirror`, with a small custom stream parser
for Mermaid.

## Rationale

- **Bundle size.** CodeMirror's modular packages add far less weight than Monaco.
- **No CDN dependency.** Monaco's React wrapper typically loads its worker bundle
  from a CDN by default, which is a runtime network dependency and awkward to
  self-host in Next.js. CodeMirror bundles locally.
- **Language support.** Neither ships a Mermaid grammar, so a custom tokenizer is
  required either way; CodeMirror's `StreamLanguage` makes this small and
  declarative.
- **Theming.** CodeMirror's theme API maps cleanly onto the project's CSS
  variables, so the editor follows light/dark mode automatically.

## Consequences

- Syntax highlighting is heuristic (keyword/string/comment/operator) rather than
  a full parse tree. This is appropriate for a diagram DSL and keeps the editor
  fast.
- Undo/redo and other commands are driven imperatively through the editor ref,
  which the toolbar wires to buttons and keyboard shortcuts.
