import { z } from "zod";

/**
 * Public catalog. Safe to ship to the browser: no supplier data here.
 * Supplier SKUs and costs live in `supplier.ts`, which is server-only.
 */

const variantSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string(),
  priceCents: z.number().int().positive(),
  /** Original price, only if the product was really sold at it before (EU Omnibus rule). */
  compareAtCents: z.number().int().positive().optional(),
  inStock: z.boolean().default(true),
  /** Index into `images` shown when this variant is selected. */
  image: z.number().int().min(0).optional(),
  /** Colour swatch shown instead of a text pill. */
  swatch: z.string().optional(),
});

const productSchema = z.object({
  id: z.string(),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string(),
  category: z.string(),
  tagline: z.string(),
  description: z.array(z.string()).min(1),
  highlights: z.array(z.string()).min(1),
  specs: z.array(z.object({ label: z.string(), value: z.string() })),
  images: z.array(z.object({ src: z.string(), alt: z.string() })).min(1),
  variants: z.array(variantSchema).min(1),
  variantLabel: z.string().default("Option"),
  inTheBox: z.array(z.string()).default([]),
  faq: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
  featured: z.boolean().default(false),
  demo: z.boolean().default(false),
});

export type Product = z.infer<typeof productSchema>;
export type Variant = z.infer<typeof variantSchema>;

const img = (name: string, alt: string) => ({ src: `/images/products/${name}.jpg`, alt });

