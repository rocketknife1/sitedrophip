import Link from "next/link";

import { CartButton } from "@/components/cart/cart-button";
import { SavedLink } from "@/components/layout/saved-link";
import { categories } from "@/data/products";
import { Container } from "./container";
import { Logo } from "./logo";
import { MobileMenu } from "./mobile-menu";

export const mainNav = [
  { href: "/products", label: "Shop all" },
  ...categories.slice(0, 3).map((c) => ({ href: `/products?category=${encodeURIComponent(c)}`, label: c })),
  { href: "/legal/shipping", label: "Shipping" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/85">
      <Container className="grid h-16 grid-cols-[1fr_auto_1fr] items-center gap-4">
        <div className="flex items-center">
          <MobileMenu />
          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-6 text-sm font-medium">
              {mainNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-foreground/75 transition-colors hover:text-foreground">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <Logo />
        <div className="flex items-center justify-end gap-1">
          <Link href="/contact" className="hidden px-2 text-sm font-medium text-foreground/75 hover:text-foreground sm:block">
            Help
          </Link>
          <SavedLink />
          <CartButton />
        </div>
      </Container>
    </header>
  );
}
