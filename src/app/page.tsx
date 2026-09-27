import { ArrowUpRight, Check, Headphones, Lock, RotateCcw, Truck, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { DeskAnatomy } from "@/components/home/desk-anatomy";
import { HeroCarousel, type Slide } from "@/components/home/hero-carousel";
import { PersonalRails } from "@/components/home/personal-rails";
import { ProductStories, type Story } from "@/components/home/product-stories";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { ProductRail } from "@/components/product/product-rail";
import { ShopFaq } from "@/components/shop-faq";
import { Button } from "@/components/ui/button";
import { categories, getProduct, lowestPrice, products } from "@/data/products";
import { site } from "@/data/site";
import { deliveryRangeLabel, formatPrice } from "@/lib/format";

const slides: Slide[] = [
  {
    image: "/images/lifestyle/slide-home.jpg",
    alt: "Bed with white linen bedding and soft pillows",
    kicker: "Trending in Home",
    title: "Sleep in linen tonight.",
    text: "Around 20,000 people a month search for linen sheets. Ours are stonewashed, so they feel soft from the first night.",
    cta: { label: "Shop Home", href: "/products?category=Home" },
  },
  {
    image: "/images/lifestyle/slide-fashion.jpg",
    alt: "Brown leather satchel resting on a stone wall",
    position: "center 60%",
    kicker: "Trending in Fashion",
    title: "The bag everyone is looking for.",
    text: "Satchel sales grew 1,771% in a year among online shops. Full-grain leather, fits a 14-inch laptop.",
    cta: { label: "See the satchel", href: "/products/leather-satchel" },
  },
  {
    image: "/images/lifestyle/slide-pets.jpg",
    alt: "White dog wearing a harness by a lake",
    kicker: "For the dog",
    title: "Better walks start here.",
    text: "A no-pull harness that is gentle on the neck, plus a brush that cleans itself with one click.",
    cta: { label: "Shop Pets", href: "/products?category=Pets" },
  },
  {
    image: "/images/lifestyle/hero.jpg",
    alt: "A tidy dark desk with a monitor, keyboard and a plant",
    position: "70% center",
    kicker: "Home office",
    title: "Build a desk you want to sit at.",
    text: "Stands, mats and lights that fix the neck ache, the noise and the glare.",
    cta: { label: "Shop Home office", href: "/products?category=Home%20office" },
  },
];

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
  Fitness: "/images/products/yoga-mat-1.jpg",
  Fashion: "/images/products/satchel-2.jpg",
  "Home office": "/images/products/desk-mat-forest.jpg",
  Car: "/images/products/dash-cam-1.jpg",
  Pets: "/images/products/harness-2.jpg",
  Beauty: "/images/products/vanity-mirror-1.jpg",
};

// Short labels under the story circles
const SHORT: Record<string, string> = {
  "dash-cam-2k": "Dash cam",
  "magnetic-car-phone-mount": "Car mount",
  "linen-bedding-set": "Linen",
  "memory-foam-mattress-topper": "Topper",
  "leather-satchel": "Satchel",
  "cotton-ankle-socks": "Socks",
  "magnetic-phone-stand": "Phone stand",
  "insulated-steel-bottle": "Bottle",
  "mini-massage-gun": "Massage gun",
  "no-pull-dog-harness": "Dog harness",
  "aluminium-laptop-stand": "Laptop stand",
  "wool-felt-desk-mat": "Desk mat",
  "monitor-light-bar": "Light bar",
  "oak-headphone-stand": "Headphones",
};

const SHOPIFY = "https://www.shopify.com/blog/trending-products";
const dataPoints = [
  { value: "+1,771%", label: "satchel bags", url: SHOPIFY },
  { value: "+1,035%", label: "mattress toppers", url: SHOPIFY },
  { value: "+779%", label: "ankle socks", url: SHOPIFY },
  { value: "+140%", label: "car dashboard accessories", url: SHOPIFY },
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
  return value ? <Check className={strong ? "mx-auto size-5" : "mx-auto size-5 opacity-70"} aria-label="Yes" /> : <X className="mx-auto size-5 opacity-60" aria-label="No" />;
}

