import { FileCode2, FileImage, FileText, FileType2, ImageDown } from "lucide-react";

const FORMATS = [
  {
    icon: FileCode2,
    label: "SVG",
    body: "Vector output with embedded styles — infinitely scalable and print-ready.",
  },
  {
    icon: ImageDown,
    label: "PNG",
    body: "Lossless raster at 1×, 2× or 3×, with optional transparency.",
  },
  {
    icon: FileText,
    label: "PDF",
    body: "Fitted to an A4 page in portrait or landscape, with a background option.",
  },
  {
    icon: FileImage,
    label: "JPEG",
    body: "Compact raster with a solid background for quick sharing.",
  },
  {
    icon: FileType2,
    label: "Mermaid source",
    body: "Download the original .mmd file so the diagram stays editable.",
  },
];

export function ExportFormats() {
  return (
    <section id="formats" className="border-b border-border">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Export in the format you need
          </h2>
          <p className="mt-3 text-muted-foreground">
            Every format produces a genuine file of that type — nothing is
            renamed or faked, and nothing leaves your device.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FORMATS.map((format) => {
            const Icon = format.icon;
            return (
              <div
                key={format.label}
                className="rounded-xl border border-border bg-card p-5 shadow-subtle"
              >
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-semibold">{format.label}</h3>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {format.body}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
