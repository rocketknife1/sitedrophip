import type Stripe from "stripe";

import { isEmailConfigured, ownerEmail, sendEmail } from "@/lib/email";
import { orderConfirmationEmail, orderNotificationEmail } from "@/lib/email-templates";
import { loadOrder } from "@/lib/orders";
import { getStripe } from "@/lib/stripe";

export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = request.headers.get("stripe-signature");
  if (!secret || !signature) return new Response("Webhook not configured", { status: 400 });

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(await request.text(), signature, secret);
  } catch (err) {
    console.error("[webhook] signature verification failed", err);
    return new Response("Invalid signature", { status: 400 });
  }

  let sessionId: string | null = null;
  if (event.type === "checkout.session.completed" && event.data.object.payment_status === "paid") {
    sessionId = event.data.object.id;
  } else if (event.type === "checkout.session.async_payment_succeeded") {
    sessionId = event.data.object.id;
  }
  if (!sessionId) return Response.json({ received: true });

  const { order } = await loadOrder(sessionId);

  // Missing configuration will not fix itself on retry, so it is logged and the event is acknowledged.
  if (!isEmailConfigured() || !ownerEmail() || !order.customerEmail) {
    console.error("[webhook] order paid but emails skipped: check RESEND_API_KEY, EMAIL_FROM, ORDER_NOTIFY_EMAIL", order.id);
    return Response.json({ received: true });
  }

  // Idempotency keys (kept 24 h by Resend) make quick Stripe retries safe: each email goes out once.
  const results = await Promise.all([
    sendEmail({
      to: order.customerEmail,
      ...orderConfirmationEmail(order),
      idempotencyKey: `order-confirmation/${order.id}`,
    }),
    sendEmail({
      to: ownerEmail()!,
      ...orderNotificationEmail(order),
      replyTo: order.customerEmail,
      idempotencyKey: `order-notification/${order.id}`,
    }),
  ]);

  const failed = results.filter((r) => !r.ok);
  if (failed.length > 0) {
    console.error("[webhook] order emails failed", order.id, failed);
    // 500 makes Stripe retry; emails that already went out are skipped thanks to the idempotency keys.
    return new Response("Email delivery failed", { status: 500 });
  }
  return Response.json({ received: true });
}
