import { sql } from '../config/database.js';

export interface IOrderItem {
  id: string;
  order_id: string;
  product_id?: string;
  vendor_id: string;
  vendor_name: string;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
  status: string;
  created_at: Date;
  updated_at: Date;
}

export class OrderItemRepository {
  static async create(data: any): Promise<IOrderItem> {
    const result = await sql`
      INSERT INTO order_items (id, order_id, product_id, vendor_id, vendor_name, name, price, quantity, subtotal, status, created_at, updated_at)
      VALUES (${data.id}, ${data.orderId}, ${data.productId || null}, ${data.vendorId}, ${data.vendorName}, ${data.name}, ${data.price}, ${data.quantity}, ${data.subtotal}, ${data.status || 'pending'}, NOW(), NOW())
      RETURNING *
    `;
    return this.mapOrderItem(result[0]);
  }

  static async getByOrder(orderId: string): Promise<IOrderItem[]> {
    const result = await sql`SELECT * FROM order_items WHERE order_id = ${orderId} ORDER BY created_at ASC`;
    return result.map((r: any) => this.mapOrderItem(r));
  }

  static async getByVendor(vendorId: string): Promise<IOrderItem[]> {
    const result = await sql`SELECT * FROM order_items WHERE vendor_id = ${vendorId} ORDER BY created_at DESC`;
    return result.map((r: any) => this.mapOrderItem(r));
  }

  static async updateStatus(id: string, status: string): Promise<IOrderItem | null> {
    const result = await sql`
      UPDATE order_items SET status = ${status}, updated_at = NOW() WHERE id = ${id} RETURNING *
    `;
    return result[0] ? this.mapOrderItem(result[0]) : null;
  }

  private static mapOrderItem(row: any): IOrderItem {
    return {
      id: row.id, order_id: row.order_id, product_id: row.product_id,
      vendor_id: row.vendor_id, vendor_name: row.vendor_name, name: row.name,
      price: Number(row.price), quantity: Number(row.quantity), subtotal: Number(row.subtotal),
      status: row.status, created_at: new Date(row.created_at), updated_at: new Date(row.updated_at),
    };
  }
}

export interface IDeliveryReceipt {
  id: string;
  order_id: string;
  vendor_id: string;
  receipt_url: string;
  tracking_number?: string;
  delivery_notes?: string;
  delivered_at?: Date;
  created_at: Date;
}

export class DeliveryReceiptRepository {
  static async create(data: any): Promise<IDeliveryReceipt> {
    const result = await sql`
      INSERT INTO delivery_receipts (id, order_id, vendor_id, receipt_url, tracking_number, delivery_notes, delivered_at, created_at)
      VALUES (${data.id}, ${data.orderId}, ${data.vendorId}, ${data.receiptUrl}, ${data.trackingNumber || null}, ${data.deliveryNotes || null}, ${data.deliveredAt || null}, NOW())
      RETURNING *
    `;
    return this.mapReceipt(result[0]);
  }

  static async getByOrder(orderId: string): Promise<IDeliveryReceipt[]> {
    const result = await sql`SELECT * FROM delivery_receipts WHERE order_id = ${orderId} ORDER BY created_at DESC`;
    return result.map((r: any) => this.mapReceipt(r));
  }

  static async getByVendor(vendorId: string): Promise<IDeliveryReceipt[]> {
    const result = await sql`SELECT * FROM delivery_receipts WHERE vendor_id = ${vendorId} ORDER BY created_at DESC`;
    return result.map((r: any) => this.mapReceipt(r));
  }

  private static mapReceipt(row: any): IDeliveryReceipt {
    return {
      id: row.id, order_id: row.order_id, vendor_id: row.vendor_id,
      receipt_url: row.receipt_url, tracking_number: row.tracking_number,
      delivery_notes: row.delivery_notes,
      delivered_at: row.delivered_at ? new Date(row.delivered_at) : undefined,
      created_at: new Date(row.created_at),
    };
  }
}