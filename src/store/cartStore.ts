import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Watch } from "../data/watches";
import { getMaxOrderQuantity, isStorefrontPurchasable } from "../lib/watchOrder";

export interface CartItem {
  watch: Watch;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  /** Normalized uppercase code; totals are recomputed from live catalog + codes. */
  appliedCode: string | null;
  addItem: (watch: Watch, quantity?: number) => void;
  removeItem: (watchId: string) => void;
  updateQuantity: (watchId: string, quantity: number) => void;
  setAppliedCode: (code: string | null) => void;
  clearCart: () => void;
  getTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      appliedCode: null,
      addItem: (watch, quantity = 1) => {
        if (!isStorefrontPurchasable(watch)) return;
        const max = getMaxOrderQuantity(watch);
        const q = Math.min(Math.max(1, quantity), max);
        if (q === 0) return;

        set((state) => {
          const existingItem = state.items.find(
            (item) => item.watch.id === watch.id,
          );
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.watch.id === watch.id
                  ? {
                      ...item,
                      quantity: Math.min(item.quantity + quantity, max),
                    }
                  : item,
              ),
            };
          }
          return { items: [...state.items, { watch, quantity: q }] };
        });
      },
      removeItem: (watchId) => {
        set((state) => ({
          items: state.items.filter((item) => item.watch.id !== watchId),
        }));
      },
      updateQuantity: (watchId, quantity) => {
        set((state) => ({
          items: state.items.map((item) => {
            if (item.watch.id !== watchId) return item;
            const max = getMaxOrderQuantity(item.watch);
            const next = Math.min(Math.max(1, quantity), max);
            return { ...item, quantity: next };
          }),
        }));
      },
      clearCart: () => set({ items: [], appliedCode: null }),
      setAppliedCode: (code) => set({ appliedCode: code }),
      getTotal: () => {
        return get().items.reduce(
          (total, item) => total + item.watch.price * item.quantity,
          0,
        );
      },
    }),
    {
      // Bumped: persist applied promo code; recompute savings from live catalog + codes.
      name: "hijo-lux-cart-v4",
    },
  ),
);
