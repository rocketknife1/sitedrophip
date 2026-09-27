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
  /** Real market data behind the pick (never our own sales). Shown as "Trending". */
  trend: z
    .object({ stat: z.string(), detail: z.string(), source: z.string(), url: z.string().url().default("https://www.shopify.com/blog/trending-products") })
    .optional(),
});

export type Product = z.infer<typeof productSchema>;
export type Variant = z.infer<typeof variantSchema>;

const img = (name: string, alt: string) => ({ src: `/images/products/${name}.jpg`, alt });

const raw: z.input<typeof productSchema>[] = [
  {
    id: "p-laptop-stand",
    slug: "aluminium-laptop-stand",
    name: "Aluminium laptop stand",
    category: "Home office",
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
    category: "Home office",
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
    category: "Home office",
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
    category: "Home office",
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
    category: "Home office",
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
    category: "Home office",
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
    category: "Tech",
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
    category: "Home office",
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
  {
    id: "p-phone-stand",
    slug: "magnetic-phone-stand",
    name: "Magnetic phone stand",
    category: "Tech",
    tagline: "Holds your phone at eye level for calls, recipes and videos.",
    description: [
      "A weighted aluminium stand with a magnetic head that tilts and rotates, so the phone sits upright for video calls or sideways for a film.",
      "Works with magnetic phones and cases; a thin metal ring is included for everything else.",
    ],
    highlights: ["Tilts and rotates 360°", "Weighted base, no wobble", "Metal ring included for any phone", "Folds flat for travel"],
    specs: [
      { label: "Material", value: "Aluminium, silicone base" },
      { label: "Height", value: "Adjustable, 14–22 cm" },
      { label: "Fits", value: "Phones 4.7–7 inches" },
    ],
    images: [img("phone-stand-1", "Phone on a slim metal stand next to a teacup"), img("phone-stand-2", "Phone standing on a desk stand beside a notebook")],
    variants: [{ id: "phone-stand-silver", name: "Silver", priceCents: 2490 }],
    inTheBox: ["Stand", "Adhesive metal ring"],
    featured: true,
    demo: true,
  },
  {
    id: "p-power-bank",
    slug: "slim-power-bank-10000",
    name: "Slim power bank 10,000 mAh",
    category: "Tech",
    tagline: "Two full phone charges in a pocket-sized battery.",
    description: [
      "Enough for about two full charges of a typical phone. USB-C in and out with 20 W fast charging, plus a USB-A port for older cables.",
      "The display shows the exact charge left, so you never guess.",
    ],
    highlights: ["10,000 mAh, about 2 phone charges", "20 W USB-C fast charging", "Charge two devices at once", "Digital battery display"],
    specs: [
      { label: "Capacity", value: "10,000 mAh / 37 Wh" },
      { label: "Ports", value: "USB-C (in/out), USB-A (out)" },
      { label: "Weight", value: "210 g" },
    ],
    images: [img("power-bank-1", "Hand holding a green power bank charging a phone")],
    variants: [{ id: "power-bank-green", name: "Green", priceCents: 3490 }],
    inTheBox: ["Power bank", "USB-C cable, 30 cm"],
    demo: true,
  },
  {
    id: "p-item-finder",
    slug: "bluetooth-item-finder",
    name: "Bluetooth item finder",
    category: "Tech",
    tagline: "Clip it to your keys or bag and let your phone find them.",
    description: [
      "Make it ring from your phone, or see the last place your phone was near it. Press the button on the finder to ring a lost phone the other way round.",
      "The battery is a standard coin cell that lasts about a year and takes seconds to replace.",
    ],
    highlights: ["Ring it from your phone", "Last-seen location on a map", "Replaceable battery, ~1 year", "Splash resistant"],
    specs: [
      { label: "Range", value: "Up to 60 m in open space" },
      { label: "Battery", value: "CR2032, replaceable" },
      { label: "Size", value: "32 mm diameter" },
    ],
    images: [img("item-finder-1", "Orange item finder tag hanging from a leather bag")],
    variantLabel: "Pack",
    variants: [
      { id: "item-finder-1", name: "1 finder", priceCents: 1990 },
      { id: "item-finder-4", name: "4 finders", priceCents: 5990 },
    ],
    inTheBox: ["Finder(s) with key ring", "Battery installed"],
    demo: true,
  },
  {
    id: "p-dash-cam",
    slug: "dash-cam-2k",
    name: "Dash cam 2K",
    category: "Car",
    tagline: "Records every drive in sharp 2K, so you have proof if something happens.",
    description: [
      "Records in 2K at the front, saves the clip automatically on a sudden brake or impact, and loops over old footage so the card never fills up.",
      "Plugs into the car's 12 V socket and sticks behind the mirror, out of your line of sight.",
    ],
    highlights: ["2K front recording", "Auto-saves clips on impact", "Loop recording", "Night vision"],
    specs: [
      { label: "Resolution", value: "2560 × 1440" },
      { label: "Field of view", value: "140°" },
      { label: "Storage", value: "microSD up to 128 GB" },
    ],
    images: [img("dash-cam-1", "Dash camera mounted on a car windscreen"), img("dash-cam-2", "Dash camera on the windscreen at sunset")],
    variants: [{ id: "dash-cam-2k", name: "2K", priceCents: 6990 }],
    inTheBox: ["Dash cam", "Adhesive mount", "12 V car charger, 3.5 m cable"],
    trend: { stat: "100,000+ searches a month", detail: "Dash cams get over 100,000 searches a month.", source: "Shopify, trending products report" },
    featured: true,
    demo: true,
  },
  {
    id: "p-car-mount",
    slug: "magnetic-car-phone-mount",
    name: "Magnetic car phone mount",
    category: "Car",
    tagline: "Snap the phone on, see the map, keep both hands on the wheel.",
    description: [
      "A strong magnet holds the phone firmly on bumpy roads. Clips onto an air vent or sticks to the dashboard.",
    ],
    highlights: ["One-hand on and off", "Vent clip and dashboard base included", "Holds phones up to 7 inches"],
    specs: [
      { label: "Mount", value: "Air vent clip or dashboard adhesive" },
      { label: "Rotation", value: "360°" },
    ],
    images: [img("car-mount-1", "Phone showing navigation in a car mount on the dashboard")],
    variants: [{ id: "car-mount-black", name: "Black", priceCents: 2290 }],
    inTheBox: ["Mount", "Vent clip", "Dashboard base", "2 metal plates"],
    trend: { stat: "+140% in a year", detail: "Dashboard accessories grew 140% in annual sales.", source: "Shopify, trending products report" },
    demo: true,
  },
  {
    id: "p-linen-set",
    slug: "linen-bedding-set",
    name: "Stonewashed linen bedding set",
    category: "Home",
    tagline: "Soft, breathable linen that gets softer with every wash.",
    description: [
      "100% European flax linen, stonewashed so it feels soft from the first night. Cool in summer, warm in winter.",
      "Duvet cover and two pillowcases, with hidden buttons at the foot.",
    ],
    highlights: ["100% linen", "Stonewashed, no ironing needed", "Duvet cover + 2 pillowcases", "Machine washable at 40 °C"],
    specs: [
      { label: "Material", value: "100% linen" },
      { label: "Care", value: "Machine wash 40 °C, tumble dry low" },
    ],
    images: [img("linen-set-1", "Bed with white linen bedding and pillows"), img("linen-set-2", "Close-up of soft linen bed sheets")],
    variantLabel: "Size",
    variants: [
      { id: "linen-set-double", name: "Double 200 × 200", priceCents: 11900 },
      { id: "linen-set-king", name: "King 240 × 220", priceCents: 13900 },
    ],
    inTheBox: ["Duvet cover", "2 pillowcases 50 × 70"],
    trend: { stat: "~20,000 searches a month", detail: "“Linen sheets” gets around 20,000 searches a month.", source: "Shopify, trending products report" },
    featured: true,
    demo: true,
  },
  {
    id: "p-topper",
    slug: "memory-foam-mattress-topper",
    name: "Memory foam mattress topper",
    category: "Home",
    tagline: "Turns a tired mattress into a new one, without buying a new one.",
    description: [
      "7 cm of memory foam that follows your shape and takes pressure off shoulders and hips. The removable cover is machine washable.",
    ],
    highlights: ["7 cm memory foam", "Removable, washable cover", "Non-slip base with corner straps"],
    specs: [
      { label: "Height", value: "7 cm" },
      { label: "Cover", value: "Polyester and bamboo viscose, washable at 40 °C" },
    ],
    images: [img("topper-1", "Soft white bed with pillows by a window")],
    variantLabel: "Size",
    variants: [
      { id: "topper-140", name: "140 × 200", priceCents: 8900 },
      { id: "topper-160", name: "160 × 200", priceCents: 9900 },
    ],
    inTheBox: ["Topper, vacuum rolled", "Cover"],
    trend: { stat: "+1,035% sales", detail: "Mattress pads grew 1,035% in sales, September 2025 vs 2024.", source: "Shopify, trending products report" },
    demo: true,
  },
  {
    id: "p-candle",
    slug: "soy-candle-amber-jar",
    name: "Soy candle in amber jar",
    category: "Home",
    tagline: "A slow, clean burn and a scent that fills the room without shouting.",
    description: [
      "Hand-poured soy wax with a cotton wick, about 45 hours of burn time. The amber glass jar makes a good plant pot once the candle is done.",
    ],
    highlights: ["Soy wax, cotton wick", "About 45 hours burn time", "Reusable amber glass jar"],
    specs: [
      { label: "Weight", value: "220 g" },
      { label: "Burn time", value: "About 45 hours" },
    ],
    images: [img("candle-1", "Two lit candles in amber glass jars"), img("candle-2", "Hand lighting a candle in an amber jar")],
    variantLabel: "Scent",
    variants: [
      { id: "candle-fig", name: "Fig & cedar", priceCents: 1990 },
      { id: "candle-linen", name: "Clean linen", priceCents: 1990 },
      { id: "candle-amber", name: "Amber & vanilla", priceCents: 1990 },
    ],
    inTheBox: ["Candle with lid"],
    demo: true,
  },
  {
    id: "p-bottle",
    slug: "insulated-steel-bottle",
    name: "Insulated steel bottle 500 ml",
    category: "Kitchen",
    tagline: "Cold for 24 hours, hot for 12, and it never leaks in the bag.",
    description: [
      "Double-wall stainless steel keeps drinks cold all day or hot through the afternoon. The powder-coated finish does not sweat or slip.",
    ],
    highlights: ["Cold 24 h, hot 12 h", "Leak-proof lid", "No sweat on the outside", "BPA free"],
    specs: [
      { label: "Capacity", value: "500 ml" },
      { label: "Material", value: "18/8 stainless steel" },
    ],
    images: [img("bottle-1", "Sage green insulated bottle on a white table"), img("bottle-2", "Three insulated bottles in coral, mint and lilac")],
    variantLabel: "Colour",
    variants: [
      { id: "bottle-sage", name: "Sage", priceCents: 2490, image: 0, swatch: "#6f8f78" },
      { id: "bottle-coral", name: "Coral", priceCents: 2490, image: 1, swatch: "#f08a5d" },
      { id: "bottle-mint", name: "Mint", priceCents: 2490, image: 1, swatch: "#7fd6c8" },
      { id: "bottle-lilac", name: "Lilac", priceCents: 2490, image: 1, swatch: "#d7a8d6" },
    ],
    featured: true,
    demo: true,
  },
  {
    id: "p-frother",
    slug: "handheld-milk-frother",
    name: "Handheld milk frother",
    category: "Kitchen",
    tagline: "Café-style foam for coffee, matcha and hot chocolate in 15 seconds.",
    description: ["A stainless steel whisk on a rechargeable handle. Rinse it under the tap and it is clean."],
    highlights: ["Foam in about 15 seconds", "USB-C rechargeable", "Stainless steel whisk", "Wall stand included"],
    specs: [{ label: "Charging", value: "USB-C, about 30 uses per charge" }],
    images: [img("frother-1", "Hand frothing milk in a cup")],
    variants: [{ id: "frother-black", name: "Black", priceCents: 1490 }],
    inTheBox: ["Frother", "Stand", "USB-C cable"],
    demo: true,
  },
  {
    id: "p-massage-gun",
    slug: "mini-massage-gun",
    name: "Mini massage gun",
    category: "Fitness",
    tagline: "Loosens tight muscles after training or a long day at the desk.",
    description: [
      "A palm-sized percussion massager with four heads and five speeds. Quiet enough to use while watching TV.",
    ],
    highlights: ["5 speeds, 4 heads", "Quiet motor", "About 6 hours per charge", "Fits in a gym bag"],
    specs: [
      { label: "Weight", value: "450 g" },
      { label: "Charging", value: "USB-C" },
    ],
    images: [img("massage-gun-1", "Black mini massage gun with a red ring"), img("massage-gun-2", "Close-up of a massage gun head")],
    variants: [{ id: "massage-gun-black", name: "Black", priceCents: 5990 }],
    inTheBox: ["Massage gun", "4 heads", "Carry pouch", "USB-C cable"],
    featured: true,
    demo: true,
  },
  {
    id: "p-bands",
    slug: "resistance-bands-set",
    name: "Resistance bands set",
    category: "Fitness",
    tagline: "A full-body workout that fits in a drawer.",
    description: ["Five fabric bands from light to extra heavy. They do not roll up or pinch like latex bands."],
    highlights: ["5 resistance levels", "Non-slip fabric", "Carry bag and exercise guide"],
    specs: [{ label: "Levels", value: "Light to extra heavy (5 bands)" }],
    images: [img("bands-1", "Resistance band next to dumbbells on a wooden floor"), img("bands-2", "Resistance band wrapped around light green dumbbells")],
    variants: [{ id: "bands-set", name: "Set of 5", priceCents: 2490 }],
    inTheBox: ["5 bands", "Carry bag", "Exercise guide"],
    demo: true,
  },
  {
    id: "p-yoga-mat",
    slug: "yoga-mat-cork-blocks",
    name: "Yoga mat with cork blocks",
    category: "Fitness",
    tagline: "Grippy, cushioned and ready for your first class or your hundredth.",
    description: ["A 6 mm non-slip mat with two natural cork blocks to support harder poses."],
    highlights: ["6 mm cushioning", "Non-slip on both sides", "2 natural cork blocks", "Carry strap"],
    specs: [
      { label: "Size", value: "183 × 61 cm" },
      { label: "Thickness", value: "6 mm" },
    ],
    images: [img("yoga-mat-1", "Sage yoga mat with two cork blocks")],
    variants: [{ id: "yoga-mat-sage", name: "Sage", priceCents: 4490 }],
    inTheBox: ["Mat", "2 cork blocks", "Strap"],
    demo: true,
  },
  {
    id: "p-satchel",
    slug: "leather-satchel",
    name: "Leather satchel",
    category: "Fashion",
    tagline: "A classic buckle satchel that fits a 14-inch laptop and ages beautifully.",
    description: [
      "Full-grain leather with brass buckles and an adjustable strap. Carry it by hand or across the body.",
      "Two inside compartments keep the laptop apart from everything else.",
    ],
    highlights: ["Full-grain leather", "Fits a 14-inch laptop", "Adjustable shoulder strap", "Two inside compartments"],
    specs: [
      { label: "Size", value: "38 × 28 × 10 cm" },
      { label: "Material", value: "Full-grain leather, brass hardware" },
    ],
    images: [img("satchel-1", "Brown leather satchel on a stone wall"), img("satchel-2", "Tan leather satchel on a table")],
    variantLabel: "Colour",
    variants: [
      { id: "satchel-tan", name: "Tan", priceCents: 8990, image: 1, swatch: "#b0703a" },
      { id: "satchel-brown", name: "Dark brown", priceCents: 8990, image: 0, swatch: "#6b3f22" },
    ],
    trend: { stat: "+1,771% sales", detail: "Satchel bags grew 1,771% in sales, September 2025 vs 2024.", source: "Shopify, trending products report" },
    featured: true,
    demo: true,
  },
  {
    id: "p-socks",
    slug: "cotton-ankle-socks",
    name: "Cotton ankle socks, 5 pairs",
    category: "Fashion",
    tagline: "Soft combed cotton that stays in place and does not slip into the shoe.",
    description: ["Cushioned sole, reinforced heel and toe, and a grip band that keeps them up."],
    highlights: ["Combed cotton", "Cushioned sole", "Heel grip, no slipping", "5 pairs"],
    specs: [{ label: "Material", value: "80% cotton, 17% polyamide, 3% elastane" }],
    images: [img("socks-1", "Grey ankle socks next to white sneakers"), img("socks-2", "Dark green socks on a mint background")],
    variantLabel: "Size",
    variants: [
      { id: "socks-36-40", name: "36–40", priceCents: 1690 },
      { id: "socks-41-46", name: "41–46", priceCents: 1690 },
    ],
    trend: { stat: "+779% sales", detail: "Ankle socks grew 779% in sales, September 2025 vs 2024.", source: "Shopify, trending products report" },
    demo: true,
  },
  {
    id: "p-harness",
    slug: "no-pull-dog-harness",
    name: "No-pull dog harness",
    category: "Pets",
    tagline: "Gentle control on walks, without pressure on the neck.",
    description: [
      "A front clip turns the dog gently towards you when it pulls. Padded, reflective and adjustable at four points.",
    ],
    highlights: ["Front and back leash clips", "Padded chest plate", "Reflective stitching", "Adjusts at 4 points"],
    specs: [{ label: "Sizes", value: "S (chest 40–55 cm), M (55–70 cm), L (70–90 cm)" }],
    images: [img("harness-1", "White dog in a black harness by a lake"), img("harness-2", "Golden retriever wearing a harness")],
    variantLabel: "Size",
    variants: [
      { id: "harness-s", name: "S", priceCents: 2990 },
      { id: "harness-m", name: "M", priceCents: 2990 },
      { id: "harness-l", name: "L", priceCents: 3290 },
    ],
    featured: true,
    demo: true,
  },
  {
    id: "p-grooming",
    slug: "self-cleaning-pet-brush",
    name: "Self-cleaning pet brush",
    category: "Pets",
    tagline: "Removes loose fur before it ends up on the sofa. One click to clean it.",
    description: ["Fine bent pins lift loose undercoat; press the button and the pins retract so the fur slides off."],
    highlights: ["One-click cleaning", "Rounded pin tips, gentle on skin", "For dogs and cats"],
    specs: [{ label: "Suitable for", value: "Short and long coats" }],
    images: [img("grooming-1", "Small white dog being brushed")],
    variants: [{ id: "grooming-brush", name: "Standard", priceCents: 1790 }],
    demo: true,
  },
  {
    id: "p-vanity-mirror",
    slug: "led-vanity-mirror",
    name: "LED vanity mirror",
    category: "Beauty",
    tagline: "Even, daylight-like light for make-up and skincare at any hour.",
    description: [
      "A tabletop mirror framed by dimmable bulbs with three light colours, from warm to daylight. Touch control, USB powered.",
    ],
    highlights: ["3 light colours, dimmable", "Touch control", "USB powered", "Tabletop or wall mounted"],
    specs: [
      { label: "Size", value: "50 × 40 cm" },
      { label: "Power", value: "USB, 5 V" },
    ],
    images: [img("vanity-mirror-1", "Vanity mirror framed by glowing bulbs")],
    variants: [{ id: "vanity-mirror-white", name: "White", priceCents: 7990 }],
    inTheBox: ["Mirror", "USB cable", "Wall mount"],
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

const CATEGORY_ORDER = ["Tech", "Home", "Kitchen", "Fitness", "Fashion", "Home office", "Car", "Pets", "Beauty"];
export const categories = CATEGORY_ORDER.filter((c) => products.some((p) => p.category === c));
