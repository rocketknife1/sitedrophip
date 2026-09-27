import "server-only";

import { Resend } from "resend";

let client: Resend | null = null;

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM);
}

function getResend(): Resend {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY is not set");
  client ??= new Resend(key);
  return client;
}

export type SendResult = { ok: true } | { ok: false; error: string };

export async function sendEmail(input: {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
  /** Same key within 24 h = email is sent once, even if Stripe retries the webhook. */
  idempotencyKey?: string;
}): Promise<SendResult> {
  if (!isEmailConfigured()) return { ok: false, error: "Email is not configured (RESEND_API_KEY / EMAIL_FROM)" };

  const { error } = await getResend().emails.send(
    {
      from: process.env.EMAIL_FROM!,
      to: input.to,
      subject: input.subject,
      html: input.html,
      replyTo: input.replyTo,
    },
    input.idempotencyKey ? { idempotencyKey: input.idempotencyKey } : undefined,
  );
  if (error) {
    console.error("[email] send failed", { to: input.to, subject: input.subject, error });
    return { ok: false, error: error.message };
  }
  return { ok: true };
}

/** Where order and form notifications go. */
export function ownerEmail(): string | undefined {
  return process.env.ORDER_NOTIFY_EMAIL;
}
