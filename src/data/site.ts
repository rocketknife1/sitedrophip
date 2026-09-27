/**
 * Single source of truth for store settings.
 * Everything wrapped in [BRACKETS] is a placeholder you MUST replace before launch.
 */

export const EU_COUNTRIES = [
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR", "HU", "IE",
  "IT", "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK", "SI", "ES", "SE",
] as const;

export type EuCountry = (typeof EU_COUNTRIES)[number];

export const site = {
  name: "Sodo Store",
  description:
    "Trending products picked from real sales and search data: tech, home, fitness, pets and more. Tracked delivery across the EU.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",

  /**
   * While true, a banner tells visitors that orders are not fulfilled.
   * Set NEXT_PUBLIC_DEMO_MODE=false only once real products, supplier and company data are in place.
   */
  demoMode: process.env.NEXT_PUBLIC_DEMO_MODE !== "false",

  currency: "EUR",
  locale: "en-IE",

  company: {
    legalName: "[COMPANY LEGAL NAME SRL]",
    registrationNumber: "[TRADE REGISTER NO. J00/0000/2026]",
    vatId: "[VAT ID RO00000000]",
    address: "[Street, number, postcode, city, Romania]",
    email: "[support@yourdomain.com]",
    phone: "[+40 700 000 000]",
    representative: "[Full name of administrator]",
  },

  shipping: {
    /** Where parcels are actually dispatched from. Must be true. */
    shipsFrom: "[our partner warehouse in Poland]",
    countries: EU_COUNTRIES,
    /** Flat shipping price in cents, charged below the free-shipping threshold. */
    flatRateCents: 490,
    freeOverCents: 4900,
    /** Business days before the parcel leaves the warehouse. */
    handlingDays: { min: 1, max: 2 },
    /** Business days the carrier needs once dispatched. */
    transitDays: { min: 2, max: 5 },
    /** Local cut-off hour: orders after it are handled from the next business day. */
    cutoffHour: 14,
    carrier: "[DPD / GLS / InPost]",
  },

  returns: {
    /** Statutory EU withdrawal period in days. Do not lower it. */
    withdrawalDays: 14,
    /** Who pays return shipping when the customer withdraws. */
    customerPaysReturn: true,
  },
} as const;

export const nav = [
  { href: "/products", label: "Shop" },
  { href: "/legal/shipping", label: "Shipping" },
  { href: "/contact", label: "Contact" },
] as const;
