"use client";

import { Lock } from "lucide-react";
import { useState, useTransition } from "react";

import { startCheckout } from "@/actions/checkout";
import { Button } from "@/components/ui/button";
import { useCart } from "@/store/cart";

export function CheckoutButton() {
  const items = useCart((s) => s.items);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="space-y-2">
      <Button
        size="lg"
        className="h-12 w-full text-base"
        disabled={pending || items.length === 0}
        onClick={() => {
          setError(null);
          startTransition(async () => {
            // On success the action redirects to Stripe and never returns.
            const result = await startCheckout(items);
            if (result?.error) setError(result.error);
          });
        }}
      >
        <Lock className="size-4" />
        {pending ? "Opening secure payment…" : "Check out"}
      </Button>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
