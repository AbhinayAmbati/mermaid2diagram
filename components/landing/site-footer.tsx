import Link from "next/link";

import { Logo } from "@/components/layout/logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <span className="text-primary">
            <Logo className="h-4 w-4" />
          </span>
          <span className="text-sm font-medium">Mermaid Studio</span>
          <span className="text-xs text-muted-foreground">
            Built with Next.js &amp; Mermaid
          </span>
        </div>

        <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
          <Link href="/editor" className="transition-colors hover:text-foreground">
            Editor
          </Link>
          <a
            href="https://mermaid.js.org/intro/"
            target="_blank"
            rel="noreferrer noopener"
            className="transition-colors hover:text-foreground"
          >
            Mermaid docs
          </a>
          <a
            href="https://github.com/AbhinayAmbati/mermaid2diagram"
            target="_blank"
            rel="noreferrer noopener"
            className="transition-colors hover:text-foreground"
          >
            GitHub
          </a>
        </nav>
      </div>
    </footer>
  );
}
