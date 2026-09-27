"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { categories } from "@/data/products";

const helpLinks = [
  { href: "/legal/shipping", label: "Shipping" },
  { href: "/legal/returns", label: "Returns and refunds" },
  { href: "/contact", label: "Contact" },
];

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<Button variant="ghost" size="icon-lg" className="-ml-2 lg:hidden" aria-label="Open menu" />}>
        <Menu className="size-5" />
      </SheetTrigger>
      <SheetContent side="left" className="gap-0 data-[side=left]:w-[85vw] data-[side=left]:max-w-sm">
        <SheetTitle className="border-b px-5 py-4 text-lg font-bold">Menu</SheetTitle>
        <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-5 py-4">
          <ul className="space-y-1">
            <li>
              <Link href="/products" onClick={close} className="block py-2.5 text-lg font-semibold">
                Shop all
              </Link>
            </li>
            {categories.map((c) => (
              <li key={c}>
                <Link href={`/products?category=${encodeURIComponent(c)}`} onClick={close} className="block py-2.5 text-lg font-semibold">
                  {c}
                </Link>
              </li>
            ))}
          </ul>
          <ul className="mt-6 space-y-1 border-t pt-6">
            {helpLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} onClick={close} className="block py-2 text-muted-foreground">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
