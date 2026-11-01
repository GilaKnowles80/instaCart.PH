/// <reference types="vite/client" />

import type { ICartItem, ICheckoutResponse } from './checkoutApi';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

export interface PayPalOrderRequest {
  intent: 'CAPTURE';
  purchase_units: Array<{
    amount: { currency_code: string; value: string; breakdown?: { item_total?: { currency_code: string; value: string } } };
    description: string;
    custom_id?: string;
  }>;
  application_context: {
    brand_name: string;
    landing_page: 'LOGIN' | 'BILLING';
    shipping_preference: 'NO_SHIPPING' | 'GET_FROM_FILE' | 'SET_PROVIDED_ADDRESS';
    user_action: 'PAY_NOW' | 'CONTINUE';
    return_url: string;
    cancel_url: string;
  };
}

export interface PayPalOrderResponse {
  id: string;
  status: string;
  links: Array<{ href: string; rel: string; method: string }>;
}

export interface PayPalCaptureResponse {
  id: string;
  status: string;
  purchase_units: Array<{
    payments: {
      captures: Array<{
        id: string;
        status: string;
        amount: { currency_code: string; value: string };
      }>;
    };
  }>;
}

export interface PayPalLiveConfig {
  clientId: string;
  environment: 'sandbox' | 'live';
  currency: string;
  brandName: string;
}

export class CheckoutApiLive {
  private config: PayPalLiveConfig;

  constructor(config: PayPalLiveConfig) {
    this.config = config;
  }

  private getPayPalBaseUrl(): string {
    return this.config.environment === 'live'
      ? 'https://api-m.paypal.com'
      : 'https://api-m.sandbox.paypal.com';
  }

