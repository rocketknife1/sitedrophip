import Link from "next/link";

import { site } from "@/data/site";
import { cn } from "@/lib/utils";

export function Logo({ inverted = false }: { inverted?: boolean }) {
  return (
    <Link
      href="/"
      className={cn("flex items-center gap-2 text-xl font-extrabold tracking-tight", inverted ? "text-white" : "text-forest")}
    >
      <span aria-hidden className="size-4 rotate-[-6deg] rounded-[3px] bg-note" />
      {site.name}
    </Link>
  );
}
