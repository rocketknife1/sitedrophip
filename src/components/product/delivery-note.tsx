"use client";

import { useSyncExternalStore } from "react";

import { site } from "@/data/site";
import { deliveryRangeLabel, deliveryWindow, formatDay, formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

const noop = () => () => {};

/**
 * The yellow note: a real delivery window computed from today's date and the shipping settings.
 * Dates render only in the browser (the visitor's clock); the server renders the day range.
 */
export function DeliveryNote({ className, tilt = true }: { className?: string; tilt?: boolean }) {
  const now = useSyncExternalStore(
    noop,
    () => new Date().toDateString(),
    () => null,
  );
  const range = now ? deliveryWindow(new Date()) : null;

  return (
    <div
      className={cn(
        "relative max-w-xs bg-note px-5 pt-6 pb-5 shadow-[2px_3px_0_rgba(30,42,38,0.9)]",
        tilt && "-rotate-2",
        className,
      )}
      style={{ color: "var(--ink)" }}
    >
      <span aria-hidden className="absolute -top-2 left-1/2 h-4 w-14 -translate-x-1/2 rotate-2 bg-white/60" />
      <p className="text-sm font-medium">Order today, it arrives</p>
      <p className="mt-1 text-2xl leading-tight font-extrabold tracking-tight">
        {range ? (
          <>
            <span className="whitespace-nowrap">{formatDay(range.from)} –</span>{" "}
            <span className="whitespace-nowrap">{formatDay(range.to)}</span>
          </>
        ) : (
          <>in {deliveryRangeLabel}</>
        )}
      </p>
      <p className="mt-3 text-sm leading-snug">
        Tracked delivery from {site.shipping.shipsFrom}.{" "}
        {site.shipping.freeOverCents > 0 && <>Free over {formatPrice(site.shipping.freeOverCents)}.</>}
      </p>
    </div>
  );
}
