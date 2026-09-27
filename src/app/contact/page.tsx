import type { Metadata } from "next";

import { ContactForm } from "@/components/forms/contact-form";
import { Container } from "@/components/layout/container";
import { site } from "@/data/site";

export const metadata: Metadata = { title: "Contact", description: `Questions about an order or a product? Write to ${site.name}.` };

export default function ContactPage() {
  return (
    <Container className="grid gap-12 py-10 md:grid-cols-[1fr_1.3fr] md:py-14">
      <div>
        <h1 className="text-3xl font-extrabold sm:text-4xl">Contact</h1>
        <p className="mt-4 max-w-sm leading-relaxed text-muted-foreground">
          Questions about a product, an order or a return. We reply within one business day.
        </p>
        <dl className="mt-8 space-y-4 text-sm">
          <div>
            <dt className="font-semibold">Email</dt>
            <dd>
              <a className="text-forest underline underline-offset-4" href={`mailto:${site.company.email}`}>
                {site.company.email}
              </a>
            </dd>
          </div>
          <div>
            <dt className="font-semibold">Phone</dt>
            <dd>{site.company.phone}</dd>
          </div>
          <div>
            <dt className="font-semibold">Company</dt>
            <dd className="text-muted-foreground">
              {site.company.legalName}
              <br />
              {site.company.address}
            </dd>
          </div>
        </dl>
      </div>
      <ContactForm />
    </Container>
  );
}
