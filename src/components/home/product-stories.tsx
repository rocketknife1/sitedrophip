"use client";

import { ChevronLeft, ChevronRight, Pause, Play, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import { useCart } from "@/store/cart";

export type Story = {
  id: string;
  label: string;
  image: string;
  title: string;
  text: string;
  price: string;
  href: string;
  /** Present when the product has a single variant, so it can go straight into the cart. */
  variantId?: string;
};

const DURATION = 6000;

/** Instagram-style stories for products: tap to pause, swipe or arrows to move, add to cart from the story. */
export function ProductStories({ stories }: { stories: Story[] }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const bars = useRef<(HTMLElement | null)[]>([]);
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const [paused, setPaused] = useState(false);
  const [seen, setSeen] = useState<Set<number>>(new Set());
  const add = useCart((s) => s.add);
  const down = useRef<{ x: number; y: number } | null>(null);

  const indexRef = useRef(0);
  const close = useCallback(() => dialog.current?.close(), []);
  const show = useCallback((n: number) => {
    indexRef.current = n;
    setIndex(n);
    setSeen((s) => new Set(s).add(n));
  }, []);
  const go = useCallback(
    (d: number) => {
      const n = indexRef.current + d;
      if (n < 0) show(0);
      else if (n >= stories.length) close();
      else show(n);
    },
    [stories.length, close, show],
  );

  useEffect(() => {
    if (!open) return;
    let frame = 0;
    let start = performance.now();
    let elapsed = 0;
    bars.current.forEach((b, i) => { if (b) b.style.transform = `scaleX(${i < index ? 1 : 0})`; });
    const tick = (now: number) => {
      if (paused) start = now - elapsed;
      else {
        elapsed = now - start;
        const p = Math.min(1, elapsed / DURATION);
        const bar = bars.current[index];
        if (bar) bar.style.transform = `scaleX(${p})`;
        if (p >= 1) {
          go(1);
          return;
        }
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [open, index, paused, go]);

  const openAt = (i: number) => {
    show(i);
    setPaused(matchMedia("(prefers-reduced-motion: reduce)").matches);
    dialog.current?.showModal();
    setOpen(true);
  };

  const s = stories[index];

  return (
    <>
      <ul className="flex gap-4 overflow-x-auto pt-2 pb-3 [scrollbar-width:none] sm:gap-6 [&::-webkit-scrollbar]:hidden" aria-label="Product stories">
        {stories.map((st, i) => (
          <li key={st.id} className="shrink-0">
            <button type="button" onClick={() => openAt(i)} className="group grid w-20 justify-items-center gap-2 sm:w-24">
              <span
                className={cn(
                  "rounded-full p-[3px] transition-transform group-hover:scale-105",
                  seen.has(i) ? "bg-border" : "bg-gradient-to-tr from-note via-[#ff7a59] to-forest",
                )}
              >
                <span className="relative block size-[74px] overflow-hidden rounded-full border-[3px] border-white sm:size-[86px]">
                  <Image src={st.image} alt="" fill sizes="90px" className="object-cover" />
                </span>
              </span>
              <span className="line-clamp-1 text-xs font-medium sm:text-sm">{st.label}</span>
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialog}
        onClose={() => setOpen(false)}
        onClick={(e) => { if (e.target === dialog.current) close(); }}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") go(1);
          if (e.key === "ArrowLeft") go(-1);
          if (e.key === " ") { e.preventDefault(); setPaused((p) => !p); }
        }}
        aria-label="Product stories"
        className="m-auto h-[100dvh] max-h-[100dvh] w-full max-w-full overflow-hidden bg-transparent p-0 backdrop:bg-black/85 backdrop:backdrop-blur-sm sm:h-[min(860px,94dvh)] sm:w-[420px] sm:rounded-2xl"
      >
        {open && s && (
          <div
            className="relative flex h-full touch-pan-y flex-col overflow-hidden bg-ink text-white select-none sm:rounded-2xl"
            onPointerDown={(e) => {
              down.current = (e.target as HTMLElement).closest("button, a") ? null : { x: e.clientX, y: e.clientY };
            }}
            onPointerUp={(e) => {
              if (!down.current) return;
              const dx = e.clientX - down.current.x;
              const dy = e.clientY - down.current.y;
              down.current = null;
              if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1);
              else if (Math.abs(dx) < 10 && Math.abs(dy) < 10) setPaused((p) => !p);
            }}
          >
            <Image src={s.image} alt="" fill sizes="420px" className="scale-110 object-cover opacity-40 blur-2xl" />
            <div className="relative z-10 flex gap-1 px-3 pt-3">
              {stories.map((st, i) => (
                <span key={st.id} className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/30">
                  <i ref={(el) => { bars.current[i] = el; }} className="block h-full origin-left bg-white" style={{ transform: `scaleX(${i < index ? 1 : 0})` }} />
                </span>
              ))}
            </div>
            <div className="relative z-10 flex items-center gap-2 px-4 pt-3 text-sm">
              <strong className="font-semibold">Sodo Store</strong>
              <span className="text-white/70">{s.label}</span>
              <button type="button" onClick={() => setPaused((p) => !p)} aria-label={paused ? "Play" : "Pause"} className="ml-auto grid size-9 place-items-center rounded-full bg-black/30">
                {paused ? <Play className="size-4" /> : <Pause className="size-4" />}
              </button>
              <button type="button" onClick={close} aria-label="Close" className="grid size-9 place-items-center rounded-full bg-black/30">
                <X className="size-5" />
              </button>
            </div>
            <div className="relative z-0 mx-4 mt-3 min-h-0 flex-1 overflow-hidden rounded-xl">
              <Image key={s.image} src={s.image} alt={s.title} fill sizes="420px" className="animate-in object-cover duration-500 fade-in" />
              {paused && (
                <span aria-hidden className="absolute top-1/2 left-1/2 grid size-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-black/40">
                  <Pause className="size-7" />
                </span>
              )}
            </div>
            <div className="relative z-10 p-5">
              <p className="text-xl font-extrabold">{s.title}</p>
              <p className="mt-1 text-sm text-white/80">{s.text}</p>
              <div className="mt-4 flex gap-2">
                {s.variantId ? (
                  <button
                    type="button"
                    onClick={() => { add(s.variantId!); close(); }}
                    className="h-12 flex-1 rounded-lg bg-white font-semibold text-ink transition hover:bg-note"
                  >
                    Add to cart · {s.price}
                  </button>
                ) : (
                  <Link href={s.href} onClick={close} className="grid h-12 flex-1 place-items-center rounded-lg bg-white font-semibold text-ink transition hover:bg-note">
                    Choose options · {s.price}
                  </Link>
                )}
                <Link href={s.href} onClick={close} className="grid h-12 place-items-center rounded-lg border border-white/40 px-4 font-semibold">
                  Details
                </Link>
              </div>
            </div>
            <button type="button" onClick={() => go(-1)} aria-label="Previous story" className="absolute top-1/2 left-2 z-20 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-black/30 backdrop-blur">
              <ChevronLeft className="size-5" />
            </button>
            <button type="button" onClick={() => go(1)} aria-label="Next story" className="absolute top-1/2 right-2 z-20 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-black/30 backdrop-blur">
              <ChevronRight className="size-5" />
            </button>
          </div>
        )}
      </dialog>
    </>
  );
}
