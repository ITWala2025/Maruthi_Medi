// src/lib/stores/useCartStore.ts
'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '../mock/types';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  prescriptionFile: string | null;
  isOpen: boolean;
  
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  setPrescriptionFile: (file: string | null) => void;
  setIsOpen: (isOpen: boolean) => void;
  
  // Computed getters
  getTotalItems: () => number;
  getSubtotal: () => number;
  hasPrescriptionItems: () => boolean;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      prescriptionFile: null,
      isOpen: false,

      addItem: (product: Product, quantity = 1) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) => item.product.id === product.id
          );

          if (existingIndex > -1) {
            const updated = [...state.items];
            updated[existingIndex].quantity += quantity;
            return { items: updated, isOpen: true };
          }

          return {
            items: [...state.items, { product, quantity }],
            isOpen: true,
          };
        });
      },

      removeItem: (productId: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }));
      },

      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [], prescriptionFile: null });
      },

      setPrescriptionFile: (file: string | null) => {
        set({ prescriptionFile: file });
      },

      setIsOpen: (isOpen: boolean) => {
        set({ isOpen });
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce(
          (sum, item) => sum + item.product.salePrice * item.quantity,
          0
        );
      },

      hasPrescriptionItems: () => {
        return get().items.some((item) => item.product.prescriptionRequired);
      },
    }),
    {
      name: 'maruthi-cart-storage',
      partialize: (state) => ({
        items: state.items,
        prescriptionFile: state.prescriptionFile,
      }),
    }
  )
);
