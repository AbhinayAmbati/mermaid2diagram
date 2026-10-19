import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Underline input: no box, no fill — just a hairline rule that darkens on
 * focus, matching the reference's form fields.
 */
const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "h-9 w-full border-0 border-b border-input bg-transparent px-0 py-1.5 text-sm text-foreground transition-colors placeholder:text-muted-foreground/60 focus-visible:border-foreground focus-visible:shadow-[0_1px_0_0_var(--foreground)] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
