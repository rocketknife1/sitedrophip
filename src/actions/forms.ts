"use server";

import { z } from "zod";

import { site } from "@/data/site";
import { isEmailConfigured, ownerEmail, sendEmail } from "@/lib/email";
import { simpleMessageEmail } from "@/lib/email-templates";

export type FormState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Record<string, string>;
  /** Submitted values, echoed back so fields keep their content after an error. */
  values?: Record<string, string>;
};

function valuesOf(formData: FormData): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of formData) if (typeof v === "string" && k !== "website" && !k.startsWith("$")) out[k] = v;
  return out;
}

function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0]);
    out[key] ??= issue.message;
  }
  return out;
}

const notConfigured: FormState = {
  status: "error",
  message: `The form is not connected yet. Email us directly at ${site.company.email}.`,
};

const contactSchema = z.object({
  name: z.string().trim().min(1, "Enter your name").max(100),
  email: z.email("Enter a valid email address").max(200),
  order: z.string().trim().max(60).optional(),
  message: z.string().trim().min(10, "Write at least a sentence so we can help").max(4000),
});

export async function sendContact(_prev: FormState, formData: FormData): Promise<FormState> {
  // Honeypot: real people never see or fill this field.
  if (formData.get("website")) return { status: "success", message: "Message sent." };

  const parsed = contactSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { status: "error", fieldErrors: fieldErrors(parsed.error), values: valuesOf(formData) };
  if (!isEmailConfigured() || !ownerEmail()) return { ...notConfigured, values: valuesOf(formData) };

  const { name, email, order, message } = parsed.data;
  const result = await sendEmail({
    to: ownerEmail()!,
    replyTo: email,
    subject: `Contact form: ${name}`,
    html: simpleMessageEmail("New message", { Name: name, Email: email, Order: order || "-", Message: message }),
  });
  if (!result.ok) return { status: "error", message: `Sending failed. Email us directly at ${site.company.email}.`, values: valuesOf(formData) };
  return { status: "success", message: "Message sent. We reply within one business day." };
}

const withdrawalSchema = z.object({
  name: z.string().trim().min(1, "Enter your full name").max(100),
  email: z.email("Enter the email you used for the order").max(200),
  order: z.string().trim().min(3, "Enter the order reference from your confirmation email").max(60),
  items: z.string().trim().min(2, "List the products you are returning").max(1000),
  receivedOn: z.iso.date("Pick the date you received the parcel"),
  address: z.string().trim().max(500).optional(),
});

export async function sendWithdrawal(_prev: FormState, formData: FormData): Promise<FormState> {
  if (formData.get("website")) return { status: "success", message: "Withdrawal received." };

  const parsed = withdrawalSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { status: "error", fieldErrors: fieldErrors(parsed.error), values: valuesOf(formData) };
  if (!isEmailConfigured() || !ownerEmail()) return { ...notConfigured, values: valuesOf(formData) };

  const d = parsed.data;
  const submittedAt = new Date().toISOString().replace("T", " ").slice(0, 16) + " UTC";
  const fields = {
    Name: d.name,
    Email: d.email,
    "Order reference": d.order,
    "Products returned": d.items,
    "Received on": d.receivedOn,
    Address: d.address || "-",
    "Submitted at": submittedAt,
  };

  const [owner, customer] = await Promise.all([
    sendEmail({
      to: ownerEmail()!,
      replyTo: d.email,
      subject: `Withdrawal notice: order ${d.order}`,
      html: simpleMessageEmail("Withdrawal notice received", fields, "Refund within 14 days of this notice (you may wait until the goods are back or proof of return is sent)."),
    }),
    sendEmail({
      to: d.email,
      subject: `We received your withdrawal for order ${d.order}`,
      html: simpleMessageEmail(
        "Your withdrawal is registered",
        fields,
        `This email confirms that ${site.company.legalName} received your notice of withdrawal. We will email you the return address and refund you within 14 days, once the goods are back or you send proof of return.`,
      ),
    }),
  ]);

  if (!owner.ok) return { status: "error", message: `Sending failed. Email your withdrawal to ${site.company.email}.`, values: valuesOf(formData) };
  if (!customer.ok) {
    return { status: "success", message: "Withdrawal received, but the confirmation email could not be sent. Keep a screenshot of this page." };
  }
  return { status: "success", message: "Withdrawal received. A confirmation is on its way to your inbox." };
}
