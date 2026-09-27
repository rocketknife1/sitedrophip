import Link from "next/link";

import { PaymentIcons } from "@/components/payment-icons";
import { categories } from "@/data/products";
import { site } from "@/data/site";
import { Container } from "./container";
import { Logo } from "./logo";

const columns = [
  {
    title: "Shop",
    links: [
      { href: "/products", label: "All products" },
      ...categories.map((c) => ({ href: `/products?category=${encodeURIComponent(c)}`, label: c })),
    ],
  },
  {
    title: "Help",
    links: [
      { href: "/legal/shipping", label: "Shipping" },
      { href: "/legal/returns", label: "Returns and refunds" },
      { href: "/withdrawal", label: "Withdraw from a purchase" },
      { href: "/contact", label: "Contact us" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/legal/terms", label: "Terms and conditions" },
      { href: "/legal/privacy", label: "Privacy policy" },
      { href: "/legal/imprint", label: "Company details" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-forest-deep text-white">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div className="max-w-xs space-y-4">
          <Logo inverted />
          <p className="text-sm leading-relaxed text-white/70">{site.description}</p>
          <p className="text-sm text-white/70">
            Questions?{" "}
            <a href={`mailto:${site.company.email}`} className="font-medium text-white underline underline-offset-4">
              {site.company.email}
            </a>
          </p>
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <h2 className="mb-4 text-sm font-semibold">{col.title}</h2>
            <ul className="space-y-2.5 text-sm">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-white/70 transition-colors hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Container>
      <div className="border-t border-white/10">
        <Container className="flex flex-col gap-4 py-6 text-xs text-white/60 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {site.company.legalName} · {site.company.registrationNumber} · VAT {site.company.vatId}
          </p>
          <PaymentIcons />
        </Container>
      </div>
    </footer>
  );
}
