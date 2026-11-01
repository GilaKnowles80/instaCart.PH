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
router.post('/orders/:orderId/receipts', authenticateToken, authorizeRoles('vendor', 'admin'), apiRateLimiter, validateParams(OrderIdSchema), DeliveryReceiptController.uploadReceipt);
router.get('/orders/:orderId/receipts', authenticateToken, validateParams(OrderIdSchema), DeliveryReceiptController.getOrderReceipts);
router.get('/vendor/receipts', authenticateToken, authorizeRoles('vendor'), DeliveryReceiptController.getVendorReceipts);
export default router;
//# sourceMappingURL=deliveryReceipt.routes.js.map