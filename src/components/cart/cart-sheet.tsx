"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useCart, useCartLines } from "@/store/cart";
import { PaymentIcons } from "@/components/payment-icons";
import { CartLines } from "./cart-lines";
import { CartUpsell } from "./cart-upsell";
import { FreeShippingProgress } from "./free-shipping-progress";
import { CartSummary } from "./cart-summary";
import { CheckoutButton } from "./checkout-button";

export function CartSheet() {
  const isOpen = useCart((s) => s.isOpen);
  const setOpen = useCart((s) => s.setOpen);
  const { count } = useCartLines();
  const close = () => setOpen(false);

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent className="gap-0 data-[side=right]:w-full data-[side=right]:sm:max-w-md">
        <SheetHeader className="border-b px-5 py-4 pr-12">
          <SheetTitle className="text-lg font-bold">Your cart</SheetTitle>
          <SheetDescription>
            {count === 0 ? "Nothing here yet." : `${count} ${count === 1 ? "item" : "items"}`}
          </SheetDescription>
        </SheetHeader>

        {count === 0 ? (
          <div className="flex flex-1 flex-col items-start gap-4 px-5 py-8">
            <p className="text-muted-foreground">Pick something from the shop and it will show up here.</p>
            <Button render={<Link href="/products" onClick={close} />} nativeButton={false}>
              Browse the shop
            </Button>
          </div>
        ) : (
          <>
            <div className="border-b px-5 py-4">
              <FreeShippingProgress />
            </div>
            <div className="flex-1 overflow-x-hidden overflow-y-auto px-5">
              <CartLines onNavigate={close} />
              <CartUpsell />
            </div>
            <SheetFooter className="gap-4 border-t px-5 py-5">
              <CartSummary />
              <CheckoutButton />
              <PaymentIcons className="justify-center" />
              <Link href="/cart" onClick={close} className="text-center text-sm text-muted-foreground hover:text-foreground hover:underline">
                View full cart
              </Link>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
