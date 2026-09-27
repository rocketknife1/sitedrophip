import type { MetadataRoute } from "next";

import { site } from "@/data/site";

// Generated once at build time (also required for the static GitHub Pages export).
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  if (site.demoMode) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/cart", "/checkout/", "/api/"] },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
