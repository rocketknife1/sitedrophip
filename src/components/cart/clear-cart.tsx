"use client";

import { useEffect } from "react";

import { useCart } from "@/store/cart";

/** Empties the cart once the order is confirmed as paid. */
export function ClearCart() {
  const clear = useCart((s) => s.clear);
  useEffect(() => {
    clear();
  }, [clear]);
  return null;
}