  async createOrder(
    items: ICartItem[],
    customerId: string,
    customerName: string,
    customerAddress: string,
    customerLatitude: number,
    customerLongitude: number,
    deliveryFee: number = 50,
    distanceKm: number = 5,
    ratePerKm: number = 10
  ): Promise<ICheckoutResponse> {
    const response = await fetch(`${API_BASE_URL}/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items,
        customerId,
        customerName,
        customerAddress,
        customerLatitude,
        customerLongitude,
        deliveryFee,
        distanceKm,
        ratePerKm,
        paymentMethod: 'paypal',
        paypalOrderId: undefined,
        paypalCaptureId: undefined,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'PayPal order creation failed.');
    }

    return response.json();
  }

  async createPayPalOrder(
    amount: number,
    currency: string = 'PHP',
    description: string = 'instaCart.PH Order',
    returnUrl?: string,
    cancelUrl?: string
  ): Promise<PayPalOrderResponse> {
    const returnUrlResolved = returnUrl || `${window.location.origin}/payment/success`;

  async capturePayPalOrder(
    orderId: string,
    backendOrderId?: string,
    paypalOrderId?: string
  ): Promise<PayPalCaptureResponse> {
    const baseUrl = this.getPayPalBaseUrl();

    const captureResponse = await fetch(`${baseUrl}/v2/checkout/orders/${orderId}/capture`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${await this.getAccessToken()}`,
        'Content-Type': 'application/json',
      },
    });

    if (!captureResponse.ok) {
      const errorData = await captureResponse.json().catch(() => ({}));
      throw new Error(errorData.message || `PayPal capture failed: ${captureResponse.status}`);
    }

    const capture: PayPalCaptureResponse = await captureResponse.json();

    if (backendOrderId && paypalOrderId) {
      const captureId = capture.purchase_units?.[0]?.payments?.captures?.[0]?.id;
      if (captureId) {
        const backendResponse = await fetch(`${API_BASE_URL}/checkout/capture-payment`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: backendOrderId,
            paypalOrderId,
            paypalCaptureId: captureId,
          }),
        });

        if (!backendResponse.ok) {
          const errorData = await backendResponse.json().catch(() => ({}));
          throw new Error(errorData.error || 'Backend payment finalization failed.');
        }
      }
    }

    return capture;
  }

  private async getAccessToken(): Promise<string> {
    const auth = Buffer.from(
      `${this.config.clientId}:${import.meta.env.VITE_PAYPAL_CLIENT_SECRET || ''}`
    ).toString('base64');

    const baseUrl = this.getPayPalBaseUrl();

    const response = await fetch(`${baseUrl}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error_description || 'PayPal authentication failed.');
    }

    const data = await response.json();
    return data.access_token;
  }

  getApprovalUrl(order: PayPalOrderResponse): string | null {
    const approvalLink = order.links?.find((l) => l.rel === 'approve');
    return approvalLink ? approvalLink.href : null;
  }

  loadPayPalSDK(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (window.paypal?.Buttons) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${this.config.clientId}&currency=${this.config.currency}&env=${this.config.environment}`;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load PayPal SDK.'));
      document.head.appendChild(script);
    });
  }
    const cancelUrlResolved = cancelUrl || `${window.location.origin}/payment/cancel`;

    const requestBody: PayPalOrderRequest = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: { currency_code: currency, value: amount.toFixed(2) },
          description,
        },
      ],
      application_context: {
        brand_name: this.config.brandName,
        landing_page: 'LOGIN',
        shipping_preference: 'NO_SHIPPING',
        user_action: 'PAY_NOW',
        return_url: returnUrlResolved,
        cancel_url: cancelUrlResolved,
      },
    };

    const baseUrl = this.getPayPalBaseUrl();

    const response = await fetch(`${baseUrl}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${await this.getAccessToken()}`,
        'Content-Type': 'application/json',
        'PayPal-Request-Id': `instaCart-${Date.now()}`,
      },
      body: JSON.stringify(requestBody),
    });

  async renderPayPalButtons(
    containerId: string,
    orderData: {
      items: ICartItem[];
      customerId: string;
      customerName: string;
      customerAddress: string;
      customerLatitude: number;
      customerLongitude: number;
      deliveryFee: number;
      distanceKm: number;
      ratePerKm: number;
    },
    onApprove: (data: any) => void,
    onError: (err: Error) => void
  ): Promise<void> {
    await this.loadPayPalSDK();

    const paypal = (window as any).paypal;

    if (!paypal?.Buttons) {
      onError(new Error('PayPal SDK failed to load.'));
      return;
    }

    paypal
      .Buttons({
        createOrder: async (actions: any) => {
          const result = await this.createOrder(
            orderData.items,
            orderData.customerId,
            orderData.customerName,
            orderData.customerAddress,
            orderData.customerLatitude,
            orderData.customerLongitude,
            orderData.deliveryFee,
            orderData.distanceKm,
            orderData.ratePerKm
          );

          if (!result.success || !result.orderId) {
            throw new Error(result.errors?.join(', ') || 'Order creation failed.');
          }

          const grandTotal =
            orderData.items.reduce((sum, item) => sum + item.price * item.quantity, 0) +
            orderData.deliveryFee;

          const paypalOrder = await this.createPayPalOrder(
            grandTotal,
            this.config.currency,
            `instaCart.PH Order ${result.orderId}`,
            `${window.location.origin}/payment/success?orderId=${result.orderId}`,
            `${window.location.origin}/payment/cancel?orderId=${result.orderId}`
          );

          return paypalOrder.id;
        },
        onApprove: async (data: any) => {
          try {
            const capture = await this.capturePayPalOrder(
              data.orderID,
              `order_${Date.now()}`,
              data.orderID
            );

            onApprove({
              orderId: data.orderID,
              captureId: capture.purchase_units?.[0]?.payments?.captures?.[0]?.id,
              status: capture.status,
              amount: capture.purchase_units?.[0]?.payments?.captures?.[0]?.amount,
            });
          } catch (err: any) {
            onError(err);
          }
        },
        onError: (err: any) => {
          onError(err);
        },
      })
      .render(`#${containerId}`);
  }
}

const defaultConfig: PayPalLiveConfig = {
  clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID || '',
  environment:
    (import.meta.env.VITE_PAYPAL_ENVIRONMENT as 'sandbox' | 'live') || 'sandbox',
  currency: import.meta.env.VITE_PAYPAL_CURRENCY || 'PHP',
  brandName: import.meta.env.VITE_PAYPAL_BRAND_NAME || 'instaCart.PH',
};

export const checkoutApiLive = new CheckoutApiLive(defaultConfig);

export async function initPayPalLiveCheckout(
  clientId?: string,
  environment: 'sandbox' | 'live' = 'sandbox'
): Promise<CheckoutApiLive> {
  return new CheckoutApiLive({
    clientId: clientId || defaultConfig.clientId,
    environment,
    currency: defaultConfig.currency,
    brandName: defaultConfig.brandName,
  });
}

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `PayPal API error: ${response.status}`);
    }

    return response.json();
  }