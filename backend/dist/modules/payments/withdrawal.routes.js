import { Router } from 'express';
import { WithdrawalService } from './withdrawal.service.js';
import { authenticateToken, authorizeRoles } from '../auth/auth.middleware.js';
import { apiRateLimiter } from '../../middleware/rateLimiter.js';
import { validateBody, validateParams } from '../../middleware/validate.js';
import { z } from 'zod';
const router = Router();
const WithdrawalIdSchema = z.object({
    withdrawalId: z.string().min(1, 'Withdrawal ID is required'),
});
const WithdrawalActionSchema = z.object({
    action: z.enum(['approve', 'reject']),
});
router.post('/request', authenticateToken, apiRateLimiter, async (req, res) => {
    try {
        const userId = req.user?.userId;
        const userRole = req.user?.role;
        const { amount, currency, payoutChannel, payoutAccount } = req.body;
        if (!amount || amount <= 0) {
            return res.status(400).json({ error: 'Valid amount is required.' });
        }
        if (!payoutChannel || !payoutAccount) {
            return res.status(400).json({ error: 'Payout channel and account are required.' });
        }
        const withdrawal = await WithdrawalService.requestWithdrawal({
            userId,
            userRole,
            amount,
            currency: currency || 'PHP',
            payoutChannel,
            payoutAccount,
        });
        return res.status(201).json({
            message: 'Withdrawal request submitted successfully.',
            withdrawal,
        });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
router.get('/my', authenticateToken, async (req, res) => {
    try {
        const userId = req.user?.userId;
        const withdrawals = await WithdrawalService.getWithdrawalsByUser(userId);
        return res.status(200).json({ withdrawals, count: withdrawals.length });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
router.get('/all', authenticateToken, authorizeRoles('admin'), async (_req, res) => {
    try {
        const withdrawals = await WithdrawalService.getAllWithdrawals();
        return res.status(200).json({ withdrawals, count: withdrawals.length });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
router.get('/pending', authenticateToken, authorizeRoles('admin'), async (_req, res) => {
    try {
        const withdrawals = await WithdrawalService.getPendingWithdrawals();
        return res.status(200).json({ withdrawals, count: withdrawals.length });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
router.post('/:withdrawalId/process', authenticateToken, authorizeRoles('admin'), validateParams(WithdrawalIdSchema), validateBody(WithdrawalActionSchema), async (req, res) => {
    try {
        const { withdrawalId } = req.params;
        const { action } = req.body;
        const withdrawal = await WithdrawalService.processWithdrawal(withdrawalId, action);
        if (!withdrawal) {
            return res.status(404).json({ error: 'Withdrawal not found.' });
        }
        return res.status(200).json({
            message: `Withdrawal ${action}d successfully.`,
            withdrawal,
        });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
export default router;
//# sourceMappingURL=withdrawal.routes.js.map