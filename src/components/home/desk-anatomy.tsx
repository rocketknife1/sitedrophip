"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { QuickAdd } from "@/components/product/quick-add";
import { getProduct, lowestPrice } from "@/data/products";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

/** Hotspots are percentages of the photo (desk-mat-forest.jpg, 4:3). */
const STEPS = [
  {
    slug: "walnut-monitor-riser",
    x: 50,
    y: 57,
    title: "Screen at eye level",
    text: "A riser lifts the screen so your neck stays straight, and gives the keyboard a place to slide under.",
  },
  {
    slug: "oak-headphone-stand",
    x: 6,
    y: 43,
    title: "A home for the headphones",
    text: "Off the desk, within reach, and the headband keeps its shape.",
  },
  {
    slug: "wool-felt-desk-mat",
    x: 24,
    y: 86,
    title: "A quieter, warmer surface",
    text: "Wool felt softens every keystroke, gives the mouse an even glide and protects the wood.",
  },
];

export function DeskAnatomy() {
  const outer = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [pinned, setPinned] = useState(false);

  // On large screens the scene is pinned and the scroll position picks the step
  useEffect(() => {
    const el = outer.current;
    if (!el) return;
    const mq = matchMedia("(min-width: 1024px) and (min-height: 700px)");
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    const update = () => {
      frame = 0;
      if (!mq.matches) return;
      const r = el.getBoundingClientRect();
      const p = Math.min(0.999, Math.max(0, -r.top / Math.max(1, r.height - window.innerHeight)));
      setActive(Math.floor(p * STEPS.length));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const sync = () => {
      setPinned(mq.matches && !reduce);
      onScroll();
    };
    sync();
    mq.addEventListener("change", sync);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      mq.removeEventListener("change", sync);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  const step = STEPS[active];

  return (
    <section ref={outer} aria-labelledby="anatomy-title" className={cn("relative mt-24 bg-ink text-white", pinned && "h-[320vh]")}>
      <div className={cn("mx-auto max-w-[90rem] px-4 py-16 sm:px-6", pinned && "sticky top-16 flex h-[calc(100vh-4rem)] items-center py-8")}>
        <div className="grid w-full items-center gap-10 lg:grid-cols-[1.35fr_1fr] lg:gap-16">
          {/* Photo with hotspots; zooms gently towards the active one */}
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-white/5">
            <div
              className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(.2,.8,.2,1)] motion-reduce:transition-none"
              style={{ transformOrigin: `${step.x}% ${step.y}%`, transform: "scale(1.12)" }}
            >
              <Image
                src="/images/products/desk-mat-forest.jpg"
                alt="A tidy desk with a laptop on a riser, headphones on a stand and a green felt desk mat"
                fill
                sizes="(min-width: 1024px) 55vw, 100vw"
                className="object-cover"
              />
              {STEPS.map((s, i) => (
                <button
                  key={s.slug}
                  type="button"
                  onClick={() => setActive(i)}
                  aria-label={`${s.title}: ${getProduct(s.slug)?.name}`}
                  aria-pressed={i === active}
                  className="group absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${s.x}%`, top: `${s.y}%` }}
                >
                  <span
                    className={cn(
                      "relative grid size-9 place-items-center rounded-full border-2 border-white shadow-lg transition-all duration-300",
                      i === active ? "scale-110 bg-note" : "bg-forest/80 group-hover:bg-forest",
                    )}
                  >
                    <span className="text-sm font-bold text-white">{i + 1}</span>
                    {i === active && <span aria-hidden className="absolute inset-0 animate-ping rounded-full border-2 border-note motion-reduce:hidden" />}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Steps */}
          <div>
            <p className="text-sm font-semibold text-note">Anatomy of a good desk</p>
            <h2 id="anatomy-title" className="mt-2 text-3xl leading-tight font-extrabold sm:text-5xl">
              Three small changes. A different day at your desk.
            </h2>
            <ol className="mt-8 space-y-3">
              {STEPS.map((s, i) => {
                const product = getProduct(s.slug);
                if (!product) return null;
                const on = i === active;
                const single = product.variants.length === 1 ? product.variants[0] : null;
                return (
                  <li
                    key={s.slug}
                    className={cn(
                      "rounded-xl border p-4 transition-all duration-500",
                      on ? "border-note/60 bg-white/10" : "border-white/10 bg-transparent opacity-60",
                    )}
                  >
                    <button type="button" onClick={() => setActive(i)} className="flex w-full items-baseline gap-3 text-left" aria-expanded={on}>
                      <span className="text-sm font-bold text-note">{i + 1}</span>
                      <span className="text-lg font-bold">{s.title}</span>
                    </button>
                    <div className={cn("grid transition-[grid-template-rows] duration-500", on ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
                      <div className="overflow-hidden">
                        <p className="mt-2 pl-6 text-white/75">{s.text}</p>
                        <div className="mt-4 flex items-center gap-3 pl-6">
                          <div className="relative size-14 shrink-0 overflow-hidden rounded-lg">
                            <Image src={product.images[0].src} alt="" fill sizes="56px" className="object-cover" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <Link href={`/products/${product.slug}`} className="font-semibold hover:underline">
                              {product.name}
                            </Link>
                            <p className="text-sm text-white/70">{formatPrice(lowestPrice(product))}</p>
                          </div>
                          {single ? (
                            <QuickAdd variantId={single.id} productName={product.name} />
                          ) : (
                            <Link href={`/products/${product.slug}`} className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink hover:bg-note">
                              Choose
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
            {pinned && (
              <div className="mt-6 h-1 overflow-hidden rounded-full bg-white/10" aria-hidden>
                <div className="h-full rounded-full bg-note transition-all duration-500" style={{ width: `${((active + 1) / STEPS.length) * 100}%` }} />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
