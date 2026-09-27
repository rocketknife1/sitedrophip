import type { Metadata } from "next";

import { CartPageContent } from "@/components/cart/cart-page-content";
import { Container } from "@/components/layout/container";

export const metadata: Metadata = { title: "Your cart", robots: { index: false } };

export default function CartPage() {
  return (
    <Container className="py-10 md:py-14">
      <h1 className="text-3xl font-extrabold sm:text-4xl">Your cart</h1>
      <CartPageContent />
    </Container>
  );
}
