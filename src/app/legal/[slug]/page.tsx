import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Container } from "@/components/layout/container";
import { legalPages } from "@/content/legal";

export function generateStaticParams() {
  return Object.keys(legalPages).map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/legal/[slug]">): Promise<Metadata> {
  const page = legalPages[(await params).slug];
  return page ? { title: page.title, description: page.description } : {};
}

export default async function LegalPage({ params }: PageProps<"/legal/[slug]">) {
  const page = legalPages[(await params).slug];
  if (!page) notFound();

  return (
    <Container className="py-10 md:py-14">
      <article className="legal max-w-2xl">
        <h1 className="text-3xl font-extrabold sm:text-4xl">{page.title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated {page.updated}</p>
        <div className="mt-8">{page.body}</div>
      </article>
    </Container>
  );
}
