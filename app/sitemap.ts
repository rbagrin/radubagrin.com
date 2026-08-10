import type { MetadataRoute } from "next";
import { modules } from "@/lib/modules";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://radubagrin.com";

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/modules`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  const moduleRoutes: MetadataRoute.Sitemap = modules.map((mod) => ({
    url: `${baseUrl}/modules/${mod.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...moduleRoutes];
}
