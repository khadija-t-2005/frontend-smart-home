import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItemDTO {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  variantId?: number;        // optionnel
  variantColor?: string;     // optionnel
  variantImageUrl?: string;  // optionnel
}

export interface CartDTO {
  id: number;
  userId: number;
  items: CartItemDTO[];
}

interface CartStore {
  cart: CartDTO | null;
  setCart: (cart: CartDTO) => void;
  clearCart: () => void;
  itemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: null,
      setCart: (cart) => set({ cart }),
      clearCart: () => set({ cart: null }),
      itemCount: () =>
        get().cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0,
    }),
    { name: 'cart-storage' }
  )
);