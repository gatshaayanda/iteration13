import type { MetadataRoute } from "next";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://iteration13.example";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: baseUrl, changeFrequency: "weekly", priority: 1 },
    { url: baseUrl + "/patterns", changeFrequency: "monthly", priority: 0.4 },
    { url: baseUrl + "/iphone-install", changeFrequency: "monthly", priority: 0.3 }
  ];
}
