import "server-only";

import { site } from "@/data/site";
import { formatPrice } from "./format";

export type OrderLine = {
  name: string;
  variant: string;
  quantity: number;
  unitCents: number;
  sku?: string;
  costCents?: number;
  supplierName?: string;
};

export type OrderEmailData = {
  id: string;
  customerName: string;
  customerEmail: string;
  phone?: string;
  addressLines: string[];
  lines: OrderLine[];
  subtotalCents: number;
  shippingCents: number;
  totalCents: number;
};

export function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

function layout(title: string, body: string): string {
  return `<!doctype html><html><body style="margin:0;background:#f5f6f3;font-family:Arial,Helvetica,sans-serif;color:#1e2a26">
<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:24px 12px">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid #d8dcd5;border-radius:12px">
<tr><td style="padding:24px 28px;border-bottom:1px solid #d8dcd5;font-size:18px;font-weight:bold;color:#1f4d3a">${escapeHtml(site.name)}</td></tr>
<tr><td style="padding:28px">
<h1 style="margin:0 0 16px;font-size:22px">${escapeHtml(title)}</h1>
${body}
</td></tr>
<tr><td style="padding:20px 28px;border-top:1px solid #d8dcd5;font-size:12px;color:#5b6660;line-height:1.5">
${escapeHtml(site.company.legalName)} · ${escapeHtml(site.company.address)}<br>
${escapeHtml(site.company.email)}
</td></tr></table></td></tr></table></body></html>`;
}

function linesTable(lines: OrderLine[], withSupplier: boolean): string {
  const rows = lines
    .map(
      (l) => `<tr>
<td style="padding:8px 0;border-bottom:1px solid #eceee9">${escapeHtml(l.name)}<br><span style="color:#5b6660;font-size:13px">${escapeHtml(l.variant)} × ${l.quantity}</span>${
        withSupplier
          ? `<br><span style="font-size:13px"><b>SKU:</b> ${escapeHtml(l.sku ?? "?")} · ${escapeHtml(l.supplierName ?? "")} · cost ${l.costCents != null ? formatPrice(l.costCents) : "?"}</span>`
          : ""
      }</td>
<td style="padding:8px 0;border-bottom:1px solid #eceee9;text-align:right;white-space:nowrap">${formatPrice(l.unitCents * l.quantity)}</td></tr>`,
    )
    .join("");
  return `<table width="100%" cellpadding="0" cellspacing="0" style="font-size:15px">${rows}</table>`;
}

function totals(o: OrderEmailData): string {
  return `<table width="100%" cellpadding="0" cellspacing="0" style="font-size:15px;margin-top:8px">
<tr><td style="padding:4px 0;color:#5b6660">Subtotal</td><td style="text-align:right">${formatPrice(o.subtotalCents)}</td></tr>
<tr><td style="padding:4px 0;color:#5b6660">Shipping</td><td style="text-align:right">${o.shippingCents === 0 ? "Free" : formatPrice(o.shippingCents)}</td></tr>
<tr><td style="padding:4px 0;font-weight:bold">Total (VAT included)</td><td style="text-align:right;font-weight:bold">${formatPrice(o.totalCents)}</td></tr>
</table>`;
}

export function orderConfirmationEmail(o: OrderEmailData): { subject: string; html: string } {
  const body = `<p style="line-height:1.6;margin:0 0 20px">Hi ${escapeHtml(o.customerName)}, thanks for your order. We will email you the tracking link as soon as the parcel leaves ${escapeHtml(site.shipping.shipsFrom)}.</p>
<p style="margin:0 0 20px;font-size:13px;color:#5b6660">Order reference: ${escapeHtml(o.id.slice(-12).toUpperCase())}</p>
${linesTable(o.lines, false)}
${totals(o)}
<h2 style="font-size:16px;margin:24px 0 8px">Shipping to</h2>
<p style="margin:0;line-height:1.6">${o.addressLines.map(escapeHtml).join("<br>")}</p>
<h2 style="font-size:16px;margin:24px 0 8px">Changed your mind?</h2>
<p style="margin:0;line-height:1.6">You can withdraw from this purchase within ${site.returns.withdrawalDays} days of receiving it, without giving a reason. Use the form at <a href="${site.url}/withdrawal" style="color:#1f4d3a">${site.url.replace(/^https?:\/\//, "")}/withdrawal</a> or reply to this email. Full terms: <a href="${site.url}/legal/terms" style="color:#1f4d3a">Terms and conditions</a>.</p>`;
  return { subject: `Order confirmed: ${site.name}`, html: layout("Your order is confirmed", body) };
}

export function orderNotificationEmail(o: OrderEmailData): { subject: string; html: string } {
  const cost = o.lines.reduce((s, l) => s + (l.costCents ?? 0) * l.quantity, 0);
  const body = `<p style="margin:0 0 16px;line-height:1.6">Place this order with the supplier. Stripe session: <code>${escapeHtml(o.id)}</code></p>
${linesTable(o.lines, true)}
${totals(o)}
<p style="margin:12px 0 0;font-size:14px">Supplier cost: <b>${formatPrice(cost)}</b> · Gross margin before fees: <b>${formatPrice(o.totalCents - cost)}</b></p>
<h2 style="font-size:16px;margin:24px 0 8px">Ship to</h2>
<p style="margin:0;line-height:1.6">${escapeHtml(o.customerName)}<br>${o.addressLines.map(escapeHtml).join("<br>")}${o.phone ? `<br>${escapeHtml(o.phone)}` : ""}<br>${escapeHtml(o.customerEmail)}</p>`;
  return { subject: `New order ${formatPrice(o.totalCents)}: ${o.lines.map((l) => l.name).join(", ")}`, html: layout("New order to fulfil", body) };
}

export function simpleMessageEmail(title: string, fields: Record<string, string>, intro?: string): string {
  const rows = Object.entries(fields)
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 12px 6px 0;color:#5b6660;vertical-align:top;white-space:nowrap">${escapeHtml(k)}</td><td style="padding:6px 0;white-space:pre-wrap">${escapeHtml(v)}</td></tr>`,
    )
    .join("");
  return layout(title, `${intro ? `<p style="margin:0 0 16px;line-height:1.6">${escapeHtml(intro)}</p>` : ""}<table cellpadding="0" cellspacing="0" style="font-size:15px">${rows}</table>`);
}