export default function HomePage() {
  const trending = products.filter((p) => p.trend);
  const underThirty = products.filter((p) => lowestPrice(p) < 3000).sort((a, b) => lowestPrice(a) - lowestPrice(b));
  const rest = products.filter((p) => !p.trend && lowestPrice(p) >= 3000);
  const linen = getProduct("linen-bedding-set");
  const gun = getProduct("mini-massage-gun");

  const storyProducts = [...trending, ...products.filter((p) => p.featured && !p.trend)].slice(0, 10);
  const stories: Story[] = storyProducts.map((p) => ({
    id: p.id,
    label: SHORT[p.slug] ?? p.name.split(" ").slice(0, 2).join(" "),
    image: p.images[0].src,
    title: p.name,
    text: p.trend ? `${p.trend.detail} Source: ${p.trend.source}.` : p.tagline,
    price: `${p.variants.length > 1 ? "from " : ""}${formatPrice(lowestPrice(p))}`,
    href: `/products/${p.slug}`,
    variantId: p.variants.length === 1 ? p.variants[0].id : undefined,
  }));

  return (
    <>
      <HeroCarousel slides={slides} perks={{ freeOver: formatPrice(site.shipping.freeOverCents), returnsDays: site.returns.withdrawalDays }} />

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

      {/* Stories */}
      <Container className="pt-12">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-xl font-extrabold sm:text-2xl">What’s trending this week</h2>
          <p className="hidden text-sm text-muted-foreground sm:block">Tap a circle to watch</p>
        </div>
        <div className="mt-4">
          <ProductStories stories={stories} />
        </div>
      </Container>

      <ProductRail title="Trending now" subtitle="Backed by public sales and search data." items={trending} href="/products" />

      {/* Categories: tall photo tiles */}
      <Container className="pt-20">
        <div className="mb-8 flex items-end justify-between gap-4">
          <h2 className="text-3xl font-extrabold sm:text-4xl">Shop by category</h2>
          <Link href="/products" className="hidden text-sm font-semibold text-forest underline-offset-4 hover:underline sm:block">
            View all {products.length}
          </Link>
        </div>
      </Container>
      <div className="grid snap-x snap-mandatory auto-cols-[46%] grid-flow-col gap-4 overflow-x-auto px-[max(1rem,calc((100vw_-_72rem)/2_+_1.5rem))] pb-2 [scrollbar-width:none] sm:auto-cols-[30%] lg:auto-cols-[calc((72rem_-_4.5rem)/4.5)] [&::-webkit-scrollbar]:hidden"
        style={{ scrollPaddingInline: "max(1rem, calc((100vw - 72rem) / 2 + 1.5rem))" }}
      >
        {categories.map((c, i) => (
          <Reveal key={c} delay={Math.min(i, 5) * 60} className="snap-start">
            <Link href={`/products?category=${encodeURIComponent(c)}`} className="group relative block aspect-[3/4] overflow-hidden rounded-2xl bg-surface">
              <Image src={categoryImage[c] ?? "/images/products/phone-stand-1.jpg"} alt="" fill sizes="(min-width: 1024px) 22vw, 46vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
              <span className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
              <span className="absolute inset-x-0 bottom-0 p-4 text-white sm:p-5">
                <span className="block text-lg font-bold sm:text-xl">{c}</span>
                <span className="text-sm text-white/80">{products.filter((p) => p.category === c).length} products</span>
              </span>
            </Link>
          </Reveal>
        ))}
      </div>

      <PersonalRails />

      {/* Spotlight: linen */}
      {linen && (
        <section className="mt-24 bg-surface">
          <div className="mx-auto grid max-w-[90rem] md:grid-cols-2">
            <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[560px]">
              <Image src="/images/products/linen-set-2.jpg" alt="Close-up of soft stonewashed linen sheets" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
            </div>
            <Reveal className="flex flex-col justify-center px-6 py-14 sm:px-12 lg:px-20">
              <p className="text-sm font-semibold text-forest">Home, trending</p>
              <h2 className="mt-2 text-3xl leading-tight font-extrabold sm:text-4xl">Softer every time you wash it.</h2>
              <p className="mt-4 max-w-md text-lg leading-relaxed text-muted-foreground">{linen.description[0]}</p>
              <ul className="mt-6 space-y-2.5">
                {linen.highlights.map((h) => (
                  <li key={h} className="flex items-center gap-3">
                    <Check className="size-5 shrink-0 text-forest" /> {h}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex items-center gap-4">
                <Button size="lg" className="h-12 px-7 text-base" render={<Link href={`/products/${linen.slug}`} />} nativeButton={false}>
                  Choose your size
                </Button>
                <span className="font-semibold">from {formatPrice(lowestPrice(linen))}</span>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      <ProductRail title="Under €30" subtitle="Small things that make a day better." items={underThirty} href="/products" />

      {/* Spotlight: recovery */}
      {gun && (
        <section className="mt-24 bg-ink text-white">
          <div className="mx-auto grid max-w-[90rem] md:grid-cols-2">
            <div className="relative aspect-[4/3] md:order-2 md:aspect-auto md:min-h-[560px]">
              <Image src="/images/products/massage-gun-2.jpg" alt="Close-up of a mini massage gun" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
            </div>
            <Reveal className="flex flex-col justify-center px-6 py-14 sm:px-12 lg:px-20">
              <p className="text-sm font-semibold text-note">Fitness</p>
              <h2 className="mt-2 text-3xl leading-tight font-extrabold sm:text-4xl">Five minutes, and your shoulders thank you.</h2>
              <p className="mt-4 max-w-md text-lg leading-relaxed text-white/75">{gun.description[0]}</p>
              <ul className="mt-6 space-y-2.5">
                {gun.highlights.map((h) => (
                  <li key={h} className="flex items-center gap-3 text-white/90">
                    <Check className="size-5 shrink-0 text-note" /> {h}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex items-center gap-4">
                <Button size="lg" className="h-12 bg-note px-7 text-base text-ink hover:bg-white" render={<Link href={`/products/${gun.slug}`} />} nativeButton={false}>
                  See the massage gun
                </Button>
                <span className="font-semibold">{formatPrice(lowestPrice(gun))}</span>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      <ProductRail title="More to explore" items={rest} href="/products" />

      <DeskAnatomy />

      {/* Data band */}
      <Container className="pt-24">
        <Reveal className="rounded-3xl bg-accent px-6 py-10 sm:px-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:items-center">
            <div>
              <h2 className="text-2xl font-extrabold sm:text-3xl">Picked from real market data</h2>
              <p className="mt-3 text-muted-foreground">
                Every product comes from a category that is growing online. These figures are sales growth across online shops, not our own sales.
              </p>
              <a href={SHOPIFY} target="_blank" rel="noopener" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-forest hover:underline">
                Source: Shopify, trending products report <ArrowUpRight className="size-4" />
              </a>
            </div>
            <dl className="grid grid-cols-2 gap-3">
              {dataPoints.map((d) => (
                <div key={d.label} className="rounded-2xl bg-white p-5 shadow-sm">
                  <dd className="text-3xl font-extrabold tracking-tight text-forest sm:text-4xl">{d.value}</dd>
                  <dt className="mt-1 text-sm text-muted-foreground">{d.label}</dt>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </Container>

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
                  <th scope="col" className="p-4"><span className="sr-only">Feature</span></th>
                  <th scope="col" className="w-28 bg-forest p-4 text-center font-bold text-white sm:w-40">{site.name}</th>
                  <th scope="col" className="w-28 p-4 text-center font-semibold text-muted-foreground sm:w-40">Overseas marketplace</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {comparison.map((row) => (
                  <tr key={row.label}>
                    <th scope="row" className="p-4 font-medium">{row.label}</th>
                    <td className="bg-accent/60 p-4 text-center font-semibold text-forest"><Cell value={row.us} strong /></td>
                    <td className="p-4 text-center text-muted-foreground"><Cell value={row.them} /></td>
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
            <Link href="/contact" className="font-semibold text-forest underline underline-offset-4">Write to us</Link>.
          </p>
        </div>
        <ShopFaq />
      </Container>
    </>
  );
}
