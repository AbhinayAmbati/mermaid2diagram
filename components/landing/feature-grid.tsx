import {
  Code2,
  Download,
  Gauge,
  MousePointerClick,
  Palette,
  ShieldCheck,
} from "lucide-react";

const FEATURES = [
  {
    icon: Code2,
    title: "A real code editor",
    body: "CodeMirror with Mermaid syntax highlighting, line numbers, undo/redo and keyboard shortcuts — not a styled textarea.",
  },
  {
    icon: Gauge,
    title: "Instant, race-safe preview",
    body: "Rendering is debounced and serialised, so a stale render can never overwrite a newer diagram.",
  },
  {
    icon: MousePointerClick,
    title: "Interactive canvas",
    body: "Zoom, pan, fit-to-screen and fullscreen with a dotted, white or transparent background.",
  },
  {
    icon: Download,
    title: "Genuine exports",
    body: "Real SVG, PNG (1–3×), PDF, JPEG and .mmd files — generated locally, never uploaded.",
  },
  {
    icon: Palette,
    title: "Tasteful presets",
    body: "Classic, Monochrome, Electric Blue and Soft Minimal, plus theme variables for fine control.",
  },
  {
    icon: ShieldCheck,
    title: "Private by default",
    body: "Strict security level, sanitised output and a local autosave you can clear at any time.",
  },
];

export function FeatureGrid() {
  return (
    <section id="features" className="border-b border-border">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Built like a tool, not a demo
          </h2>
          <p className="mt-3 text-muted-foreground">
            Every control on the editor does something real, and the export
            pipeline produces files you can actually ship.
          </p>
        </div>

        <div className="mt-10 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="bg-card p-6">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-secondary text-primary">
                  <Icon className="h-4 w-4" />
                </div>
                <h3 className="mt-4 text-sm font-semibold">{feature.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {feature.body}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
