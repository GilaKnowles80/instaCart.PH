/// <reference types="vite/client" />

export interface ICartItem {
  id: string;
  productId?: string;
  vendorId: string;
  vendorName: string;
  name: string;
  price: number;
  quantity: number;
  subtotal?: number;
}

export interface ICheckoutResponse {
  success: boolean;
  orderId?: string;
  order?: any;
  vendorSummaries?: any[];
  escrowSplits?: any[];
  itemsCount: number;
  paymentMethod?: string;
  errors?: string[];
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

export const checkoutApi = {
  /**
   * Dispatches the current basket payload straight to the payment fraud pipeline
   */
  async submitOrder(
    items: ICartItem[],
    userId: string,
    customerName: string,
    customerAddress: string,
    customerLatitude: number,
    customerLongitude: number,
    deliveryFee: number = 50,
    distanceKm: number = 5,
    ratePerKm: number = 10,
    paymentMethod: 'gcash' | 'maya' | 'paypal' | 'cash' | 'qr' = 'paypal'
  ): Promise<ICheckoutResponse> {
    const response = await fetch(`${API_BASE_URL}/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items,
        customerId: userId,
        customerName,
        customerAddress,
        customerLatitude,
        customerLongitude,
        deliveryFee,
        distanceKm,
        ratePerKm,
        paymentMethod,
        paypalOrderId: undefined,
        paypalCaptureId: undefined,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Network layer failed to process transaction checkout.');
    }

    return response.json();
  },

  async capturePayment(orderId: string, paypalOrderId: string, paypalCaptureId: string): Promise<ICheckoutResponse> {
    const response = await fetch(`${API_BASE_URL}/checkout/capture-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ orderId, paypalOrderId, paypalCaptureId }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Payment capture failed.');
    }

    return response.json();
  },
};