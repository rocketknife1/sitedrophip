// Static-preview stand-in for src/actions/forms.ts (GitHub Pages has no server).
// Copied over the real file by scripts/prepare-pages.mjs during the Pages build only.

import { site } from "@/data/site";

export type FormState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Record<string, string>;
  values?: Record<string, string>;
};

function preview(formData: FormData): FormState {
  const values: Record<string, string> = {};
  for (const [k, v] of formData) if (typeof v === "string" && k !== "website" && !k.startsWith("$")) values[k] = v;
  return {
    status: "error",
    message: `This is a preview on GitHub Pages, so forms are switched off. Email us at ${site.company.email}.`,
    values,
  };
}

export async function sendContact(_prev: FormState, formData: FormData): Promise<FormState> {
  return preview(formData);
}

export async function sendWithdrawal(_prev: FormState, formData: FormData): Promise<FormState> {
  return preview(formData);
}
