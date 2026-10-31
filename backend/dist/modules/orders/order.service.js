import { OrderRepository, sql } from '../../db/repository.js';
export class OrderService {
    static async createOrder(data) {
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
        return order;
    }
    static async getOrderById(orderId) {
        const order = await OrderRepository.findById(orderId);
        return order ? order : null;
    }
    static async updateOrderStatus(orderId, status) {
        const order = await OrderRepository.updateStatus(orderId, status);
        return order ? order : null;
    }
    static async updatePaymentStatus(orderId, paymentStatus, paypalOrderId, paypalCaptureId) {
        const order = await OrderRepository.findById(orderId);
        if (!order)
            return null;
        const newStatus = paymentStatus === 'paid' ? 'paid' : order.status;
        const updated = await sql `
      UPDATE orders SET payment_status = ${paymentStatus}, paypal_order_id = ${paypalOrderId || null}, paypal_capture_id = ${paypalCaptureId || null}, status = ${newStatus}, updated_at = NOW() WHERE id = ${orderId} RETURNING *
    `;
        return updated[0] ? updated[0] : null;
    }
    static async assignDriver(orderId, driverId, driverName) {
        const order = await OrderRepository.assignDriver(orderId, driverId, driverName);
        return order ? order : null;
    }
    static async getAllOrders() {
        const orders = await OrderRepository.getAll();
        return orders;
    }
    static async getOrdersByCustomer(customerId) {
        const orders = await OrderRepository.getByCustomer(customerId);
        return orders;
    }
    static async getOrdersByVendor(vendorId) {
        const orders = await OrderRepository.getByVendor(vendorId);
        return orders;
    }
    static async getOrdersByDriver(driverId) {
        const orders = await OrderRepository.getByDriver(driverId);
        return orders;
    }
    static async getDriverEarnings(driverId) {
        const driverOrders = await OrderRepository.getByDriver(driverId);
        const delivered = driverOrders.filter((o) => o.status === 'delivered');
        const totalEarnings = delivered.reduce((sum, o) => sum + Number(o.delivery_fee), 0);
        return { totalEarnings, totalDeliveries: delivered.length };
    }
    static async getPlatformEarnings() {
        const orders = await OrderRepository.getAll();
        const paidOrders = orders.filter((o) => o.payment_status === 'paid');
        const total = paidOrders.reduce((sum, o) => sum + Number(o.total_platform_earnings), 0);
        return { total, orderCount: paidOrders.length };
    }
}
//# sourceMappingURL=order.service.js.map