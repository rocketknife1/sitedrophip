"use client";

import { formatPrice, shippingCents } from "@/lib/format";
import { useCartLines } from "@/store/cart";

export function CartSummary() {
  const { subtotalCents } = useCartLines();
  const shipping = shippingCents(subtotalCents);

  return (
    <div className="space-y-3">
      <dl className="space-y-1.5 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Subtotal</dt>
          <dd>{formatPrice(subtotalCents)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Delivery</dt>
          <dd>{shipping === 0 ? "Free" : formatPrice(shipping)}</dd>
        </div>
        <div className="flex justify-between border-t pt-2 text-base font-semibold">
          <dt>Total</dt>
          <dd>{formatPrice(subtotalCents + shipping)}</dd>
        </div>
      </dl>
      <p className="text-xs text-muted-foreground">VAT included. Delivery to EU countries only.</p>
    </div>
  );
}
