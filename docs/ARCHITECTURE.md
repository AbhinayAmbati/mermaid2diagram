# Architecture

Mermaid Studio is a client-side application. There is no backend, database or
authentication — the whole product is a static Next.js app whose only runtime
dependency is the browser.

## Layers

```
┌──────────────────────────────────────────────────────────────┐
│ UI (React components)                                        │
│   landing/*   editor/*   diagram/*   export/*   examples/*   │
└───────────────┬──────────────────────────────────────────────┘
                │ reads/writes
┌───────────────▼──────────────────────────────────────────────┐
│ State — Zustand store (lib/store)                            │
│   source · settings · svg · status · error                   │
└───────────────┬──────────────────────────────────────────────┘
                │ effects
┌───────────────▼──────────────────────────────────────────────┐
│ Hooks (lib/hooks)                                            │
│   useMermaidRender · useAutosave · useKeyboardShortcuts …    │
└───────────────┬──────────────────────────────────────────────┘
                │ calls
┌───────────────▼──────────────────────────────────────────────┐
│ Domain (lib/mermaid)                                         │
│   render · config · sanitize · export-svg · export-raster    │
│   export-pdf · export (orchestrator)                         │
└──────────────────────────────────────────────────────────────┘
```

The domain layer is deliberately free of React. Every function there takes plain
values and returns plain values (or Promises), which is what makes the export
pipeline independently testable.

## Separation rules

- **Rendering vs. UI.** `lib/mermaid/render.ts` only knows how to turn a string
  into an SVG string. It never touches the DOM beyond Mermaid's own temporary
  measurement node, which it cleans up.
- **Conversion vs. download.** `export-*.ts` produce `Blob`s; `export.ts` decides
  the filename and triggers the download. Tests assert on blobs and metadata, not
  on the browser download.
- **Server vs. client.** Pages are server components; anything that needs the DOM
  (editor, canvas, export dialog) is a client component and, where heavy, is
  loaded with `next/dynamic({ ssr: false })`.

## Concurrency model

Mermaid renders asynchronously and mutates a shared library instance. The render
hook therefore:

1. debounces input,
2. appends each pass to a single promise chain (serialising renders),
3. tags each pass with a monotonic token, and
4. drops any result whose token is no longer current.

This gives latest-wins semantics without ever having two Mermaid renders in
flight at once.

## Data flow for an export

```
ExportDialog
  → runExport({ svg, source, options })
      → mmd   : Blob(source)
      → svg   : buildSvgDocument()  [sanitize → standalone → background]
      → png   : svgToPngBlob()      [renderSvgToCanvas → canvasToBlob]
      → jpeg  : svgToJpegBlob()
      → pdf   : svgToPdfBlob()      [canvas @3× → jsPDF fit-to-A4]
  → downloadBlob(blob, filename)
```

## Where to extend

- **New export format** — add an entry to `EXPORT_FORMATS` and a branch in
  `runExport`. The dialog picks up metadata automatically.
- **New example** — append to `TEMPLATES`; it appears in the dropdown, the
  landing gallery and the deep-link handler at once.
- **New diagram-type label** — extend `TYPE_LABELS` in `lib/mermaid/diagram-type.ts`.
