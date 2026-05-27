import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  volume: string;
  origin?: string;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (id: string, volume: string) => void;
  updateQuantity: (id: string, volume: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  total: () => number;
  itemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      addItem: (item) => {
        const { items } = get();
        const existing = items.find(
          (i) => i.id === item.id && i.volume === item.volume
        );
        if (existing) {
          set({
            items: items.map((i) =>
              i.id === item.id && i.volume === item.volume
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
          });
        } else {
          set({ items: [...items, item] });
        }
      },
      removeItem: (id, volume) =>
        set({ items: get().items.filter((i) => !(i.id === id && i.volume === volume)) }),
      updateQuantity: (id, volume, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id, volume);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.id === id && i.volume === volume ? { ...i, quantity } : i
          ),
        });
      },
      clearCart: () => set({ items: [] }),
      toggleCart: () => set({ isOpen: !get().isOpen }),
      total: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
      itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: 'beeamrit-cart' }
  )
);
