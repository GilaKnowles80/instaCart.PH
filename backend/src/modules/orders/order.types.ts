export type OrderStatus =
  | 'pending'
  | 'paid'
  | 'preparing'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface IOrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  vendorId: string;
  vendorName: string;
}

export interface IOrder {
  id: string;
  customerId: string;
  customerName: string;
  customerAddress: string;
  customerLatitude: number;
  customerLongitude: number;
  vendorId: string;
  vendorName: string;
  driverId?: string;
  driverName?: string;
  items: IOrderItem[];
  subtotal: number;
  deliveryFee: number;
  serviceCharge: number; // 2% platform fee
  vendorPlatformFee: number;
  totalPlatformEarnings: number;
  vendorNetPayout: number;
  grandTotal: number;
  distanceKm: number;
  ratePerKm: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paypalOrderId?: string;
  paypalCaptureId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateOrderRequest {
  customerId: string;
  items: IOrderItem[];
  subtotal: number;
  deliveryFee: number;
  serviceCharge: number;
  vendorPlatformFee: number;
  totalPlatformEarnings: number;
  vendorNetPayout: number;
  grandTotal: number;
  distanceKm: number;
  ratePerKm: number;
  vendorId: string;
  vendorName: string;
  customerName: string;
  customerAddress: string;
  customerLatitude: number;
  customerLongitude: number;
}
