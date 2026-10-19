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
    value: "SVG · PNG · PDF · JPEG · .mmd",
  },
];

export function Hero() {
  return (
    <section className="px-4 pb-16 pt-6 sm:pb-24 sm:pt-10">
      <div className="mx-auto grid max-w-[1320px] items-start gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:gap-16">
        {/* Left: statement */}
        <div className="pt-4 lg:pt-14">
          <h1 className="text-balance text-[2.5rem] font-medium leading-[1.05] tracking-[-0.03em] sm:text-[3.25rem]">
            From Mermaid Code to{" "}
            <span className="text-muted-foreground/45">
              Beautiful Diagrams.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-pretty text-[1.0625rem] leading-relaxed text-muted-foreground">
            Write or paste Mermaid syntax. Preview your diagrams instantly,
            refine the details, and export crisp visuals in the format you need.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" asChild className="gap-2">
              <Link href="/editor">
                Start Creating
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
            <Button size="lg" variant="light" asChild>
              <a href="#examples">Explore Examples</a>
            </Button>
          </div>

          <dl className="mt-12 max-w-xl">
            {SPEC_ROWS.map((row) => (
              <div
                key={row.label}
                className="border-t border-border py-4 last:border-b"
              >
                <dt className="label-mono text-muted-foreground">{row.label}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-foreground">
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>

          <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
            No account required · Runs in your browser
          </p>
        </div>

        {/* Right: live result panel */}
        <HeroPreview />
      </div>
    </section>
  );
}
