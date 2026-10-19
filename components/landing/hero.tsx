import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

import { HeroPreview } from "./hero-preview";

const SPEC_ROWS = [
  {
    label: "Engine",
    value: "Mermaid v11: flowcharts, sequence, class, ER, Gantt, mindmaps",
  },
  {
    label: "Editor",
    value: "CodeMirror 6 with Mermaid syntax highlighting",
  },
  {
    label: "Exports",
    value: "SVG · PNG · WebP · PDF · JPEG · .mmd",
  },
];

/**
 * The hero fills exactly one viewport beneath the navigation bar, so it needs
 * no scrolling on a typical laptop. Both columns are top-aligned by the grid,
 * and the section centres the pair vertically on taller screens.
 */
export function Hero() {
  return (
    <section className="flex min-h-[calc(100dvh-4.5rem)] items-center px-4 py-6 sm:min-h-[calc(100dvh-5rem)]">
      <div className="mx-auto grid w-full max-w-[1320px] items-start gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)] lg:gap-14">
        {/* Left: statement */}
        <div>
          <h1 className="text-balance text-[2.25rem] font-medium leading-[1.05] tracking-[-0.03em] sm:text-[2.75rem] lg:text-[2.875rem]">
            From Mermaid Code to{" "}
            <span className="text-muted-foreground/45">Beautiful Diagrams.</span>
          </h1>

          <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground">
            Write or paste Mermaid syntax. Preview your diagrams instantly,
            refine the details, and export crisp visuals in the format you need.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" asChild className="gap-2">
              <Link href="/editor">
                Start Creating
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <a href="#examples">Explore Examples</a>
            </Button>
          </div>

          <dl className="mt-7 max-w-xl">
            {SPEC_ROWS.map((row) => (
              <div
                key={row.label}
                className="border-t border-border py-4 last:border-b"
              >
                <dt className="label-mono text-muted-foreground">{row.label}</dt>
                <dd className="mt-2 text-sm leading-snug text-foreground">
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>

          <p className="mt-7 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
            No account required · Runs in your browser
          </p>
        </div>

        {/* Right: live result panel */}
        <HeroPreview />
      </div>
    </section>
  );
}
