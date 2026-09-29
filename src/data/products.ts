import { z } from "zod";

import catalog from "./products.json";

/**
 * Public catalog. Safe to ship to the browser: no supplier data here.
 * Supplier SKUs and costs live in `supplier.ts`, which is server-only.
 */

const variantSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string(),
  priceCents: z.number().int().positive(),
  /** Original price, only if the product was really sold at it before (EU Omnibus rule). */
  compareAtCents: z.number().int().positive().optional(),
  inStock: z.boolean().default(true),
  /** Index into `images` shown when this variant is selected. */
  image: z.number().int().min(0).optional(),
  /** Colour swatch shown instead of a text pill. */
  swatch: z.string().optional(),
});

const productSchema = z.object({
  id: z.string(),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string(),
  category: z.string(),
  tagline: z.string(),
  description: z.array(z.string()).min(1),
  highlights: z.array(z.string()).min(1),
  specs: z.array(z.object({ label: z.string(), value: z.string() })),
  images: z.array(z.object({ src: z.string(), alt: z.string() })).min(1),
  variants: z.array(variantSchema).min(1),
  variantLabel: z.string().default("Option"),
  inTheBox: z.array(z.string()).default([]),
  faq: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
  featured: z.boolean().default(false),
  demo: z.boolean().default(false),
  /** Real market data behind the pick (never our own sales). Shown as "Trending". */
  trend: z
    .object({ stat: z.string(), detail: z.string(), source: z.string(), url: z.string().url().default("https://www.shopify.com/blog/trending-products") })
    .optional(),
});

export type Product = z.infer<typeof productSchema>;
export type Variant = z.infer<typeof variantSchema>;

/**
 * The catalog itself lives in products.json, so products, prices and texts can be
 * edited without touching code (e.g. from the Organizator app, which commits that
 * file). It is validated here at build time: an invalid edit fails the build and the
 * live site keeps its previous version.
 */

export const products: Product[] = z.array(productSchema).parse(catalog.products);

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function findVariant(variantId: string): { product: Product; variant: Variant } | undefined {
  for (const product of products) {
    const variant = product.variants.find((v) => v.id === variantId);
    if (variant) return { product, variant };
  }
  return undefined;
}

export function lowestPrice(product: Product): number {
  return Math.min(...product.variants.map((v) => v.priceCents));
}

/** Image for a variant: its own photo if it has one, otherwise the product's first photo. */
export function variantImage(product: Product, variant: Variant) {
  return product.images[variant.image ?? 0] ?? product.images[0];
}

const CATEGORY_ORDER = ["Tech", "Home", "Kitchen", "Fitness", "Fashion", "Home office", "Car", "Pets", "Beauty"];
export const categories = CATEGORY_ORDER.filter((c) => products.some((p) => p.category === c));
