import { sql } from '../../config/database.js';
import { OrderRepository } from '../../db/repository.js';
import { ProductRepository } from '../../db/productRepository.js';
import { OrderItemRepository } from '../../db/orderItemRepository.js';
import { InventoryService, CartItem, ValidationResult } from './inventoryService.js';
import { EscrowService } from '../payments/escrow.service.js';
import { calculateFeeSplit } from '../payments/paypal.service.js';

export interface CheckoutRequest {
  items: CartItem[];
  customerId: string;
  customerName: string;
  customerAddress: string;
  customerLatitude: number;
  customerLongitude: number;
  deliveryFee: number;
  distanceKm: number;
  ratePerKm: number;
  paypalOrderId?: string;
  paypalCaptureId?: string;
}

export interface VendorOrderSummary {
  vendorId: string;
  vendorName: string;
  items: CartItem[];
  subtotal: number;
  platformFee: number;
  vendorNet: number;
}

export interface CheckoutResult {
  success: boolean;
  orderId: string;
  order: any;
  vendorSummaries: VendorOrderSummary[];
  escrowSplits: any[];
  errors: string[];
}

export class CheckoutService {
  static async processOrder(data: CheckoutRequest): Promise<CheckoutResult> {
    const errors: string[] = [];

    // Validate that cart is not empty
    if (!data.items || data.items.length === 0) {
      return { success: false, orderId: '', order: null, vendorSummaries: [], escrowSplits: [], errors: ['Cart is empty. Please add items before checkout.'] };
    }

    // Step 1: Validate cart inventory
    const validation: ValidationResult = await InventoryService.validateCart(data.items);
    if (!validation.valid) {
      return { success: false, orderId: '', order: null, vendorSummaries: [], escrowSplits: [], errors: validation.errors };
    }

    // Step 2: Group items by vendor for multi-vendor order splitting
    const vendorGroups = InventoryService.groupByVendor(validation.items);

    // Step 3: Calculate totals per vendor
    const vendorSummaries: VendorOrderSummary[] = [];
    let grandTotal = 0;
    let totalPlatformEarnings = 0;

    for (const [vendorId, items] of vendorGroups) {
      const vendorSubtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
      const feeSplit = calculateFeeSplit(vendorSubtotal, 0, 0);
      const vendorSummary: VendorOrderSummary = {
        vendorId,
        vendorName: items[0].vendorName,
        items,
        subtotal: vendorSubtotal,
        platformFee: feeSplit.totalPlatformEarnings,
        vendorNet: feeSplit.vendorNet,
      };
      vendorSummaries.push(vendorSummary);
      grandTotal += vendorSubtotal;
      totalPlatformEarnings += feeSplit.totalPlatformEarnings;
    }

    grandTotal += data.deliveryFee;
    totalPlatformEarnings += Math.round((data.deliveryFee * 0.02) * 100) / 100;

    // Step 4: Create order in a transactional manner
    const orderId = `order_${Math.random().toString(36).slice(2, 11)}`;
    const serviceCharge = Math.round((grandTotal * 0.02) * 100) / 100;

    try {
      const primaryVendor = vendorSummaries[0];
      const order = await OrderRepository.create({
        id: orderId,
        customerId: data.customerId,
        customerName: data.customerName,
        customerAddress: data.customerAddress,
        customerLatitude: data.customerLatitude,
        customerLongitude: data.customerLongitude,
        vendorId: primaryVendor?.vendorId || '',
        vendorName: primaryVendor?.vendorName || '',
        items: validation.items.map((i) => ({
          id: `item_${Math.random().toString(36).slice(2, 11)}`,
          productId: i.productId,
          vendorId: i.vendorId,
          vendorName: i.vendorName,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
          subtotal: i.subtotal,
          status: 'pending',
        })),
        subtotal: grandTotal - data.deliveryFee,
        deliveryFee: data.deliveryFee,
        serviceCharge,
        vendorPlatformFee: 0,
        totalPlatformEarnings: totalPlatformEarnings,
        vendorNetPayout: grandTotal - data.deliveryFee - totalPlatformEarnings,
        grandTotal,
        distanceKm: data.distanceKm,
        ratePerKm: data.ratePerKm,
        status: 'pending',
        paymentStatus: 'pending',
        paypalOrderId: data.paypalOrderId || null,
        paypalCaptureId: data.paypalCaptureId || null,
      });

      await InventoryService.deductStock(orderId, validation.items);

      const escrowSplits = [];
      for (const summary of vendorSummaries) {
        const split = await EscrowService.splitPayment({
          orderId,
          customerId: data.customerId,
          vendorId: summary.vendorId,
          subtotal: summary.subtotal,
          deliveryFee: 0,
          platformFeePercent: 2,
          currency: 'PHP',
        });
        escrowSplits.push(split);
      }

      return {
        success: true,
        orderId,
        order,
        vendorSummaries,
        escrowSplits,
        errors: [],
      };
    } catch (error: any) {
      await InventoryService.releaseStock(orderId, validation.items);
      return {
        success: false,
        orderId: '',
        order: null,
        vendorSummaries: [],
        escrowSplits: [],
        errors: [error.message || 'Checkout failed.'],
      };
    }
  }
  static async capturePaymentAndFinalize(
    orderId: string,
    paypalOrderId: string,
    paypalCaptureId: string
  ): Promise<{ success: boolean; order: any; errors: string[] }> {
    try {
      const order = await sql`
        UPDATE orders
        SET payment_status = 'paid', status = 'paid', paypal_order_id = ${paypalOrderId}, paypal_capture_id = ${paypalCaptureId}, updated_at = NOW()
        WHERE id = ${orderId}
        RETURNING *
      `;

      if (order.length === 0) {
        return { success: false, order: null, errors: ['Order not found.'] };
      }

      const items = await OrderItemRepository.getByOrder(orderId);
      for (const item of items) {
        await OrderItemRepository.updateStatus(item.id, 'paid');
      }

      for (const item of items) {
        try {
          await EscrowService.completeSplit(orderId, paypalCaptureId);
        } catch {
          // Escrow may already be completed
        }
      }

      return { success: true, order: order[0], errors: [] };
    } catch (error: any) {
      return { success: false, order: null, errors: [error.message || 'Payment finalization failed.'] };
    }
  }
}
