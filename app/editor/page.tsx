import type { Metadata } from "next";
import { Suspense } from "react";

import { EditorWorkspace } from "@/components/editor/editor-workspace";

export const metadata: Metadata = {
  title: "Editor",
  description:
    "Write Mermaid code, preview it instantly and export SVG, PNG, PDF or JPEG.",
};

export default function EditorPage() {
  return (
    <Suspense fallback={<div className="h-dvh w-full" aria-hidden />}>
      <EditorWorkspace />
    </Suspense>
  );
}
