"use client";

import { ProductRail } from "@/components/product/product-rail";
import { products } from "@/data/products";
import { useHydrated } from "@/store/cart";
import { useRecent, useSaved } from "@/store/lists";

const byIds = (ids: string[]) => ids.map((id) => products.find((p) => p.id === id)).filter((p) => p !== undefined);

/** "Pick up where you left off": only shown once the visitor has history in this browser. */
export function PersonalRails() {
  const hydrated = useHydrated();
  const recent = useRecent((s) => s.ids);
  const saved = useSaved((s) => s.ids);
  if (!hydrated) return null;
  return (
    <>
      <ProductRail title="Recently viewed" subtitle="Pick up where you left off." items={byIds(recent)} />
      <ProductRail title="Saved for later" subtitle="The things you hearted, on this device." items={byIds(saved)} href="/saved" />
    </>
  );
}
