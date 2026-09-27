"use client";

import { ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useCart, useCartLines, useHydrated } from "@/store/cart";

export function CartButton() {
  const setOpen = useCart((s) => s.setOpen);
  const { count } = useCartLines();
  const hydrated = useHydrated();
  const shown = hydrated ? count : 0;

  return (
    <Button
      variant="ghost"
      size="lg"
      onClick={() => setOpen(true)}
      aria-label={shown > 0 ? `Open cart, ${shown} ${shown === 1 ? "item" : "items"}` : "Open cart"}
      className="relative gap-2 px-2"
    >
      <ShoppingBag className="size-5" />
      <span className="hidden text-sm sm:inline">Cart</span>
      {shown > 0 && (
        <span className="tabular grid min-w-5 place-items-center rounded-full bg-forest px-1.5 text-xs leading-5 font-semibold text-white">
          {shown}
        </span>
      )}
    </Button>
  );
}
