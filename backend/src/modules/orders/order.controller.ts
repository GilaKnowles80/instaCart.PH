import { Request, Response } from 'express';
import { OrderService } from './order.service.js';
import { PaymentsController } from '../payments/payments.controller.js';

export const OrderController = {
  async createOrder(req: Request, res: Response) {
    try {
      const data = req.body as any;
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
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  },

  async getOrder(req: Request, res: Response) {
    try {
      const { orderId } = req.params as { orderId: string };
      const order = await OrderService.getOrderById(orderId);
      if (!order) {
        return res.status(404).json({ error: 'Order not found.' });
      }
      return res.status(200).json({ order });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  },

  async updateOrderStatus(req: Request, res: Response) {
    try {
      const { orderId } = req.params as { orderId: string };
      const { status } = req.body;
      const order = await OrderService.updateOrderStatus(orderId, status);
      if (!order) {
        return res.status(404).json({ error: 'Order not found.' });
      }
      return res.status(200).json({ message: 'Order status updated.', order });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  },

  async assignDriver(req: Request, res: Response) {
    try {
      const { orderId } = req.params as { orderId: string };
      const { driverId, driverName } = req.body;
      const order = await OrderService.assignDriver(orderId, driverId, driverName);
      if (!order) {
        return res.status(404).json({ error: 'Order not found.' });
      }
      return res.status(200).json({ message: 'Driver assigned.', order });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  },

  async getAllOrders(req: Request, res: Response) {
    try {
      const orders = await OrderService.getAllOrders();
      return res.status(200).json({ orders, count: orders.length });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  },

  async getCustomerOrders(req: Request, res: Response) {
    try {
      const { customerId } = req.params as { customerId: string };
      const orders = await OrderService.getOrdersByCustomer(customerId);
      return res.status(200).json({ orders, count: orders.length });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  },

  async getVendorOrders(req: Request, res: Response) {
    try {
      const { vendorId } = req.params as { vendorId: string };
      const orders = await OrderService.getOrdersByVendor(vendorId);
      return res.status(200).json({ orders, count: orders.length });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  },

  async getDriverOrders(req: Request, res: Response) {
    try {
      const { driverId } = req.params as { driverId: string };
      const orders = await OrderService.getOrdersByDriver(driverId);
      return res.status(200).json({ orders, count: orders.length });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  },

  async getDriverEarnings(req: Request, res: Response) {
    try {
      const { driverId } = req.params as { driverId: string };
      const earnings = await OrderService.getDriverEarnings(driverId);
      return res.status(200).json({ driverId, ...earnings });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  },

  async getPlatformEarnings(req: Request, res: Response) {
    try {
      const earnings = await OrderService.getPlatformEarnings();
      return res.status(200).json(earnings);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  },
};
