"use client";

import { Lock, Pause, Play, RotateCcw, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type Slide = {
  image: string;
  alt: string;
  position?: string;
  kicker: string;
  title: string;
  text: string;
  cta: { label: string; href: string };
};

const SLIDE_MS = 6500;

const REDUCE = "(prefers-reduced-motion: reduce)";
const subscribeReduce = (cb: () => void) => {
  const mq = matchMedia(REDUCE);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

/** Full-bleed billboard: slow zoom on each photo, auto-advances, pauses on hover, focus or tab switch. */
export function HeroCarousel({ slides, perks }: { slides: Slide[]; perks: { freeOver: string; returnsDays: number } }) {
  const [index, setIndex] = useState(0);
  const [userPaused, setPaused] = useState(false);
  const [hover, setHover] = useState(false);
  const bars = useRef<(HTMLSpanElement | null)[]>([]);
  const reduced = useSyncExternalStore(subscribeReduce, () => matchMedia(REDUCE).matches, () => false);
  const paused = userPaused || reduced;

  // One rAF loop drives the progress bar and the switch to the next slide
  useEffect(() => {
    let frame = 0;
    let start = performance.now();
    let elapsed = 0;
    const tick = (now: number) => {
      if (paused || hover || document.hidden) {
        start = now - elapsed;
      } else {
        elapsed = now - start;
        const p = Math.min(1, elapsed / SLIDE_MS);
        const bar = bars.current[index];
        if (bar) bar.style.transform = `scaleX(${p})`;
        if (p >= 1) {
          setIndex((i) => (i + 1) % slides.length);
          return;
        }
      }
      frame = requestAnimationFrame(tick);
    };
    bars.current.forEach((b, i) => { if (b) b.style.transform = `scaleX(${i < index ? 1 : 0})`; });
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [index, paused, hover, slides.length]);

  const slide = slides[index];

  return (
    <section
      className="relative isolate overflow-hidden bg-ink text-white"
      aria-roledescription="carousel"
      aria-label="Highlights"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
    >
      {slides.map((s, i) => (
        <div key={s.image} aria-hidden={i !== index} className={cn("absolute inset-0 -z-10 transition-opacity duration-1000", i === index ? "opacity-100" : "opacity-0")}>
          <Image
            src={s.image}
            alt={i === index ? s.alt : ""}
            fill
            priority={i === 0}
            sizes="100vw"
            className={cn("object-cover", i === index && !paused && "animate-kenburns")}
            style={{ objectPosition: s.position ?? "center" }}
          />
        </div>
      ))}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/85 via-black/45 to-black/10 md:bg-gradient-to-r md:from-black/80 md:via-black/40 md:to-transparent" />

      <div className="mx-auto flex min-h-[620px] w-full max-w-6xl flex-col justify-end px-4 pt-24 pb-10 sm:px-6 md:min-h-[700px] md:justify-center md:py-24">
        <div key={index} className="max-w-xl animate-in duration-700 fade-in slide-in-from-bottom-4">
          <p className="text-sm font-semibold text-note">{slide.kicker}</p>
          <h1 className="mt-3 text-[2.6rem] leading-[1.03] font-extrabold sm:text-6xl lg:text-7xl">{slide.title}</h1>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-white/85">{slide.text}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" className="h-13 bg-white px-7 text-base text-ink hover:bg-note" render={<Link href={slide.cta.href} />} nativeButton={false}>
              {slide.cta.label}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-13 border-white/60 bg-transparent px-7 text-base text-white hover:bg-white/10 hover:text-white"
              render={<Link href="/products" />}
              nativeButton={false}
            >
              Shop everything
            </Button>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-6">
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/85">
            <li className="flex items-center gap-2"><Truck className="size-4" /> Free over {perks.freeOver}</li>
            <li className="flex items-center gap-2"><RotateCcw className="size-4" /> {perks.returnsDays}-day returns</li>
            <li className="flex items-center gap-2"><Lock className="size-4" /> Secure checkout</li>
          </ul>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setPaused((p) => !p)}
              aria-label={paused ? "Play slideshow" : "Pause slideshow"}
              className="grid size-9 place-items-center rounded-full border border-white/40 bg-black/20 backdrop-blur transition hover:bg-white/20"
            >
              {paused ? <Play className="size-4" /> : <Pause className="size-4" />}
            </button>
            <div className="flex gap-1.5" role="tablist" aria-label="Choose a highlight">
              {slides.map((s, i) => (
                <button
                  key={s.image}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={s.title}
                  onClick={() => setIndex(i)}
                  className="h-1 w-10 overflow-hidden rounded-full bg-white/30 sm:w-12"
                >
                  <span ref={(el) => { bars.current[i] = el; }} className="block h-full origin-left bg-white" style={{ transform: `scaleX(${i < index ? 1 : 0})` }} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
