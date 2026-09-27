"use client";

import Image from "next/image";

import { products } from "@/data/products";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/store/cart";
import { Plus } from "lucide-react";

/** Suggests single-variant products that are not in the cart yet. */
export function CartUpsell() {
  const items = useCart((s) => s.items);
  const add = useCart((s) => s.add);
  const inCart = new Set(items.map((i) => i.variantId));
  const suggestions = products
    .filter((p) => p.variants.length === 1 && p.variants[0].inStock && !inCart.has(p.variants[0].id))
    .sort((a, b) => a.variants[0].priceCents - b.variants[0].priceCents)
    .slice(0, 2);

  if (suggestions.length === 0) return null;

  return (
    <div className="border-t py-4">
      <h3 className="mb-3 text-sm font-semibold">You might also like</h3>
      <ul className="space-y-3">
        {suggestions.map((p) => (
          <li key={p.id} className="flex items-center gap-3">
            <div className="relative size-14 shrink-0 overflow-hidden rounded-md bg-surface">
              <Image src={p.images[0].src} alt="" fill sizes="56px" className="object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{p.name}</p>
              <p className="text-sm text-muted-foreground">{formatPrice(p.variants[0].priceCents)}</p>
            </div>
            <button
              type="button"
              onClick={() => add(p.variants[0].id)}
              className="flex h-9 items-center gap-1 rounded-full border px-3 text-sm font-semibold transition hover:border-forest hover:text-forest"
              aria-label={`Add ${p.name} to cart`}
            >
              <Plus className="size-4" /> Add
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
