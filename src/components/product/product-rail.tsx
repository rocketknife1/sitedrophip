"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import type { Product } from "@/data/products";
import { ProductCard } from "./product-card";

/** Horizontal, swipeable row of products with arrow buttons (streaming-style shelf). */
export function ProductRail({ title, subtitle, items, href }: { title: string; subtitle?: string; items: Product[]; href?: string }) {
  const track = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  const update = useCallback(() => {
    const el = track.current;
    if (!el) return;
    setEdges({ start: el.scrollLeft <= 2, end: el.scrollLeft >= el.scrollWidth - el.clientWidth - 2 });
  }, []);

  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [update, items.length]);

  const scroll = (dir: number) => {
    const el = track.current;
    if (!el) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: reduce ? "auto" : "smooth" });
  };

  if (!items.length) return null;

  return (
    <section className="pt-16" aria-label={title}>
      <div className="mx-auto flex w-full max-w-6xl items-end justify-between gap-4 px-4 sm:px-6">
        <div>
          <h2 className="text-2xl font-extrabold sm:text-3xl">{title}</h2>
          {subtitle && <p className="mt-1 text-muted-foreground">{subtitle}</p>}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {href && (
            <Link href={href} className="mr-2 hidden text-sm font-semibold text-forest underline-offset-4 hover:underline sm:block">
              View all
            </Link>
          )}
          <button
            type="button"
            onClick={() => scroll(-1)}
            disabled={edges.start}
            aria-label={`${title}: previous`}
            className="grid size-10 place-items-center rounded-full border bg-white transition hover:border-forest hover:text-forest disabled:opacity-30"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => scroll(1)}
            disabled={edges.end}
            aria-label={`${title}: next`}
            className="grid size-10 place-items-center rounded-full border bg-white transition hover:border-forest hover:text-forest disabled:opacity-30"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
      </div>
      <div
        ref={track}
        onScroll={update}
        className="mt-6 grid snap-x snap-mandatory auto-cols-[62%] grid-flow-col gap-4 overflow-x-auto px-[max(1rem,calc((100vw_-_72rem)/2_+_1.5rem))] pb-4 [scrollbar-width:none] sm:auto-cols-[38%] sm:gap-6 lg:auto-cols-[calc((72rem_-_4.5rem)/4)] [&::-webkit-scrollbar]:hidden"
        style={{ scrollPaddingInline: "max(1rem, calc((100vw - 72rem) / 2 + 1.5rem))" }}
      >
        {items.map((p) => (
          <div key={p.id} className="snap-start">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </section>
  );
}
