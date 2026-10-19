import { cn } from "@/lib/utils";

/**
 * The Mermaid Studio mark: a lime tile holding a node-and-connector glyph —
 * the same shape language the product draws.
 */
export function Logo({
  className,
  size = 28,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-[7px] bg-primary text-primary-foreground",
        className
      )}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ width: size * 0.62, height: size * 0.62 }}
      >
        <rect x="2.5" y="3" width="8.5" height="6" rx="2" />
        <rect x="13" y="15" width="8.5" height="6" rx="2" />
        <path d="M11 6h3.2a2.3 2.3 0 0 1 2.3 2.3V15" />
      </svg>
    </span>
  );
}

/**
 * Mark plus wordmark.
 *
 * `tone="nav"` renders for the dark floating pill (light text); the default
 * tone inherits the page theme, for the theme-synced editor bar.
 */
export function BrandLockup({
  className,
  tone = "default",
}: {
  className?: string;
  tone?: "default" | "nav";
}) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <Logo size={26} />
      <span
        className={cn(
          "text-[15px] font-semibold tracking-tight",
          tone === "nav" ? "text-nav-foreground" : "text-foreground"
        )}
      >
        Mermaid Studio
      </span>
    </span>
  );
}
