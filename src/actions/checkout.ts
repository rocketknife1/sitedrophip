"use server";

import { redirect } from "next/navigation";
import type Stripe from "stripe";
import { z } from "zod";

import { findVariant } from "@/data/products";
import { site } from "@/data/site";
import { shippingCents } from "@/lib/format";
import { getStripe, isStripeConfigured } from "@/lib/stripe";

const cartSchema = z
  .array(
    z.object({
      variantId: z.string().max(64),
      quantity: z.number().int().min(1).max(10),
    }),
  )
  .min(1)
  .max(20);

export type CheckoutResult = { error: string };

/**
 * Builds a Stripe Checkout session from variant ids and quantities only.
 * Prices are looked up here on the server, so a tampered cart cannot change what is charged.
 */
export async function startCheckout(input: unknown): Promise<CheckoutResult> {
  const parsed = cartSchema.safeParse(input);
  if (!parsed.success) return { error: "Your cart could not be read. Remove the items and add them again." };

  if (!isStripeConfigured()) {
    return { error: "Payments are not set up yet: STRIPE_SECRET_KEY is missing on the server." };
  }
  if (site.demoMode && process.env.STRIPE_SECRET_KEY!.startsWith("sk_live")) {
    return { error: "Live payments are blocked while the store is in demo mode." };
  }

  // Merge duplicate lines so quantity limits apply per variant.
  const merged = new Map<string, number>();
  for (const { variantId, quantity } of parsed.data) {
    merged.set(variantId, Math.min(10, (merged.get(variantId) ?? 0) + quantity));
  }

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
  let subtotal = 0;
  for (const [variantId, quantity] of merged) {
    const found = findVariant(variantId);
    if (!found) return { error: "One of the products in your cart is no longer available. Remove it and try again." };
    const { product, variant } = found;
    if (!variant.inStock) return { error: `${product.name} (${variant.name}) is out of stock. Remove it to continue.` };

    subtotal += variant.priceCents * quantity;
    const image = product.images[0]?.src;
    lineItems.push({
      quantity,
      price_data: {
        currency: site.currency.toLowerCase(),
        unit_amount: variant.priceCents,
        product_data: {
          name: product.variants.length > 1 ? `${product.name} (${variant.name})` : product.name,
          metadata: { variant_id: variant.id },
          // Stripe only shows public raster images.
          images: site.url.startsWith("https://") && image && !image.endsWith(".svg") ? [`${site.url}${image}`] : undefined,
        },
      },
    });
  }

  const shipping = shippingCents(subtotal);
  const { handlingDays, transitDays } = site.shipping;

  let url: string | null;
  try {
    const session = await getStripe().checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      locale: "auto",
      shipping_address_collection: {
        allowed_countries: [...site.shipping.countries],
      },
      phone_number_collection: { enabled: true },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            display_name: shipping === 0 ? "Free tracked delivery" : "Tracked delivery",
            fixed_amount: { amount: shipping, currency: site.currency.toLowerCase() },
            delivery_estimate: {
              minimum: { unit: "business_day", value: handlingDays.min + transitDays.min },
              maximum: { unit: "business_day", value: handlingDays.max + transitDays.max },
            },
          },
        },
      ],
      custom_text: {
        submit: {
          message: `By paying you accept our terms (${site.url}/legal/terms). You can withdraw within ${site.returns.withdrawalDays} days of delivery.`,
        },
      },
      success_url: `${site.url}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${site.url}/cart`,
    });
    url = session.url;
  } catch (err) {
    console.error("[checkout] Stripe session failed", err);
    return { error: "The payment page could not be opened. Try again in a minute." };
  }

  if (!url) return { error: "The payment page could not be opened. Try again in a minute." };
  redirect(url);
}
