import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { site } from "@/data/site";
import { deliveryRangeLabel, formatPrice } from "@/lib/format";

export const shopFaq = [
  {
    q: "How long does delivery take?",
    a: `Parcels leave ${site.shipping.shipsFrom} within ${site.shipping.handlingDays.min}–${site.shipping.handlingDays.max} business days and arrive ${deliveryRangeLabel} after you order. You get a tracking link by email as soon as it ships.`,
  },
  {
    q: "How much is delivery?",
    a: `${formatPrice(site.shipping.flatRateCents)} to any EU country, free on orders over ${formatPrice(site.shipping.freeOverCents)}.`,
  },
  {
    q: "Can I return something?",
    a: `Yes. You have ${site.returns.withdrawalDays} days from delivery to withdraw from the purchase without giving a reason. ${
      site.returns.customerPaysReturn ? "You pay for sending the item back; " : ""
    }we refund the product and the original delivery cost within 14 days.`,
  },
  {
    q: "Which payment methods do you accept?",
    a: "Cards (Visa, Mastercard, Amex), Apple Pay and Google Pay, plus local methods depending on your country. Payment runs through Stripe; we never see your card details.",
  },
  {
    q: "Do prices include VAT?",
    a: "Yes. The price you see is the price you pay, plus delivery if your order is under the free-delivery threshold.",
  },
];

export function ShopFaq({ extra = [] }: { extra?: { q: string; a: string }[] }) {
  const items = [...extra, ...shopFaq];
  return (
    <Accordion className="border-y">
      {items.map((item) => (
        <AccordionItem key={item.q} value={item.q}>
          <AccordionTrigger className="py-4 text-base">{item.q}</AccordionTrigger>
          <AccordionContent className="max-w-prose pb-4 text-muted-foreground leading-relaxed">
            <p>{item.a}</p>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
