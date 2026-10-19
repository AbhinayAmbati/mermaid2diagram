import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { TEMPLATES } from "@/lib/examples/templates";

/** A compact gallery of real templates; each card opens the editor preloaded. */
export function ExampleGallery() {
  return (
    <section id="examples" className="border-b border-border bg-secondary/40">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Start from an example
          </h2>
          <p className="mt-3 text-muted-foreground">
            Pick a template and it opens straight in the editor, ready to tweak
            and export.
          </p>
        </div>

        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {TEMPLATES.map((template) => (
            <Link
              key={template.id}
              href={`/editor?example=${template.id}`}
              className="group flex flex-col rounded-xl border border-border bg-card p-5 shadow-subtle transition-colors hover:border-primary/40 hover:bg-accent/40"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-sm font-semibold">{template.name}</h3>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
              </div>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {template.description}
              </p>
              <Badge variant="outline" className="mt-4 w-fit">
                {template.category}
              </Badge>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
