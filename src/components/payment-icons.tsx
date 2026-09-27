import { cn } from "@/lib/utils";

const badge = "flex h-6 w-10 items-center justify-center rounded-[4px] border border-black/10 bg-white";

/** Simplified marks for the payment methods Stripe Checkout offers by default. */
export function PaymentIcons({ className }: { className?: string }) {
  return (
    <ul aria-label="Accepted payment methods" className={cn("flex flex-wrap items-center gap-1.5", className)}>
      <li className={badge} title="Visa">
        <span className="text-[11px] font-black tracking-tight text-[#1a1f71] italic">VISA</span>
      </li>
      <li className={badge} title="Mastercard">
        <svg viewBox="0 0 24 16" className="h-4 w-6" aria-hidden>
          <circle cx="9" cy="8" r="6" fill="#eb001b" />
          <circle cx="15" cy="8" r="6" fill="#f79e1b" fillOpacity=".9" />
        </svg>
        <span className="sr-only">Mastercard</span>
      </li>
      <li className={badge} title="American Express">
        <span className="rounded-[2px] bg-[#1f72cd] px-0.5 text-[8px] font-bold text-white">AMEX</span>
      </li>
      <li className={badge} title="Apple Pay">
        <span className="text-[8.5px] leading-none font-semibold text-black">Apple Pay</span>
      </li>
      <li className={badge} title="Google Pay">
        <span className="text-[10px] font-semibold text-[#3c4043]">
          <span className="text-[#4285f4]">G</span> Pay
        </span>
        <span className="sr-only">Google Pay</span>
      </li>
    </ul>
  );
}
