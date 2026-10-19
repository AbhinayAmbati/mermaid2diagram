import { FinalCta } from "@/components/landing/cta";
import { DiagramTypes } from "@/components/landing/diagram-types";
import { ExampleGallery } from "@/components/landing/example-gallery";
import { ExportFormats } from "@/components/landing/export-formats";
import { FeatureGrid } from "@/components/landing/feature-grid";
import { Hero } from "@/components/landing/hero";
import { SiteFooter } from "@/components/landing/site-footer";
import { SiteHeader } from "@/components/landing/site-header";

export default function LandingPage() {
  return (
    <div className="min-h-dvh bg-background">
      <SiteHeader />
      <main>
        <Hero />
        <FeatureGrid />
        <DiagramTypes />
        <ExportFormats />
        <ExampleGallery />
        <FinalCta />
      </main>
      <SiteFooter />
    </div>
  );
}
