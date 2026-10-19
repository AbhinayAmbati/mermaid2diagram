"use client";

import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

import { cn } from "@/lib/utils";

const ResizablePanelGroup = ({
  className,
  ...props
}: React.ComponentProps<typeof PanelGroup>) => (
  <PanelGroup className={cn("flex h-full w-full", className)} {...props} />
);

const ResizablePanel = Panel;

const ResizableHandle = ({
  withHandle,
  className,
  ...props
}: React.ComponentProps<typeof PanelResizeHandle> & {
  withHandle?: boolean;
}) => (
  <PanelResizeHandle
    className={cn(
      "group relative flex w-px items-center justify-center bg-border transition-colors data-[resize-handle-state=hover]:bg-foreground/40 data-[resize-handle-state=drag]:bg-primary",
      className
    )}
    {...props}
  >
    {withHandle && (
      <div className="z-10 flex h-9 w-3 items-center justify-center rounded-full border border-border bg-card opacity-0 transition-opacity group-hover:opacity-100 group-data-[resize-handle-state=drag]:opacity-100">
        <div className="h-3.5 w-px bg-muted-foreground/60" />
      </div>
    )}
  </PanelResizeHandle>
);

export { ResizablePanelGroup, ResizablePanel, ResizableHandle };
