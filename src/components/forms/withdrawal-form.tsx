"use client";

import { useActionState } from "react";

import { sendWithdrawal, type FormState } from "@/actions/forms";
import { Button } from "@/components/ui/button";
import { Field, FormMessage, Honeypot } from "./form-parts";

const initial: FormState = { status: "idle" };

export function WithdrawalForm() {
  const [state, action, pending] = useActionState(sendWithdrawal, initial);

  if (state.status === "success") return <FormMessage state={state} />;

  return (
    <form action={action} className="relative space-y-5" noValidate>
      <Honeypot />
      <Field name="name" label="Full name" autoComplete="name" required state={state} />
      <Field name="email" label="Email used for the order" type="email" autoComplete="email" required state={state} />
      <Field name="order" label="Order reference" hint="The 12-character code in your confirmation email." required state={state} />
      <Field
        name="items"
        label="Products you are withdrawing from"
        hint="For example: Felt desk mat, 80 × 30 cm, 1 piece."
        multiline
        rows={3}
        required
        state={state}
      />
      <Field name="receivedOn" label="Date you received the parcel" type="date" required state={state} />
      <Field name="address" label="Your address (optional)" autoComplete="street-address" state={state} />
      <FormMessage state={state} />
      <Button type="submit" size="lg" className="h-11 px-6" disabled={pending}>
        {pending ? "Sending…" : "Withdraw from contract"}
      </Button>
    </form>
  );
}
