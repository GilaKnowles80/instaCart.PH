import { ProductRepository } from '../../db/productRepository.js';
import { OrderItemRepository } from '../../db/orderItemRepository.js';
import { sql } from '../../config/database.js';

export interface CartItem {
  productId: string;
  vendorId: string;
  vendorName: string;
  name: string;
  price: number;
  quantity: number;
}

export interface ValidatedCartItem extends CartItem {
  product: any;
  subtotal: number;
}

export interface ValidationResult {
  valid: boolean;
  items: ValidatedCartItem[];
  errors: string[];
  subtotal: number;
}

export class InventoryService {
  /**
   * Validate that all cart items are in stock and return validated items with subtotals.
   * Groups items by vendor for multi-vendor order splitting.
   */
  static async validateCart(items: CartItem[]): Promise<ValidationResult> {
    const errors: string[] = [];
    const validatedItems: ValidatedCartItem[] = [];
    let subtotal = 0;

    for (const item of items) {
      const product = await ProductRepository.findById(item.productId);
      if (!product) {
        errors.push(`Product ${item.name} not found.`);
        continue;
      }
      if (!product.is_active) {
        errors.push(`Product ${item.name} is no longer available.`);
        continue;
      }
      if (product.stock_quantity < item.quantity) {
        errors.push(`Insufficient stock for ${item.name}. Available: ${product.stock_quantity}, Requested: ${item.quantity}.`);
        continue;
      }

      const itemSubtotal = Number(product.price) * item.quantity;
      subtotal += itemSubtotal;
      validatedItems.push({
        ...item,
        product,
        subtotal: itemSubtotal,
      });
    }

    return {
      valid: errors.length === 0,
      items: validatedItems,
      errors,
      subtotal: Math.round(subtotal * 100) / 100,
    };
  }

  /**
   * Group validated cart items by vendor ID for multi-vendor order splitting.
   */
  static groupByVendor(items: ValidatedCartItem[]): Map<string, ValidatedCartItem[]> {
    const grouped = new Map<string, ValidatedCartItem[]>();
    for (const item of items) {
      const existing = grouped.get(item.vendorId) || [];
      existing.push(item);
      grouped.set(item.vendorId, existing);
    }
    return grouped;
  }

  /**
   * Deduct stock for all items in an order within a transaction.
   * Creates inventory transaction records for audit.
   */
  static async deductStock(orderId: string, items: ValidatedCartItem[]): Promise<void> {
    for (const item of items) {
      await ProductRepository.adjustStock(
        item.productId,
        -item.quantity,
        'deduct',
        item.vendorId,
        'order',
        orderId,
        `Deducted ${item.quantity} unit(s) for order ${orderId}`
      );

      await OrderItemRepository.create({
        id: `item_${Math.random().toString(36).slice(2, 11)}`,
        orderId,
        productId: item.productId,
        vendorId: item.vendorId,
        vendorName: item.vendorName,
        name: item.name,
        price: Number(item.product.price),
        quantity: item.quantity,
        subtotal: item.subtotal,
        status: 'pending',
      });
    }
  }

  /**
   * Release stock back (e.g., on order cancellation).
   */
  static async releaseStock(orderId: string, items: ValidatedCartItem[]): Promise<void> {
    for (const item of items) {
      await ProductRepository.adjustStock(
        item.productId,
        item.quantity,
        'release',
        item.vendorId,
        'order',
        orderId,
        `Released ${item.quantity} unit(s) for cancelled order ${orderId}`
      );
    }
  }
}