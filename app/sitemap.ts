import type { MetadataRoute } from "next";

import { siteUrl } from "@/lib/seo/site";

export default function sitemap(): MetadataRoute.Sitemap {
  // A build-time timestamp is honest: the pages are static and regenerate on
  // every deploy, so this tracks the last time the content actually changed.
  const lastModified = new Date();

  return [
    {
      url: `${siteUrl}/`,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/editor`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];
}
