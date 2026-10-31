import { OrderService } from './order.service.js';
export const OrderController = {
    async createOrder(req, res) {
        try {
            const data = req.body;
            const required = ['customerId', 'items', 'subtotal', 'grandTotal', 'vendorId', 'vendorName'];
            for (const field of required) {
                if (data[field] === undefined || data[field] === null) {
                    return res.status(400).json({ error: `${field} is required.` });
                }
            }
            const order = await OrderService.createOrder(data);
            return res.status(201).json({
                message: 'Order created successfully.',
                order,
            });
        }
        catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },
    async getOrder(req, res) {
        try {
            const { orderId } = req.params;
            const order = await OrderService.getOrderById(orderId);
            if (!order) {
                return res.status(404).json({ error: 'Order not found.' });
            }
            return res.status(200).json({ order });
        }
        catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },
    async updateOrderStatus(req, res) {
        try {
            const { orderId } = req.params;
            const { status } = req.body;
            const order = await OrderService.updateOrderStatus(orderId, status);
            if (!order) {
                return res.status(404).json({ error: 'Order not found.' });
            }
            return res.status(200).json({ message: 'Order status updated.', order });
        }
        catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },
    async assignDriver(req, res) {
        try {
            const { orderId } = req.params;
            const { driverId, driverName } = req.body;
            const order = await OrderService.assignDriver(orderId, driverId, driverName);
            if (!order) {
                return res.status(404).json({ error: 'Order not found.' });
            }
            return res.status(200).json({ message: 'Driver assigned.', order });
        }
        catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },
    async getAllOrders(req, res) {
        try {
            const orders = await OrderService.getAllOrders();
            return res.status(200).json({ orders, count: orders.length });
        }
        catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },
    async getCustomerOrders(req, res) {
        try {
            const { customerId } = req.params;
            const orders = await OrderService.getOrdersByCustomer(customerId);
            return res.status(200).json({ orders, count: orders.length });
        }
        catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },
    async getVendorOrders(req, res) {
        try {
            const { vendorId } = req.params;
            const orders = await OrderService.getOrdersByVendor(vendorId);
            return res.status(200).json({ orders, count: orders.length });
        }
        catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },
    async getDriverOrders(req, res) {
        try {
            const { driverId } = req.params;
            const orders = await OrderService.getOrdersByDriver(driverId);
            return res.status(200).json({ orders, count: orders.length });
        }
        catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },
    async getDriverEarnings(req, res) {
        try {
            const { driverId } = req.params;
            const earnings = await OrderService.getDriverEarnings(driverId);
            return res.status(200).json({ driverId, ...earnings });
        }
        catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },
    async getPlatformEarnings(req, res) {
        try {
            const earnings = await OrderService.getPlatformEarnings();
            return res.status(200).json(earnings);
        }
        catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },
};
//# sourceMappingURL=order.controller.js.map