import { create } from "zustand";
import { sanityClient, queries } from "../lib/sanity";
import { mapSanityDocumentsToWatches } from "../lib/mapSanityWatch";
import type { SanityWatchDocument } from "../lib/sanityTypes";
import { Watch, WATCHES } from "../data/watches";

interface ProductState {
  watches: Watch[];
  isLoading: boolean;
  error: string | null;
  fetchWatches: () => Promise<void>;
  clearCatalogError: () => void;
}

function isDemoSanity(): boolean {
  return sanityClient.config().projectId === "demo";
}

export const useProductStore = create<ProductState>((set, get) => ({
  watches: [],
  isLoading: false,
  error: null,
  fetchWatches: async () => {
    if (get().watches.length > 0 || get().isLoading) return;

    set({ isLoading: true, error: null });

    if (isDemoSanity()) {
      set({ watches: WATCHES, isLoading: false, error: null });
      return;
    }

    try {
      const raw = await sanityClient.fetch<SanityWatchDocument[]>(queries.getAllWatches);
      const watches = mapSanityDocumentsToWatches(raw ?? []);

      if (watches.length === 0) {
        console.warn(
          "Sanity returned no valid watches (check slug + required fields); using local WATCHES fallback.",
        );
        set({
          watches: WATCHES,
          isLoading: false,
          error:
            "No published watches matched the catalog query. Showing sample pieces until content is live.",
        });
        return;
      }

      set({ watches, isLoading: false, error: null });
    } catch (error) {
      console.warn("Failed to fetch watches from Sanity, falling back to local data:", error);
      set({
        watches: WATCHES,
        isLoading: false,
        error: "Could not load the live catalog. Showing sample pieces. Check connection or CORS.",
      });
    }
  },
  clearCatalogError: () => set({ error: null }),
}));
