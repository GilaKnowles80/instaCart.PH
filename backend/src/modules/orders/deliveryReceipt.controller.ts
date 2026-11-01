import { Request, Response } from 'express';
import { DeliveryReceiptRepository } from '../../db/orderItemRepository.js';
import { OrderRepository } from '../../db/repository.js';
import { authenticateToken, authorizeRoles } from '../auth/auth.middleware.js';
import { apiRateLimiter } from '../../middleware/rateLimiter.js';
import { z } from 'zod';

const DeliveryReceiptSchema = z.object({
  receiptUrl: z.string().url('Invalid receipt URL'),
  trackingNumber: z.string().optional(),
  deliveryNotes: z.string().optional(),
});

export const DeliveryReceiptController = {
  async uploadReceipt(req: Request, res: Response) {
    try {
      const { orderId } = req.params as { orderId: string };
      const vendorId = (req as any).user?.userId;
      const data = DeliveryReceiptSchema.parse(req.body);

      // Verify the order belongs to this vendor
      const order = await OrderRepository.findById(orderId);
      if (!order) {
        return res.status(404).json({ error: 'Order not found.' });
      }
      if (order.vendor_id !== vendorId && (req as any).user?.role !== 'admin') {
        return res.status(403).json({ error: 'Not authorized to upload receipt for this order.' });
      }

      const receipt = await DeliveryReceiptRepository.create({
        id: `rcpt_${Math.random().toString(36).slice(2, 11)}`,
        orderId,
        vendorId,
        receiptUrl: data.receiptUrl,
        trackingNumber: data.trackingNumber,
        deliveryNotes: data.deliveryNotes,
        deliveredAt: new Date(),
      });

      return res.status(201).json({ message: 'Delivery receipt uploaded successfully.', receipt });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  },

  async getOrderReceipts(req: Request, res: Response) {
    try {
      const { orderId } = req.params as { orderId: string };
      const receipts = await DeliveryReceiptRepository.getByOrder(orderId);
      return res.status(200).json({ receipts, count: receipts.length });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  },

  async getVendorReceipts(req: Request, res: Response) {
    try {
      const vendorId = (req as any).user?.userId;
      const receipts = await DeliveryReceiptRepository.getByVendor(vendorId);
      return res.status(200).json({ receipts, count: receipts.length });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  },
};