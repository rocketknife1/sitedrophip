"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import { products } from "@/data/products";

const known = (id: unknown): id is string => typeof id === "string" && products.some((p) => p.id === id);

/** Products the visitor hearted. Kept in this browser only. */
export const useSaved = create<{ ids: string[]; toggle: (id: string) => void }>()(
  persist(
    (set) => ({
      ids: [],
      toggle: (id) => set((s) => ({ ids: s.ids.includes(id) ? s.ids.filter((x) => x !== id) : [id, ...s.ids] })),
    }),
    {
      name: "saved-v1",
      merge: (persisted, current) => ({ ...current, ids: ((persisted as { ids?: unknown[] })?.ids ?? []).filter(known) }),
    },
  ),
);

/** Last products the visitor opened, newest first. */
export const useRecent = create<{ ids: string[]; push: (id: string) => void }>()(
  persist(
    (set) => ({
      ids: [],
      push: (id) => set((s) => ({ ids: [id, ...s.ids.filter((x) => x !== id)].slice(0, 10) })),
    }),
    {
      name: "recent-v1",
      merge: (persisted, current) => ({ ...current, ids: ((persisted as { ids?: unknown[] })?.ids ?? []).filter(known) }),
    },
  ),
);
