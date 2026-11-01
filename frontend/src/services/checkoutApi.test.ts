import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { checkoutApi, type ICartItem, type ICheckoutResponse } from './checkoutApi';

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
    { id: 'item_1', productId: 'prod_1', vendorId: 'vendor_1', vendorName: 'Fresh Market', name: 'Fresh Milk', price: 80, quantity: 2 },
    { id: 'item_2', productId: 'prod_2', vendorId: 'vendor_1', vendorName: 'Fresh Market', name: 'Bread', price: 45, quantity: 1 },
  ];

  const mockResponse: ICheckoutResponse = {
    success: true,
    orderId: 'order_ABC123',
    itemsCount: 3,
    paymentMethod: 'gcash',
  };

  it('should POST to the checkout endpoint with correct payload', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    const result = await checkoutApi.submitOrder(
      cartItems,
      'user_demo_123',
      'Demo User',
      '123 Main St',
      14.5995,
      120.9842,
      50,
      5,
      10,
      'gcash'
    );

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

    await expect(checkoutApi.submitOrder(
      cartItems,
      'user_demo_123',
      'Demo User',
      '123 Main St',
      14.5995,
      120.9842,
      50,
      5,
      10,
      'cash'
    )).rejects.toThrow('Insufficient funds');
  });

  it('should default payment method to paypal', async () => {
    const mockResponse: ICheckoutResponse = {
      success: true,
      orderId: 'order_DEF456',
      itemsCount: 1,
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    await checkoutApi.submitOrder(
      cartItems.slice(0, 1),
      'user_demo_123',
      'Demo User',
      '123 Main St',
      14.5995,
      120.9842,
      50,
      5,
      10
    );

    const [, options] = mockFetch.mock.calls[0];
    const body = JSON.parse(options?.body as string);
    expect(body.paymentMethod).toBe('paypal');
  });

  it('should export ICartItem and ICheckoutResponse interfaces', () => {
    const item: ICartItem = { id: '1', productId: 'prod_1', vendorId: 'vendor_1', vendorName: 'Test', name: 'Test', price: 10, quantity: 1 };
    const response: ICheckoutResponse = { success: true, orderId: 'TXN-1', itemsCount: 1 };

    expect(item.id).toBe('1');
    expect(response.success).toBe(true);
  });
});