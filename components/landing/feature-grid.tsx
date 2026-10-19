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
    body: "CodeMirror 6 with Mermaid syntax highlighting, line numbers, undo/redo and keyboard shortcuts, not a styled textarea.",
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
    body: "Real SVG, PNG (1x, 2x, 3x), PDF, JPEG and .mmd files, generated locally and never uploaded.",
  },
  {
    icon: Palette,
    title: "Tasteful presets",
    body: "Classic, Monochrome, Terminal Lime and Soft Minimal, plus theme variables for fine control.",
  },
  {
    icon: ShieldCheck,
    title: "Private by default",
    body: "Strict security level, sanitised output and a local autosave you can clear at any time.",
  },
];

export function FeatureGrid() {
  return (
    <section id="features" className="px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-[1320px]">
        <div className="max-w-2xl">
          <span className="label-mono text-muted-foreground">03 / Features</span>
          <h2 className="mt-4 text-[1.75rem] font-medium leading-tight tracking-[-0.02em] sm:text-[2.25rem]">
            Built like a tool, not a demo
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Every control on the editor does something real, and the export
            pipeline produces files you can actually ship.
          </p>
        </div>

        <div className="mt-12 grid gap-px overflow-hidden rounded-xl border border-box-line bg-box-line sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="group bg-box p-7">
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md border border-box-line bg-box-hover text-box-foreground transition-colors group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-box-muted/70">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-6 text-base font-semibold tracking-tight text-box-foreground">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-box-muted">
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
