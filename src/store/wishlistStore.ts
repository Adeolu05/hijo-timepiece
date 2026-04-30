import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WishlistState {
  ids: string[];
  toggle: (watchId: string) => void;
  has: (watchId: string) => boolean;
  remove: (watchId: string) => void;
  /** Drop IDs that are not in `validIds` (e.g. unpublished watches). */
  keepOnly: (validIds: ReadonlySet<string>) => void;
  clear: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (watchId) => {
        const id = watchId.trim();
        if (!id) return;
        set((s) => ({
          ids: s.ids.includes(id) ? s.ids.filter((x) => x !== id) : [...s.ids, id],
        }));
      },
      has: (watchId) => get().ids.includes(watchId.trim()),
      remove: (watchId) => {
        const id = watchId.trim();
        if (!id) return;
        set((s) => ({ ids: s.ids.filter((x) => x !== id) }));
      },
      keepOnly: (validIds) => {
        set((s) => ({ ids: s.ids.filter((id) => validIds.has(id)) }));
      },
      clear: () => set({ ids: [] }),
    }),
    { name: "hijo-lux-wishlist-v1" },
  ),
);
