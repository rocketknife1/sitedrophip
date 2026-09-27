import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Container } from "@/components/layout/container";
import { ProductCard } from "@/components/product/product-card";
import { ProductView } from "@/components/product/product-view";
import { ShopFaq } from "@/components/shop-faq";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { getProduct, products } from "@/data/products";
import { site } from "@/data/site";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/products/[slug]">): Promise<Metadata> {
  const product = getProduct((await params).slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.tagline,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: { title: product.name, description: product.tagline, images: [product.images[0].src] },
  };
}

export default async function ProductPage({ params }: PageProps<"/products/[slug]">) {
  const product = getProduct((await params).slug);
  if (!product) notFound();

  const related = [
    ...products.filter((p) => p.id !== product.id && p.category === product.category),
    ...products.filter((p) => p.id !== product.id && p.category !== product.category),
  ].slice(0, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.tagline,
    image: product.images.map((i) => `${site.url}${i.src}`),
    brand: { "@type": "Brand", name: site.name },
    offers: product.variants.map((v) => ({
      "@type": "Offer",
      name: v.name,
      sku: v.id,
      price: (v.priceCents / 100).toFixed(2),
      priceCurrency: site.currency,
      availability: v.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: `${site.url}/products/${product.slug}`,
    })),
  };

  const sections = [
    {
      title: "Details",
      body: (
        <div className="space-y-3">
          {product.description.map((para) => (
            <p key={para}>{para}</p>
          ))}
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {product.highlights.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        </div>
      ),
    },
    {
      title: "Specifications",
      body: (
        <dl className="divide-y">
          {product.specs.map((s) => (
            <div key={s.label} className="grid grid-cols-[9rem_1fr] gap-4 py-2.5">
              <dt className="text-muted-foreground">{s.label}</dt>
              <dd className="text-foreground">{s.value}</dd>
            </div>
          ))}
        </dl>
      ),
    },
    ...(product.inTheBox.length > 0
      ? [
          {
            title: "In the box",
            body: (
              <ul className="list-disc space-y-1 pl-5">
                {product.inTheBox.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ),
          },
        ]
      : []),
    {
      title: "Shipping and returns",
      body: (
        <p>
          Tracked delivery to all EU countries from {site.shipping.shipsFrom}. You have {site.returns.withdrawalDays} days from delivery to send
          it back for a refund. Read the full{" "}
          <Link href="/legal/shipping" className="font-medium text-forest underline">
            shipping
          </Link>{" "}
          and{" "}
          <Link href="/legal/returns" className="font-medium text-forest underline">
            returns
          </Link>{" "}
          policies.
        </p>
      ),
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        // JSON.stringify output with "<" escaped cannot break out of the script tag.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <Container className="py-6 md:py-10">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground">
          <ol className="flex flex-wrap gap-1.5">
            <li>
              <Link href="/" className="hover:text-foreground hover:underline">
                Home
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link href={`/products?category=${encodeURIComponent(product.category)}`} className="hover:text-foreground hover:underline">
                {product.category}
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li aria-current="page" className="text-foreground">
              {product.name}
            </li>
          </ol>
        </nav>

        <ProductView product={product} />

        <div className="mt-16 grid gap-12 lg:grid-cols-2 lg:gap-16">
          <section>
            <h2 className="mb-2 text-2xl font-extrabold">About the {product.name.toLowerCase()}</h2>
            <Accordion defaultValue={["Details"]} className="border-b">
              {sections.map((s) => (
                <AccordionItem key={s.title} value={s.title} className="border-t">
                  <AccordionTrigger className="py-4 text-base font-semibold">{s.title}</AccordionTrigger>
                  <AccordionContent className="pb-5 text-[15px] leading-relaxed text-muted-foreground">{s.body}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
          <section>
            <h2 className="mb-2 text-2xl font-extrabold">Questions</h2>
            <ShopFaq extra={product.faq} />
          </section>
        </div>

        {related.length > 0 && (
          <section className="mt-24">
            <h2 className="mb-8 text-3xl font-extrabold">You might also like</h2>
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </Container>
    </>
  );
}
