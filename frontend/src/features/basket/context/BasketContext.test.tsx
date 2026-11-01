import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { BasketProvider, useBasket } from './BasketContext';

describe('BasketContext', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <BasketProvider>{children}</BasketProvider>
  );

  beforeEach(() => {
    // Each test gets a fresh provider via renderHook
  });

  it('should start with an empty cart', () => {
    const { result } = renderHook(() => useBasket(), { wrapper });

    expect(result.current.cart).toEqual([]);
    expect(result.current.getCartTotal()).toBe(0);
  });

  it('should add items to cart', () => {
    const { result } = renderHook(() => useBasket(), { wrapper });

    act(() => {
      result.current.addToCart({ id: 'item_1', name: 'Fresh Milk', price: 80, vendorId: 'vendor_1', vendorName: 'Test Vendor' });
    });

    expect(result.current.cart).toHaveLength(1);
    expect(result.current.cart[0]).toMatchObject({
      id: 'item_1',
      name: 'Fresh Milk',
      price: 80,
      quantity: 1,
    });
    expect(result.current.getCartTotal()).toBe(80);
  });

  it('should increment quantity when adding the same item twice', () => {
    const { result } = renderHook(() => useBasket(), { wrapper });

    act(() => {
      result.current.addToCart({ id: 'item_1', name: 'Fresh Milk', price: 80, vendorId: 'vendor_1', vendorName: 'Test Vendor' });
      result.current.addToCart({ id: 'item_1', name: 'Fresh Milk', price: 80, vendorId: 'vendor_1', vendorName: 'Test Vendor' });
    });

    expect(result.current.cart).toHaveLength(1);
    expect(result.current.cart[0].quantity).toBe(2);
    expect(result.current.getCartTotal()).toBe(160);
  });

  it('should remove an item from cart', () => {
    const { result } = renderHook(() => useBasket(), { wrapper });

    act(() => {
      result.current.addToCart({ id: 'item_1', name: 'Fresh Milk', price: 80, vendorId: 'vendor_1', vendorName: 'Test Vendor' });
      result.current.addToCart({ id: 'item_2', name: 'Bread', price: 45, vendorId: 'vendor_1', vendorName: 'Test Vendor' });
      result.current.removeFromCart('item_1');
    });

    expect(result.current.cart).toHaveLength(1);
    expect(result.current.cart[0].id).toBe('item_2');
    expect(result.current.getCartTotal()).toBe(45);
  });

  it('should clear the cart', () => {
    const { result } = renderHook(() => useBasket(), { wrapper });

    act(() => {
      result.current.addToCart({ id: 'item_1', name: 'Fresh Milk', price: 80, vendorId: 'vendor_1', vendorName: 'Test Vendor' });
      result.current.clearCart();
    });

    expect(result.current.cart).toEqual([]);
    expect(result.current.getCartTotal()).toBe(0);
  });

  it('should calculate total correctly for multiple items', () => {
    const { result } = renderHook(() => useBasket(), { wrapper });

    act(() => {
      result.current.addToCart({ id: 'item_1', name: 'Fresh Milk', price: 80, vendorId: 'vendor_1', vendorName: 'Test Vendor' });
      result.current.addToCart({ id: 'item_2', name: 'Bread', price: 45, vendorId: 'vendor_1', vendorName: 'Test Vendor' });
      result.current.addToCart({ id: 'item_2', name: 'Bread', price: 45, vendorId: 'vendor_1', vendorName: 'Test Vendor' });
    });

    expect(result.current.getCartTotal()).toBe(170); // 80 + (45 * 2)
  });
});