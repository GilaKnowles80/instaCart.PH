import { Router } from 'express';
import { EscrowService } from './escrow.service.js';
import { authenticateToken } from '../auth/auth.middleware.js';
import { apiRateLimiter } from '../../middleware/rateLimiter.js';
import { validateParams } from '../../middleware/validate.js';
import { z } from 'zod';

const router = Router();

const OrderIdSchema = z.object({
  orderId: z.string().min(1, 'Order ID is required'),
});

const RecipientSchema = z.object({
  recipientType: z.string().min(1, 'Recipient type is required'),
  recipientId: z.string().min(1, 'Recipient ID is required'),
});

// Create escrow split for an order (rate limited)
router.post(
  '/split',
  authenticateToken,
  apiRateLimiter,
  async (req, res) => {
    try {
      const result = await EscrowService.splitPayment(req.body);
      return res.status(200).json({
        message: 'Escrow split created successfully.',
        split: result,
      });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
);

// Complete an escrow split (admin action)
router.post(
  '/split/:orderId/complete',
  authenticateToken,
  validateParams(OrderIdSchema),
  async (req, res) => {
    try {
      const { orderId } = req.params as { orderId: string };
      const { paypalTransactionId } = req.body;
      const result = await EscrowService.completeSplit(orderId, paypalTransactionId);
      if (!result) {
        return res.status(404).json({ error: 'Escrow split not found.' });
      }
      return res.status(200).json({
        message: 'Escrow split completed.',
        split: result,
      });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
);

// Get escrow split by order ID
router.get(
  '/split/:orderId',
  authenticateToken,
  validateParams(OrderIdSchema),
  async (req, res) => {
    try {
      const { orderId } = req.params as { orderId: string };
      const split = await EscrowService.getSplit(orderId);
      if (!split) {
        return res.status(404).json({ error: 'Escrow split not found.' });
      }
      return res.status(200).json({ split });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
);

// Get all escrow splits (admin)
router.get('/splits', authenticateToken, async (_req, res) => {
  try {
    const splits = await EscrowService.getAllSplits();
    return res.status(200).json({ splits, count: splits.length });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Get splits by recipient
router.get(
  '/splits/recipient/:recipientType/:recipientId',
  authenticateToken,
  validateParams(RecipientSchema),
  async (req, res) => {
    try {
      const { recipientType, recipientId } = req.params as { recipientType: string; recipientId: string };
      const splits = await EscrowService.getSplitsByRecipient(recipientType, recipientId);
      return res.status(200).json({ splits, count: splits.length });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
);

export default router;