import "server-only";

import { products } from "./products";

/**
 * Supplier data per variant. Never imported by client code, so costs and SKUs stay private.
 * Fill these in from your supplier (CJ Dropshipping, BigBuy, a local wholesaler, …).
 */
export const supplier: Record<string, { sku: string; costCents: number; supplierName: string }> = {
  "laptop-stand-silver": { sku: "[SUP-SKU-001]", costCents: 1250, supplierName: "[Supplier]" },
  "desk-mat-charcoal": { sku: "[SUP-SKU-002-CH]", costCents: 1090, supplierName: "[Supplier]" },
  "desk-mat-forest": { sku: "[SUP-SKU-002-FO]", costCents: 1090, supplierName: "[Supplier]" },
  "desk-mat-blush": { sku: "[SUP-SKU-002-BL]", costCents: 1090, supplierName: "[Supplier]" },
  "desk-mat-cream": { sku: "[SUP-SKU-002-CR]", costCents: 1090, supplierName: "[Supplier]" },
  "light-bar-standard": { sku: "[SUP-SKU-003-S]", costCents: 1420, supplierName: "[Supplier]" },
  "light-bar-remote": { sku: "[SUP-SKU-003-R]", costCents: 2080, supplierName: "[Supplier]" },
  "headphone-stand-oak": { sku: "[SUP-SKU-004]", costCents: 920, supplierName: "[Supplier]" },
  "monitor-riser-80": { sku: "[SUP-SKU-005-80]", costCents: 2150, supplierName: "[Supplier]" },
  "monitor-riser-100": { sku: "[SUP-SKU-005-100]", costCents: 2540, supplierName: "[Supplier]" },
  "desk-tray-bamboo": { sku: "[SUP-SKU-006]", costCents: 740, supplierName: "[Supplier]" },
  "wireless-charger-walnut": { sku: "[SUP-SKU-007]", costCents: 980, supplierName: "[Supplier]" },
  "under-desk-holder-black": { sku: "[SUP-SKU-008]", costCents: 810, supplierName: "[Supplier]" },
};

// Fail loudly at build time if a variant has no supplier entry: an unfulfillable order is worse than a failed build.
for (const product of products) {
  for (const variant of product.variants) {
    if (!supplier[variant.id]) {
      throw new Error(`Missing supplier entry for variant "${variant.id}" in src/data/supplier.ts`);
    }
  }
}
