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
  "phone-stand-silver": { sku: "[SUP-PHONE-STAND-SILVER]", costCents: 870, supplierName: "[Supplier]" },
  "power-bank-green": { sku: "[SUP-POWER-BANK-GREEN]", costCents: 1220, supplierName: "[Supplier]" },
  "item-finder-1": { sku: "[SUP-ITEM-FINDER-1]", costCents: 700, supplierName: "[Supplier]" },
  "item-finder-4": { sku: "[SUP-ITEM-FINDER-4]", costCents: 2100, supplierName: "[Supplier]" },
  "dash-cam-2k": { sku: "[SUP-DASH-CAM-2K]", costCents: 2450, supplierName: "[Supplier]" },
  "car-mount-black": { sku: "[SUP-CAR-MOUNT-BLACK]", costCents: 800, supplierName: "[Supplier]" },
  "linen-set-double": { sku: "[SUP-LINEN-SET-DOUBLE]", costCents: 4160, supplierName: "[Supplier]" },
  "linen-set-king": { sku: "[SUP-LINEN-SET-KING]", costCents: 4860, supplierName: "[Supplier]" },
  "topper-140": { sku: "[SUP-TOPPER-140]", costCents: 3120, supplierName: "[Supplier]" },
  "topper-160": { sku: "[SUP-TOPPER-160]", costCents: 3460, supplierName: "[Supplier]" },
  "candle-fig": { sku: "[SUP-CANDLE-FIG]", costCents: 700, supplierName: "[Supplier]" },
  "candle-linen": { sku: "[SUP-CANDLE-LINEN]", costCents: 700, supplierName: "[Supplier]" },
  "candle-amber": { sku: "[SUP-CANDLE-AMBER]", costCents: 700, supplierName: "[Supplier]" },
  "bottle-sage": { sku: "[SUP-BOTTLE-SAGE]", costCents: 870, supplierName: "[Supplier]" },
  "bottle-coral": { sku: "[SUP-BOTTLE-CORAL]", costCents: 870, supplierName: "[Supplier]" },
  "bottle-mint": { sku: "[SUP-BOTTLE-MINT]", costCents: 870, supplierName: "[Supplier]" },
  "bottle-lilac": { sku: "[SUP-BOTTLE-LILAC]", costCents: 870, supplierName: "[Supplier]" },
  "frother-black": { sku: "[SUP-FROTHER-BLACK]", costCents: 520, supplierName: "[Supplier]" },
  "massage-gun-black": { sku: "[SUP-MASSAGE-GUN-BLACK]", costCents: 2100, supplierName: "[Supplier]" },
  "bands-set": { sku: "[SUP-BANDS-SET]", costCents: 870, supplierName: "[Supplier]" },
  "yoga-mat-sage": { sku: "[SUP-YOGA-MAT-SAGE]", costCents: 1570, supplierName: "[Supplier]" },
  "satchel-tan": { sku: "[SUP-SATCHEL-TAN]", costCents: 3150, supplierName: "[Supplier]" },
  "satchel-brown": { sku: "[SUP-SATCHEL-BROWN]", costCents: 3150, supplierName: "[Supplier]" },
  "socks-36-40": { sku: "[SUP-SOCKS-36-40]", costCents: 590, supplierName: "[Supplier]" },
  "socks-41-46": { sku: "[SUP-SOCKS-41-46]", costCents: 590, supplierName: "[Supplier]" },
  "harness-s": { sku: "[SUP-HARNESS-S]", costCents: 1050, supplierName: "[Supplier]" },
  "harness-m": { sku: "[SUP-HARNESS-M]", costCents: 1050, supplierName: "[Supplier]" },
  "harness-l": { sku: "[SUP-HARNESS-L]", costCents: 1150, supplierName: "[Supplier]" },
  "grooming-brush": { sku: "[SUP-GROOMING-BRUSH]", costCents: 630, supplierName: "[Supplier]" },
  "vanity-mirror-white": { sku: "[SUP-VANITY-MIRROR-WHITE]", costCents: 2800, supplierName: "[Supplier]" },
};

// Fail loudly at build time if a variant has no supplier entry: an unfulfillable order is worse than a failed build.
for (const product of products) {
  for (const variant of product.variants) {
    if (!supplier[variant.id]) {
      throw new Error(`Missing supplier entry for variant "${variant.id}" in src/data/supplier.ts`);
    }
  }
}
