import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Buttons are uppercase monospace with wide letter-spacing - the signature
 * control style of the design system.
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm font-mono text-[11px] font-medium uppercase tracking-[0.12em] transition-[background-color,color,border-color,box-shadow] duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-45 [&_svg]:pointer-events-none [&_svg]:size-3.5 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary-hover",
        secondary:
          "border border-border bg-card text-foreground hover:bg-secondary",
        outline:
          "border border-border bg-transparent text-foreground hover:bg-secondary",
        ghost: "text-foreground hover:bg-secondary",
        soft: "bg-accent text-accent-foreground hover:bg-accent/70",
        dark: "border border-panel-line bg-panel-2 text-on-panel hover:bg-white/10",
        light: "border border-box-line bg-box text-box-foreground hover:bg-box-hover",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        link: "font-sans text-sm normal-case tracking-normal text-foreground underline underline-offset-4 hover:text-muted-foreground",
      },
      size: {
        default: "h-9 px-4",
        sm: "h-7 px-3 text-[10px]",
        lg: "h-10 px-5 text-[12px]",
        icon: "h-8 w-8",
        "icon-sm": "h-7 w-7",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
