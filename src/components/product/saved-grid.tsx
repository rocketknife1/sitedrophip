"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { products } from "@/data/products";
import { useHydrated } from "@/store/cart";
import { useSaved } from "@/store/lists";
import { ProductCard } from "./product-card";

export function SavedGrid() {
  const hydrated = useHydrated();
  const ids = useSaved((s) => s.ids);
  if (!hydrated) return <p className="mt-8 text-muted-foreground">Loading…</p>;
  const items = ids.map((id) => products.find((p) => p.id === id)).filter((p) => p !== undefined);
  if (!items.length) {
    return (
      <div className="mt-8 space-y-4">
        <p className="text-muted-foreground">Nothing saved yet.</p>
        <Button render={<Link href="/products" />} nativeButton={false}>
          Browse the shop
        </Button>
      </div>
    );
  }
  return (
    <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
      {items.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
