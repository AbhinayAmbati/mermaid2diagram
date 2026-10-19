import Link from "next/link";
import { ArrowRight, Github } from "lucide-react";

import { Logo } from "@/components/layout/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { href: "#features", label: "Features" },
  { href: "#diagram-types", label: "Diagram types" },
  { href: "#formats", label: "Exports" },
  { href: "#examples", label: "Examples" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-2 px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-primary">
            <Logo />
          </span>
          <span className="text-sm font-semibold tracking-tight">
            Mermaid Studio
          </span>
          <Badge variant="soft" className="hidden sm:inline-flex">
            BETA
          </Badge>
        </Link>

        <nav className="ml-6 hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="icon-sm"
            asChild
            aria-label="View source on GitHub"
          >
            <a
              href="https://github.com/AbhinayAmbati/mermaid2diagram"
              target="_blank"
              rel="noreferrer noopener"
            >
              <Github className="h-4 w-4" />
            </a>
          </Button>
          <ThemeToggle />
          <Button size="sm" asChild className="gap-1.5">
            <Link href="/editor">
              Open editor
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
