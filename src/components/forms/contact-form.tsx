"use client";

import { useActionState } from "react";

import { sendContact, type FormState } from "@/actions/forms";
import { Button } from "@/components/ui/button";
import { Field, FormMessage, Honeypot } from "./form-parts";

const initial: FormState = { status: "idle" };

export function ContactForm() {
  const [state, action, pending] = useActionState(sendContact, initial);

  if (state.status === "success") return <FormMessage state={state} />;

  return (
    <form action={action} className="relative space-y-5" noValidate>
      <Honeypot />
      <Field name="name" label="Your name" autoComplete="name" required state={state} />
      <Field name="email" label="Email" type="email" autoComplete="email" required state={state} />
      <Field name="order" label="Order reference (optional)" hint="From your confirmation email, if it is about an order." state={state} />
      <Field name="message" label="Message" multiline required state={state} />
      <FormMessage state={state} />
      <Button type="submit" size="lg" className="h-11 px-6" disabled={pending}>
        {pending ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}
