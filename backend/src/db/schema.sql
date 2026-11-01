-- instaCart.PH Neon PostgreSQL Schema (Part 1: Core User Tables)
-- Migrates in-memory Map stores to PostgreSQL tables

-- ==========================================
-- 1. USERS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(50) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'customer',
  first_name VARCHAR(100) NOT NULL,
  middle_name VARCHAR(100),
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  address TEXT DEFAULT '',
  full_name VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE,
  is_email_verified BOOLEAN DEFAULT FALSE,
  kyc_verified BOOLEAN DEFAULT FALSE,
  kyc_documents JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- ==========================================
-- 2. VENDOR PROFILES
-- ==========================================
CREATE TABLE IF NOT EXISTS vendor_profiles (
  id VARCHAR(50) PRIMARY KEY,
  user_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
  business_name VARCHAR(255) NOT NULL,
  legal_name VARCHAR(255) NOT NULL,
  contact_name VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL,
  operational_class VARCHAR(50) NOT NULL,
  payout_channel VARCHAR(50) NOT NULL,
  payout_account_name VARCHAR(255) NOT NULL,
  payout_account_reference VARCHAR(255) NOT NULL,
  paypal_checkout_link VARCHAR(500),
  platform_fee_percent NUMERIC(5,2) DEFAULT 0,
  status VARCHAR(50) DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vendor_profiles_user_id ON vendor_profiles(user_id);

-- ==========================================
-- 3. WHOLESALER PROFILES
-- ==========================================
CREATE TABLE IF NOT EXISTS wholesaler_profiles (
  id VARCHAR(50) PRIMARY KEY,
  user_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
  business_name VARCHAR(255) NOT NULL,
  legal_name VARCHAR(255) NOT NULL,
  contact_name VARCHAR(255) NOT NULL,
  payout_channel VARCHAR(50) NOT NULL,
  payout_account_name VARCHAR(255) NOT NULL,
  payout_account_reference VARCHAR(255) NOT NULL,
  paypal_checkout_link VARCHAR(500),
  platform_fee_percent NUMERIC(5,2) DEFAULT 0,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_wholesaler_profiles_user_id ON wholesaler_profiles(user_id);

-- ==========================================
-- 4. DRIVER PROFILES
-- ==========================================
CREATE TABLE IF NOT EXISTS driver_profiles (
  id VARCHAR(50) PRIMARY KEY,
  user_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  license_number VARCHAR(100) NOT NULL,
  vehicle_type VARCHAR(50) NOT NULL,
  rate_per_kilometer NUMERIC(10,2) DEFAULT 0,
  is_available BOOLEAN DEFAULT TRUE,
  current_latitude NUMERIC(10,7),
  current_longitude NUMERIC(10,7),
  total_deliveries INTEGER DEFAULT 0,
  total_earnings NUMERIC(12,2) DEFAULT 0,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_driver_profiles_user_id ON driver_profiles(user_id);

-- ==========================================
-- 5. RETAILER PROFILES

-- ==========================================
-- 7. REFRESH TOKENS
-- ==========================================
CREATE TABLE IF NOT EXISTS refresh_tokens (
  token VARCHAR(500) PRIMARY KEY,
  user_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id ON refresh_tokens(user_id);

-- ==========================================
-- 8. COMPLIANCE RECORDS
-- ==========================================
CREATE TABLE IF NOT EXISTS compliance_records (
  id VARCHAR(50) PRIMARY KEY,
  user_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
  user_role VARCHAR(50) NOT NULL,
  email VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  lockin_reason TEXT,
  requested_by VARCHAR(255),
  approved_by VARCHAR(255),
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_compliance_records_user_id ON compliance_records(user_id);

-- ==========================================
-- 9. CHANGE EMAIL REQUESTS
-- ==========================================
CREATE TABLE IF NOT EXISTS change_email_requests (
  id VARCHAR(50) PRIMARY KEY,
  user_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
  old_email VARCHAR(255) NOT NULL,
  new_email VARCHAR(255) NOT NULL,
  token VARCHAR(255) UNIQUE NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_change_email_requests_token ON change_email_requests(token);

-- ==========================================
-- 10. CHANGE PASSWORD REQUESTS
-- ==========================================
CREATE TABLE IF NOT EXISTS change_password_requests (
  id VARCHAR(50) PRIMARY KEY,
  user_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(255) UNIQUE NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_change_password_requests_token ON change_password_requests(token);

-- ==========================================
-- 11. USER COMPLAINTS
-- ==========================================
CREATE TABLE IF NOT EXISTS user_complaints (
  id VARCHAR(50) PRIMARY KEY,
  user_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
  reported_by VARCHAR(255) NOT NULL,
  reported_by_email VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'open',
  admin_response TEXT,
  resolved_by VARCHAR(255),
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_complaints_user_id ON user_complaints(user_id);

-- ==========================================
-- 12. ADMIN NOTIFICATIONS
-- ==========================================
CREATE TABLE IF NOT EXISTS admin_notifications (
  id VARCHAR(50) PRIMARY KEY,
  admin_email VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'system',
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_notifications_admin_email ON admin_notifications(admin_email);
-- ==========================================
CREATE TABLE IF NOT EXISTS retailer_profiles (
  id VARCHAR(50) PRIMARY KEY,
  user_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,

-- ==========================================
-- 13. ORDERS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS orders (
  id VARCHAR(50) PRIMARY KEY,
  customer_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
  customer_name VARCHAR(255) NOT NULL,
  customer_address TEXT NOT NULL,
  customer_latitude NUMERIC(10,7) NOT NULL,
  customer_longitude NUMERIC(10,7) NOT NULL,
  vendor_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
  vendor_name VARCHAR(255) NOT NULL,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  subtotal NUMERIC(12,2) NOT NULL DEFAULT 0,
  delivery_fee NUMERIC(12,2) NOT NULL DEFAULT 0,
  service_charge NUMERIC(12,2) NOT NULL DEFAULT 0,
  vendor_platform_fee NUMERIC(12,2) NOT NULL DEFAULT 0,
  total_platform_earnings NUMERIC(12,2) NOT NULL DEFAULT 0,
  vendor_net_payout NUMERIC(12,2) NOT NULL DEFAULT 0,
  grand_total NUMERIC(12,2) NOT NULL DEFAULT 0,
  distance_km NUMERIC(10,2) NOT NULL DEFAULT 0,
  rate_per_km NUMERIC(10,2) NOT NULL DEFAULT 0,
  status VARCHAR(50) DEFAULT 'pending',
  payment_status VARCHAR(50) DEFAULT 'pending',
  paypal_order_id VARCHAR(255),
  paypal_capture_id VARCHAR(255),
  driver_id VARCHAR(50) REFERENCES users(id),
  driver_name VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_vendor_id ON orders(vendor_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_driver_id ON orders(driver_id);

-- ==========================================
-- 13b. PRODUCTS TABLE (Vendor Catalog)
-- ==========================================
-- Each product is tied to a specific vendor_id for inventory isolation.
-- Prevents cross-vendor inventory tampering per the marketplace architecture.
CREATE TABLE IF NOT EXISTS products (
  id VARCHAR(50) PRIMARY KEY,
  vendor_id VARCHAR(50) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100) NOT NULL,
  price NUMERIC(12,2) NOT NULL DEFAULT 0,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  min_stock_alert INTEGER DEFAULT 5,
  images JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  weight_kg NUMERIC(6,3),
  dimensions_cm JSONB,
  sku VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_vendor_id ON products(vendor_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);

-- ==========================================
-- 13c. ORDER ITEMS TABLE (Multi-Vendor Order Splitting)
-- ==========================================
-- Each order item is tied to a specific vendor_id, enabling per-vendor
-- fulfillment tracking and escrow splits for multi-vendor carts.
CREATE TABLE IF NOT EXISTS order_items (
  id VARCHAR(50) PRIMARY KEY,
  order_id VARCHAR(50) NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id VARCHAR(50) REFERENCES products(id) ON DELETE SET NULL,
  vendor_id VARCHAR(50) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  vendor_name VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  price NUMERIC(12,2) NOT NULL DEFAULT 0,
  quantity INTEGER NOT NULL DEFAULT 1,
  subtotal NUMERIC(12,2) NOT NULL DEFAULT 0,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_vendor_id ON order_items(vendor_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_order_items_status ON order_items(status);

-- ==========================================
-- 13d. INVENTORY TRANSACTIONS TABLE (Stock Audit Log)
-- ==========================================
-- Immutable audit trail for all stock adjustments (reserve, release, deduct, restock).
CREATE TABLE IF NOT EXISTS inventory_transactions (
  id VARCHAR(50) PRIMARY KEY,
  product_id VARCHAR(50) NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  vendor_id VARCHAR(50) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL, -- 'reserve' | 'release' | 'deduct' | 'restock' | 'adjust'
  quantity_change INTEGER NOT NULL,
  reference_type VARCHAR(50), -- 'order' | 'manual' | 'restock'
  reference_id VARCHAR(50),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_inventory_transactions_product_id ON inventory_transactions(product_id);
CREATE INDEX IF NOT EXISTS idx_inventory_transactions_vendor_id ON inventory_transactions(vendor_id);
CREATE INDEX IF NOT EXISTS idx_inventory_transactions_type ON inventory_transactions(type);
CREATE INDEX IF NOT EXISTS idx_inventory_transactions_created_at ON inventory_transactions(created_at);

-- ==========================================
-- 13e. DELIVERY RECEIPTS TABLE (Proof of Delivery)
-- ==========================================
-- Vendors upload delivery receipts/tracking notes for fulfilled orders.
CREATE TABLE IF NOT EXISTS delivery_receipts (
  id VARCHAR(50) PRIMARY KEY,
  order_id VARCHAR(50) NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  vendor_id VARCHAR(50) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  receipt_url VARCHAR(500) NOT NULL,
  tracking_number VARCHAR(255),
  delivery_notes TEXT,
  delivered_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_delivery_receipts_order_id ON delivery_receipts(order_id);
CREATE INDEX IF NOT EXISTS idx_delivery_receipts_vendor_id ON delivery_receipts(vendor_id);

-- ==========================================
-- 14. WITHDRAWALS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS withdrawals (
  id VARCHAR(50) PRIMARY KEY,
  user_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
  user_role VARCHAR(50) NOT NULL,
  amount NUMERIC(12,2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'PHP',
  payout_channel VARCHAR(50) NOT NULL,
  payout_account VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  paypal_payout_batch_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_withdrawals_user_id ON withdrawals(user_id);
CREATE INDEX IF NOT EXISTS idx_withdrawals_status ON withdrawals(status);

-- ==========================================
-- 15. ESCROW SPLITS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS escrow_splits (
  id VARCHAR(50) PRIMARY KEY,
  order_id VARCHAR(50) REFERENCES orders(id) ON DELETE CASCADE,
  customer_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
  vendor_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
  retailer_id VARCHAR(50) REFERENCES users(id),
  wholesaler_id VARCHAR(50) REFERENCES users(id),
  delivery_driver_id VARCHAR(50) REFERENCES users(id),
  subtotal NUMERIC(12,2) NOT NULL DEFAULT 0,
  delivery_fee NUMERIC(12,2) NOT NULL DEFAULT 0,
  platform_fee_percent NUMERIC(5,2) DEFAULT 2,
  vendor_platform_fee_percent NUMERIC(5,2) DEFAULT 0,
  currency VARCHAR(10) DEFAULT 'PHP',
  total_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  admin_earnings NUMERIC(12,2) NOT NULL DEFAULT 0,
  vendor_earnings NUMERIC(12,2) NOT NULL DEFAULT 0,
  retailer_earnings NUMERIC(12,2) NOT NULL DEFAULT 0,
  wholesaler_earnings NUMERIC(12,2) NOT NULL DEFAULT 0,
  delivery_driver_earnings NUMERIC(12,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_escrow_splits_order_id ON escrow_splits(order_id);

-- ==========================================
-- 16. ESCROW SPLIT ITEMS
-- ==========================================
CREATE TABLE IF NOT EXISTS escrow_split_items (
  id VARCHAR(50) PRIMARY KEY,
  split_id VARCHAR(50) REFERENCES escrow_splits(id) ON DELETE CASCADE,
  recipient_type VARCHAR(50) NOT NULL,
  recipient_id VARCHAR(50) NOT NULL,
  amount NUMERIC(12,2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'PHP',
  status VARCHAR(50) DEFAULT 'pending',
  paypal_transaction_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- 17. KYC DOCUMENTS
-- ==========================================
CREATE TABLE IF NOT EXISTS kyc_documents (
  id VARCHAR(50) PRIMARY KEY,
  user_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
  user_role VARCHAR(50) NOT NULL,
  document_type VARCHAR(100) NOT NULL,
  document_name VARCHAR(255) NOT NULL,
  file_url VARCHAR(500) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  rejected_reason TEXT,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by VARCHAR(255),
  expiry_date TIMESTAMP WITH TIME ZONE,
  is_required BOOLEAN DEFAULT FALSE,
  compliance_score INTEGER DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_kyc_documents_user_id ON kyc_documents(user_id);

-- ==========================================
-- 18. COMPLIANCE PROFILES
-- ==========================================
CREATE TABLE IF NOT EXISTS compliance_profiles (
  id VARCHAR(50) PRIMARY KEY,
  user_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
  user_role VARCHAR(50) NOT NULL,
  overall_status VARCHAR(50) DEFAULT 'pending',
  compliance_percentage NUMERIC(5,2) DEFAULT 0,
  documents_submitted INTEGER DEFAULT 0,
  documents_required INTEGER DEFAULT 0,
  documents_approved INTEGER DEFAULT 0,
  documents_rejected INTEGER DEFAULT 0,
  is_compliant BOOLEAN DEFAULT FALSE,
  can_go_live BOOLEAN DEFAULT FALSE,
  last_reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_compliance_profiles_user_id ON compliance_profiles(user_id);

-- ==========================================
-- 19. SUBSCRIPTIONS
-- ==========================================
CREATE TABLE IF NOT EXISTS subscriptions (
  id VARCHAR(50) PRIMARY KEY,
  user_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
  plan_name VARCHAR(50) NOT NULL,
  status VARCHAR(50) DEFAULT 'active',
  current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);

CREATE INDEX IF NOT EXISTS idx_escrow_split_items_split_id ON escrow_split_items(split_id);
  store_name VARCHAR(255) NOT NULL,
  owner_name VARCHAR(255) NOT NULL,
  contact_email VARCHAR(255) NOT NULL,
  contact_phone VARCHAR(50) NOT NULL,
  address TEXT NOT NULL,
  paypal_email VARCHAR(255) NOT NULL,
  platform_fee_percent NUMERIC(5,2) DEFAULT 0,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_retailer_profiles_user_id ON retailer_profiles(user_id);


-- ==========================================
-- 20. POSTS
-- ==========================================
CREATE TABLE IF NOT EXISTS posts (
  id VARCHAR(50) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  author_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
  tags JSONB DEFAULT '[]'::jsonb,
  status VARCHAR(50) DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_posts_author_id ON posts(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);

-- ==========================================
-- 21. ESCROW ACCOUNTS (KYC module)
-- ==========================================
CREATE TABLE IF NOT EXISTS escrow_accounts (
  id VARCHAR(50) PRIMARY KEY,
  transaction_id VARCHAR(50) NOT NULL,
  buyer_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
  seller_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
  developer_id VARCHAR(50) REFERENCES users(id),
  agent_id VARCHAR(50) REFERENCES users(id),
  amount NUMERIC(12,2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'PHP',
  status VARCHAR(50) DEFAULT 'held',
  purpose TEXT NOT NULL,
  release_conditions JSONB DEFAULT '[]'::jsonb,
  conditions_met BOOLEAN DEFAULT FALSE,
  deposited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  released_at TIMESTAMP WITH TIME ZONE,
  refunded_at TIMESTAMP WITH TIME ZONE,
  paypal_transaction_id VARCHAR(255),
  service_charge_amount NUMERIC(12,2) DEFAULT 0,
  service_charge_paid_to_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_escrow_accounts_transaction_id ON escrow_accounts(transaction_id);
-- ==========================================
-- 6. CUSTOMER PROFILES
-- ==========================================
CREATE TABLE IF NOT EXISTS customer_profiles (
  id VARCHAR(50) PRIMARY KEY,
  user_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  address TEXT NOT NULL,
  default_latitude NUMERIC(10,7),
  default_longitude NUMERIC(10,7),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()

-- ==========================================
-- 22. BUSINESS TRANSACTIONS (KYC module)
-- ==========================================
CREATE TABLE IF NOT EXISTS business_transactions (
  id VARCHAR(50) PRIMARY KEY,
  property_id VARCHAR(50) NOT NULL,
  property_title VARCHAR(255) NOT NULL,
  buyer_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
  seller_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
  developer_id VARCHAR(50) REFERENCES users(id),
  agent_id VARCHAR(50) REFERENCES users(id),
  agent_commission_amount NUMERIC(12,2) DEFAULT 0,
  service_charge_amount NUMERIC(12,2) DEFAULT 0,
  total_amount NUMERIC(12,2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'PHP',
  status VARCHAR(50) DEFAULT 'pending',
  escrow_account_id VARCHAR(50) REFERENCES escrow_accounts(id),
  paypal_transaction_id VARCHAR(255),
  admin_service_charge_paid BOOLEAN DEFAULT FALSE,
  agent_commission_paid BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_business_transactions_buyer_id ON business_transactions(buyer_id);
CREATE INDEX IF NOT EXISTS idx_business_transactions_seller_id ON business_transactions(seller_id);

-- ==========================================
-- 23. AGENT-DEVELOPER CONNECTIONS
-- ==========================================
CREATE TABLE IF NOT EXISTS agent_developer_connections (
  id VARCHAR(50) PRIMARY KEY,
  agent_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
  developer_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
  connection_status VARCHAR(50) DEFAULT 'pending',
  commission_rate NUMERIC(5,2) DEFAULT 0,
  total_commission_earned NUMERIC(12,2) DEFAULT 0,
  connected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  terminated_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_agent_developer_connections_agent_id ON agent_developer_connections(agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_developer_connections_developer_id ON agent_developer_connections(developer_id);

-- ==========================================
-- 24. MARKETING MATERIALS
-- ==========================================
CREATE TABLE IF NOT EXISTS marketing_materials (
  id VARCHAR(50) PRIMARY KEY,
  developer_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
  project_name VARCHAR(255) NOT NULL,
  material_type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  file_url VARCHAR(500) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by VARCHAR(255)
);

CREATE INDEX IF NOT EXISTS idx_marketing_materials_developer_id ON marketing_materials(developer_id);
);

-- ==========================================
-- 25. USER APP ROLES (Centralized SSO / Multi-App)
-- ==========================================
-- Maps a global user to per-app roles so a user can be
-- "Admin" in App A but "Member" in App B, etc.
CREATE TABLE IF NOT EXISTS user_app_roles (
  id VARCHAR(50) PRIMARY KEY,
  user_id VARCHAR(50) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  app_id VARCHAR(50) NOT NULL,
  app_role VARCHAR(50) NOT NULL DEFAULT 'member',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_app_roles_user_id ON user_app_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_app_roles_app_id ON user_app_roles(app_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_app_roles_unique ON user_app_roles(user_id, app_id);

-- ==========================================
-- 26. OAUTH AUTHORIZATION CODES (Persistent SSO)
-- ==========================================
-- Persistent replacement for the in-memory authCodes Map.
CREATE TABLE IF NOT EXISTS oauth_authorization_codes (
  id VARCHAR(50) PRIMARY KEY,
  code VARCHAR(255) UNIQUE NOT NULL,
  user_id VARCHAR(50) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  client_id VARCHAR(100) NOT NULL,
  redirect_uri TEXT NOT NULL,
  scope TEXT NOT NULL DEFAULT '',
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_oauth_auth_codes_code ON oauth_authorization_codes(code);
CREATE INDEX IF NOT EXISTS idx_oauth_auth_codes_user_id ON oauth_authorization_codes(user_id);
CREATE INDEX IF NOT EXISTS idx_oauth_auth_codes_expires_at ON oauth_authorization_codes(expires_at);

-- ==========================================
-- 27. OAUTH SESSIONS (Cross-App Single Sign-Out)
-- ==========================================
-- Tracks every active session per user per app so logging out
-- of one app can revoke all sessions across all apps.
CREATE TABLE IF NOT EXISTS oauth_sessions (
  id VARCHAR(50) PRIMARY KEY,
  user_id VARCHAR(50) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  app_id VARCHAR(100) NOT NULL,
  access_token_hash VARCHAR(255) NOT NULL,
  refresh_token_hash VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  revoked BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_oauth_sessions_user_id ON oauth_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_oauth_sessions_app_id ON oauth_sessions(app_id);
CREATE INDEX IF NOT EXISTS idx_oauth_sessions_access_token ON oauth_sessions(access_token_hash);
CREATE INDEX IF NOT EXISTS idx_oauth_sessions_revoked ON oauth_sessions(revoked);

-- ==========================================
-- 28. OAUTH CLIENTS (Registered SSO client apps)
-- ==========================================
CREATE TABLE IF NOT EXISTS oauth_clients (
  id VARCHAR(100) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  client_secret VARCHAR(255) NOT NULL,
  redirect_uris TEXT NOT NULL DEFAULT '', -- comma-separated
  scope TEXT NOT NULL DEFAULT '',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_oauth_clients_id ON oauth_clients(id);