import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Watch } from "../data/watches";

export interface CartItem {
  watch: Watch;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (watch: Watch, quantity?: number) => void;
  removeItem: (watchId: string) => void;
  updateQuantity: (watchId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (watch, quantity = 1) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.watch.id === watch.id,
          );
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.watch.id === watch.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item,
              ),
            };
          }
          return { items: [...state.items, { watch, quantity }] };
        });
      },
      removeItem: (watchId) => {
        set((state) => ({
          items: state.items.filter((item) => item.watch.id !== watchId),
        }));
      },
      updateQuantity: (watchId, quantity) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.watch.id === watchId ? { ...item, quantity } : item,
          ),
        }));
      },
      clearCart: () => set({ items: [] }),
      getTotal: () => {
        return get().items.reduce(
          (total, item) => total + item.watch.price * item.quantity,
          0,
        );
      },
    }),
    {
      // Bumped when cart `watch.id` semantics changed from Sanity `_id` to public slug.
      name: "hijo-lux-cart-v2",
    },
  ),
);
