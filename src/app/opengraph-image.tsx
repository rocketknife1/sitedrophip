import { ImageResponse } from "next/og";

import { site } from "@/data/site";

// Generated once at build time (also required for the static GitHub Pages export).
export const dynamic = "force-static";

export const alt = `${site.name}: desk and home-office gear`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#f5f6f3",
          color: "#1e2a26",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 40, fontWeight: 800, color: "#1f4d3a" }}>
          <div style={{ width: 36, height: 36, background: "#f2c14e", transform: "rotate(-6deg)" }} />
          {site.name}
        </div>
        <div style={{ fontSize: 84, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2, maxWidth: 900 }}>
          Build a desk you want to sit at.
        </div>
        <div style={{ fontSize: 30, color: "#5b6660" }}>Delivered across the EU · VAT included</div>
      </div>
    ),
    size,
  );
}
