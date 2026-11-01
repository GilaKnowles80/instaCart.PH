import { Router } from 'express';
import { DeliveryReceiptController } from './deliveryReceipt.controller.js';
import { authenticateToken, authorizeRoles } from '../auth/auth.middleware.js';
import { apiRateLimiter } from '../../middleware/rateLimiter.js';
import { validateParams } from '../../middleware/validate.js';
import { z } from 'zod';

const router = Router();

const OrderIdSchema = z.object({
  orderId: z.string().min(1, 'Order ID is required'),
});

// Vendor - upload delivery receipt for an order
router.post(
  '/orders/:orderId/receipts',
  authenticateToken,
  authorizeRoles('vendor', 'admin'),
  apiRateLimiter,
  validateParams(OrderIdSchema),
  DeliveryReceiptController.uploadReceipt
);

// Get receipts for an order
router.get(
  '/orders/:orderId/receipts',
  authenticateToken,
  validateParams(OrderIdSchema),
  DeliveryReceiptController.getOrderReceipts
);

// Vendor - get own receipts
router.get('/vendor/receipts', authenticateToken, authorizeRoles('vendor'), DeliveryReceiptController.getVendorReceipts);

export default router;