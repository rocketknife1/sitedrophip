import { ArrowUpRight, Check, Headphones, Lock, RotateCcw, Truck, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { DeskAnatomy } from "@/components/home/desk-anatomy";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { ScrollScene } from "@/components/motion/scroll-scene";
import { ProductCard } from "@/components/product/product-card";
import { ShopFaq } from "@/components/shop-faq";
import { Button } from "@/components/ui/button";
import { categories, products } from "@/data/products";
import { site } from "@/data/site";
import { deliveryRangeLabel, formatPrice } from "@/lib/format";

const benefits = [
  { icon: Truck, title: "Tracked EU delivery", text: `Free over ${formatPrice(site.shipping.freeOverCents)}, arrives in ${deliveryRangeLabel}.` },
  { icon: RotateCcw, title: `${site.returns.withdrawalDays}-day returns`, text: "Changed your mind? Send it back, no reason needed." },
  { icon: Lock, title: "Secure checkout", text: "Card, Apple Pay and Google Pay, processed by Stripe." },
  { icon: Headphones, title: "Real support", text: "Write to us and a person replies within one business day." },
];

const categoryImage: Record<string, string> = {
  Tech: "/images/products/phone-stand-1.jpg",
  Home: "/images/products/linen-set-1.jpg",
  Kitchen: "/images/products/bottle-2.jpg",
  Fitness: "/images/products/bands-1.jpg",
  Fashion: "/images/products/satchel-1.jpg",
  "Home office": "/images/products/desk-mat-forest.jpg",
  Car: "/images/products/dash-cam-1.jpg",
  Pets: "/images/products/harness-1.jpg",
  Beauty: "/images/products/vanity-mirror-1.jpg",
};

// Market data behind the shelf. Every figure links to its source; none of it is our own sales.
const SHOPIFY = "https://www.shopify.com/blog/trending-products";
const dataPoints = [
  { value: "56%", label: "of internet users buy something online every week", source: "GWI via DataReportal, Digital 2025", url: "https://datareportal.com/reports/digital-2025-sub-section-online-shopping" },
  { value: "+1,771%", label: "sales growth for satchel bags in a year", source: "Shopify, trending products", url: SHOPIFY, slug: "leather-satchel" },
  { value: "+1,035%", label: "sales growth for mattress pads and toppers", source: "Shopify, trending products", url: SHOPIFY, slug: "memory-foam-mattress-topper" },
  { value: "+779%", label: "sales growth for ankle socks", source: "Shopify, trending products", url: SHOPIFY, slug: "cotton-ankle-socks" },
  { value: "+140%", label: "annual sales growth for dashboard accessories", source: "Shopify, trending products", url: SHOPIFY, slug: "magnetic-car-phone-mount" },
  { value: "100k+", label: "searches a month for dash cams", source: "Shopify, trending products", url: SHOPIFY, slug: "dash-cam-2k" },
];

const comparison: { label: string; us: string | boolean; them: string | boolean }[] = [
  { label: "Delivery time", us: deliveryRangeLabel, them: "2–4 weeks" },
  { label: "Ships from", us: "Inside the EU", them: "Outside the EU" },
  { label: "No customs or import VAT at the door", us: true, them: false },
  { label: `${site.returns.withdrawalDays}-day returns to an EU address`, us: true, them: false },
  { label: "Support replies in one business day", us: true, them: false },
];

function Cell({ value, strong }: { value: string | boolean; strong?: boolean }) {
  if (typeof value === "string") return <>{value}</>;
  return value ? (
    <Check className={strong ? "mx-auto size-5" : "mx-auto size-5 opacity-70"} aria-label="Yes" />
  ) : (
    <X className="mx-auto size-5 opacity-60" aria-label="No" />
  );
}

// Three columns of product photos drifting at different speeds as the hero scrolls away
const mosaic = [
  ["satchel-1", "bottle-2", "harness-1"],
  ["dash-cam-1", "linen-set-1", "massage-gun-1", "phone-stand-1"],
  ["candle-1", "desk-mat-forest", "vanity-mirror-1"],
];
const columnShift = [240, -360, 120];

export default function HomePage() {
  const featured = products.filter((p) => p.featured).slice(0, 8);
  const trending = products.filter((p) => p.trend);

  return (
    <>
      {/* Hero */}
      <ScrollScene className="relative isolate overflow-hidden bg-ink text-white">
        <Container className="grid min-h-[640px] items-center gap-10 py-16 lg:min-h-[720px] lg:grid-cols-[1fr_1.05fr] lg:py-0">
          <div className="max-w-xl will-change-transform" style={{ transform: "translateY(calc(var(--p, 0) * -80px))", opacity: "calc(1 - var(--p, 0) * 1.2)" }}>
            <h1 className="text-[2.75rem] leading-[1.02] font-extrabold sm:text-6xl lg:text-7xl">What the world is buying, delivered to your door.</h1>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-white/80">
              Products picked from real sales and search data: tech, home, fitness, pets and more. Tracked EU delivery and{" "}
              {site.returns.withdrawalDays} days to change your mind.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" className="h-13 bg-white px-7 text-base text-ink hover:bg-note" render={<Link href="/products" />} nativeButton={false}>
                Shop all {products.length} products
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-13 border-white/50 bg-transparent px-7 text-base text-white hover:bg-white/10 hover:text-white"
                render={<Link href="#data" />}
                nativeButton={false}
              >
                See the data behind it
              </Button>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/80">
              <li className="flex items-center gap-2">
                <Truck className="size-4" /> Free over {formatPrice(site.shipping.freeOverCents)}
              </li>
              <li className="flex items-center gap-2">
                <RotateCcw className="size-4" /> {site.returns.withdrawalDays}-day returns
              </li>
              <li className="flex items-center gap-2">
                <Lock className="size-4" /> Secure checkout
              </li>
            </ul>
          </div>

          <div aria-hidden className="relative hidden h-[720px] grid-cols-3 gap-4 overflow-hidden lg:grid [mask-image:linear-gradient(transparent,#000_12%,#000_88%,transparent)]">
            {mosaic.map((col, c) => (
              <div
                key={c}
                className="flex flex-col gap-4 will-change-transform"
                style={{ marginTop: c === 1 ? "-120px" : c === 2 ? "40px" : "-30px", transform: `translateY(calc(var(--p, 0) * ${columnShift[c]}px))` }}
              >
                {col.map((name, i) => (
                  <div key={name} className="relative aspect-[4/5] shrink-0 overflow-hidden rounded-2xl bg-white/5">
                    <Image src={`/images/products/${name}.jpg`} alt="" fill priority={c === 1 && i < 2} sizes="16vw" className="object-cover" />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </Container>
      </ScrollScene>

      {/* Benefits */}
      <section aria-label="Why shop with us" className="border-b bg-surface">
        <Container className="grid grid-cols-2 gap-x-6 gap-y-8 py-10 lg:grid-cols-4">
          {benefits.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex flex-col gap-3 sm:flex-row sm:gap-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-white text-forest shadow-sm">
                <Icon className="size-5" />
              </span>
              <div>
                <h2 className="text-[15px] font-bold">{title}</h2>
                <p className="mt-1 text-sm leading-snug text-muted-foreground">{text}</p>
              </div>
            </div>
          ))}
        </Container>
      </section>

      {/* Categories */}
      <Container className="pt-20">
        <div className="mb-8 flex items-end justify-between gap-4">
          <h2 className="text-3xl font-extrabold sm:text-4xl">Shop by category</h2>
          <Link href="/products" className="hidden text-sm font-semibold text-forest underline-offset-4 hover:underline sm:block">
            View all
          </Link>
        </div>
        <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:-mx-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-9 lg:overflow-visible lg:px-0">
          {categories.map((c, i) => (
            <Reveal key={c} delay={i * 50} className="w-36 shrink-0 snap-start lg:w-auto">
              <Link href={`/products?category=${encodeURIComponent(c)}`} className="group block">
                <span className="relative block aspect-square overflow-hidden rounded-2xl bg-surface">
                  <Image src={categoryImage[c] ?? "/images/products/phone-stand-1.jpg"} alt="" fill sizes="(min-width: 1024px) 11vw, 144px" className="object-cover transition-transform duration-500 group-hover:scale-110" />
                </span>
                <span className="mt-2 block text-center text-sm font-semibold">{c}</span>
                <span className="block text-center text-xs text-muted-foreground">{products.filter((p) => p.category === c).length} products</span>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>

      {/* Featured products */}
      <Container className="pt-20">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold sm:text-4xl">Picked for you</h2>
            <p className="mt-2 text-muted-foreground">A mix from every category. “Trending” tags come from public market data.</p>
          </div>
          <Link href="/products" className="hidden shrink-0 text-sm font-semibold text-forest underline-offset-4 hover:underline sm:block">
            View all {products.length}
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
          {featured.map((p, i) => (
            <Reveal key={p.id} delay={(i % 4) * 70}>
              <ProductCard product={p} priority={i < 4} />
            </Reveal>
          ))}
        </div>
      </Container>

      {/* The data behind the shelf */}
      <section id="data" className="mt-24 scroll-mt-20 bg-ink py-20 text-white">
        <Container>
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-note">The data behind the shelf</p>
            <h2 className="mt-2 text-3xl leading-tight font-extrabold sm:text-5xl">We stock what people are actually searching for and buying.</h2>
            <p className="mt-4 text-lg text-white/70">
              Every product here comes from a category that is growing online. These are public market figures, not our own sales.
            </p>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {dataPoints.map((d, i) => (
              <Reveal key={d.label} delay={(i % 3) * 80} className="h-full">
                <div className="flex h-full flex-col rounded-2xl border border-white/10 bg-white/5 p-6">
                  <p className="text-5xl font-extrabold tracking-tight text-note">{d.value}</p>
                  <p className="mt-2 text-lg leading-snug">{d.label}</p>
                  <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-6 text-sm">
                    <a href={d.url} target="_blank" rel="noopener" className="text-white/60 underline-offset-4 hover:text-white hover:underline">
                      Source: {d.source}
                    </a>
                    {d.slug && (
                      <Link href={`/products/${d.slug}`} className="inline-flex items-center gap-1 font-semibold text-white hover:text-note">
                        See it <ArrowUpRight className="size-4" />
                      </Link>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          {trending.length > 0 && (
            <p className="mt-8 max-w-3xl text-sm text-white/60">
              Products tagged “Trending” in the shop are backed by one of these figures: {trending.map((p) => p.name.toLowerCase()).join(", ")}.
            </p>
          )}
        </Container>
      </section>

      <DeskAnatomy />

      {/* Comparison */}
      <Container className="pt-24">
        <Reveal className="mx-auto max-w-3xl">
          <h2 className="text-center text-3xl font-extrabold sm:text-4xl">Why order from {site.name}</h2>
          <p className="mx-auto mt-3 max-w-lg text-center text-muted-foreground">
            Similar products are often cheaper on big overseas marketplaces. This is what the difference pays for.
          </p>
          <div className="mt-10 overflow-hidden rounded-xl border">
            <table className="w-full text-left text-sm sm:text-[15px]">
              <thead>
                <tr className="bg-surface">
                  <th scope="col" className="p-4">
                    <span className="sr-only">Feature</span>
                  </th>
                  <th scope="col" className="w-28 bg-forest p-4 text-center font-bold text-white sm:w-40">
                    {site.name}
                  </th>
                  <th scope="col" className="w-28 p-4 text-center font-semibold text-muted-foreground sm:w-40">
                    Overseas marketplace
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {comparison.map((row) => (
                  <tr key={row.label}>
                    <th scope="row" className="p-4 font-medium">
                      {row.label}
                    </th>
                    <td className="bg-accent/60 p-4 text-center font-semibold text-forest">
                      <Cell value={row.us} strong />
                    </td>
                    <td className="p-4 text-center text-muted-foreground">
                      <Cell value={row.them} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </Container>

      {/* FAQ */}
      <Container className="grid gap-10 pt-24 md:grid-cols-[1fr_2fr]">
        <div>
          <h2 className="text-3xl font-extrabold sm:text-4xl">Questions before you buy</h2>
          <p className="mt-3 text-muted-foreground">
            Something else?{" "}
            <Link href="/contact" className="font-semibold text-forest underline underline-offset-4">
              Write to us
            </Link>
            .
          </p>
        </div>
        <ShopFaq />
      </Container>
    </>
  );
}
