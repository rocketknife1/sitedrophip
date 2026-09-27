"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { useCartLines, useHydrated } from "@/store/cart";
import { PaymentIcons } from "@/components/payment-icons";
import { CartLines } from "./cart-lines";
import { FreeShippingProgress } from "./free-shipping-progress";
import { CartSummary } from "./cart-summary";
import { CheckoutButton } from "./checkout-button";

export function CartPageContent() {
  const hydrated = useHydrated();
  const { count } = useCartLines();

  if (!hydrated) return <p className="mt-8 text-muted-foreground">Loading your cart…</p>;

  if (count === 0) {
    return (
      <div className="mt-8 space-y-4">
        <p className="text-muted-foreground">Your cart is empty. Pick something from the shop and it will show up here.</p>
        <Button render={<Link href="/products" />} nativeButton={false}>
          Browse the shop
        </Button>
      </div>
    );
  }

  return (
    <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_22rem]">
      <div>
        <FreeShippingProgress />
        <div className="mt-6 border-t">
          <CartLines />
        </div>
      </div>
      <aside className="h-fit space-y-5 rounded-2xl bg-surface p-6 lg:sticky lg:top-20">
        <h2 className="text-lg font-bold">Order summary</h2>
        <CartSummary />
        <CheckoutButton />
        <PaymentIcons className="justify-center" />
        <p className="text-xs leading-relaxed text-muted-foreground">
          You enter your address and pay on the next page, run by Stripe. By paying you accept our{" "}
          <Link href="/legal/terms" className="underline">
            terms
          </Link>
          .
        </p>
      </aside>
    </div>
  );
}
