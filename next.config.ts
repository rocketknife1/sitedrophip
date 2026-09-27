import type { NextConfig } from "next";

/**
 * GITHUB_PAGES=true builds a static preview for GitHub Pages (see .github/workflows/pages.yml).
 * Without it, this is the full store with checkout, emails and forms (e.g. on Vercel).
 */
const isPages = process.env.GITHUB_PAGES === "true";
const basePath = isPages ? "/sitedrophip" : "";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
    NEXT_PUBLIC_STATIC_PREVIEW: isPages ? "true" : "false",
  },
  ...(isPages && {
    output: "export",
    basePath,
    trailingSlash: true,
    // GitHub Pages cannot optimise images; the loader only adds the base path.
    images: { loader: "custom", loaderFile: "./src/lib/static-image-loader.ts" },
  }),
};

export default nextConfig;
