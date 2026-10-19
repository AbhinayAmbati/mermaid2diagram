import * as React from "react";

import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[84px] w-full border-0 border-b border-input bg-transparent px-0 py-2 text-sm text-foreground transition-colors placeholder:text-muted-foreground/60 focus-visible:border-foreground focus-visible:shadow-[0_1px_0_0_var(--foreground)] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
