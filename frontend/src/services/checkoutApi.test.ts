import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { checkoutApi, type ICartItem, type ICheckoutResponse } from './checkoutApi.ts';

const mockFetch = vi.fn() as ReturnType<typeof vi.fn>;

beforeEach(() => {
  vi.stubGlobal('fetch', mockFetch);
});

afterEach(() => {
  vi.unstubAllGlobals();
  mockFetch.mockReset();
});

describe('checkoutApi.submitOrder', () => {
  const cartItems: ICartItem[] = [
    { id: 'item_1', name: 'Fresh Milk', price: 80, quantity: 2 },
    { id: 'item_2', name: 'Bread', price: 45, quantity: 1 },
  ];

  it('should POST to the checkout endpoint with correct payload', async () => {
    const mockResponse: ICheckoutResponse = {
      success: true,
      transactionId: 'TXN-ABC123',
      itemsCount: 3,
      paymentMethod: 'gcash',
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    const result = await checkoutApi.submitOrder(cartItems, 'user_demo_123', 'gcash');

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const [url, options] = mockFetch.mock.calls[0];
    expect(url).toContain('/checkout');
    expect(options?.method).toBe('POST');
    expect(options?.headers?.['Content-Type']).toBe('application/json');
    expect(result).toEqual(mockResponse);
  });

  it('should throw an error when the response is not ok', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Insufficient funds' }),
    } as Response);

    await expect(checkoutApi.submitOrder(cartItems, 'user_demo_123', 'cash')).rejects.toThrow(
      'Insufficient funds'
    );
  });

  it('should default payment method to paypal', async () => {
    const mockResponse: ICheckoutResponse = {
      success: true,
      transactionId: 'TXN-DEF456',
      itemsCount: 1,
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    await checkoutApi.submitOrder(cartItems.slice(0, 1), 'user_demo_123');

    const [, options] = mockFetch.mock.calls[0];
    const body = JSON.parse(options?.body as string);
    expect(body.paymentMethod).toBe('paypal');
  });

  it('should export ICartItem and ICheckoutResponse interfaces', () => {
    const item: ICartItem = { id: '1', name: 'Test', price: 10, quantity: 1 };
    const response: ICheckoutResponse = { success: true, transactionId: 'TXN-1', itemsCount: 1 };

    expect(item.id).toBe('1');
    expect(response.success).toBe(true);
  });
});