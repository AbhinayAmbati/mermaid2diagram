import { ArrowUpRight } from "lucide-react";

const FORMATS = [
  {
    label: "SVG",
    body: "Vector output with embedded styles, infinitely scalable and print-ready.",
    meta: "vector",
  },
  {
    label: "PNG",
    body: "Lossless raster at 1x, 2x or 3x, with optional transparency.",
    meta: "1x / 2x / 3x",
  },
  {
    label: "PDF",
    body: "Fitted to an A4 page in portrait or landscape, with a background option.",
    meta: "A4",
  },
  {
    label: "JPEG",
    body: "Compact raster with a solid background for quick sharing.",
    meta: "raster",
  },
  {
    label: "MMD",
    body: "Download the original .mmd file so the diagram stays editable.",
    meta: "source",
  },
];

export function ExportFormats() {
  return (
    <section id="formats" className="px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-[1320px]">
        <div className="max-w-2xl">
          <span className="label-mono text-muted-foreground">05 / Exports</span>
          <h2 className="mt-4 text-[1.75rem] font-medium leading-tight tracking-[-0.02em] sm:text-[2.25rem]">
            Export in the format you need
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Every format produces a genuine file of that type. Nothing is
            renamed or faked, and nothing leaves your device.
          </p>
        </div>

        <div className="mt-12 grid gap-px overflow-hidden rounded-xl border border-box-line bg-box-line sm:grid-cols-2 lg:grid-cols-3">
          {FORMATS.map((format) => (
            <div
              key={format.label}
              className="group flex flex-col justify-between bg-box p-7 transition-colors hover:bg-box-hover"
            >
              <div className="flex items-start justify-between">
                <span className="font-mono text-2xl font-medium tracking-tight text-box-foreground">
                  {format.label}
                </span>
                <ArrowUpRight className="h-4 w-4 text-box-muted transition-colors group-hover:text-primary" />
              </div>
              <p className="mt-6 text-sm leading-relaxed text-box-muted">
                {format.body}
              </p>
              <span className="label-mono-sm mt-5 text-box-muted">
                {format.meta}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
