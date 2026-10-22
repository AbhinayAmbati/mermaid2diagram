"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowUpRight, Github, Menu } from "lucide-react";

import { BrandLockup } from "@/components/layout/logo";
import { NavDivider, NavLink, NavPill } from "@/components/layout/nav-pill";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "#engine", label: "Engine" },
  { href: "#features", label: "Features" },
  { href: "#formats", label: "Exports" },
  { href: "#examples", label: "Examples" },
];

const REPO_URL = "https://github.com/AbhinayAmbati/mermaid2diagram";

/**
 * The landing page's floating navigation pill.
 *
 * Wide screens show the section links inline. Below `lg` they collapse into a
 * sheet so no destination is unreachable on a phone, the GitHub shortcut drops
 * out below `sm`, and the wordmark falls away under 420px to leave room for the
 * controls. What remains is the mark, the theme toggle, the primary action and
 * the menu button.
 */
export function SiteHeader() {
  const [open, setOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 px-3 py-3 sm:px-4 sm:py-4">
      <NavPill className="w-full sm:w-fit">
        <Link
          href="/"
          className="flex min-w-0 items-center rounded-pill py-1 pl-1.5 pr-2.5 transition-opacity hover:opacity-85"
        >
          <BrandLockup tone="nav" wordmarkClassName="hidden min-[420px]:inline" />
        </Link>

        <NavDivider className="hidden lg:block" />

        <nav data-testid="desktop-nav" className="hidden items-center lg:flex">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.href} href={link.href}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <NavDivider className="hidden lg:block" />

        <div className="ml-auto flex items-center gap-0.5 lg:ml-0">
          <Button
            variant="ghost"
            size="icon-sm"
            asChild
            aria-label="View source on GitHub"
            className="hidden rounded-pill text-nav-muted hover:bg-nav-hover hover:text-nav-foreground sm:inline-flex"
          >
            <a href={REPO_URL} target="_blank" rel="noreferrer noopener">
              <Github className="h-4 w-4" />
            </a>
          </Button>

          <ThemeToggle tone="nav" />

          <Button size="sm" asChild className="ml-1 gap-1.5 rounded-pill">
            <Link href="/editor">
              Open editor
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Open menu"
                className="rounded-pill text-nav-muted hover:bg-nav-hover hover:text-nav-foreground lg:hidden"
              >
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="flex w-[86vw] max-w-xs flex-col"
            >
              <SheetHeader className="text-left">
                <SheetTitle className="label-mono text-muted-foreground">
                  Menu
                </SheetTitle>
              </SheetHeader>

              <nav data-testid="mobile-nav" className="mt-2 flex flex-col">
                {NAV_LINKS.map((link) => (
                  <SheetClose asChild key={link.href}>
                    <a
                      href={link.href}
                      className="rounded-lg px-3 py-3 text-[15px] font-medium text-foreground transition-colors hover:bg-secondary"
                    >
                      {link.label}
                    </a>
                  </SheetClose>
                ))}
              </nav>

              <SheetClose asChild>
                <a
                  href={REPO_URL}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="mt-1 flex items-center gap-2 rounded-lg px-3 py-3 text-[15px] font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  <Github className="h-4 w-4" />
                  View source
                </a>
              </SheetClose>

              <div className="mt-auto border-t border-border pt-4">
                <SheetClose asChild>
                  <Link
                    href="/editor"
                    className={cn(
                      buttonVariants({ size: "lg" }),
                      "w-full gap-2"
                    )}
                  >
                    Open editor
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </NavPill>
    </header>
  );
}
