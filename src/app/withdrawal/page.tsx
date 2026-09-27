import type { Metadata } from "next";
import Link from "next/link";

import { WithdrawalForm } from "@/components/forms/withdrawal-form";
import { Container } from "@/components/layout/container";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Withdraw from a purchase",
  description: `Changed your mind? Withdraw from your order within ${site.returns.withdrawalDays} days of delivery.`,
};

export default function WithdrawalPage() {
  return (
    <Container className="grid gap-12 py-10 md:grid-cols-[1fr_1.3fr] md:py-14">
      <div>
        <h1 className="text-3xl font-extrabold sm:text-4xl">Withdraw from a purchase</h1>
        <div className="mt-4 max-w-sm space-y-3 leading-relaxed text-muted-foreground">
          <p>
            You can withdraw from your order within {site.returns.withdrawalDays} days of receiving it, without giving a reason. Send this
            form and you get a confirmation by email straight away.
          </p>
          <p>
            We then send you the return address. Your refund, including the original delivery cost, follows within 14 days once the
            goods are back or you send proof of return.
          </p>
          <p>
            Full details in{" "}
            <Link href="/legal/returns" className="text-forest underline underline-offset-4">
              Returns and refunds
            </Link>
            .
          </p>
        </div>
      </div>
      <WithdrawalForm />
    </Container>
  );
}
