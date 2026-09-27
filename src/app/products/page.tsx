import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { ProductCard } from "@/components/product/product-card";
import { categories, products } from "@/data/products";
import { site } from "@/data/site";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Shop",
  description: "Laptop stands, felt desk mats, monitor lights and desk organisers. Delivered across the EU.",
};

export default async function ProductsPage({ searchParams }: PageProps<"/products">) {
  const { category } = await searchParams;
  const active = typeof category === "string" && categories.includes(category) ? category : null;
  const shown = active ? products.filter((p) => p.category === active) : products;

  const chip = (selected: boolean) =>
    cn(
      "inline-block rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
      selected ? "border-forest bg-forest text-white" : "bg-white hover:border-foreground/40",
    );

  return (
    <Container className="py-10 md:py-14">
      <h1 className="text-4xl font-extrabold sm:text-5xl">{active ?? "Shop all"}</h1>
      <p className="mt-2 text-muted-foreground">
        {shown.length} {shown.length === 1 ? "product" : "products"} · Free EU delivery over {formatPrice(site.shipping.freeOverCents)} · {site.returns.withdrawalDays}-day returns
      </p>
      <nav aria-label="Categories" className="mt-6">
        <ul className="flex flex-wrap gap-2">
          <li>
            <Link href="/products" className={chip(!active)} aria-current={!active ? "page" : undefined}>
              All
            </Link>
          </li>
          {categories.map((c) => (
            <li key={c}>
              <Link
                href={`/products?category=${encodeURIComponent(c)}`}
                className={chip(active === c)}
                aria-current={active === c ? "page" : undefined}
              >
                {c}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
        {shown.map((p, i) => (
          <ProductCard key={p.id} product={p} priority={i < 4} />
        ))}
      </div>
    </Container>
  );
}
