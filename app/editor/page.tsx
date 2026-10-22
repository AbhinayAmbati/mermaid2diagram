import type { Metadata } from "next";
import { Suspense } from "react";

import { EditorWorkspace } from "@/components/editor/editor-workspace";
import { site, siteUrl } from "@/lib/seo/site";

export const metadata: Metadata = {
  title: "Editor",
  description:
    "Write or paste Mermaid code, preview it instantly, and export SVG, PNG, WebP, PDF or JPEG. No account, no sign-up, everything runs in your browser.",
  alternates: { canonical: "/editor" },
  openGraph: {
    type: "website",
    url: `${siteUrl}/editor`,
    title: `Editor · ${site.name}`,
    description:
      "Write or paste Mermaid code, preview it instantly, and export SVG, PNG, WebP, PDF or JPEG.",
  },
};

export default function EditorPage() {
  return (
    <Suspense fallback={<div className="h-dvh w-full" aria-hidden />}>
      <EditorWorkspace />
    </Suspense>
  );
}