const raw: z.input<typeof productSchema>[] = [
  {
    id: "p-laptop-stand",
    slug: "aluminium-laptop-stand",
    name: "Aluminium laptop stand",
    category: "Posture",
    tagline: "Lifts the screen 15 cm closer to eye level, so you stop looking down all day.",
    description: [
      "Most laptops put the top of the screen well below eye level. Hours of looking down is what makes your neck ache by the afternoon.",
      "This stand is milled from a single piece of aluminium: nothing to assemble, nothing to wobble. The open back lets air reach the underside of the laptop, which keeps it cooler under load.",
    ],
    highlights: [
      "Raises the screen by 15 cm",
      "One-piece aluminium, no assembly",
      "Fits laptops 11–16 inches",
      "Open back for airflow",
    ],
    specs: [
      { label: "Material", value: "Anodised aluminium" },
      { label: "Lift", value: "15 cm at the back edge" },
      { label: "Fits", value: "Laptops 11–16 inches, up to 5 kg" },
      { label: "Weight", value: "1.1 kg" },
    ],
    images: [
      img("laptop-stand-1", "Laptop resting on a silver aluminium stand on an oak desk"),
      img("laptop-stand-2", "Side view of the aluminium laptop stand showing its angle"),
    ],
    variantLabel: "Finish",
    variants: [{ id: "laptop-stand-silver", name: "Silver", priceCents: 3990, swatch: "#c9cbcc" }],
    inTheBox: ["Laptop stand", "Cleaning cloth"],
    faq: [
      {
        q: "Do I need an external keyboard?",
        a: "We recommend one. At this height typing on the laptop's own keyboard puts your wrists at an awkward angle.",
      },
    ],
    featured: true,
    demo: true,
  },
  {
    id: "p-desk-mat",
    slug: "wool-felt-desk-mat",
    name: "Wool felt desk mat",
    category: "Desk mats",
    tagline: "A quiet, warm surface for keyboard and mouse that protects the desk.",
    description: [
      "Pressed from 4 mm merino wool felt with a natural rubber base that stays put. It softens keyboard noise and gives the mouse an even glide.",
      "Wool does not hold smells and can be spot-cleaned with a damp cloth. Four colours, one size that fits a full keyboard and mouse.",
    ],
    highlights: [
      "4 mm merino wool felt",
      "Non-slip natural rubber base",
      "90 × 40 cm fits keyboard and mouse",
      "Spot-clean with a damp cloth",
    ],
    specs: [
      { label: "Material", value: "Merino wool felt, natural rubber" },
      { label: "Size", value: "90 × 40 cm" },
      { label: "Thickness", value: "4 mm" },
      { label: "Care", value: "Spot-clean, do not machine wash" },
    ],
    images: [
      img("desk-mat-charcoal", "Charcoal felt desk mat under a white keyboard and trackpad"),
      img("desk-mat-forest", "Forest green felt desk mat under a white keyboard and trackpad"),
      img("desk-mat-blush", "Blush pink felt desk mat under a white keyboard and trackpad"),
      img("desk-mat-cream", "Cream felt desk mat under a white keyboard and trackpad"),
    ],
    variantLabel: "Colour",
    variants: [
      { id: "desk-mat-charcoal", name: "Charcoal", priceCents: 3490, image: 0, swatch: "#4a4d4f" },
      { id: "desk-mat-forest", name: "Forest", priceCents: 3490, image: 1, swatch: "#3f6b57" },
      { id: "desk-mat-blush", name: "Blush", priceCents: 3490, image: 2, swatch: "#d9b8b0" },
      { id: "desk-mat-cream", name: "Cream", priceCents: 3490, image: 3, swatch: "#ece8df" },
    ],
    inTheBox: ["Desk mat, rolled"],
    featured: true,
    demo: true,
  },
  {
    id: "p-light-bar",
    slug: "monitor-light-bar",
    name: "Monitor light bar",
    category: "Lighting",
    tagline: "Lights the desk, not the screen, so evening work stops straining your eyes.",
    description: [
      "An asymmetric LED bar that sits on top of the monitor and throws light down onto the desk without reflecting off the screen.",
      "Set brightness and colour temperature from 2700 K warm to 6500 K daylight. Powered by any USB-C port, it takes up no space on the desk.",
    ],
    highlights: ["No glare on the screen", "2700–6500 K, stepless brightness", "USB-C powered, 5 W", "Fits monitors 1–6 cm thick"],
    specs: [
      { label: "Length", value: "45 cm" },
      { label: "Power", value: "USB-C, 5 V / 1 A" },
      { label: "Colour temperature", value: "2700–6500 K" },
      { label: "CRI", value: "Ra > 95" },
    ],
    images: [
      img("light-bar-1", "Light bar mounted on a monitor on a wooden desk"),
      img("light-bar-2", "Light bar on a monitor in a desk setup with plants"),
      img("light-bar-3", "Close-up of the light bar glowing warm"),
    ],
    variantLabel: "Version",
    variants: [
      { id: "light-bar-standard", name: "Standard", priceCents: 4490 },
      { id: "light-bar-remote", name: "With wireless dial", priceCents: 5990 },
    ],
    inTheBox: ["Light bar", "Monitor clip", "USB-C cable, 1.5 m"],
    faq: [
      {
        q: "Does it work on curved monitors?",
        a: "Yes, for curved monitors up to 1800R. On tighter curves the clip may not sit flush.",
      },
    ],
    featured: true,
    demo: true,
  },
  {
    id: "p-headphone-stand",
    slug: "oak-headphone-stand",
    name: "Oak headphone stand",
    category: "Organisation",
    tagline: "Gives your headphones a place to live that is not the desk surface.",
    description: [
      "A solid oak base with a curved arm that keeps the headband in shape. The weighted base means it will not tip, even with heavy over-ear headphones.",
      "Oiled, not lacquered, so the grain stays visible and it ages well.",
    ],
    highlights: ["Solid oak, oiled finish", "Weighted base, does not tip", "Fits every over-ear headphone", "Felt pad protects the desk"],
    specs: [
      { label: "Material", value: "Solid oak" },
      { label: "Height", value: "27 cm" },
      { label: "Base", value: "10 × 10 cm" },
    ],
    images: [
      img("headphone-stand-1", "Black headphones hanging on an oak headphone stand"),
      img("headphone-stand-2", "Oak headphone stand next to a monitor on a wooden desk"),
    ],
    variantLabel: "Wood",
    variants: [{ id: "headphone-stand-oak", name: "Oak", priceCents: 2990, swatch: "#c9a47a" }],
    inTheBox: ["Headphone stand"],
    featured: true,
    demo: true,
  },
  {
    id: "p-monitor-riser",
    slug: "walnut-monitor-riser",
    name: "Walnut monitor riser",
    category: "Posture",
    tagline: "Raises the monitor and gives the keyboard a home underneath.",
    description: [
      "A walnut shelf on steel legs that lifts your monitor by 11 cm. Slide the keyboard underneath when you need the desk for writing.",
      "Holds up to 20 kg, enough for a 32-inch monitor or two smaller ones side by side.",
    ],
    highlights: ["Lifts monitors by 11 cm", "Holds up to 20 kg", "Keyboard fits underneath", "Walnut veneer, steel legs"],
    specs: [
      { label: "Size", value: "80 × 24 × 11 cm" },
      { label: "Material", value: "Walnut veneer, powder-coated steel" },
      { label: "Max load", value: "20 kg" },
    ],
    images: [img("monitor-riser-1", "Walnut monitor riser holding a monitor, with a keyboard in front")],
    variantLabel: "Size",
    variants: [
      { id: "monitor-riser-80", name: "80 cm", priceCents: 5990 },
      { id: "monitor-riser-100", name: "100 cm", priceCents: 6990 },
    ],
    inTheBox: ["Shelf", "2 steel legs", "Screws and hex key"],
    demo: true,
  },
  {
    id: "p-desk-tray",
    slug: "bamboo-desk-tray",
    name: "Bamboo desk tray",
    category: "Organisation",
    tagline: "One place for keys, earbuds, pens and the other small things.",
    description: [
      "A three-compartment bamboo tray that catches everything you empty from your pockets. Keeps the small things together and off the keyboard.",
    ],
    highlights: ["Three compartments", "Solid bamboo", "Felt-lined base", "30 × 20 cm"],
    specs: [
      { label: "Material", value: "Bamboo, felt base" },
      { label: "Size", value: "30 × 20 × 3 cm" },
    ],
    images: [img("desk-tray-1", "Bamboo desk tray holding keys, earbuds and a pen on a grey desk")],
    variants: [{ id: "desk-tray-bamboo", name: "Bamboo", priceCents: 2490 }],
    demo: true,
  },
  {
    id: "p-wireless-charger",
    slug: "walnut-wireless-charger",
    name: "Walnut wireless charger",
    category: "Charging",
    tagline: "Put the phone down and it charges. No cable to find.",
    description: [
      "A 15 W Qi2 wireless charging pad set in solid walnut. Works through cases up to 5 mm thick.",
      "Comes with a USB-C cable; use any 20 W USB-C power adapter for full speed.",
    ],
    highlights: ["15 W Qi2 fast charging", "Solid walnut top", "Works through cases up to 5 mm", "LED off at night"],
    specs: [
      { label: "Output", value: "15 W (Qi2)" },
      { label: "Input", value: "USB-C, 20 W adapter recommended" },
      { label: "Diameter", value: "10 cm" },
    ],
    images: [img("wireless-charger-1", "Phone charging on a round walnut wireless charger")],
    variants: [{ id: "wireless-charger-walnut", name: "Walnut", priceCents: 2990 }],
    inTheBox: ["Wireless charger", "USB-C cable, 1 m"],
    demo: true,
  },
  {
    id: "p-under-desk-holder",
    slug: "under-desk-laptop-holder",
    name: "Under-desk laptop holder",
    category: "Organisation",
    tagline: "Clamps your closed laptop under the desk and frees up the whole surface.",
    description: [
      "Made for laptops you use with an external monitor. The adjustable steel bracket screws under the desk and holds a closed laptop, router or dock out of sight.",
    ],
    highlights: ["Fits devices 1.5–5 cm thick", "Steel bracket, holds 5 kg", "Screws included"],
    specs: [
      { label: "Material", value: "Steel, silicone pads" },
      { label: "Adjustable width", value: "1.5–5 cm" },
      { label: "Max load", value: "5 kg" },
    ],
    images: [img("under-desk-holder-1", "Steel bracket holding a closed laptop under a wooden desk")],
    variants: [{ id: "under-desk-holder-black", name: "Black", priceCents: 2790 }],
    inTheBox: ["2 brackets", "Screws"],
    demo: true,
  },
];

export const products: Product[] = raw.map((p) => productSchema.parse(p));

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function findVariant(variantId: string): { product: Product; variant: Variant } | undefined {
  for (const product of products) {
    const variant = product.variants.find((v) => v.id === variantId);
    if (variant) return { product, variant };
  }
  return undefined;
}

export function lowestPrice(product: Product): number {
  return Math.min(...product.variants.map((v) => v.priceCents));
}

/** Image for a variant: its own photo if it has one, otherwise the product's first photo. */
export function variantImage(product: Product, variant: Variant) {
  return product.images[variant.image ?? 0] ?? product.images[0];
}

export const categories = [...new Set(products.map((p) => p.category))];
