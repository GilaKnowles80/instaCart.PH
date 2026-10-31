import { describe, it, expect } from 'vitest';
import { CheckoutService } from './checkout.service.js';

describe('CheckoutService.processOrder', () => {
  it('should return success with a transaction ID and item count', async () => {
    const cartItems = [
      { id: 'item_1', name: 'Fresh Milk', price: 80, quantity: 2 },
      { id: 'item_2', name: 'Bread', price: 45, quantity: 1 },
    ];

    const result = await CheckoutService.processOrder(cartItems, 'user_demo_123');

    expect(result.success).toBe(true);
    expect(result.transactionId).toMatch(/^TXN-[A-Z0-9]+$/);
    expect(result.itemsCount).toBe(2);
  });

  it('should generate a unique transaction ID on each call', async () => {
    const cartItems = [{ id: 'item_1', name: 'Test Item', price: 10, quantity: 1 }];

    const result1 = await CheckoutService.processOrder(cartItems, 'user_1');
    const result2 = await CheckoutService.processOrder(cartItems, 'user_2');

    expect(result1.transactionId).not.toBe(result2.transactionId);
  });

  it('should handle empty cart', async () => {
    const result = await CheckoutService.processOrder([], 'user_demo_123');

    expect(result.success).toBe(true);
    expect(result.itemsCount).toBe(0);
    expect(result.transactionId).toBeDefined();
  });
});