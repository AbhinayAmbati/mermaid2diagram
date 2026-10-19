import { cn } from "@/lib/utils";

/** The Mermaid Studio mark: a minimal node-and-edge glyph. */
export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={cn("h-5 w-5", className)}
    >
      <rect
        x="1.5"
        y="2.5"
        width="8"
        height="6"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <rect
        x="14.5"
        y="2.5"
        width="8"
        height="6"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <rect
        x="8"
        y="15.5"
        width="8"
        height="6"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M9.5 5.5h5M5.5 8.5v4a3 3 0 0 0 3 3h0M18.5 8.5v4a3 3 0 0 1-3 3h0"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
