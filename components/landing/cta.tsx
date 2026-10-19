import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

export function FinalCta() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-foreground px-6 py-14 text-center sm:px-12">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.15] [background-image:radial-gradient(#ffffff_1px,transparent_1px)] [background-size:22px_22px]"
          />
          <div className="relative">
            <h2 className="text-balance text-2xl font-semibold tracking-tight text-background sm:text-3xl">
              Your next diagram is one paste away.
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-pretty text-sm leading-relaxed text-background/70 sm:text-base">
              Open the editor, drop in your Mermaid code and export a crisp file
              in seconds — no sign-up, no server round-trips.
            </p>
            <div className="mt-8 flex justify-center">
              <Button size="lg" asChild className="gap-2">
                <Link href="/editor">
                  Start Creating
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
