import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { SiteFooter } from "@/components/landing/site-footer";
import { SiteHeader } from "@/components/landing/site-header";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Page not found",
  // A 404 must never be indexed.
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="flex flex-1 items-center px-4 py-20">
        <div className="mx-auto w-full max-w-[1320px]">
          <span className="label-mono text-muted-foreground">404</span>
          <h1 className="mt-4 max-w-2xl text-balance text-[2rem] font-medium leading-tight tracking-[-0.03em] sm:text-[2.75rem]">
            That page does not exist.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
            The link may be broken or the page may have moved. The editor is
            still where you left it.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" asChild className="gap-2">
              <Link href="/editor">
                Open the editor
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/">Back to home</Link>
            </Button>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
