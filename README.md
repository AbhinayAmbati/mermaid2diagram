# mermaid2diagram

**From Mermaid code to beautiful diagrams.** Paste or write Mermaid syntax, preview
it instantly, refine the details, and export crisp SVG, PNG, PDF or JPEG files,
all in the browser, with no account and no server round-trips.

---

## Highlights

- **A real code editor**: CodeMirror 6 with Mermaid syntax highlighting, line
  numbers, folding, undo/redo and keyboard shortcuts.
- **Instant, race-safe preview**: rendering is debounced and serialised through a
  promise queue with a monotonic token, so a stale render can never overwrite a
  newer one. Repeated renders are cleaned up to avoid duplicate SVG ids.
- **Interactive canvas**: zoom, pan, fit-to-screen, reset and fullscreen, with
  white / transparent (checkerboard) / grid backgrounds and a live zoom readout.
- **Genuine exports**: SVG (standalone, sanitised), PNG (1×/2×/3×), WebP,
  PDF (A4, portrait or landscape), JPEG and the original `.mmd` source.
- **Customisation**: four appearance presets (Classic, Monochrome, Terminal Lime,
  Soft Minimal), Mermaid themes, theme variables, font, size and padding.
- **Twelve example templates** across flowcharts, sequence, class, ER, state,
  Gantt, Git, mindmap, journey, pie and system architecture.
- **Local autosave**: your draft is kept in `localStorage` and restored on
  reload. You can clear it at any time; nothing is ever uploaded.
- **Accessible & responsive**: semantic markup, labelled controls, tooltips on
  icon-only buttons, and a split-pane desktop layout that becomes tabs on mobile.

---

## Tech stack

| Concern        | Choice                                                   |
| -------------- | -------------------------------------------------------- |
| Framework      | Next.js 15 (App Router)                                  |
| Language       | TypeScript (strict)                                      |
| Styling        | Tailwind CSS + CSS design tokens                         |
| Components     | shadcn/ui-style primitives built on Radix UI             |
| Icons          | lucide-react                                             |
| Rendering      | Mermaid.js v11                                           |
| Editor         | CodeMirror 6 (`@uiw/react-codemirror`)                   |
| Animation      | Framer Motion (used sparingly)                           |
| Notifications  | Sonner                                                   |
| Pan / zoom     | `react-zoom-pan-pinch`                                   |
| PDF            | jsPDF                                                    |
| State          | Zustand                                                  |
| Tests          | Vitest + Testing Library, Playwright                     |

---

## Getting started

```bash
# 1. Install dependencies (pnpm recommended; npm works too)
pnpm install

# 2. Start the dev server
pnpm dev
# → http://localhost:3000        (landing page)
# → http://localhost:3000/editor (editor)
```

### Scripts

| Command             | Description                                    |
| ------------------- | ---------------------------------------------- |
| `pnpm dev`          | Start the dev server                           |
| `pnpm build`        | Production build                               |
| `pnpm start`        | Serve the production build                     |
| `pnpm lint`         | ESLint (next/core-web-vitals)                  |
| `pnpm typecheck`    | `tsc --noEmit`                                 |
| `pnpm test`         | Unit tests (Vitest)                            |
| `pnpm test:e2e`     | End-to-end tests (Playwright, needs a build)   |

> **Note:** the production build uses Turbopack (`next build --turbopack` is the
> default in the `build` script environment). Type and lint checks are run as
> separate, explicit scripts.

---

## Project structure

```text
app/
  layout.tsx            Root layout: fonts, theme provider, tooltips, toaster
  page.tsx              Landing page
  editor/page.tsx       Editor route (wraps the workspace in Suspense)
  globals.css           Design tokens (light + dark) and CodeMirror theming
components/
  layout/navbar.tsx     Sticky top bar
  editor/               CodeMirror editor, toolbar, workspace shell, language mode
  diagram/              Canvas, toolbar, appearance panel, error state
  export/               Export dialog + option controls
  examples/             Examples dropdown
  landing/              Hero, features, diagram types, formats, gallery, CTA
  ui/                   shadcn/ui-style primitives
lib/
  mermaid/              render, config, sanitize, export-svg/png/pdf, orchestrator
  examples/templates.ts Twelve ready-to-use Mermaid templates
  hooks/                debounce, render pipeline, autosave, media query, shortcuts
  store/                Zustand diagram store
  storage/draft.ts      Local draft persistence helpers
types/                  Shared diagram + export types
e2e/                    Playwright specs
```

---

## How rendering works

1. The editor writes to a Zustand store.
2. `useMermaidRender` debounces the source (350 ms) and the settings (150 ms).
3. Each pass is appended to a **promise queue** so only one Mermaid render runs at
   a time, and tagged with a **monotonic token**.
4. When a render resolves, its token is compared with the latest; stale results
   are discarded, which eliminates the classic "old render overwrites new
   preview" race.
5. On success the SVG string, intrinsic size and detected diagram type are stored.
   On failure a structured error (message + line/column when available) is stored
   and shown in the canvas error state.

## How exporting works

All conversion is client-side:

- **SVG**: sanitised with DOMPurify (SVG profile, preserving Mermaid's inline
  `<style>`), given explicit dimensions and an optional background rect.
- **PNG / WebP / JPEG**: the SVG is drawn onto a `<canvas>` at 1-3× (clamped to
  an 8192 px ceiling) and encoded with `canvas.toBlob`. PNG and WebP keep an
  alpha channel; JPEG is coerced to a solid background.
- **PDF**: the diagram is rasterised at 3× and fitted to an A4 page (portrait or
  landscape) with a configurable background. Mermaid depends heavily on CSS
  classes inside a `<style>` block, so a raster path is used for faithful output.
- **`.mmd`**: the original source, unchanged.

> **Note on `htmlLabels`:** the render config disables Mermaid's HTML labels so
> labels are real SVG `<text>` nodes. `<foreignObject>` content does not rasterise
> reliably when an SVG is drawn to a canvas, so this keeps PNG/PDF exports correct.

---

## Security

- Mermaid runs with `securityLevel: "strict"` - user labels are sanitised by
  Mermaid itself - and `suppressErrorRendering` is enabled so a bad diagram never
  injects error graphics into the document.
- Exported SVG passes through DOMPurify before it is written to disk or clipboard.
- Diagram source is treated as untrusted input throughout.
- No authentication, database or backend is required, and no diagram content is
  ever sent to a server.

---

## Testing

```bash
pnpm test          # unit tests
pnpm typecheck     # types
pnpm lint          # lint
pnpm build         # production build
pnpm test:e2e      # requires: npx playwright install chromium
```

Unit tests cover the Mermaid configuration, error parsing, render-id generation,
SVG measurement, export format metadata and the download orchestrator, plus the
template catalogue and string utilities.

---

## License

MIT
