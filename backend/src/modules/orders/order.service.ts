import type { IOrder, CreateOrderRequest, OrderStatus, PaymentStatus } from './order.types.js';
import { OrderRepository, sql } from '../../db/repository.js';

export class OrderService {
  static async createOrder(data: CreateOrderRequest): Promise<IOrder> {
    const order = await OrderRepository.create({
      id: `order_${Math.random().toString(36).slice(2, 11)}`,
      customerId: data.customerId,
      customerName: data.customerName,
      customerAddress: data.customerAddress,
      customerLatitude: data.customerLatitude,
      customerLongitude: data.customerLongitude,
      vendorId: data.vendorId,
      vendorName: data.vendorName,
      items: data.items,
      subtotal: data.subtotal,
      deliveryFee: data.deliveryFee,
      serviceCharge: data.serviceCharge,
      vendorPlatformFee: data.vendorPlatformFee,
      totalPlatformEarnings: data.totalPlatformEarnings,
      vendorNetPayout: data.vendorNetPayout,
      grandTotal: data.grandTotal,
      distanceKm: data.distanceKm,
      ratePerKm: data.ratePerKm,
      status: 'pending',
      paymentStatus: 'pending',
    });
    return order as unknown as IOrder;
  }

  static async getOrderById(orderId: string): Promise<IOrder | null> {
    const order = await OrderRepository.findById(orderId);
    return order ? (order as unknown as IOrder) : null;
  }

  static async updateOrderStatus(orderId: string, status: OrderStatus): Promise<IOrder | null> {
    const order = await OrderRepository.updateStatus(orderId, status);
    return order ? (order as unknown as IOrder) : null;
  }

  static async updatePaymentStatus(
    orderId: string,
    paymentStatus: PaymentStatus,
    paypalOrderId?: string,
    paypalCaptureId?: string
  ): Promise<IOrder | null> {
    const order = await OrderRepository.findById(orderId);
    if (!order) return null;

    const newStatus = paymentStatus === 'paid' ? 'paid' : order.status;
    const updated = await sql`
      UPDATE orders SET payment_status = ${paymentStatus}, paypal_order_id = ${paypalOrderId || null}, paypal_capture_id = ${paypalCaptureId || null}, status = ${newStatus}, updated_at = NOW() WHERE id = ${orderId} RETURNING *
    `;
    return updated[0] ? (updated[0] as unknown as IOrder) : null;
  }

  static async assignDriver(orderId: string, driverId: string, driverName: string): Promise<IOrder | null> {
    const order = await OrderRepository.assignDriver(orderId, driverId, driverName);
    return order ? (order as unknown as IOrder) : null;
  }

  static async getAllOrders(): Promise<IOrder[]> {
    const orders = await OrderRepository.getAll();
    return orders as unknown as IOrder[];
  }

  static async getOrdersByCustomer(customerId: string): Promise<IOrder[]> {
    const orders = await OrderRepository.getByCustomer(customerId);
    return orders as unknown as IOrder[];
  }

  static async getOrdersByVendor(vendorId: string): Promise<IOrder[]> {
    const orders = await OrderRepository.getByVendor(vendorId);
    return orders as unknown as IOrder[];
  }

  static async getOrdersByDriver(driverId: string): Promise<IOrder[]> {
    const orders = await OrderRepository.getByDriver(driverId);
    return orders as unknown as IOrder[];
  }

  static async getDriverEarnings(driverId: string): Promise<{ totalEarnings: number; totalDeliveries: number }> {
    const driverOrders = await OrderRepository.getByDriver(driverId);
    const delivered = driverOrders.filter((o: any) => o.status === 'delivered');
    const totalEarnings = delivered.reduce((sum: number, o: any) => sum + Number(o.delivery_fee), 0);
    return { totalEarnings, totalDeliveries: delivered.length };
  }

  static async getPlatformEarnings(): Promise<{ total: number; orderCount: number }> {
    const orders = await OrderRepository.getAll();
    const paidOrders = orders.filter((o: any) => o.payment_status === 'paid');
    const total = paidOrders.reduce((sum: number, o: any) => sum + Number(o.total_platform_earnings), 0);
    return { total, orderCount: paidOrders.length };
  }
}
