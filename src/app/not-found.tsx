import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <Container className="py-20">
      <h1 className="text-3xl font-extrabold sm:text-4xl">This page does not exist</h1>
      <p className="mt-4 text-muted-foreground">The link may be old, or the product is no longer sold.</p>
      <Button className="mt-8" render={<Link href="/products" />} nativeButton={false}>
        Go to the shop
      </Button>
    </Container>
  );
}
