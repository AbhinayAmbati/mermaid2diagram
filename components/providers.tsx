"use client";

import { TooltipProvider } from "@/components/ui/tooltip";

/** Global client-side providers shared by every route. */
export function Providers({ children }: { children: React.ReactNode }) {
  return <TooltipProvider delayDuration={300}>{children}</TooltipProvider>;
}
