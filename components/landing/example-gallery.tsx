import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { TEMPLATES } from "@/lib/examples/templates";

/** A compact gallery of real templates; each card opens the editor preloaded. */
export function ExampleGallery() {
  return (
    <section id="examples" className="px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-[1320px]">
        <div className="max-w-2xl">
          <span className="label-mono text-muted-foreground">06 / Templates</span>
          <h2 className="mt-4 text-[1.75rem] font-medium leading-tight tracking-[-0.02em] sm:text-[2.25rem]">
            Start from an example
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Pick a template and it opens straight in the editor, ready to tweak
            and export.
          </p>
        </div>

        <div className="mt-12 grid gap-px overflow-hidden rounded-xl border border-box-line bg-box-line sm:grid-cols-2 lg:grid-cols-3">
          {TEMPLATES.map((template, index) => (
            <Link
              key={template.id}
              href={`/editor?example=${template.id}`}
              className="group flex flex-col bg-box p-7 transition-colors hover:bg-box-hover"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-box-muted/70">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-box-muted transition-colors group-hover:text-primary" />
              </div>
              <h3 className="mt-5 text-base font-semibold tracking-tight text-box-foreground">
                {template.name}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-box-muted">
                {template.description}
              </p>
              <span className="label-mono-sm mt-5 text-box-muted">
                {template.category}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
