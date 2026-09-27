// Static-preview stand-in for src/actions/checkout.ts (GitHub Pages has no server).
// Copied over the real file by scripts/prepare-pages.mjs during the Pages build only.

export type CheckoutResult = { error: string };

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- same signature as the real action
export async function startCheckout(_input: unknown): Promise<CheckoutResult> {
  return {
    error: "This is a preview on GitHub Pages, so payments are switched off. The full store runs checkout through Stripe.",
  };
}
