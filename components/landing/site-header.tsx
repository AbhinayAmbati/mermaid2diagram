import Link from "next/link";
import { ArrowUpRight, Github } from "lucide-react";

import { BrandLockup } from "@/components/layout/logo";
import { NavDivider, NavLink, NavPill } from "@/components/layout/nav-pill";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { href: "#engine", label: "Engine" },
  { href: "#features", label: "Features" },
  { href: "#formats", label: "Exports" },
  { href: "#examples", label: "Examples" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 px-3 py-3 sm:px-4 sm:py-4">
      <NavPill>
        <Link
          href="/"
          className="flex items-center rounded-pill py-1 pl-1.5 pr-2.5 transition-opacity hover:opacity-85"
        >
          <BrandLockup />
        </Link>

        <NavDivider />

        <nav className="hidden items-center lg:flex">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.href} href={link.href}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <NavDivider />

        <Button
          variant="ghost"
          size="icon-sm"
          asChild
          aria-label="View source on GitHub"
          className="rounded-pill text-nav-muted hover:bg-nav-hover hover:text-nav-foreground"
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

        <Button size="sm" asChild className="ml-1 gap-1.5 rounded-pill">
          <Link href="/editor">
            Open editor
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </NavPill>
    </header>
  );
}
