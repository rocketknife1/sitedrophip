import { Check, Headphones, Lock, RotateCcw, Truck, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { DeskAnatomy } from "@/components/home/desk-anatomy";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { ScrollScene } from "@/components/motion/scroll-scene";
import { DeliveryNote } from "@/components/product/delivery-note";
import { ProductCard } from "@/components/product/product-card";
import { ShopFaq } from "@/components/shop-faq";
import { Button } from "@/components/ui/button";
import { products } from "@/data/products";
import { site } from "@/data/site";
import { deliveryRangeLabel, formatPrice } from "@/lib/format";

const benefits = [
  { icon: Truck, title: "Tracked EU delivery", text: `Free over ${formatPrice(site.shipping.freeOverCents)}, arrives in ${deliveryRangeLabel}.` },
  { icon: RotateCcw, title: `${site.returns.withdrawalDays}-day returns`, text: "Changed your mind? Send it back, no reason needed." },
  { icon: Lock, title: "Secure checkout", text: "Card, Apple Pay and Google Pay, processed by Stripe." },
  { icon: Headphones, title: "Real support", text: "Write to us and a person replies within one business day." },
];

const categoryTiles = [
  { category: "Posture", image: "/images/products/laptop-stand-1.jpg", text: "Stands and risers" },
  { category: "Desk mats", image: "/images/lifestyle/felt-mat-desk.jpg", text: "Wool felt, four colours" },
  { category: "Lighting", image: "/images/products/light-bar-2.jpg", text: "Light without glare" },
  { category: "Organisation", image: "/images/products/headphone-stand-2.jpg", text: "A place for everything" },
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

export default function HomePage() {
  const mat = products.find((p) => p.slug === "wool-felt-desk-mat");
  const light = products.find((p) => p.slug === "monitor-light-bar");

  return (
    <>
      {/* Hero */}
      <ScrollScene className="relative isolate overflow-hidden bg-ink">
        <div className="absolute inset-0 -z-10 will-change-transform" style={{ transform: "scale(calc(1.12 - var(--p, 0) * 0.12)) translateY(calc(var(--p, 0) * 60px))" }}>
          <Image
            src="/images/lifestyle/hero.jpg"
            alt="A tidy dark desk with a monitor, keyboard and a plant"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[70%_center]"
          />
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/85 via-black/45 to-black/10 md:bg-gradient-to-r md:from-black/80 md:via-black/40 md:to-transparent" />
        <Container className="flex min-h-[620px] flex-col justify-end pt-24 pb-12 md:min-h-[700px] md:justify-center md:py-24">
          <div className="max-w-xl text-white will-change-transform" style={{ transform: "translateY(calc(var(--p, 0) * -90px))", opacity: "calc(1 - var(--p, 0) * 1.3)" }}>
            <h1 className="text-[2.75rem] leading-[1.02] font-extrabold sm:text-6xl lg:text-7xl">Build a desk you want to sit at.</h1>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-white/85">
              Stands, mats, lights and organisers that fix the neck ache, the cable mess and the glare. Delivered across the EU.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" className="h-13 bg-white px-7 text-base text-ink hover:bg-note" render={<Link href="/products" />} nativeButton={false}>
                Shop the collection
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-13 border-white/60 bg-transparent px-7 text-base text-white hover:bg-white/10 hover:text-white"
                render={<Link href="/products?category=Posture" />}
                nativeButton={false}
              >
                Fix my posture
              </Button>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/85">
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
        </Container>
        <div className="absolute right-[max(1.5rem,calc((100vw-72rem)/2+1.5rem))] bottom-14 hidden lg:block" style={{ transform: "translateY(calc(var(--p, 0) * -180px))" }}>
          <DeliveryNote className="w-72 rotate-3" />
        </div>
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

      {/* Products */}
      <Container className="pt-20">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold sm:text-4xl">Shop the desk</h2>
            <p className="mt-2 text-muted-foreground">Eight things, each fixing one annoying problem.</p>
          </div>
          <Link href="/products" className="hidden shrink-0 text-sm font-semibold text-forest underline-offset-4 hover:underline sm:block">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
          {products.map((p, i) => (
            <Reveal key={p.id} delay={(i % 4) * 70}>
              <ProductCard product={p} priority={i < 4} />
            </Reveal>
          ))}
        </div>
      </Container>

      <DeskAnatomy />

      {/* Categories */}
      <Container className="pt-24">
        <h2 className="mb-8 text-3xl font-extrabold sm:text-4xl">Shop by problem</h2>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {categoryTiles.map((t, i) => (
            <Reveal key={t.category} delay={i * 70}>
            <Link
              href={`/products?category=${encodeURIComponent(t.category)}`}
              className="group relative block aspect-[3/4] overflow-hidden rounded-xl bg-surface"
            >
              <Image src={t.image} alt="" fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 text-white sm:p-5">
                <p className="text-lg font-bold sm:text-xl">{t.category}</p>
                <p className="text-sm text-white/80">{t.text}</p>
              </div>
            </Link>
            </Reveal>
          ))}
        </div>
      </Container>

      {/* Feature: desk mat */}
      {mat && (
        <section className="mt-24 bg-surface">
          <div className="mx-auto grid max-w-[90rem] md:grid-cols-2">
            <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[560px]">
              <Image src="/images/lifestyle/felt-mat-desk.jpg" alt="Grey wool felt mat under a laptop and keyboard" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
            </div>
            <div className="flex flex-col justify-center px-6 py-14 sm:px-12 lg:px-20">
              <h2 className="text-3xl leading-tight font-extrabold sm:text-4xl">A quieter desk starts under the keyboard.</h2>
              <p className="mt-4 max-w-md text-lg leading-relaxed text-muted-foreground">
                4 mm of merino wool felt softens every keystroke and gives the mouse a smooth, even glide. It also keeps the desk from getting
                scratched.
              </p>
              <ul className="mt-6 space-y-2.5">
                {mat.highlights.map((h) => (
                  <li key={h} className="flex items-center gap-3">
                    <Check className="size-5 shrink-0 text-forest" /> {h}
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Button size="lg" className="h-12 px-7 text-base" render={<Link href={`/products/${mat.slug}`} />} nativeButton={false}>
                  Choose your colour
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Feature: light bar */}
      {light && (
        <section className="bg-ink text-white">
          <div className="mx-auto grid max-w-[90rem] md:grid-cols-2">
            <div className="relative aspect-[4/3] md:order-2 md:aspect-auto md:min-h-[560px]">
              <Image src="/images/products/light-bar-1.jpg" alt="Monitor light bar lighting a desk" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
            </div>
            <div className="flex flex-col justify-center px-6 py-14 sm:px-12 lg:px-20">
              <h2 className="text-3xl leading-tight font-extrabold sm:text-4xl">Work late without the glare.</h2>
              <p className="mt-4 max-w-md text-lg leading-relaxed text-white/75">
                The light bar sits on your monitor and lights only the desk. No reflection on the screen, no lamp taking up space.
              </p>
              <ul className="mt-6 space-y-2.5">
                {light.highlights.map((h) => (
                  <li key={h} className="flex items-center gap-3 text-white/90">
                    <Check className="size-5 shrink-0 text-note" /> {h}
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Button size="lg" className="h-12 bg-note px-7 text-base text-ink hover:bg-white" render={<Link href={`/products/${light.slug}`} />} nativeButton={false}>
                  See the light bar
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

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
