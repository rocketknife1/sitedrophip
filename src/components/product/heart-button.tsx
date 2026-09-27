"use client";

import { Heart } from "lucide-react";

import { cn } from "@/lib/utils";
import { useHydrated } from "@/store/cart";
import { useSaved } from "@/store/lists";

export function HeartButton({ productId, productName, className }: { productId: string; productName: string; className?: string }) {
  const hydrated = useHydrated();
  const saved = useSaved((s) => s.ids.includes(productId));
  const toggle = useSaved((s) => s.toggle);
  const on = hydrated && saved;

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        toggle(productId);
      }}
      aria-pressed={on}
      aria-label={on ? `Remove ${productName} from saved` : `Save ${productName} for later`}
      className={cn(
        "relative z-10 grid size-9 place-items-center rounded-full bg-white/90 text-ink shadow-sm backdrop-blur transition hover:scale-110",
        on && "text-[#d6455d]",
        className,
      )}
    >
      <Heart className={cn("size-[18px] transition-transform", on && "scale-110 fill-current")} />
    </button>
  );
}
