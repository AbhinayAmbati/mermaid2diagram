"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * The floating navigation pill - a dark, rounded bar that hovers above the
 * page in both light and dark themes. This is the most recognisable element of
 * the design system.
 */
export function NavPill({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mx-auto flex w-fit max-w-full items-center gap-0.5 rounded-pill border border-black/[0.06] bg-nav p-2 text-nav-foreground shadow-pill",
        className
      )}
    >
      {children}
    </div>
  );
}

/** Text link inside the pill. */
export function NavLink({
  children,
  className,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      className={cn(
        "flex items-center gap-1 rounded-pill px-3 py-1.5 text-sm font-medium text-nav-muted transition-colors hover:bg-nav-hover hover:text-nav-foreground",
        className
      )}
      {...props}
    >
      {children}
    </a>
  );
}

/** Thin vertical divider between pill groups. */
export function NavDivider({ className }: { className?: string }) {
  return (
    <span
      className={cn("mx-1.5 h-6 w-px shrink-0 bg-nav-line", className)}
      aria-hidden
    />
  );
}
