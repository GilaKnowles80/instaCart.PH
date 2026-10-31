import { payPalPayout } from './paypal.service.js';
import { WithdrawalRepository } from '../../db/repository.js';

export interface WithdrawalRequest {
  id: string;
  userId: string;
  userRole: string;
  amount: number;
  currency: string;
  payoutChannel: 'PAYPAL' | 'BPI_BANK' | 'GCASH' | 'MAYA' | 'PAYMONGO';
  payoutAccount: string;
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  paypalPayoutBatchId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class WithdrawalService {
  static async requestWithdrawal(data: {
    userId: string;
    userRole: string;
    amount: number;
    currency: string;
    payoutChannel: 'PAYPAL' | 'BPI_BANK' | 'GCASH' | 'MAYA' | 'PAYMONGO';
    payoutAccount: string;
  }): Promise<WithdrawalRequest> {
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
    return withdrawal as unknown as WithdrawalRequest;
  }

  static async processWithdrawal(
    withdrawalId: string,
    adminAction: 'approve' | 'reject'
  ): Promise<WithdrawalRequest | null> {
    const withdrawal = await WithdrawalRepository.findById(withdrawalId);
    if (!withdrawal) return null;

    if (adminAction === 'reject') {
      const updated = await WithdrawalRepository.update(withdrawalId, { status: 'rejected' });
      return updated ? (updated as unknown as WithdrawalRequest) : null;
    }

    // Process PayPal payout
    try {
      const payout = await payPalPayout(
        withdrawal.payout_account,
        Number(withdrawal.amount),
        withdrawal.currency,
        `instaCart.PH Withdrawal - ${withdrawalId}`
      );

      const updated = await WithdrawalRepository.update(withdrawalId, {
        status: 'completed',
        paypal_payout_batch_id: payout.batch_header?.payout_batch_id,
      });
      return updated ? (updated as unknown as WithdrawalRequest) : null;
    } catch (error) {
      const updated = await WithdrawalRepository.update(withdrawalId, { status: 'rejected' });
      return updated ? (updated as unknown as WithdrawalRequest) : null;
    }
  }

  static async getWithdrawal(withdrawalId: string): Promise<WithdrawalRequest | null> {
    const withdrawal = await WithdrawalRepository.findById(withdrawalId);
    return withdrawal ? (withdrawal as unknown as WithdrawalRequest) : null;
  }

  static async getWithdrawalsByUser(userId: string): Promise<WithdrawalRequest[]> {
    const withdrawals = await WithdrawalRepository.getByUser(userId);
    return withdrawals as unknown as WithdrawalRequest[];
  }

  static async getAllWithdrawals(): Promise<WithdrawalRequest[]> {
    const withdrawals = await WithdrawalRepository.getAll();
    return withdrawals as unknown as WithdrawalRequest[];
  }

  static async getPendingWithdrawals(): Promise<WithdrawalRequest[]> {
    const withdrawals = await WithdrawalRepository.getPending();
    return withdrawals as unknown as WithdrawalRequest[];
  }
}