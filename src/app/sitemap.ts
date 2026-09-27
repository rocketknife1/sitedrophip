import type { MetadataRoute } from "next";

import { legalPages } from "@/content/legal";
import { products } from "@/data/products";
import { site } from "@/data/site";

// Generated once at build time (also required for the static GitHub Pages export).
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = ["", "/products", "/contact", "/withdrawal"];
  return [
    ...staticPaths.map((path) => ({ url: `${site.url}${path}`, changeFrequency: "weekly" as const, priority: path === "" ? 1 : 0.7 })),
    ...products.map((p) => ({ url: `${site.url}/products/${p.slug}`, changeFrequency: "weekly" as const, priority: 0.9 })),
    ...Object.keys(legalPages).map((slug) => ({ url: `${site.url}/legal/${slug}`, changeFrequency: "yearly" as const, priority: 0.2 })),
  ];
}
