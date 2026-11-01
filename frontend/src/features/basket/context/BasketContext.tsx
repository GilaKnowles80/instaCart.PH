import React, { createContext, useContext, useState } from 'react';
import type { ICartItem } from '../../../services/checkoutApi';

interface BasketContextValue {
  cart: ICartItem[];
  addToCart: (item: Omit<ICartItem, 'quantity'>) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartByVendor: () => Map<string, ICartItem[]>;
}

const BasketContext = createContext<BasketContextValue | undefined>(undefined);

export const BasketProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [cart, setCart] = useState<ICartItem[]>([]);

  const addToCart = (item: Omit<ICartItem, 'quantity'>) => setCart((current) => {
    const existing = current.find((entry) => entry.id === item.id);
    if (existing) {
      return current.map((entry) => entry.id === item.id ? { ...entry, quantity: entry.quantity + 1 } : entry);
    }
    return [...current, { ...item, quantity: 1 }];
  });

  const removeFromCart = (id: string) => setCart((current) => current.filter((item) => item.id !== id));
  const clearCart = () => setCart([]);
  const getCartTotal = () => cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const getCartByVendor = () => {
    const grouped = new Map<string, ICartItem[]>();
    for (const item of cart) {
      const existing = grouped.get(item.vendorId) || [];
      existing.push(item);
      grouped.set(item.vendorId, existing);
    }
    return grouped;
  };

  return <BasketContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, getCartTotal, getCartByVendor }}>{children}</BasketContext.Provider>;
};

export const useBasket = (): BasketContextValue => {
  const context = useContext(BasketContext);
  if (!context) throw new Error('useBasket must be wrapped inside a BasketProvider.');
  return context;
};
