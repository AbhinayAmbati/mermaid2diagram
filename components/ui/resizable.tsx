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

/**
 * The split handle is a gutter with an always-visible divider line plus a grip
 * in the middle, so it is obvious that the panes can be dragged. Both light up
 * in the accent colour on hover and while dragging.
 */
const ResizableHandle = ({
  withHandle,
  className,
  ...props
}: React.ComponentProps<typeof PanelResizeHandle> & {
  withHandle?: boolean;
}) => (
  <PanelResizeHandle
    className={cn(
      "group relative flex w-1.5 shrink-0 cursor-col-resize items-center justify-center bg-card",
      className
    )}
    {...props}
  >
    <span
      aria-hidden
      className="pointer-events-none absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-border transition-colors group-hover:bg-primary group-data-[resize-handle-state=drag]:bg-primary"
    />
    {withHandle && (
      <span
        aria-hidden
        className="pointer-events-none absolute top-1/2 h-10 w-[3px] -translate-y-1/2 rounded-full bg-border transition-colors group-hover:bg-primary group-data-[resize-handle-state=drag]:bg-primary"
      />
    )}
  </PanelResizeHandle>
);

export { ResizablePanelGroup, ResizablePanel, ResizableHandle };
