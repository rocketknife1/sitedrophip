"use client";

import { Lock, RotateCcw, TrendingUp, Truck } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { QuantityStepper } from "@/components/cart/quantity-stepper";
import { PaymentIcons } from "@/components/payment-icons";
import { Button } from "@/components/ui/button";
import type { Product } from "@/data/products";
import { site } from "@/data/site";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useCart } from "@/store/cart";
import { useRecent } from "@/store/lists";
import { DeliveryNote } from "./delivery-note";
import { Price } from "./price";

export function ProductView({ product }: { product: Product }) {
  const firstAvailable = product.variants.find((v) => v.inStock) ?? product.variants[0];
  const [variantId, setVariantId] = useState(firstAvailable.id);
  const [imageIndex, setImageIndex] = useState(firstAvailable.image ?? 0);
  const [quantity, setQuantity] = useState(1);
  const [buyBoxVisible, setBuyBoxVisible] = useState(true);
  const buttonRef = useRef<HTMLDivElement>(null);
  const add = useCart((s) => s.add);
  const pushRecent = useRecent((s) => s.push);

  // Remember what the visitor looked at, for "Recently viewed" on the home page
  useEffect(() => {
    pushRecent(product.id);
  }, [product.id, pushRecent]);

  const variant = product.variants.find((v) => v.id === variantId)!;
  const image = product.images[imageIndex] ?? product.images[0];
  const hasSwatches = product.variants.every((v) => v.swatch);

  // Show the sticky mobile bar only once the main add-to-cart button has scrolled away.
  useEffect(() => {
    const el = buttonRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setBuyBoxVisible(entry.isIntersecting));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  function selectVariant(id: string) {
    setVariantId(id);
    const v = product.variants.find((x) => x.id === id);
    if (v?.image !== undefined) setImageIndex(v.image);
  }

  function addToCart() {
    add(variant.id, quantity);
    setQuantity(1);
  }

  return (
    <div className="grid gap-8 md:grid-cols-[1.15fr_1fr] lg:gap-14">
      {/* Gallery */}
      <div className="md:sticky md:top-24 md:self-start">
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-surface">
          <Image
            key={image.src}
            src={image.src}
            alt={image.alt}
            fill
            priority
            sizes="(min-width: 768px) 55vw, 100vw"
            className="animate-in object-cover duration-300 fade-in"
          />
        </div>
        {product.images.length > 1 && (
          <ul className="mt-3 grid grid-cols-5 gap-2 sm:gap-3">
            {product.images.map((img, i) => (
              <li key={img.src}>
                <button
                  type="button"
                  onClick={() => setImageIndex(i)}
                  aria-label={`Show image ${i + 1}: ${img.alt}`}
                  aria-current={i === imageIndex}
                  className={cn(
                    "relative block aspect-square w-full overflow-hidden rounded-lg bg-surface ring-2 ring-offset-2 transition",
                    i === imageIndex ? "ring-forest" : "ring-transparent hover:ring-border",
                  )}
                >
                  <Image src={img.src} alt="" fill sizes="120px" className="object-cover" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Buy box */}
      <div>
        <p className="text-sm font-medium text-forest">{product.category}</p>
        <h1 className="mt-1 text-3xl leading-tight font-extrabold sm:text-[2.5rem]">{product.name}</h1>
        <div className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <Price cents={variant.priceCents} compareAtCents={variant.compareAtCents} className="text-2xl font-bold" />
          <span className="text-sm text-muted-foreground">VAT included</span>
        </div>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{product.tagline}</p>
        {product.trend && (
          <a
            href={product.trend.url}
            target="_blank"
            rel="noopener"
            className="mt-5 flex items-start gap-3 rounded-xl border bg-surface p-4 text-sm transition-colors hover:border-forest"
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-ink text-note">
              <TrendingUp className="size-4" />
            </span>
            <span>
              <strong className="block text-base">Trending: {product.trend.stat}</strong>
              {product.trend.detail} <span className="text-muted-foreground">Source: {product.trend.source}.</span>
            </span>
          </a>
        )}

        {product.variants.length > 1 && (
          <fieldset className="mt-7">
            <legend className="mb-3 text-sm font-semibold">
              {product.variantLabel}: <span className="font-normal text-muted-foreground">{variant.name}</span>
            </legend>
            <div className="flex flex-wrap gap-2.5">
              {product.variants.map((v) => (
                <label
                  key={v.id}
                  title={v.name}
                  className={cn(
                    "cursor-pointer transition has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-forest",
                    hasSwatches
                      ? cn("size-10 rounded-full ring-2 ring-offset-2", v.id === variantId ? "ring-forest" : "ring-transparent hover:ring-border")
                      : cn(
                          "rounded-lg border-2 px-4 py-2.5 text-sm font-semibold",
                          v.id === variantId ? "border-forest bg-accent text-forest" : "border-border hover:border-foreground/30",
                        ),
                    !v.inStock && "cursor-not-allowed opacity-40",
                  )}
                  style={hasSwatches ? { background: v.swatch } : undefined}
                >
                  <input
                    type="radio"
                    name="variant"
                    value={v.id}
                    checked={v.id === variantId}
                    disabled={!v.inStock}
                    onChange={() => selectVariant(v.id)}
                    className="sr-only"
                  />
                  <span className={hasSwatches ? "sr-only" : undefined}>
                    {v.name}
                    {!hasSwatches && new Set(product.variants.map((x) => x.priceCents)).size > 1 && (
                      <span className="ml-1.5 font-normal text-muted-foreground">{formatPrice(v.priceCents)}</span>
                    )}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        )}

        <div ref={buttonRef} className="mt-7 flex gap-3">
          <QuantityStepper value={quantity} onChange={setQuantity} label="Quantity" className="h-13 rounded-lg [&_button]:h-13" />
          <Button size="lg" className="h-13 flex-1 rounded-lg text-base" disabled={!variant.inStock} onClick={addToCart}>
            {variant.inStock ? `Add to cart · ${formatPrice(variant.priceCents * quantity)}` : "Out of stock"}
          </Button>
        </div>
        <PaymentIcons className="mt-4" />

        <ul className="mt-7 divide-y rounded-xl border text-sm">
          <li className="flex items-start gap-3 p-4">
            <Truck className="mt-0.5 size-5 shrink-0 text-forest" />
            <span>
              <strong className="font-semibold">Free delivery over {formatPrice(site.shipping.freeOverCents)}.</strong> Otherwise{" "}
              {formatPrice(site.shipping.flatRateCents)}, tracked, to all EU countries.
            </span>
          </li>
          <li className="flex items-start gap-3 p-4">
            <RotateCcw className="mt-0.5 size-5 shrink-0 text-forest" />
            <span>
              <strong className="font-semibold">{site.returns.withdrawalDays} days to change your mind.</strong> Send it back for a full refund.
            </span>
          </li>
          <li className="flex items-start gap-3 p-4">
            <Lock className="mt-0.5 size-5 shrink-0 text-forest" />
            <span>
              <strong className="font-semibold">Secure payment by Stripe.</strong> We never see your card details.
            </span>
          </li>
        </ul>

        <DeliveryNote tilt={false} className="mt-7 max-w-none shadow-none" />
      </div>

      {/* Sticky add-to-cart on mobile */}
      <div
        aria-hidden={buyBoxVisible}
        className={cn(
          "fixed inset-x-0 bottom-0 z-30 flex items-center gap-3 border-t bg-white/95 px-4 py-3 backdrop-blur transition-transform duration-300 md:hidden",
          buyBoxVisible ? "translate-y-full" : "translate-y-0",
        )}
      >
        <div className="relative size-12 shrink-0 overflow-hidden rounded-md bg-surface">
          <Image src={image.src} alt="" fill sizes="48px" className="object-cover" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{product.name}</p>
          <p className="text-sm text-muted-foreground">
            {formatPrice(variant.priceCents)}
            {product.variants.length > 1 && ` · ${variant.name}`}
          </p>
        </div>
        <Button className="h-11 px-5" disabled={!variant.inStock} onClick={addToCart} tabIndex={buyBoxVisible ? -1 : 0}>
          Add to cart
        </Button>
      </div>
    </div>
  );
}
