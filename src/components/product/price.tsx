import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

export function Price({
  cents,
  compareAtCents,
  from = false,
  className,
}: {
  cents: number;
  compareAtCents?: number;
  from?: boolean;
  className?: string;
}) {
  return (
    <p className={cn("flex items-baseline gap-2", className)}>
      <span>
        {from && <span className="mr-1 text-[0.8em] font-normal text-muted-foreground">from</span>}
        {formatPrice(cents)}
      </span>
      {compareAtCents && compareAtCents > cents && (
        <s className="text-[0.8em] font-normal text-muted-foreground">
          <span className="sr-only">Previously </span>
          {formatPrice(compareAtCents)}
        </s>
      )}
    </p>
  );
}
