/**
 * use-content-store.ts
 * Local-first store for Content Tracker data.
 * Uses createLocalStore factory — exact same pattern as use-signal-store.ts.
 * - Storage key: "scoutboard:content:v1"
 * - Falls back to mock contentTracker when empty
 *
 * addContent() is a thin wrapper over factory addItem() — no local useState,
 * no safeGet/safeSet duplication, single source of truth.
 */

"use client";

import type { ContentItem } from "./mock-data";
import { contentTracker as mockContentTracker } from "./mock-data";
import { createLocalStore } from "./create-local-store";

const STORAGE_KEY = "scoutboard:content:v1";
const META_KEY = "scoutboard:content_meta:v1";

const useBaseContentStore = createLocalStore<ContentItem>(
  STORAGE_KEY,
  META_KEY,
  mockContentTracker
);

export interface ContentStore {
  items: ContentItem[];
  addContent: (
    title: string,
    platform: ContentItem["platform"],
    engagement: number,
    angle: string
  ) => void;
}

export function useContentStore(): ContentStore {
  const { data, addItem } = useBaseContentStore();

  function addContent(
    title: string,
    platform: ContentItem["platform"],
    engagement: number,
    angle: string
  ) {
    const newItem: ContentItem = {
      id: `c-manual-${Date.now()}`,
      title: title.trim(),
      platform,
      engagement,
      angle: angle.trim(),
      postedAt: "เพิ่งเพิ่ม",
    };
    addItem(newItem);
  }

  return { items: data, addContent };
}
