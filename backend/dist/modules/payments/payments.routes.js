import { Router } from 'express';
import { PaymentsController } from './payments.controller.js';
import { authenticateToken } from '../auth/auth.middleware.js';
import { apiRateLimiter, payoutRateLimiter } from '../../middleware/rateLimiter.js';
import { validateParams } from '../../middleware/validate.js';
import { z } from 'zod';
const router = Router();
const OrderIdSchema = z.object({
    orderId: z.string().min(1, 'Order ID is required'),
});
router.post('/calculate', apiRateLimiter, PaymentsController.calculateCheckout);
router.post('/orders', apiRateLimiter, PaymentsController.createOrder);
router.post('/orders/:orderId/capture', apiRateLimiter, validateParams(OrderIdSchema), PaymentsController.captureOrder);
router.post('/payout', authenticateToken, payoutRateLimiter, PaymentsController.payoutToVendor);
router.get('/config', PaymentsController.getPlatformFeeConfig);
export default router;
//# sourceMappingURL=payments.routes.js.map