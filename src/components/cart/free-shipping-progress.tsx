"use client";

import { Truck } from "lucide-react";

import { site } from "@/data/site";
import { formatPrice } from "@/lib/format";
import { useCartLines } from "@/store/cart";

export function FreeShippingProgress() {
  const { subtotalCents } = useCartLines();
  const threshold = site.shipping.freeOverCents;
  const missing = threshold - subtotalCents;
  const pct = Math.min(100, Math.round((subtotalCents / threshold) * 100));

  return (
    <div className="space-y-2">
      <p className="flex items-center gap-2 text-sm">
        <Truck className="size-4 shrink-0 text-forest" />
        {missing > 0 ? (
          <span>
            You are <strong className="font-semibold">{formatPrice(missing)}</strong> away from free delivery
          </span>
        ) : (
          <strong className="font-semibold text-forest">Your order ships free</strong>
        )}
      </p>
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        aria-label="Progress towards free delivery"
        className="h-2 overflow-hidden rounded-full bg-surface"
      >
        <div className="h-full rounded-full bg-forest transition-[width] duration-500" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
