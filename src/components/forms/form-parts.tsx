"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { FormState } from "@/actions/forms";

export function Field({
  name,
  label,
  hint,
  state,
  multiline = false,
  ...props
}: {
  name: string;
  label: string;
  hint?: string;
  state: FormState;
  multiline?: boolean;
} & React.ComponentProps<"input"> &
  Pick<React.ComponentProps<"textarea">, "rows">) {
  const error = state.fieldErrors?.[name];
  const describedBy = [hint && `${name}-hint`, error && `${name}-error`].filter(Boolean).join(" ") || undefined;
  const shared = {
    id: name,
    defaultValue: state.values?.[name],
    name,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describedBy,
    className: "bg-card text-base",
  };

  return (
    <div className="space-y-1.5">
      <Label htmlFor={name}>{label}</Label>
      {multiline ? (
        <Textarea {...shared} rows={props.rows ?? 5} required={props.required} />
      ) : (
        <Input {...shared} {...props} className="h-10 bg-card text-base" />
      )}
      {hint && (
        <p id={`${name}-hint`} className="text-sm text-muted-foreground">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${name}-error`} className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

/** Hidden from people; bots that fill every field reveal themselves. */
export function Honeypot() {
  return (
    <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
      <label>
        Website
        <input type="text" name="website" tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
}

export function FormMessage({ state }: { state: FormState }) {
  if (!state.message) return null;
  return (
    <p
      role={state.status === "error" ? "alert" : "status"}
      className={state.status === "error" ? "text-sm text-destructive" : "rounded-md bg-accent px-3 py-2 text-sm text-accent-foreground"}
    >
      {state.message}
    </p>
  );
}
