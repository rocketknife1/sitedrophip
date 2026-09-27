import Image from "next/image";
import Link from "next/link";

import type { Product } from "@/data/products";
import { lowestPrice } from "@/data/products";
import { site } from "@/data/site";
import { HeartButton } from "./heart-button";
import { Price } from "./price";
import { QuickAdd } from "./quick-add";

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const price = lowestPrice(product);
  const multiplePrices = new Set(product.variants.map((v) => v.priceCents)).size > 1;
  const [first, second] = product.images;
  const swatches = product.variants.filter((v) => v.swatch);
  const single = product.variants.length === 1 ? product.variants[0] : null;

  return (
    <article className="group relative flex flex-col">
      <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-surface">
        <Image
          src={first.src}
          alt={first.alt}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 45vw, 90vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
        {second && (
          <Image
            src={second.src}
            alt=""
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 45vw, 90vw"
            className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
        )}
        <div className="absolute top-3 left-3 flex flex-col items-start gap-1.5">
          {product.trend && <span className="rounded-full bg-ink px-2.5 py-1 text-xs font-semibold text-white shadow-sm">Trending</span>}
          {price >= site.shipping.freeOverCents && (
            <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-forest shadow-sm">Free delivery</span>
          )}
          {product.variants.some((v) => v.compareAtCents && v.compareAtCents > v.priceCents) && (
            <span className="rounded-full bg-note px-2.5 py-1 text-xs font-semibold text-ink">Sale</span>
          )}
        </div>
        <HeartButton productId={product.id} productName={product.name} className="absolute top-3 right-3" />
        {single && single.inStock && (
          <QuickAdd
            variantId={single.id}
            productName={product.name}
            className="absolute right-3 bottom-3 translate-y-0 opacity-100 md:translate-y-2 md:opacity-0 md:group-focus-within:translate-y-0 md:group-focus-within:opacity-100 md:group-hover:translate-y-0 md:group-hover:opacity-100"
          />
        )}
      </div>

      <div className="mt-4 flex flex-col gap-1">
        <h3 className="text-[15px] leading-snug font-semibold">
          <Link href={`/products/${product.slug}`} className="after:absolute after:inset-0">
            {product.name}
          </Link>
        </h3>
        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{product.tagline}</p>
        <div className="mt-1 flex items-center justify-between gap-3">
          <Price cents={price} from={multiplePrices} className="text-[15px] font-bold" />
          {swatches.length > 1 && (
            <ul className="flex gap-1" aria-label={`${swatches.length} colours`}>
              {swatches.map((v) => (
                <li key={v.id} title={v.name} className="size-3.5 rounded-full ring-1 ring-black/15" style={{ background: v.swatch }} />
              ))}
            </ul>
          )}
        </div>
      </div>
    </article>
  );
}
