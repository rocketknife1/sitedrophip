"use client";

import { Minus, Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { MAX_QTY } from "@/store/cart";

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  label,
  className,
}: {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  label: string;
  className?: string;
}) {
  const btn =
    "grid size-9 place-items-center text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40 disabled:hover:text-muted-foreground";
  return (
    <div role="group" aria-label={label} className={cn("inline-flex items-center rounded-md border bg-card", className)}>
      <button type="button" className={btn} onClick={() => onChange(value - 1)} disabled={value <= min} aria-label="Decrease quantity">
        <Minus className="size-4" />
      </button>
      <output aria-live="polite" className="tabular w-8 text-center text-sm font-semibold">
        {value}
      </output>
      <button type="button" className={btn} onClick={() => onChange(value + 1)} disabled={value >= MAX_QTY} aria-label="Increase quantity">
        <Plus className="size-4" />
      </button>
    </div>
  );
}
