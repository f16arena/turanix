import type { MetadataRoute } from "next";

const baseUrl = "https://turanix.kz";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/offer", "/privacy"].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date("2026-05-23"),
    changeFrequency: path === "" ? "monthly" : "yearly",
    priority: path === "" ? 1 : 0.6,
  }));
}
