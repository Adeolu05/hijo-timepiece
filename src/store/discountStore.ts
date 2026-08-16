import { create } from "zustand";
import { isDemoSanityClient, queries, sanityClient } from "../lib/sanity";
import { mapSanityDocumentsToDiscountCodes } from "../lib/mapSanityDiscountCode";
import { normalizeDiscountCode } from "../lib/discountCodes";
import type { DiscountCode, SanityDiscountCodeDocument } from "../lib/discountTypes";

const PENDING_PROMO_KEY = "hijo-lux-pending-promo";

function readPendingCode(): string | null {
  if (typeof sessionStorage === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(PENDING_PROMO_KEY);
    return raw ? normalizeDiscountCode(raw) || null : null;
  } catch {
    return null;
  }
}

function writePendingCode(code: string | null) {
  if (typeof sessionStorage === "undefined") return;
  try {
    if (code) sessionStorage.setItem(PENDING_PROMO_KEY, code);
    else sessionStorage.removeItem(PENDING_PROMO_KEY);
  } catch {
    /* ignore quota / private mode */
  }
}

interface DiscountState {
  codes: DiscountCode[];
  isLoading: boolean;
  hasFetched: boolean;
  fetchFailed: boolean;
  pendingCode: string | null;
  fetchCodes: () => Promise<void>;
  capturePendingCode: (raw: string) => void;
  clearPendingCode: () => void;
}

export const useDiscountStore = create<DiscountState>((set, get) => ({
  codes: [],
  isLoading: false,
  hasFetched: false,
  fetchFailed: false,
  pendingCode: readPendingCode(),
  fetchCodes: async () => {
    if (get().isLoading) return;
    if (get().hasFetched && !get().fetchFailed) return;

    set({ isLoading: true, fetchFailed: false });

    if (isDemoSanityClient()) {
      set({ codes: [], isLoading: false, hasFetched: true, fetchFailed: false });
      return;
    }

    try {
      const raw = await sanityClient.fetch<SanityDiscountCodeDocument[]>(queries.getAllDiscountCodes);
      set({
        codes: mapSanityDocumentsToDiscountCodes(raw ?? []),
        isLoading: false,
        hasFetched: true,
        fetchFailed: false,
      });
    } catch (error) {
      console.warn("Failed to fetch discount codes from Sanity:", error);
      set({ codes: [], isLoading: false, hasFetched: true, fetchFailed: true });
    }
  },
  capturePendingCode: (raw) => {
    const code = normalizeDiscountCode(raw);
    if (!code) return;
    writePendingCode(code);
    set({ pendingCode: code });
  },
  clearPendingCode: () => {
    writePendingCode(null);
    set({ pendingCode: null });
  },
}));
