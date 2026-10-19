import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

export function FinalCta() {
  return (
    <section className="px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-[1320px]">
        <div className="chamfer-lg-tl-br relative overflow-hidden bg-panel px-6 py-16 text-center sm:px-16 sm:py-24">
          <div className="blueprint-grid absolute inset-0" aria-hidden />
          <div className="relative">
            <span className="label-mono text-signal">Ready when you are</span>
            <h2 className="mx-auto mt-5 max-w-3xl text-balance text-[2rem] font-medium leading-[1.1] tracking-[-0.03em] text-on-panel sm:text-[3rem]">
              Your next diagram is one paste away.
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-pretty text-[0.9375rem] leading-relaxed text-on-panel-muted">
              Open the editor, drop in your Mermaid code and export a crisp file
              in seconds, with no sign-up and no server round-trips.
            </p>
            <div className="mt-9 flex justify-center">
              <Button size="lg" asChild className="gap-2">
                <Link href="/editor">
                  Start Creating
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
