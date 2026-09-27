import type { Metadata } from "next";
import Link from "next/link";

import { ClearCart } from "@/components/cart/clear-cart";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { site } from "@/data/site";
import { formatPrice } from "@/lib/format";
import { loadOrder } from "@/lib/orders";
import { isStripeConfigured } from "@/lib/stripe";

export const metadata: Metadata = { title: "Order confirmed", robots: { index: false } };

async function getOrder(sessionId: string | undefined) {
  if (!sessionId || !isStripeConfigured() || !/^cs_[A-Za-z0-9_]+$/.test(sessionId)) return null;
  try {
    return await loadOrder(sessionId);
  } catch (err) {
    console.error("[success] could not load session", err);
    return null;
  }
}

export default async function SuccessPage({ searchParams }: PageProps<"/checkout/success">) {
  const { session_id } = await searchParams;
  const result = await getOrder(typeof session_id === "string" ? session_id : undefined);

  if (!result) {
    return (
      <Container className="max-w-2xl py-16">
        <h1 className="text-3xl font-extrabold">We could not find this order</h1>
        <p className="mt-4 leading-relaxed text-muted-foreground">
          If you paid, the confirmation email is on its way. Nothing there within an hour? Write to{" "}
          <a className="underline" href={`mailto:${site.company.email}`}>
            {site.company.email}
          </a>
          .
        </p>
      </Container>
    );
  }

  const { session, order } = result;
  const paid = session.payment_status === "paid";

  return (
    <Container className="max-w-2xl py-16">
      {paid && <ClearCart />}
      <h1 className="text-3xl font-extrabold sm:text-4xl">{paid ? "Thank you, your order is in" : "Your payment is processing"}</h1>
      <p className="mt-4 leading-relaxed text-muted-foreground">
        {paid
          ? `A confirmation is on its way to ${order.customerEmail}. We will email the tracking link as soon as the parcel leaves ${site.shipping.shipsFrom}.`
          : "Some payment methods take a little longer. We will email you as soon as the payment clears."}
      </p>
      <p className="mt-2 text-sm text-muted-foreground">Order reference: {order.id.slice(-12).toUpperCase()}</p>

      <ul className="mt-8 divide-y border-y">
        {order.lines.map((l, i) => (
          <li key={i} className="flex justify-between gap-4 py-3">
            <span>
              {l.name}
              {l.variant && <span className="text-muted-foreground"> · {l.variant}</span>} × {l.quantity}
            </span>
            <span>{formatPrice(l.unitCents * l.quantity)}</span>
          </li>
        ))}
      </ul>
      <dl className="mt-4 space-y-1 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Delivery</dt>
          <dd>{order.shippingCents === 0 ? "Free" : formatPrice(order.shippingCents)}</dd>
        </div>
        <div className="flex justify-between text-base font-semibold">
          <dt>Total paid</dt>
          <dd>{formatPrice(order.totalCents)}</dd>
        </div>
      </dl>

      <Button className="mt-10" render={<Link href="/products" />} nativeButton={false}>
        Back to the shop
      </Button>
    </Container>
  );
}
