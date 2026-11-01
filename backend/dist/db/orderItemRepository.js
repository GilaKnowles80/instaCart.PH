import { sql } from '../config/database.js';
export class OrderItemRepository {
    static async create(data) {
        const result = await sql `
      INSERT INTO order_items (id, order_id, product_id, vendor_id, vendor_name, name, price, quantity, subtotal, status, created_at, updated_at)
      VALUES (${data.id}, ${data.orderId}, ${data.productId || null}, ${data.vendorId}, ${data.vendorName}, ${data.name}, ${data.price}, ${data.quantity}, ${data.subtotal}, ${data.status || 'pending'}, NOW(), NOW())
      RETURNING *
    `;
        return this.mapOrderItem(result[0]);
    }
    static async getByOrder(orderId) {
        const result = await sql `SELECT * FROM order_items WHERE order_id = ${orderId} ORDER BY created_at ASC`;
        return result.map((r) => this.mapOrderItem(r));
    }
    static async getByVendor(vendorId) {
        const result = await sql `SELECT * FROM order_items WHERE vendor_id = ${vendorId} ORDER BY created_at DESC`;
        return result.map((r) => this.mapOrderItem(r));
    }
    static async updateStatus(id, status) {
        const result = await sql `
      UPDATE order_items SET status = ${status}, updated_at = NOW() WHERE id = ${id} RETURNING *
    `;
        return result[0] ? this.mapOrderItem(result[0]) : null;
    }
    static mapOrderItem(row) {
        return {
            id: row.id, order_id: row.order_id, product_id: row.product_id,
            vendor_id: row.vendor_id, vendor_name: row.vendor_name, name: row.name,
            price: Number(row.price), quantity: Number(row.quantity), subtotal: Number(row.subtotal),
            status: row.status, created_at: new Date(row.created_at), updated_at: new Date(row.updated_at),
        };
    }
}
export class DeliveryReceiptRepository {
    static async create(data) {
        const result = await sql `
      INSERT INTO delivery_receipts (id, order_id, vendor_id, receipt_url, tracking_number, delivery_notes, delivered_at, created_at)
      VALUES (${data.id}, ${data.orderId}, ${data.vendorId}, ${data.receiptUrl}, ${data.trackingNumber || null}, ${data.deliveryNotes || null}, ${data.deliveredAt || null}, NOW())
      RETURNING *
    `;
        return this.mapReceipt(result[0]);
    }
    static async getByOrder(orderId) {
        const result = await sql `SELECT * FROM delivery_receipts WHERE order_id = ${orderId} ORDER BY created_at DESC`;
        return result.map((r) => this.mapReceipt(r));
    }
    static async getByVendor(vendorId) {
        const result = await sql `SELECT * FROM delivery_receipts WHERE vendor_id = ${vendorId} ORDER BY created_at DESC`;
        return result.map((r) => this.mapReceipt(r));
    }
    static mapReceipt(row) {
        return {
            id: row.id, order_id: row.order_id, vendor_id: row.vendor_id,
            receipt_url: row.receipt_url, tracking_number: row.tracking_number,
            delivery_notes: row.delivery_notes,
            delivered_at: row.delivered_at ? new Date(row.delivered_at) : undefined,
            created_at: new Date(row.created_at),
        };
    }
}
//# sourceMappingURL=orderItemRepository.js.map