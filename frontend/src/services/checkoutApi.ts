/// <reference types="vite/client" />

export interface ICartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface ICheckoutResponse {
  success: boolean;
  transactionId: string;
  itemsCount: number;
  paymentMethod?: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

export const checkoutApi = {
  /**
   * Dispatches the current basket payload straight to the payment fraud pipeline
   */
  async submitOrder(
    items: ICartItem[],
    userId: string,
    paymentMethod: 'gcash' | 'maya' | 'paypal' | 'cash' | 'qr' = 'paypal'
  ): Promise<ICheckoutResponse> {
    const response = await fetch(`${API_BASE_URL}/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ items, userId, paymentMethod }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Network layer failed to process transaction checkout.');
    }

    return response.json();
  },
};