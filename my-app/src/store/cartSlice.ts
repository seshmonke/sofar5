import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Product } from '../data/products';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  totalPrice: number;
}

const STORAGE_KEY = 'assortiShop_cart';

const initialState: CartState = {
  items: [],
  totalPrice: 0
};

const calculateTotalPrice = (items: CartItem[]): number => {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
};

const saveToLocalStorage = (items: CartItem[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Product>) => {
      const product = action.payload;
      const existingItem = state.items.find(item => item.id === product.id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: 1
        });
      }

      state.totalPrice = calculateTotalPrice(state.items);
      saveToLocalStorage(state.items);
    },

    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      state.totalPrice = calculateTotalPrice(state.items);
      saveToLocalStorage(state.items);
    },

    updateQuantity: (state, action: PayloadAction<{ id: number; quantity: number }>) => {
      const item = state.items.find(item => item.id === action.payload.id);
      if (item) {
        if (action.payload.quantity <= 0) {
          state.items = state.items.filter(item => item.id !== action.payload.id);
        } else {
          item.quantity = action.payload.quantity;
        }
        state.totalPrice = calculateTotalPrice(state.items);
        saveToLocalStorage(state.items);
      }
    },

    clearCart: (state) => {
      state.items = [];
      state.totalPrice = 0;
      saveToLocalStorage([]);
    },

    loadFromLocalStorage: (state) => {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          state.items = JSON.parse(saved);
          state.totalPrice = calculateTotalPrice(state.items);
        } catch (error) {
          console.error('Failed to load cart from localStorage:', error);
        }
      }
    }
  }
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, loadFromLocalStorage } = cartSlice.actions;
export const cartReducer = cartSlice.reducer;
