"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Monitor, Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TooltipButton } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const OPTIONS = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
] as const;

export function ThemeToggle({
  className,
  tone = "default",
}: {
  className?: string;
  /** `nav` styles the trigger for the dark floating pill. */
  tone?: "default" | "nav";
}) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  const active = OPTIONS.find((o) => o.value === theme) ?? OPTIONS[0];
  const ActiveIcon = mounted ? active.icon : Sun;

  return (
    <DropdownMenu>
      <TooltipButton label="Theme">
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Change theme"
            className={cn(
              tone === "nav" &&
                "rounded-pill text-nav-muted hover:bg-nav-hover hover:text-nav-foreground",
              className
            )}
          >
            <ActiveIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
      </TooltipButton>
      <DropdownMenuContent align="end" className="w-44">
        {OPTIONS.map((option) => {
          const Icon = option.icon;
          return (
            <DropdownMenuItem
              key={option.value}
              onClick={() => setTheme(option.value)}
              className="gap-2.5"
            >
              <Icon className="h-4 w-4" />
              <span>{option.label}</span>
              {mounted && theme === option.value && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
