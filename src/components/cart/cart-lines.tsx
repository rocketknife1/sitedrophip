"use client";

import Image from "next/image";
import Link from "next/link";

import { variantImage } from "@/data/products";
import { formatPrice } from "@/lib/format";
import { useCart, useCartLines } from "@/store/cart";
import { QuantityStepper } from "./quantity-stepper";

export function CartLines({ onNavigate }: { onNavigate?: () => void }) {
  const { lines } = useCartLines();
  const setQuantity = useCart((s) => s.setQuantity);
  const remove = useCart((s) => s.remove);

  return (
    <ul className="divide-y">
      {lines.map(({ product, variant, quantity }) => (
        <li key={variant.id} className="flex gap-4 py-4">
          <Link
            href={`/products/${product.slug}`}
            onClick={onNavigate}
            className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-surface"
          >
            <Image src={variantImage(product, variant).src} alt={variantImage(product, variant).alt} fill sizes="80px" className="object-cover" />
          </Link>
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <div className="flex justify-between gap-3">
              <div className="min-w-0">
                <Link href={`/products/${product.slug}`} onClick={onNavigate} className="font-medium hover:underline">
                  {product.name}
                </Link>
                {product.variants.length > 1 && (
                  <p className="text-sm text-muted-foreground">
                    {product.variantLabel}: {variant.name}
                  </p>
                )}
              </div>
              <p className="shrink-0 font-medium">{formatPrice(variant.priceCents * quantity)}</p>
            </div>
            <div className="flex items-center justify-between">
              <QuantityStepper
                value={quantity}
                onChange={(q) => setQuantity(variant.id, q)}
                label={`Quantity of ${product.name}`}
              />
              <button
                type="button"
                onClick={() => remove(variant.id)}
                className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                Remove
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
