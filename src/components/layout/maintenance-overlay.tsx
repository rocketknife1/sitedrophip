"use client";

import { Wrench } from "lucide-react";
import { useEffect, useState } from "react";

type Maintenance = { active: boolean; title?: string; message?: string };

/**
 * Maintenance mode: public/maintenance.json with "active": true covers the whole
 * store with a message. It is switched on/off from the Organizator app, so taking
 * the store down needs no code change. Read on every page load (no cache), so the
 * switch takes effect as soon as the new build is live.
 */
export function MaintenanceOverlay() {
  const [m, setM] = useState<Maintenance | null>(null);

  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
    fetch(`${base}/maintenance.json`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data: Maintenance | null) => {
        if (data?.active === true) setM(data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!m) return;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [m]);

  if (!m) return null;
  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="maintenance-title"
      className="fixed inset-0 z-[2147483647] grid place-items-center overflow-auto bg-ink px-6 py-10 text-center text-white"
    >
      <div className="max-w-xl">
        <p className="mb-7 text-sm font-medium tracking-[0.14em] text-white/70 uppercase">Sodo Store</p>
        <div className="mx-auto mb-7 grid size-20 place-items-center rounded-full bg-forest">
          <Wrench className="size-9" aria-hidden="true" />
        </div>
        <h1 id="maintenance-title" className="mb-4 text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          {m.title || "We'll be back shortly"}
        </h1>
        <p className="text-lg leading-relaxed whitespace-pre-line text-white/85">
          {m.message || "The store is down for a short maintenance. Please check back in a little while."}
        </p>
      </div>
    </div>
  );
}
