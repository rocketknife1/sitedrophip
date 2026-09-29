import { z } from "zod";

import settingsJson from "./site.json";

/**
 * Single source of truth for store settings.
 * Everything wrapped in [BRACKETS] is a placeholder you MUST replace before launch.
 */

export const EU_COUNTRIES = [
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR", "HU", "IE",
  "IT", "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK", "SI", "ES", "SE",
] as const;

export type EuCountry = (typeof EU_COUNTRIES)[number];

/**
 * Editable settings (name, company details, shipping, returns) live in site.json,
 * so they can be changed without touching code (e.g. from the Organizator app).
 * Validated at build time: an invalid edit fails the build and the live site keeps
 * its previous version. Legal minimums and runtime switches stay here, in code.
 */
const settingsSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  company: z.object({
    legalName: z.string(),
    registrationNumber: z.string(),
    vatId: z.string(),
    address: z.string(),
    email: z.string(),
    phone: z.string(),
    representative: z.string(),
  }),
  shipping: z.object({
    shipsFrom: z.string(),
    flatRateCents: z.number().int().nonnegative(),
    freeOverCents: z.number().int().nonnegative(),
    handlingDays: z.object({ min: z.number().int().nonnegative(), max: z.number().int().nonnegative() }),
    transitDays: z.object({ min: z.number().int().nonnegative(), max: z.number().int().nonnegative() }),
    cutoffHour: z.number().int().min(0).max(23),
    carrier: z.string(),
  }),
  returns: z.object({ customerPaysReturn: z.boolean() }),
});
const settings = settingsSchema.parse(settingsJson);

export const site = {
  name: settings.name,
  description: settings.description,
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",

  /**
   * While true, a banner tells visitors that orders are not fulfilled.
   * Set NEXT_PUBLIC_DEMO_MODE=false only once real products, supplier and company data are in place.
   */
  demoMode: process.env.NEXT_PUBLIC_DEMO_MODE !== "false",

  currency: "EUR",
  locale: "en-IE",

  /** Everything wrapped in [BRACKETS] in site.json is a placeholder you MUST replace before launch. */
  company: settings.company,

  shipping: {
    ...settings.shipping,
    countries: EU_COUNTRIES,
  },

  returns: {
    /** Statutory EU withdrawal period in days. Do not lower it. */
    withdrawalDays: 14,
    /** Who pays return shipping when the customer withdraws. */
    customerPaysReturn: settings.returns.customerPaysReturn,
  },
} as const;

export const nav = [
  { href: "/products", label: "Shop" },
  { href: "/legal/shipping", label: "Shipping" },
  { href: "/contact", label: "Contact" },
] as const;
