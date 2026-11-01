import { ProductRepository } from '../../db/productRepository.js';
import { OrderItemRepository } from '../../db/orderItemRepository.js';
export class InventoryService {
    static async validateCart(items) {
        const errors = [];
        const validatedItems = [];
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
    static groupByVendor(items) {
        const grouped = new Map();
        for (const item of items) {
            const existing = grouped.get(item.vendorId) || [];
            existing.push(item);
            grouped.set(item.vendorId, existing);
        }
        return grouped;
    }
    static async deductStock(orderId, items) {
        for (const item of items) {
            await ProductRepository.adjustStock(item.productId, -item.quantity, 'deduct', item.vendorId, 'order', orderId, `Deducted ${item.quantity} unit(s) for order ${orderId}`);
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
    static async releaseStock(orderId, items) {
        for (const item of items) {
            await ProductRepository.adjustStock(item.productId, item.quantity, 'release', item.vendorId, 'order', orderId, `Released ${item.quantity} unit(s) for cancelled order ${orderId}`);
        }
    }
}
//# sourceMappingURL=inventoryService.js.map