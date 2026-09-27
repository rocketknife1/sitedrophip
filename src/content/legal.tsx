import Link from "next/link";
import type { ReactNode } from "react";

import { site } from "@/data/site";
import { deliveryRangeLabel, formatPrice } from "@/lib/format";

/**
 * EU consumer-law templates. They are a starting point, not legal advice:
 * have them reviewed (lawyer / accountant) before taking real orders.
 */

const c = site.company;
const s = site.shipping;
const r = site.returns;

export type LegalPage = { title: string; description: string; updated: string; body: ReactNode };

export const legalPages: Record<string, LegalPage> = {
  terms: {
    title: "Terms and conditions",
    description: `The terms that apply when you buy from ${site.name}.`,
    updated: "2026-09-27",
    body: (
      <>
        <h2>1. Who we are</h2>
        <p>
          This shop is run by {c.legalName}, {c.address}, registered under {c.registrationNumber}, VAT ID {c.vatId}. You can reach us at{" "}
          {c.email} or {c.phone}.
        </p>
        <h2>2. Scope</h2>
        <p>
          These terms apply to every order placed on this website by consumers resident in the European Union. Mandatory consumer
          protection rules of your country of residence always apply, even where these terms say otherwise.
        </p>
        <h2>3. How a contract is formed</h2>
        <p>
          Product pages are an invitation to order, not a binding offer. By clicking the payment button you make a binding offer to
          buy. The contract is concluded when we send the order confirmation email. If a product cannot be delivered, we tell you
          straight away and refund any payment in full.
        </p>
        <h2>4. Prices and payment</h2>
        <p>
          All prices are in euro and include VAT. Delivery costs are shown in the cart before you pay. Payment is processed by Stripe
          Payments Europe Ltd. We accept the methods shown on the payment page. Your card details never reach us.
        </p>
        <h2>5. Delivery</h2>
        <p>
          We deliver to EU countries only. Delivery times and costs are described on the <Link href="/legal/shipping">shipping page</Link>.
          Risk of loss passes to you when the parcel is handed to you or to a person you designate.
        </p>
        <h2>6. Right of withdrawal</h2>
        <p>
          You may withdraw from the contract within {r.withdrawalDays} days without giving a reason. The details and the model
          withdrawal form are on the <Link href="/legal/returns">returns page</Link>, and you can withdraw online using our{" "}
          <Link href="/withdrawal">withdrawal form</Link>.
        </p>
        <h2>7. Legal guarantee</h2>
        <p>
          You benefit from the statutory guarantee of conformity for goods for two years from delivery. If a product is faulty,
          contact us and we will repair or replace it, or refund you where repair or replacement is not possible. We pay the return
          costs for faulty goods.
        </p>
        <h2>8. Liability</h2>
        <p>
          We are liable without limitation for intent, gross negligence and injury to life, body or health, and as required by
          product liability law. Otherwise our liability is limited to foreseeable damage typical for this kind of contract.
        </p>
        <h2>9. Complaints and disputes</h2>
        <p>
          Contact us first at {c.email}; we answer within 5 business days. You may also contact the consumer protection authority of
          your country or an alternative dispute resolution body. In Romania this is ANPC (anpc.ro). We are not obliged, but are
          willing, to take part in alternative dispute resolution.
        </p>
        <h2>10. Applicable law</h2>
        <p>
          Romanian law applies, without depriving you of the protection given by the mandatory provisions of the law of the country
          where you live.
        </p>
      </>
    ),
  },

  returns: {
    title: "Returns and refunds",
    description: `You have ${r.withdrawalDays} days to change your mind. Here is how returns and refunds work.`,
    updated: "2026-09-27",
    body: (
      <>
        <h2>Your right of withdrawal</h2>
        <p>
          You have the right to withdraw from this contract within {r.withdrawalDays} days without giving any reason. The withdrawal
          period expires {r.withdrawalDays} days after the day on which you, or a third party other than the carrier indicated by you,
          acquire physical possession of the goods. For an order of several goods delivered separately, it runs from receipt of the
          last item.
        </p>
        <h2>How to withdraw</h2>
        <p>
          Inform us of your decision with a clear statement. The quickest way is our <Link href="/withdrawal">online withdrawal form</Link>
          : you get a confirmation email immediately. You can also email {c.email} or write to {c.legalName}, {c.address}. You may use
          the model form below, but it is not obligatory. It is enough to send your notice before the period expires.
        </p>
        <h2>Sending the goods back</h2>
        <p>
          Send the goods back without undue delay and in any event no later than 14 days after you told us you are withdrawing. We
          email you the return address.{" "}
          {r.customerPaysReturn
            ? "You bear the direct cost of returning the goods."
            : "We pay for the return shipping."}{" "}
          You are only liable for any loss in value of the goods resulting from handling beyond what is necessary to establish their
          nature, characteristics and functioning.
        </p>
        <h2>Your refund</h2>
        <p>
          We reimburse all payments received from you, including the cost of standard delivery, without undue delay and at the latest
          within 14 days of the day we are informed of your withdrawal. We use the same payment method you used, unless you expressly
          agree otherwise; you will not incur any fees for the reimbursement. We may withhold the refund until we have received the
          goods back or you have supplied proof of having sent them, whichever is earlier.
        </p>
        <h2>Faulty or damaged products</h2>
        <p>
          This is separate from withdrawal. If something arrives damaged or stops working within two years, write to {c.email} with a
          photo. We replace, repair or refund it and cover the return cost.
        </p>
        <h2>Model withdrawal form</h2>
        <blockquote>
          <p>To {c.legalName}, {c.address}, {c.email}:</p>
          <p>
            I/We (*) hereby give notice that I/We (*) withdraw from my/our (*) contract of sale of the following goods (*): ______
          </p>
          <p>Ordered on (*) / received on (*): ______</p>
          <p>Name of consumer(s): ______</p>
          <p>Address of consumer(s): ______</p>
          <p>Signature of consumer(s) (only if this form is notified on paper): ______</p>
          <p>Date: ______</p>
          <p>(*) Delete as appropriate.</p>
        </blockquote>
      </>
    ),
  },

  shipping: {
    title: "Shipping",
    description: "Where we deliver, how long it takes and what it costs.",
    updated: "2026-09-27",
    body: (
      <>
        <h2>Where we deliver</h2>
        <p>To all 27 EU member states. We do not ship outside the EU at the moment.</p>
        <h2>How long it takes</h2>
        <p>
          Orders placed on a business day before {s.cutoffHour}:00 are processed the same day. The parcel leaves {s.shipsFrom} within{" "}
          {s.handlingDays.min}–{s.handlingDays.max} business days, then {s.carrier} delivers it in {s.transitDays.min}–
          {s.transitDays.max} business days. In total that is {deliveryRangeLabel}. Remote areas and public holidays can add a day or two.
        </p>
        <h2>What it costs</h2>
        <p>
          {formatPrice(s.flatRateCents)} per order to any EU country. Free on orders over {formatPrice(s.freeOverCents)}. There are no
          customs duties or extra charges on delivery.
        </p>
        <h2>Tracking</h2>
        <p>You receive a tracking link by email when your parcel ships.</p>
        <h2>If a parcel is late or damaged</h2>
        <p>
          If tracking has not moved for 5 business days, or the parcel arrives damaged, email {c.email} with your order reference and a
          photo if relevant. We will send a replacement or refund you.
        </p>
      </>
    ),
  },

  privacy: {
    title: "Privacy policy",
    description: "What personal data we collect, why, and your rights under the GDPR.",
    updated: "2026-09-27",
    body: (
      <>
        <h2>Controller</h2>
        <p>
          {c.legalName}, {c.address}, {c.email}, is responsible for processing your personal data on this website.
        </p>
        <h2>What we collect and why</h2>
        <ul>
          <li>
            <strong>Orders:</strong> name, email, phone, delivery and billing address, the products you bought. We need these to
            deliver your order and to meet accounting obligations (legal basis: contract, Art. 6(1)(b) GDPR, and legal obligation,
            Art. 6(1)(c)).
          </li>
          <li>
            <strong>Payment:</strong> handled entirely by Stripe Payments Europe Ltd. We receive only the payment status and the last
            digits of the card, never the full card details.
          </li>
          <li>
            <strong>Contact and withdrawal forms:</strong> the data you type in, used to answer you (Art. 6(1)(b) and (f)).
          </li>
          <li>
            <strong>Delivery:</strong> your name, address and phone are passed to our logistics partner and the carrier so they can
            deliver the parcel.
          </li>
          <li>
            <strong>Website statistics:</strong> Vercel Web Analytics counts page views without cookies and without identifying you
            (legitimate interest, Art. 6(1)(f)).
          </li>
        </ul>
        <h2>Cookies and local storage</h2>
        <p>
          We do not use advertising or tracking cookies. Your cart is kept in your browser&apos;s local storage so it survives a page
          reload; this is strictly necessary for the shop to work and needs no consent.
        </p>
        <h2>Processors</h2>
        <p>
          Vercel Inc. (hosting), Stripe Payments Europe Ltd. (payments), Resend Inc. (transactional email), our fulfilment partner
          and carrier. Where data is transferred outside the EU, this relies on the EU-US Data Privacy Framework or standard
          contractual clauses.
        </p>
        <h2>How long we keep data</h2>
        <p>
          Order and invoice data: as long as tax and accounting law requires (in Romania, currently 5 to 10 years). Messages: up to 2
          years after the conversation ends.
        </p>
        <h2>Your rights</h2>
        <p>
          You can ask for access, correction, deletion, restriction, portability, and object to processing, by writing to {c.email}.
          You can also complain to a supervisory authority; in Romania this is ANSPDCP (dataprotection.ro).
        </p>
      </>
    ),
  },

  imprint: {
    title: "Company details",
    description: `Who runs ${site.name}.`,
    updated: "2026-09-27",
    body: (
      <>
        <dl>
          <dt>Company</dt>
          <dd>{c.legalName}</dd>
          <dt>Registered address</dt>
          <dd>{c.address}</dd>
          <dt>Trade register number</dt>
          <dd>{c.registrationNumber}</dd>
          <dt>VAT ID</dt>
          <dd>{c.vatId}</dd>
          <dt>Represented by</dt>
          <dd>{c.representative}</dd>
          <dt>Email</dt>
          <dd>{c.email}</dd>
          <dt>Phone</dt>
          <dd>{c.phone}</dd>
          <dt>Consumer protection authority</dt>
          <dd>Autoritatea Națională pentru Protecția Consumatorilor (ANPC), anpc.ro</dd>
        </dl>
      </>
    ),
  },
};
