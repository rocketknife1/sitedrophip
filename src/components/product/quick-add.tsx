"use client";

import { Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { useCart } from "@/store/cart";

/** One-tap add for products with a single variant. */
export function QuickAdd({ variantId, productName, className }: { variantId: string; productName: string; className?: string }) {
  const add = useCart((s) => s.add);
  return (
    <button
      type="button"
      onClick={() => add(variantId)}
      aria-label={`Add ${productName} to cart`}
      className={cn(
        "relative z-10 flex h-10 items-center gap-1.5 rounded-full bg-white px-4 text-sm font-semibold text-ink shadow-md transition hover:bg-forest hover:text-white",
        className,
      )}
    >
      <Plus className="size-4" />
      Add
    </button>
  );
}
