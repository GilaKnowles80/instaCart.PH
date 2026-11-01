import { sql } from '../config/database.js';
export class ProductRepository {
    static async create(data) {
        const result = await sql `
      INSERT INTO products (id, vendor_id, name, description, category, price, stock_quantity, min_stock_alert, images, is_active, is_featured, weight_kg, dimensions_cm, sku, created_at, updated_at)
      VALUES (${data.id}, ${data.vendorId}, ${data.name}, ${data.description || null}, ${data.category}, ${data.price}, ${data.stockQuantity || 0}, ${data.minStockAlert || 5}, ${JSON.stringify(data.images || [])}, ${data.isActive !== false}, ${data.isFeatured || false}, ${data.weightKg || null}, ${data.dimensionsCm ? JSON.stringify(data.dimensionsCm) : null}, ${data.sku || null}, NOW(), NOW())
      RETURNING *
    `;
        return this.mapProduct(result[0]);
    }
    static async findById(id) {
        const result = await sql `SELECT * FROM products WHERE id = ${id}`;
        return result[0] ? this.mapProduct(result[0]) : null;
    }
    static async getByVendor(vendorId) {
        const result = await sql `SELECT * FROM products WHERE vendor_id = ${vendorId} ORDER BY created_at DESC`;
        return result.map((r) => this.mapProduct(r));
    }
    static async getAll(filters) {
        let query = `SELECT * FROM products WHERE 1=1`;
        if (filters?.category)
            query += ` AND category = '${filters.category}'`;
        if (filters?.isActive !== undefined)
            query += ` AND is_active = ${filters.isActive}`;
        if (filters?.vendorId)
            query += ` AND vendor_id = '${filters.vendorId}'`;
        query += ` ORDER BY created_at DESC`;
        const result = await sql.unsafe(query);
        const rows = Array.isArray(result) ? result : result.rows || [];
        return rows.map((r) => this.mapProduct(r));
    }
    static async update(id, updates) {
        const fields = Object.keys(updates);
        if (fields.length === 0)
            return null;
        const setParts = fields.map((key) => {
            const camelToSnake = key.replace(/[A-Z]/g, (m) => `_${m.toLowerCase()}`);
            let val = updates[key];
            if (typeof val === 'object' && val !== null)
                val = JSON.stringify(val);
            return `${camelToSnake} = ${val}`;
        }).join(', ');
        const result = await sql.unsafe(`UPDATE products SET ${setParts}, updated_at = NOW() WHERE id = ${id} RETURNING *`);
        const rows = Array.isArray(result) ? result : result.rows || [];
        return rows[0] ? this.mapProduct(rows[0]) : null;
    }
    static async delete(id) {
        const result = await sql `DELETE FROM products WHERE id = ${id} RETURNING id`;
        return result.length > 0;
    }
    static async adjustStock(productId, quantityChange, type, vendorId, referenceType, referenceId, notes) {
        const result = await sql `
      UPDATE products
      SET stock_quantity = GREATEST(stock_quantity + ${quantityChange}, 0), updated_at = NOW()
      WHERE id = ${productId}
      RETURNING *
    `;
        if (result.length === 0)
            return null;
        await sql `
      INSERT INTO inventory_transactions (id, product_id, vendor_id, type, quantity_change, reference_type, reference_id, notes, created_at)
      VALUES (${`txn_${Math.random().toString(36).slice(2, 11)}`}, ${productId}, ${vendorId}, ${type}, ${quantityChange}, ${referenceType || null}, ${referenceId || null}, ${notes || null}, NOW())
    `;
        return this.mapProduct(result[0]);
    }
    static async getLowStock(vendorId) {
        let query = `SELECT * FROM products WHERE stock_quantity <= min_stock_alert AND is_active = TRUE`;
        if (vendorId)
            query += ` AND vendor_id = '${vendorId}'`;
        query += ` ORDER BY stock_quantity ASC`;
        const result = await sql.unsafe(query);
        const rows = Array.isArray(result) ? result : result.rows || [];
        return rows.map((r) => this.mapProduct(r));
    }
    static mapProduct(row) {
        return {
            id: row.id, vendor_id: row.vendor_id, name: row.name, description: row.description,
            category: row.category, price: Number(row.price), stock_quantity: Number(row.stock_quantity),
            min_stock_alert: Number(row.min_stock_alert), images: this.parseJsonArray(row.images),
            is_active: row.is_active, is_featured: row.is_featured,
            weight_kg: row.weight_kg ? Number(row.weight_kg) : undefined,
            dimensions_cm: row.dimensions_cm ? this.parseJson(row.dimensions_cm) : undefined,
            sku: row.sku, created_at: new Date(row.created_at), updated_at: new Date(row.updated_at),
        };
    }
    static parseJsonArray(val) {
        if (Array.isArray(val))
            return val;
        if (typeof val === 'string') {
            try {
                return JSON.parse(val);
            }
            catch {
                return [];
            }
        }
        return [];
    }
    static parseJson(val) {
        if (typeof val === 'string') {
            try {
                return JSON.parse(val);
            }
            catch {
                return val;
            }
        }
        return val;
    }
}
//# sourceMappingURL=productRepository.js.map