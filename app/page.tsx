import type { Metadata } from "next";

import { BlueprintSection } from "@/components/landing/blueprint-section";
import { FinalCta } from "@/components/landing/cta";
import { DiagramTypes } from "@/components/landing/diagram-types";
import { ExampleGallery } from "@/components/landing/example-gallery";
import { ExportFormats } from "@/components/landing/export-formats";
import { FeatureGrid } from "@/components/landing/feature-grid";
import { Hero } from "@/components/landing/hero";
import { SiteFooter } from "@/components/landing/site-footer";
import { SiteHeader } from "@/components/landing/site-header";
import { site, siteUrl } from "@/lib/seo/site";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: { url: siteUrl },
};

/**
 * Structured data for the landing page. Describes the site and the application
 * itself, which is what earns a rich result for a developer tool.
 */
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: site.name,
      description: site.description,
      inLanguage: "en",
      publisher: { "@id": `${siteUrl}/#author` },
    },
    {
      "@type": "Person",
      "@id": `${siteUrl}/#author`,
      name: site.author,
      url: site.authorUrl,
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${siteUrl}/#application`,
      name: site.name,
      url: `${siteUrl}/editor`,
      description: site.description,
      applicationCategory: "DeveloperApplication",
      applicationSubCategory: "Diagram editor",
      operatingSystem: "Any modern browser",
      browserRequirements: "Requires JavaScript",
      isAccessibleForFree: true,
      author: { "@id": `${siteUrl}/#author` },
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      featureList: [
        "Live Mermaid.js rendering",
        "CodeMirror editor with Mermaid syntax highlighting",
        "Zoom, pan and fit-to-screen canvas",
        "Export to SVG, PNG, WebP, PDF and JPEG",
        "Download the original .mmd source",
        "Appearance presets and Mermaid theme variables",
        "Twelve ready-made diagram templates",
      ],
    },
  ],
};

export default function LandingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        // Escaped so the payload can never terminate the script element.
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
      <SiteHeader />
      <main>
        <Hero />
        <BlueprintSection />
        <FeatureGrid />
        <DiagramTypes />
        <ExportFormats />
        <ExampleGallery />
        <FinalCta />
      </main>
      <SiteFooter />
    </>
  );
}
