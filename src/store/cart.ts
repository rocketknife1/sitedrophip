"use client";

import { useSyncExternalStore } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";

import { findVariant } from "@/data/products";

export const MAX_QTY = 10;

export type CartItem = { variantId: string; quantity: number };

type CartState = {
  items: CartItem[];
  isOpen: boolean;
  add: (variantId: string, quantity?: number) => void;
  setQuantity: (variantId: string, quantity: number) => void;
  remove: (variantId: string) => void;
  clear: () => void;
  setOpen: (open: boolean) => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      add: (variantId, quantity = 1) =>
        set((s) => {
          const existing = s.items.find((i) => i.variantId === variantId);
          const items = existing
            ? s.items.map((i) =>
                i.variantId === variantId ? { ...i, quantity: Math.min(MAX_QTY, i.quantity + quantity) } : i,
              )
            : [...s.items, { variantId, quantity: Math.min(MAX_QTY, quantity) }];
          return { items, isOpen: true };
        }),
      setQuantity: (variantId, quantity) =>
        set((s) => ({
          items:
            quantity <= 0
              ? s.items.filter((i) => i.variantId !== variantId)
              : s.items.map((i) => (i.variantId === variantId ? { ...i, quantity: Math.min(MAX_QTY, quantity) } : i)),
        })),
      remove: (variantId) => set((s) => ({ items: s.items.filter((i) => i.variantId !== variantId) })),
      clear: () => set({ items: [] }),
      setOpen: (isOpen) => set({ isOpen }),
    }),
    {
      name: "cart-v1",
      partialize: (s) => ({ items: s.items }),
      // Drop items whose variant no longer exists in the catalog.
      merge: (persisted, current) => {
        const items = ((persisted as Partial<CartState>)?.items ?? []).filter(
          (i) => typeof i?.variantId === "string" && findVariant(i.variantId) && Number.isInteger(i.quantity) && i.quantity > 0,
        );
        return { ...current, items };
      },
    },
  ),
);

/** Cart lines joined with catalog data. Prices always come from the catalog, never from storage. */
export function useCartLines() {
  const items = useCart((s) => s.items);
  const lines = items.flatMap((item) => {
    const found = findVariant(item.variantId);
    return found ? [{ ...found, quantity: item.quantity }] : [];
  });
  const subtotalCents = lines.reduce((sum, l) => sum + l.variant.priceCents * l.quantity, 0);
  const count = lines.reduce((sum, l) => sum + l.quantity, 0);
  return { lines, subtotalCents, count };
}

const noop = () => () => {};

/** False during SSR and the first client render, so persisted cart data never causes a hydration mismatch. */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
}
