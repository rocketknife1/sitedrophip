import type { Metadata } from "next";
import { Suspense } from "react";

import { Container } from "@/components/layout/container";
import { Catalog, CatalogBody } from "@/components/product/catalog";

export const metadata: Metadata = {
  title: "Shop",
  description: "Trending tech, home, kitchen, fitness, fashion, car, pet and beauty products. Delivered across the EU.",
};

export default function ProductsPage() {
  return (
    <Container className="py-10 md:py-14">
      <Suspense fallback={<CatalogBody active={null} />}>
        <Catalog />
      </Suspense>
    </Container>
  );
}
