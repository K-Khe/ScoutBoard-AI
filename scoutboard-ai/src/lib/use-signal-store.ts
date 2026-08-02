/**
 * use-signal-store.ts
 * Local-first store for Signal Sources data.
 * Uses createLocalStore factory — exact same pattern as use-market-store.ts.
 * - Storage key: "scoutboard:signals:v1"
 * - Falls back to mock signalSources when empty
 *
 * addSignal() is a thin wrapper over the factory's addItem() —
 * no local useState, no safeGet/safeSet duplication, single source of truth.
 */

"use client";

import type { SignalSource } from "./mock-data";
import { signalSources as mockSignalSources } from "./mock-data";
import { createLocalStore } from "./create-local-store";

const STORAGE_KEY = "scoutboard:signals:v1";
const META_KEY = "scoutboard:signals_meta:v1";

const useBaseSignalStore = createLocalStore<SignalSource>(
  STORAGE_KEY,
  META_KEY,
  mockSignalSources
);

export interface SignalStore {
  sources: SignalSource[];
  addSignal: (handle: string, platform: SignalSource["platform"]) => void;
}

export function useSignalStore(): SignalStore {
  const { data, addItem } = useBaseSignalStore();

  function addSignal(handle: string, platform: SignalSource["platform"]) {
    const trimmed = handle.startsWith("@") ? handle : `@${handle}`;
    const newSource: SignalSource = {
      id: `s-manual-${Date.now()}`,
      handle: trimmed,
      platform,
      followers: 0,
      postsTracked: 0,
      lastSignal: "เพิ่งเพิ่ม",
      status: "กำลังติดตาม",
    };
    // addItem uses setData((prev) => [...prev, item]) internally —
    // `prev` == React state at call time, `next` is persisted to localStorage
    // in the same callback. UI and storage are always in sync.
    addItem(newSource);
  }

  return { sources: data, addSignal };
}
