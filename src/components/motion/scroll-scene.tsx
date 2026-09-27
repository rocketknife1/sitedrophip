"use client";

import { useEffect, useRef } from "react";

/**
 * Exposes how far the section has scrolled past the top of the viewport as the CSS
 * variable --p (0 → 1). Children animate with plain CSS, e.g.
 * transform: scale(calc(1.12 - var(--p, 0) * 0.12)).
 */
export function ScrollScene({ className, children, ...props }: React.ComponentProps<"section">) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const r = el.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, -r.top / r.height));
      el.style.setProperty("--p", p.toFixed(4));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section ref={ref} className={className} {...props}>
      {children}
    </section>
  );
}
