import { describe, it, expect, beforeAll } from 'vitest';
import { CheckoutService } from './checkout.service.js';
import type { CheckoutRequest } from './checkout.service.js';
import { sql } from '../../config/database.js';

describe('CheckoutService.processOrder', () => {
  beforeAll(async () => {
    // Ensure required tables exist and seed test data
    await sql`CREATE TABLE IF NOT EXISTS products (
      id VARCHAR(50) PRIMARY KEY,
      vendor_id VARCHAR(50) NOT NULL,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      category VARCHAR(100) NOT NULL,
      price NUMERIC(10,2) NOT NULL,
      stock_quantity INTEGER NOT NULL DEFAULT 0,
      min_stock_alert INTEGER NOT NULL DEFAULT 5,
      images JSONB DEFAULT '[]'::jsonb,
      is_active BOOLEAN DEFAULT TRUE,
      is_featured BOOLEAN DEFAULT FALSE,
      weight_kg NUMERIC(5,2),
      dimensions_cm JSONB,
      sku VARCHAR(100),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )`;

    await sql`CREATE TABLE IF NOT EXISTS inventory_transactions (
      id VARCHAR(50) PRIMARY KEY,
      product_id VARCHAR(50) NOT NULL REFERENCES products(id),
      vendor_id VARCHAR(50) NOT NULL,
      type VARCHAR(50) NOT NULL,
      quantity_change INTEGER NOT NULL,
      reference_type VARCHAR(50),
      reference_id VARCHAR(50),
      notes TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )`;

    await sql`CREATE TABLE IF NOT EXISTS orders (
      id VARCHAR(50) PRIMARY KEY,
      customer_id VARCHAR(50) NOT NULL,
      customer_name VARCHAR(255) NOT NULL,
      customer_address TEXT NOT NULL,
      customer_latitude NUMERIC(10,7),
      customer_longitude NUMERIC(10,7),
      vendor_id VARCHAR(50) NOT NULL,
      vendor_name VARCHAR(255) NOT NULL,
      items JSONB DEFAULT '[]'::jsonb,
      subtotal NUMERIC(12,2) NOT NULL DEFAULT 0,
      delivery_fee NUMERIC(10,2) NOT NULL DEFAULT 0,
      service_charge NUMERIC(10,2) NOT NULL DEFAULT 0,
      vendor_platform_fee NUMERIC(10,2) NOT NULL DEFAULT 0,
      total_platform_earnings NUMERIC(12,2) NOT NULL DEFAULT 0,
      vendor_net_payout NUMERIC(12,2) NOT NULL DEFAULT 0,
      grand_total NUMERIC(12,2) NOT NULL DEFAULT 0,
      distance_km NUMERIC(10,2),
      rate_per_km NUMERIC(10,2),
      status VARCHAR(50) DEFAULT 'pending',
      payment_status VARCHAR(50) DEFAULT 'pending',
      paypal_order_id VARCHAR(255),
      paypal_capture_id VARCHAR(255),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )`;

    await sql`CREATE TABLE IF NOT EXISTS order_items (
      id VARCHAR(50) PRIMARY KEY,
      order_id VARCHAR(50) NOT NULL REFERENCES orders(id),
      product_id VARCHAR(50),
      vendor_id VARCHAR(50) NOT NULL,
      vendor_name VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL,
      price NUMERIC(10,2) NOT NULL,
      quantity INTEGER NOT NULL,
      subtotal NUMERIC(12,2) NOT NULL,
      status VARCHAR(50) DEFAULT 'pending',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )`;

    await sql`CREATE TABLE IF NOT EXISTS escrow_splits (
      id VARCHAR(50) PRIMARY KEY,
      order_id VARCHAR(50) NOT NULL,
      customer_id VARCHAR(50) NOT NULL,
      vendor_id VARCHAR(50) NOT NULL,
      retailer_id VARCHAR(50),
      wholesaler_id VARCHAR(50),
      delivery_driver_id VARCHAR(50),
      subtotal NUMERIC(12,2) NOT NULL DEFAULT 0,
      delivery_fee NUMERIC(10,2) NOT NULL DEFAULT 0,
      platform_fee_percent NUMERIC(5,2) DEFAULT 0,
      vendor_platform_fee_percent NUMERIC(5,2) DEFAULT 0,
      currency VARCHAR(10) DEFAULT 'PHP',
      total_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
      admin_earnings NUMERIC(12,2) NOT NULL DEFAULT 0,
      vendor_earnings NUMERIC(12,2) NOT NULL DEFAULT 0,
      retailer_earnings NUMERIC(12,2) NOT NULL DEFAULT 0,
      wholesaler_earnings NUMERIC(12,2) NOT NULL DEFAULT 0,
      delivery_driver_earnings NUMERIC(12,2) NOT NULL DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )`;

    await sql`CREATE TABLE IF NOT EXISTS escrow_split_items (
      id VARCHAR(50) PRIMARY KEY,
      split_id VARCHAR(50) NOT NULL REFERENCES escrow_splits(id),
      recipient_type VARCHAR(50) NOT NULL,
      recipient_id VARCHAR(50) NOT NULL,
      amount NUMERIC(12,2) NOT NULL,
      currency VARCHAR(10) DEFAULT 'PHP',
      status VARCHAR(50) DEFAULT 'pending',
      paypal_transaction_id VARCHAR(255),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )`;

    // Insert test users (needed for foreign key constraints)
    await sql`INSERT INTO users (id, email, password_hash, role, first_name, middle_name, last_name, phone, address, full_name, is_active, is_email_verified, kyc_verified, kyc_documents, created_at, updated_at) VALUES
      ('user_demo_123', 'demo_test_123@example.com', 'hash', 'customer', 'Demo', NULL, 'User', '1234567890', '123 Main St', 'Demo User', TRUE, FALSE, FALSE, '[]'::jsonb, NOW(), NOW())
      ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email, password_hash = EXCLUDED.password_hash, role = EXCLUDED.role, first_name = EXCLUDED.first_name, middle_name = EXCLUDED.middle_name, last_name = EXCLUDED.last_name, phone = EXCLUDED.phone, address = EXCLUDED.address, full_name = EXCLUDED.full_name, is_active = EXCLUDED.is_active, is_email_verified = EXCLUDED.is_email_verified, kyc_verified = EXCLUDED.kyc_verified, kyc_documents = EXCLUDED.kyc_documents, updated_at = NOW()`;
    await sql`INSERT INTO users (id, email, password_hash, role, first_name, middle_name, last_name, phone, address, full_name, is_active, is_email_verified, kyc_verified, kyc_documents, created_at, updated_at) VALUES
      ('vendor_1', 'vendor_test_1@example.com', 'hash', 'vendor', 'Test', NULL, 'Vendor', '1234567890', '123 Vendor St', 'Test Vendor', TRUE, FALSE, FALSE, '[]'::jsonb, NOW(), NOW())
      ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email, password_hash = EXCLUDED.password_hash, role = EXCLUDED.role, first_name = EXCLUDED.first_name, middle_name = EXCLUDED.middle_name, last_name = EXCLUDED.last_name, phone = EXCLUDED.phone, address = EXCLUDED.address, full_name = EXCLUDED.full_name, is_active = EXCLUDED.is_active, is_email_verified = EXCLUDED.is_email_verified, kyc_verified = EXCLUDED.kyc_verified, kyc_documents = EXCLUDED.kyc_documents, updated_at = NOW()`;

    // Insert test products
    await sql`INSERT INTO products (id, vendor_id, name, description, category, price, stock_quantity, min_stock_alert, images, is_active, is_featured, sku) VALUES
      ('prod_1', 'vendor_1', 'Fresh Milk', 'Dairy product', 'dairy', 80, 100, 5, '[]'::jsonb, TRUE, FALSE, 'MILK-001')
      ON CONFLICT (id) DO UPDATE SET stock_quantity = 100, is_active = TRUE`;
    await sql`INSERT INTO products (id, vendor_id, name, description, category, price, stock_quantity, min_stock_alert, images, is_active, is_featured, sku) VALUES
      ('prod_2', 'vendor_1', 'Bread', 'Bakery product', 'bakery', 45, 100, 5, '[]'::jsonb, TRUE, FALSE, 'BREAD-001')
      ON CONFLICT (id) DO UPDATE SET stock_quantity = 100, is_active = TRUE`;
  });

  const baseRequest: CheckoutRequest = {
    items: [
      { productId: 'prod_1', vendorId: 'vendor_1', vendorName: 'Test Vendor', name: 'Fresh Milk', price: 80, quantity: 2 },
      { productId: 'prod_2', vendorId: 'vendor_1', vendorName: 'Test Vendor', name: 'Bread', price: 45, quantity: 1 },
    ],
    customerId: 'user_demo_123',
    customerName: 'Demo User',
    customerAddress: '123 Main St',
    customerLatitude: 14.5995,
    customerLongitude: 120.9842,
    deliveryFee: 50,
    distanceKm: 5,
    ratePerKm: 10,
  };

  it('should return success with orderId and vendorSummaries', async () => {
    const result = await CheckoutService.processOrder(baseRequest);

    expect(result.success).toBe(true);
    expect(result.orderId).toBeDefined();
    expect(result.order).toBeDefined();
    expect(result.vendorSummaries.length).toBeGreaterThan(0);
    expect(result.errors.length).toBe(0);
  });

  it('should generate a unique order ID on each call', async () => {
    const result1 = await CheckoutService.processOrder(baseRequest);
    const result2 = await CheckoutService.processOrder(baseRequest);

    expect(result1.orderId).not.toBe(result2.orderId);
  });

  it('should return validation errors for empty cart', async () => {
    const result = await CheckoutService.processOrder({ ...baseRequest, items: [] });

    expect(result.success).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });
});