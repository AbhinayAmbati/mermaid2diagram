/**
 * Single source of truth for the canonical origin and the site's copy, so the
 * page metadata, robots.txt and the sitemap can never disagree with each other.
 */
function resolveSiteUrl(): string {
  // 1. An explicit value always wins. Set this to your custom domain.
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/+$/, "");

  // 2. Vercel injects the production domain on every deployment, so previews
  //    and production resolve to a real origin without any configuration.
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel.replace(/\/+$/, "")}`;

  // 3. Local development.
  return "http://localhost:3000";
}

export const siteUrl = resolveSiteUrl();

export const site = {
  name: "mermaid2diagram",
  tagline: "From Mermaid code to beautiful diagrams",
  shortDescription:
    "Turn Mermaid.js code into beautiful diagrams, right in your browser.",
  description:
    "Turn Mermaid.js code into beautiful diagrams. Paste syntax, preview instantly, style it and export SVG, PNG, WebP, PDF or JPEG. Free, no account, all in your browser.",
  author: "Abhinay Ambati",
  authorUrl: "https://github.com/AbhinayAmbati",
  repoUrl: "https://github.com/AbhinayAmbati/mermaid2diagram",
  locale: "en_US",
  themeColor: "#c8f73c",
  backgroundColor: "#0b1a15",
  keywords: [
    "mermaid",
    "mermaid.js",
    "mermaid editor",
    "mermaid live editor",
    "mermaid to svg",
    "mermaid to png",
    "mermaid to webp",
    "mermaid diagram generator",
    "flowchart maker",
    "sequence diagram editor",
    "class diagram tool",
    "entity relationship diagram",
    "gantt chart maker",
    "mindmap editor",
    "diagram export",
    "developer tools",
  ],
} as const;

/** Absolute URL helper, so nothing depends on how metadataBase is set. */
export function absoluteUrl(path = "/"): string {
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}
