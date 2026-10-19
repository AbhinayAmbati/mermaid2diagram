import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

import { HeroPreview } from "./hero-preview";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 grid-bg-dots opacity-60 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]"
      />
      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground shadow-subtle">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            In-browser Mermaid editor & exporter
          </span>

          <h1 className="mt-6 text-balance text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
            From Mermaid Code to{" "}
            <span className="text-primary">Beautiful Diagrams.</span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            Write or paste Mermaid syntax. Preview your diagrams instantly,
            refine the details, and export crisp visuals in the format you need.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" asChild className="w-full gap-2 sm:w-auto">
              <Link href="/editor">
                Start Creating
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="w-full sm:w-auto"
            >
              <a href="#examples">Explore Examples</a>
            </Button>
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            No account required · Everything runs in your browser
          </p>
        </div>

        <div className="mt-14">
          <HeroPreview />
        </div>
      </div>
    </section>
  );
}
