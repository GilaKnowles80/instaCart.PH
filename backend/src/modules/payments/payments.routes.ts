import { Router } from 'express';
import { PaymentsController } from './payments.controller.js';
import { authenticateToken } from '../auth/auth.middleware.js';
import { apiRateLimiter, payoutRateLimiter } from '../../middleware/rateLimiter.js';
import { validateBody, validateParams } from '../../middleware/validate.js';
import { z } from 'zod';

const router = Router();

const OrderIdSchema = z.object({
  orderId: z.string().min(1, 'Order ID is required'),
});

// Public - calculate checkout fees (rate limited)
router.post('/calculate', apiRateLimiter, PaymentsController.calculateCheckout);

// Public - create PayPal order (rate limited)
router.post('/orders', apiRateLimiter, PaymentsController.createOrder);

// Public - capture PayPal order (rate limited)
router.post(
  '/orders/:orderId/capture',
  apiRateLimiter,
  validateParams(OrderIdSchema),
  PaymentsController.captureOrder
);

// Protected - payout to vendor (strict rate limit)
router.post('/payout', authenticateToken, payoutRateLimiter, PaymentsController.payoutToVendor);

// Public - get platform fee config
router.get('/config', PaymentsController.getPlatformFeeConfig);

export default router;
