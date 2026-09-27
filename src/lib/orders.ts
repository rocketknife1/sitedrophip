import "server-only";

import type Stripe from "stripe";

import { findVariant } from "@/data/products";
import { supplier } from "@/data/supplier";
import type { OrderEmailData, OrderLine } from "./email-templates";
import { getStripe } from "./stripe";

/** Loads a Checkout session with its line items and turns it into the shape the emails and success page use. */
export async function loadOrder(sessionId: string): Promise<{ session: Stripe.Checkout.Session; order: OrderEmailData }> {
  const session = await getStripe().checkout.sessions.retrieve(sessionId, {
    expand: ["line_items.data.price.product"],
  });

  const lines: OrderLine[] = (session.line_items?.data ?? []).map((item) => {
    const product = item.price?.product;
    const variantId =
      product && typeof product === "object" && !("deleted" in product && product.deleted)
        ? (product as Stripe.Product).metadata.variant_id
        : undefined;
    const found = variantId ? findVariant(variantId) : undefined;
    const sup = variantId ? supplier[variantId] : undefined;
    const quantity = item.quantity ?? 1;
    return {
      name: found?.product.name ?? item.description ?? "Item",
      variant: found?.variant.name ?? "",
      quantity,
      unitCents: Math.round(item.amount_total / quantity),
      sku: sup?.sku,
      costCents: sup?.costCents,
      supplierName: sup?.supplierName,
    };
  });

  const shipping = session.collected_information?.shipping_details;
  const address = shipping?.address ?? session.customer_details?.address;
  const addressLines = [
    address?.line1,
    address?.line2,
    [address?.postal_code, address?.city].filter(Boolean).join(" "),
    address?.state,
    address?.country,
  ].filter((l): l is string => Boolean(l));

  return {
    session,
    order: {
      id: session.id,
      customerName: shipping?.name ?? session.customer_details?.name ?? "",
      customerEmail: session.customer_details?.email ?? "",
      phone: session.customer_details?.phone ?? undefined,
      addressLines,
      lines,
      subtotalCents: session.amount_subtotal ?? 0,
      shippingCents: session.shipping_cost?.amount_total ?? 0,
      totalCents: session.amount_total ?? 0,
    },
  };
}
