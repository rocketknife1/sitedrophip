import type { Metadata } from "next";

import { SavedGrid } from "@/components/product/saved-grid";
import { Container } from "@/components/layout/container";

export const metadata: Metadata = { title: "Saved for later", robots: { index: false } };

export default function SavedPage() {
  return (
    <Container className="py-10 md:py-14">
      <h1 className="text-3xl font-extrabold sm:text-4xl">Saved for later</h1>
      <p className="mt-2 text-muted-foreground">Tap the heart on any product to keep it here. Saved on this device only.</p>
      <SavedGrid />
    </Container>
  );
}
