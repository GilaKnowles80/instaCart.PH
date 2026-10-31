import { PLATFORM_SERVICE_FEE_PERCENT } from './paypal.service.js';
import { sql } from '../../config/database.js';
import { EscrowSplitRepository, EscrowSplitItemRepository } from '../../db/repository.js';

export interface EscrowSplitRequest {
  orderId: string;
  customerId: string;
  vendorId: string;
  retailerId?: string;
  wholesalerId?: string;
  deliveryDriverId?: string;
  subtotal: number;
  deliveryFee: number;
  platformFeePercent?: number;
  vendorPlatformFeePercent?: number;
  currency?: string;
}

export interface EscrowSplitResult {
  orderId: string;
  totalAmount: number;
  adminEarnings: number;
  vendorEarnings: number;
  retailerEarnings: number;
  wholesalerEarnings: number;
  deliveryDriverEarnings: number;
  splits: Array<{
    recipientType: 'admin' | 'vendor' | 'retailer' | 'wholesaler' | 'delivery_driver';
    recipientId: string;
    amount: number;
    currency: string;
    status: 'pending' | 'completed' | 'failed';
    paypalTransactionId?: string;
  }>;
}

export class EscrowService {
  static async splitPayment(request: EscrowSplitRequest): Promise<EscrowSplitResult> {
    const {
      orderId, customerId, vendorId, retailerId, wholesalerId, deliveryDriverId,
      subtotal, deliveryFee,
      platformFeePercent = PLATFORM_SERVICE_FEE_PERCENT || 2,
      vendorPlatformFeePercent = 0, currency = 'PHP',
    } = request;

    const totalAmount = subtotal + deliveryFee;
    const adminServiceCharge = Math.round((subtotal * (platformFeePercent / 100)) * 100) / 100;
    const vendorPlatformFee = Math.round((subtotal * (vendorPlatformFeePercent / 100)) * 100) / 100;
    const totalAdminEarnings = adminServiceCharge + vendorPlatformFee;
    const vendorNet = Math.round((subtotal - vendorPlatformFee) * 100) / 100;
    const deliveryDriverEarnings = deliveryFee;
    const retailerEarnings = retailerId ? Math.round((vendorNet * 0.1) * 100) / 100 : 0;
    const wholesalerEarnings = wholesalerId ? Math.round((vendorNet * 0.15) * 100) / 100 : 0;

    const split = await EscrowSplitRepository.create({
      id: `escrow_${Math.random().toString(36).slice(2, 11)}`, orderId, customerId, vendorId,
      retailerId: retailerId || null, wholesalerId: wholesalerId || null,
      deliveryDriverId: deliveryDriverId || null, subtotal, deliveryFee,
      platformFeePercent, vendorPlatformFeePercent, currency, totalAmount,
      adminEarnings: totalAdminEarnings, vendorEarnings: vendorNet,
      retailerEarnings, wholesalerEarnings, deliveryDriverEarnings,
    });

    const splits: EscrowSplitResult['splits'] = [
      { recipientType: 'admin', recipientId: 'admin_hq', amount: totalAdminEarnings, currency, status: 'pending' },
      { recipientType: 'vendor', recipientId: vendorId, amount: vendorNet, currency, status: 'pending' },
    ];
    if (retailerId) splits.push({ recipientType: 'retailer', recipientId: retailerId, amount: retailerEarnings, currency, status: 'pending' });
    if (wholesalerId) splits.push({ recipientType: 'wholesaler', recipientId: wholesalerId, amount: wholesalerEarnings, currency, status: 'pending' });
    if (deliveryDriverId) splits.push({ recipientType: 'delivery_driver', recipientId: deliveryDriverId, amount: deliveryDriverEarnings, currency, status: 'pending' });

    for (const s of splits) {
      await EscrowSplitItemRepository.create({
        id: `item_${Math.random().toString(36).slice(2, 11)}`, splitId: split.id,
        recipientType: s.recipientType, recipientId: s.recipientId, amount: s.amount,
        currency: s.currency, status: s.status, paypalTransactionId: undefined,
      });
    }

    return { orderId, totalAmount, adminEarnings: totalAdminEarnings, vendorEarnings: vendorNet,
      retailerEarnings, wholesalerEarnings, deliveryDriverEarnings, splits };
  }
  static async completeSplit(orderId: string, paypalTransactionId: string): Promise<EscrowSplitResult | null> {
    const split = await EscrowSplitRepository.findByOrderId(orderId);
    if (!split) return null;
    await EscrowSplitRepository.complete(orderId, paypalTransactionId);
    return this.getSplit(orderId);
  }

  static async getSplit(orderId: string): Promise<EscrowSplitResult | null> {
    const split = await EscrowSplitRepository.findByOrderId(orderId);
    if (!split) return null;
    const items = await sql`SELECT * FROM escrow_split_items WHERE split_id = ${split.id}`;
    return {
      orderId: split.order_id, totalAmount: Number(split.total_amount),
      adminEarnings: Number(split.admin_earnings), vendorEarnings: Number(split.vendor_earnings),
      retailerEarnings: Number(split.retailer_earnings), wholesalerEarnings: Number(split.wholesaler_earnings),
      deliveryDriverEarnings: Number(split.delivery_driver_earnings),
      splits: items.map((i: any) => ({
        recipientType: i.recipient_type, recipientId: i.recipient_id, amount: Number(i.amount),
        currency: i.currency, status: i.status,
        paypalTransactionId: i.paypal_transaction_id || undefined,
      })),
    };
  }

  static async getAllSplits(): Promise<EscrowSplitResult[]> {
    const splits = await EscrowSplitRepository.getAll();
    const result: EscrowSplitResult[] = [];
    for (const split of splits) {
      const items = await sql`SELECT * FROM escrow_split_items WHERE split_id = ${split.id}`;
      result.push({
        orderId: split.order_id, totalAmount: Number(split.total_amount),
        adminEarnings: Number(split.admin_earnings), vendorEarnings: Number(split.vendor_earnings),
        retailerEarnings: Number(split.retailer_earnings), wholesalerEarnings: Number(split.wholesaler_earnings),
        deliveryDriverEarnings: Number(split.delivery_driver_earnings),
        splits: items.map((i: any) => ({
          recipientType: i.recipient_type, recipientId: i.recipient_id, amount: Number(i.amount),
          currency: i.currency, status: i.status,
          paypalTransactionId: i.paypal_transaction_id || undefined,
        })),
      });
    }
    return result;
  }

  static async getSplitsByRecipient(recipientType: string, recipientId: string): Promise<EscrowSplitResult[]> {
    const splits = await EscrowSplitRepository.getByRecipient(recipientType, recipientId);
    const result: EscrowSplitResult[] = [];
    for (const split of splits) {
      const items = await sql`SELECT * FROM escrow_split_items WHERE split_id = ${split.id}`;
      result.push({
        orderId: split.order_id, totalAmount: Number(split.total_amount),
        adminEarnings: Number(split.admin_earnings), vendorEarnings: Number(split.vendor_earnings),
        retailerEarnings: Number(split.retailer_earnings), wholesalerEarnings: Number(split.wholesaler_earnings),
        deliveryDriverEarnings: Number(split.delivery_driver_earnings),
        splits: items.map((i: any) => ({
          recipientType: i.recipient_type, recipientId: i.recipient_id, amount: Number(i.amount),
          currency: i.currency, status: i.status,
          paypalTransactionId: i.paypal_transaction_id || undefined,
        })),
      });
    }
    return result;
  }
}