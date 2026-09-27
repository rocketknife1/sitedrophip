import { site } from "@/data/site";

const money = new Intl.NumberFormat(site.locale, { style: "currency", currency: site.currency });

export function formatPrice(cents: number): string {
  return money.format(cents / 100);
}

export function shippingCents(subtotalCents: number): number {
  return subtotalCents >= site.shipping.freeOverCents ? 0 : site.shipping.flatRateCents;
}

function addBusinessDays(date: Date, days: number): Date {
  const d = new Date(date);
  let added = 0;
  while (added < days) {
    d.setDate(d.getDate() + 1);
    const day = d.getDay();
    if (day !== 0 && day !== 6) added++;
  }
  return d;
}

/** Earliest and latest delivery date for an order placed at `now`. */
export function deliveryWindow(now: Date = new Date()): { from: Date; to: Date } {
  const { handlingDays, transitDays, cutoffHour } = site.shipping;
  const day = now.getDay();
  const pastCutoff = now.getHours() >= cutoffHour || day === 0 || day === 6;
  // Orders past the cut-off (or on weekends) count as placed on the next business day.
  const start = pastCutoff ? addBusinessDays(now, 1) : now;
  return {
    from: addBusinessDays(start, handlingDays.min + transitDays.min),
    to: addBusinessDays(start, handlingDays.max + transitDays.max),
  };
}

const dayFormat = new Intl.DateTimeFormat(site.locale, { weekday: "short", day: "numeric", month: "short" });

export function formatDay(date: Date): string {
  return dayFormat.format(date);
}

export const deliveryRangeLabel = `${site.shipping.handlingDays.min + site.shipping.transitDays.min}–${
  site.shipping.handlingDays.max + site.shipping.transitDays.max
} business days`;
