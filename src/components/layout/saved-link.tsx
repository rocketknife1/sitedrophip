"use client";

import { Heart } from "lucide-react";
import Link from "next/link";

import { useHydrated } from "@/store/cart";
import { useSaved } from "@/store/lists";

export function SavedLink() {
  const hydrated = useHydrated();
  const count = useSaved((s) => s.ids.length);
  const shown = hydrated ? count : 0;
  return (
    <Link
      href="/saved"
      aria-label={shown ? `Saved items, ${shown}` : "Saved items"}
      className="relative grid size-10 place-items-center rounded-full text-foreground/80 transition hover:bg-surface hover:text-foreground"
    >
      <Heart className="size-5" />
      {shown > 0 && (
        <span className="absolute -top-0.5 -right-0.5 grid min-w-5 place-items-center rounded-full bg-[#d6455d] px-1 text-[11px] leading-5 font-bold text-white">
          {shown}
        </span>
      )}
    </Link>
  );
}
