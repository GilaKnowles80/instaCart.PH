import { payPalPayout } from './paypal.service.js';
import { WithdrawalRepository } from '../../db/repository.js';
export class WithdrawalService {
    static async requestWithdrawal(data) {
        const withdrawal = await WithdrawalRepository.create({
            id: `wd_${Math.random().toString(36).slice(2, 11)}`,
            userId: data.userId,
            userRole: data.userRole,
            amount: data.amount,
            currency: data.currency,
            payoutChannel: data.payoutChannel,
            payoutAccount: data.payoutAccount,
            status: 'pending',
        });
        return withdrawal;
    }
    static async processWithdrawal(withdrawalId, adminAction) {
        const withdrawal = await WithdrawalRepository.findById(withdrawalId);
        if (!withdrawal)
            return null;
        if (adminAction === 'reject') {
            const updated = await WithdrawalRepository.update(withdrawalId, { status: 'rejected' });
            return updated ? updated : null;
        }
        try {
            const payout = await payPalPayout(withdrawal.payout_account, Number(withdrawal.amount), withdrawal.currency, `instaCart.PH Withdrawal - ${withdrawalId}`);
            const updated = await WithdrawalRepository.update(withdrawalId, {
                status: 'completed',
                paypal_payout_batch_id: payout.batch_header?.payout_batch_id,
            });
            return updated ? updated : null;
        }
        catch (error) {
            const updated = await WithdrawalRepository.update(withdrawalId, { status: 'rejected' });
            return updated ? updated : null;
        }
    }
    static async getWithdrawal(withdrawalId) {
        const withdrawal = await WithdrawalRepository.findById(withdrawalId);
        return withdrawal ? withdrawal : null;
    }
    static async getWithdrawalsByUser(userId) {
        const withdrawals = await WithdrawalRepository.getByUser(userId);
        return withdrawals;
    }
    static async getAllWithdrawals() {
        const withdrawals = await WithdrawalRepository.getAll();
        return withdrawals;
    }
    static async getPendingWithdrawals() {
        const withdrawals = await WithdrawalRepository.getPending();
        return withdrawals;
    }
}
//# sourceMappingURL=withdrawal.service.js.map