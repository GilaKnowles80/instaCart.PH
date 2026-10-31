import { sql } from '../config/database.js';
export { sql };
export class UserRepository {
    static async create(data) {
        const result = await sql `
      INSERT INTO users (id, email, password_hash, role, first_name, middle_name, last_name, phone, address, full_name, kyc_documents, created_at, updated_at)
      VALUES (${data.id}, ${data.email}, ${data.passwordHash}, ${data.role}, ${data.firstName}, ${data.middleName || null}, ${data.lastName}, ${data.phone}, ${data.address || ''}, ${data.fullName}, ${JSON.stringify(data.kycDocuments || [])}, NOW(), NOW())
      RETURNING *
    `;
        return result[0];
    }
    static async findByEmail(email) {
        const result = await sql `SELECT * FROM users WHERE email = ${email}`;
        return result[0] || null;
    }
    static async findById(id) {
        const result = await sql `SELECT * FROM users WHERE id = ${id}`;
        return result[0] || null;
    }
    static async getAll() {
        const result = await sql `SELECT id, email, role, first_name, middle_name, last_name, phone, address, full_name, is_active, is_email_verified, kyc_verified, kyc_documents, created_at, updated_at FROM users`;
        return result;
    }
    static async delete(id) {
        await sql `DELETE FROM users WHERE id = ${id}`;
    }
    static async update(id, updates) {
        const fields = Object.keys(updates);
        if (fields.length === 0)
            return null;
        const setParts = fields.map((key) => `${key} = ${updates[key]}`).join(', ');
        const result = (await sql.unsafe(`UPDATE users SET ${setParts}, updated_at = NOW() WHERE id = ${id} RETURNING *`));
        return result[0] || null;
    }
}
export class ProfileRepository {
    static async createVendor(data) {
        const result = await sql `
      INSERT INTO vendor_profiles (id, user_id, business_name, legal_name, contact_name, category, operational_class, payout_channel, payout_account_name, payout_account_reference, paypal_checkout_link, platform_fee_percent, status, created_at, updated_at)
      VALUES (${data.id}, ${data.userId}, ${data.businessName}, ${data.legalName}, ${data.contactName}, ${data.category}, ${data.operationalClass}, ${data.payoutChannel}, ${data.payoutAccountName}, ${data.payoutAccountReference}, ${data.paypalCheckoutLink || null}, ${data.platformFeePercent || 0}, ${data.status || 'draft'}, NOW(), NOW())
      RETURNING *
    `;
        return result[0];
    }
    static async getVendorByUserId(userId) {
        const result = await sql `SELECT * FROM vendor_profiles WHERE user_id = ${userId}`;
        return result[0] || null;
    }
    static async createWholesaler(data) {
        const result = await sql `
      INSERT INTO wholesaler_profiles (id, user_id, business_name, legal_name, contact_name, payout_channel, payout_account_name, payout_account_reference, paypal_checkout_link, platform_fee_percent, status, created_at, updated_at)
      VALUES (${data.id}, ${data.userId}, ${data.businessName}, ${data.legalName}, ${data.contactName}, ${data.payoutChannel}, ${data.payoutAccountName}, ${data.payoutAccountReference}, ${data.paypalCheckoutLink || null}, ${data.platformFeePercent || 0}, ${data.status || 'pending'}, NOW(), NOW())
      RETURNING *
    `;
        return result[0];
    }
    static async getWholesalerByUserId(userId) {
        const result = await sql `SELECT * FROM wholesaler_profiles WHERE user_id = ${userId}`;
        return result[0] || null;
    }
    static async createDriver(data) {
        const result = await sql `
      INSERT INTO driver_profiles (id, user_id, first_name, last_name, email, phone, license_number, vehicle_type, rate_per_kilometer, is_available, current_latitude, current_longitude, total_deliveries, total_earnings, status, created_at, updated_at)
      VALUES (${data.id}, ${data.userId}, ${data.firstName}, ${data.lastName}, ${data.email}, ${data.phone}, ${data.licenseNumber}, ${data.vehicleType}, ${data.ratePerKilometer || 0}, ${data.isAvailable !== false}, ${data.currentLatitude || null}, ${data.currentLongitude || null}, ${data.totalDeliveries || 0}, ${data.totalEarnings || 0}, ${data.status || 'pending'}, NOW(), NOW())
      RETURNING *
    `;
        return result[0];
    }
    static async getDriverByUserId(userId) {
        const result = await sql `SELECT * FROM driver_profiles WHERE user_id = ${userId}`;
        return result[0] || null;
    }
    static async createRetailer(data) {
        const result = await sql `
      INSERT INTO retailer_profiles (id, user_id, store_name, owner_name, contact_email, contact_phone, address, paypal_email, platform_fee_percent, status, created_at, updated_at)
      VALUES (${data.id}, ${data.userId}, ${data.storeName}, ${data.ownerName}, ${data.contactEmail}, ${data.contactPhone}, ${data.address}, ${data.paypalEmail}, ${data.platformFeePercent || 0}, ${data.status || 'pending'}, NOW(), NOW())
      RETURNING *
    `;
        return result[0];
    }
    static async getRetailerByUserId(userId) {
        const result = await sql `SELECT * FROM retailer_profiles WHERE user_id = ${userId}`;
        return result[0] || null;
    }
    static async createCustomer(data) {
        const result = await sql `
      INSERT INTO customer_profiles (id, user_id, first_name, last_name, email, phone, address, default_latitude, default_longitude, created_at, updated_at)
      VALUES (${data.id}, ${data.userId}, ${data.firstName}, ${data.lastName}, ${data.email}, ${data.phone}, ${data.address}, ${data.defaultLatitude || null}, ${data.defaultLongitude || null}, NOW(), NOW())
      RETURNING *
    `;
        return result[0];
    }
    static async getCustomerByUserId(userId) {
        const result = await sql `SELECT * FROM customer_profiles WHERE user_id = ${userId}`;
        return result[0] || null;
    }
}
export class RefreshTokenRepository {
    static async create(token, userId) {
        await sql `INSERT INTO refresh_tokens (token, user_id, created_at) VALUES (${token}, ${userId}, NOW())`;
    }
    static async find(token) {
        const result = await sql `SELECT * FROM refresh_tokens WHERE token = ${token}`;
        return result[0] || null;
    }
    static async delete(token) {
        await sql `DELETE FROM refresh_tokens WHERE token = ${token}`;
    }
    static async deleteByUserId(userId) {
        await sql `DELETE FROM refresh_tokens WHERE user_id = ${userId}`;
    }
}
export class ComplianceRecordRepository {
    static async create(data) {
        const result = await sql `
      INSERT INTO compliance_records (id, user_id, user_role, email, status, lockin_reason, requested_by, approved_by, approved_at, created_at, updated_at)
      VALUES (${data.id}, ${data.userId}, ${data.userRole}, ${data.email}, ${data.status || 'pending'}, ${data.lockinReason || null}, ${data.requestedBy || null}, ${data.approvedBy || null}, ${data.approvedAt || null}, NOW(), NOW())
      RETURNING *
    `;
        return result[0];
    }
    static async findById(id) {
        const result = await sql `SELECT * FROM compliance_records WHERE id = ${id}`;
        return result[0] || null;
    }
    static async findByUserId(userId) {
        const result = await sql `SELECT * FROM compliance_records WHERE user_id = ${userId}`;
        return result;
    }
    static async update(id, updates) {
        const fields = Object.keys(updates);
        if (fields.length === 0)
            return null;
        const setParts = fields.map((key) => `${key} = ${updates[key]}`).join(', ');
        const result = (await sql.unsafe(`UPDATE compliance_records SET ${setParts}, updated_at = NOW() WHERE id = ${id} RETURNING *`));
        return result[0] || null;
    }
    static async getAll() {
        const result = await sql `SELECT * FROM compliance_records`;
        return result;
    }
}
export class ChangeEmailRequestRepository {
    static async create(data) {
        const result = await sql `
      INSERT INTO change_email_requests (id, user_id, old_email, new_email, token, status, expires_at, created_at)
      VALUES (${data.id}, ${data.userId}, ${data.oldEmail}, ${data.newEmail}, ${data.token}, ${data.status || 'pending'}, ${data.expiresAt}, NOW())
      RETURNING *
    `;
        return result[0];
    }
    static async findByToken(token) {
        const result = await sql `SELECT * FROM change_email_requests WHERE token = ${token}`;
        return result[0] || null;
    }
    static async update(id, updates) {
        const fields = Object.keys(updates);
        if (fields.length === 0)
            return null;
        const setParts = fields.map((key) => `${key} = ${updates[key]}`).join(', ');
        const result = (await sql.unsafe(`UPDATE change_email_requests SET ${setParts} WHERE id = ${id} RETURNING *`));
        return result[0] || null;
    }
}
export class ChangePasswordRequestRepository {
    static async create(data) {
        const result = await sql `
      INSERT INTO change_password_requests (id, user_id, token, status, expires_at, created_at)
      VALUES (${data.id}, ${data.userId}, ${data.token}, ${data.status || 'pending'}, ${data.expiresAt}, NOW())
      RETURNING *
    `;
        return result[0];
    }
    static async findByToken(token) {
        const result = await sql `SELECT * FROM change_password_requests WHERE token = ${token}`;
        return result[0] || null;
    }
    static async update(id, updates) {
        const fields = Object.keys(updates);
        if (fields.length === 0)
            return null;
        const setParts = fields.map((key) => `${key} = ${updates[key]}`).join(', ');
        const result = (await sql.unsafe(`UPDATE change_password_requests SET ${setParts} WHERE id = ${id} RETURNING *`));
        return result[0] || null;
    }
}
export class UserComplaintRepository {
    static async create(data) {
        const result = await sql `
      INSERT INTO user_complaints (id, user_id, reported_by, reported_by_email, type, subject, description, status, created_at, updated_at)
      VALUES (${data.id}, ${data.userId}, ${data.reportedBy}, ${data.reportedByEmail}, ${data.type}, ${data.subject}, ${data.description}, ${data.status || 'open'}, NOW(), NOW())
      RETURNING *
    `;
        return result[0];
    }
    static async getAll() {
        const result = await sql `SELECT * FROM user_complaints ORDER BY created_at DESC`;
        return result;
    }
    static async update(id, updates) {
        const fields = Object.keys(updates);
        if (fields.length === 0)
            return null;
        const setParts = fields.map((key) => `${key} = ${updates[key]}`).join(', ');
        const result = (await sql.unsafe(`UPDATE user_complaints SET ${setParts}, updated_at = NOW() WHERE id = ${id} RETURNING *`));
        return result[0] || null;
    }
}
export class AdminNotificationRepository {
    static async create(data) {
        const result = await sql `
      INSERT INTO admin_notifications (id, admin_email, subject, message, type, read, created_at)
      VALUES (${data.id}, ${data.adminEmail}, ${data.subject}, ${data.message}, ${data.type || 'system'}, ${data.read !== undefined ? data.read : false}, NOW())
      RETURNING *
    `;
        return result[0];
    }
    static async findByAdminEmail(adminEmail) {
        const result = await sql `SELECT * FROM admin_notifications WHERE admin_email = ${adminEmail} ORDER BY created_at DESC`;
        return result;
    }
    static async markRead(id) {
        const result = await sql `UPDATE admin_notifications SET read = TRUE WHERE id = ${id} RETURNING *`;
        return result[0] || null;
    }
}
export class OrderRepository {
    static async create(data) {
        const result = await sql `
      INSERT INTO orders (id, customer_id, customer_name, customer_address, customer_latitude, customer_longitude, vendor_id, vendor_name, items, subtotal, delivery_fee, service_charge, vendor_platform_fee, total_platform_earnings, vendor_net_payout, grand_total, distance_km, rate_per_km, status, payment_status, created_at, updated_at)
      VALUES (${data.id}, ${data.customerId}, ${data.customerName}, ${data.customerAddress}, ${data.customerLatitude}, ${data.customerLongitude}, ${data.vendorId}, ${data.vendorName}, ${JSON.stringify(data.items)}, ${data.subtotal}, ${data.deliveryFee}, ${data.serviceCharge}, ${data.vendorPlatformFee}, ${data.totalPlatformEarnings}, ${data.vendorNetPayout}, ${data.grandTotal}, ${data.distanceKm}, ${data.ratePerKm}, ${data.status || 'pending'}, ${data.paymentStatus || 'pending'}, NOW(), NOW())
      RETURNING *
    `;
        return result[0];
    }
    static async findById(orderId) {
        const result = await sql `SELECT * FROM orders WHERE id = ${orderId}`;
        return result[0] || null;
    }
    static async updateStatus(orderId, status) {
        const result = await sql `UPDATE orders SET status = ${status}, updated_at = NOW() WHERE id = ${orderId} RETURNING *`;
        return result[0] || null;
    }
    static async assignDriver(orderId, driverId, driverName) {
        const result = await sql `UPDATE orders SET driver_id = ${driverId}, driver_name = ${driverName}, updated_at = NOW() WHERE id = ${orderId} RETURNING *`;
        return result[0] || null;
    }
    static async getAll() {
        const result = await sql `SELECT * FROM orders ORDER BY created_at DESC`;
        return result;
    }
    static async getByCustomer(customerId) {
        const result = await sql `SELECT * FROM orders WHERE customer_id = ${customerId} ORDER BY created_at DESC`;
        return result;
    }
    static async getByVendor(vendorId) {
        const result = await sql `SELECT * FROM orders WHERE vendor_id = ${vendorId} ORDER BY created_at DESC`;
        return result;
    }
    static async getByDriver(driverId) {
        const result = await sql `SELECT * FROM orders WHERE driver_id = ${driverId} ORDER BY created_at DESC`;
        return result;
    }
}
export class WithdrawalRepository {
    static async create(data) {
        const result = await sql `
      INSERT INTO withdrawals (id, user_id, user_role, amount, currency, payout_channel, payout_account, status, created_at, updated_at)
      VALUES (${data.id}, ${data.userId}, ${data.userRole}, ${data.amount}, ${data.currency}, ${data.payoutChannel}, ${data.payoutAccount}, ${data.status || 'pending'}, NOW(), NOW())
      RETURNING *
    `;
        return result[0];
    }
    static async findById(withdrawalId) {
        const result = await sql `SELECT * FROM withdrawals WHERE id = ${withdrawalId}`;
        return result[0] || null;
    }
    static async update(id, updates) {
        const fields = Object.keys(updates);
        if (fields.length === 0)
            return null;
        const setParts = fields.map((key) => `${key} = ${updates[key]}`).join(', ');
        const result = (await sql.unsafe(`UPDATE withdrawals SET ${setParts}, updated_at = NOW() WHERE id = ${id} RETURNING *`));
        return result[0] || null;
    }
    static async getByUser(userId) {
        const result = await sql `SELECT * FROM withdrawals WHERE user_id = ${userId} ORDER BY created_at DESC`;
        return result;
    }
    static async getAll() {
        const result = await sql `SELECT * FROM withdrawals ORDER BY created_at DESC`;
        return result;
    }
    static async getPending() {
        const result = await sql `SELECT * FROM withdrawals WHERE status = 'pending' ORDER BY created_at DESC`;
        return result;
    }
}
export class EscrowSplitRepository {
    static async create(data) {
        const result = await sql `
      INSERT INTO escrow_splits (id, order_id, customer_id, vendor_id, retailer_id, wholesaler_id, delivery_driver_id, subtotal, delivery_fee, platform_fee_percent, vendor_platform_fee_percent, currency, total_amount, admin_earnings, vendor_earnings, retailer_earnings, wholesaler_earnings, delivery_driver_earnings, created_at)
      VALUES (${data.id}, ${data.orderId}, ${data.customerId}, ${data.vendorId}, ${data.retailerId || null}, ${data.wholesalerId || null}, ${data.deliveryDriverId || null}, ${data.subtotal}, ${data.deliveryFee}, ${data.platformFeePercent || 2}, ${data.vendorPlatformFeePercent || 0}, ${data.currency || 'PHP'}, ${data.totalAmount}, ${data.adminEarnings}, ${data.vendorEarnings}, ${data.retailerEarnings || 0}, ${data.wholesalerEarnings || 0}, ${data.deliveryDriverEarnings}, NOW())
      RETURNING *
    `;
        return result[0];
    }
    static async findByOrderId(orderId) {
        const result = await sql `SELECT * FROM escrow_splits WHERE order_id = ${orderId}`;
        return result[0] || null;
    }
    static async complete(orderId, paypalTransactionId) {
        const split = await this.findByOrderId(orderId);
        if (!split)
            return null;
        await sql `UPDATE escrow_split_items SET status = 'completed', paypal_transaction_id = ${paypalTransactionId} WHERE split_id = ${split.id}`;
        return split;
    }
    static async getAll() {
        const result = await sql `SELECT * FROM escrow_splits ORDER BY created_at DESC`;
        return result;
    }
    static async getByRecipient(recipientType, recipientId) {
        const result = await sql `
      SELECT s.* FROM escrow_splits s
      JOIN escrow_split_items i ON i.split_id = s.id
      WHERE i.recipient_type = ${recipientType} AND i.recipient_id = ${recipientId}
    `;
        return result;
    }
}
export class EscrowSplitItemRepository {
    static async create(data) {
        const result = await sql `
      INSERT INTO escrow_split_items (id, split_id, recipient_type, recipient_id, amount, currency, status, paypal_transaction_id, created_at)
      VALUES (${data.id}, ${data.splitId}, ${data.recipientType}, ${data.recipientId}, ${data.amount}, ${data.currency}, ${data.status || 'pending'}, ${data.paypalTransactionId || null}, NOW())
      RETURNING *
    `;
        return result[0];
    }
}
export class KycDocumentRepository {
    static async create(data) {
        const result = await sql `
      INSERT INTO kyc_documents (id, user_id, user_role, document_type, document_name, file_url, file_name, file_size, mime_type, status, rejected_reason, uploaded_at, reviewed_at, reviewed_by, expiry_date, is_required, compliance_score)
      VALUES (${data.id}, ${data.userId}, ${data.userRole}, ${data.documentType}, ${data.documentName}, ${data.fileUrl}, ${data.fileName}, ${data.fileSize}, ${data.mimeType}, ${data.status || 'pending'}, ${data.rejectedReason || null}, NOW(), ${data.reviewedAt || null}, ${data.reviewedBy || null}, ${data.expiryDate || null}, ${data.isRequired !== undefined ? data.isRequired : false}, ${data.complianceScore || 0})
      RETURNING *
    `;
        return result[0];
    }
    static async getByUserId(userId) {
        const result = await sql `SELECT * FROM kyc_documents WHERE user_id = ${userId} ORDER BY uploaded_at DESC`;
        return result;
    }
    static async getAll() {
        const result = await sql `SELECT * FROM kyc_documents ORDER BY uploaded_at DESC`;
        return result;
    }
    static async review(documentId, status, reviewedBy, rejectedReason) {
        const result = await sql `
      UPDATE kyc_documents SET status = ${status}, reviewed_at = NOW(), reviewed_by = ${reviewedBy}, rejected_reason = ${rejectedReason || null}, compliance_score = ${status === 'approved' ? 100 : 0} WHERE id = ${documentId} RETURNING *`;
        return result[0] || null;
    }
}
export class ComplianceProfileRepository {
    static async create(data) {
        const result = await sql `
      INSERT INTO compliance_profiles (id, user_id, user_role, overall_status, compliance_percentage, documents_submitted, documents_required, documents_approved, documents_rejected, is_compliant, can_go_live, created_at, updated_at)
      VALUES (${data.id}, ${data.userId}, ${data.userRole}, ${data.overallStatus || 'pending'}, ${data.compliancePercentage || 0}, ${data.documentsSubmitted || 0}, ${data.documentsRequired || 0}, ${data.documentsApproved || 0}, ${data.documentsRejected || 0}, ${data.isCompliant !== undefined ? data.isCompliant : false}, ${data.canGoLive !== undefined ? data.canGoLive : false}, NOW(), NOW())
      RETURNING *
    `;
        return result[0];
    }
    static async getByUserId(userId) {
        const result = await sql `SELECT * FROM compliance_profiles WHERE user_id = ${userId}`;
        return result[0] || null;
    }
    static async getAll() {
        const result = await sql `SELECT * FROM compliance_profiles`;
        return result;
    }
    static async update(userId, updates) {
        const fields = Object.keys(updates);
        if (fields.length === 0)
            return null;
        const setParts = fields.map((key) => `${key} = ${updates[key]}`).join(', ');
        const result = (await sql.unsafe(`UPDATE compliance_profiles SET ${setParts}, updated_at = NOW() WHERE user_id = ${userId} RETURNING *`));
        return result[0] || null;
    }
}
export class SubscriptionRepository {
    static async create(data) {
        const result = await sql `
      INSERT INTO subscriptions (id, user_id, plan_name, status, current_period_end, created_at)
      VALUES (${data.id}, ${data.userId}, ${data.planName}, ${data.status || 'active'}, ${data.currentPeriodEnd}, NOW())
      RETURNING *
    `;
        return result[0];
    }
    static async getActive() {
        const result = await sql `SELECT * FROM subscriptions WHERE status = 'active'`;
        return result;
    }
    static async updateStatus(id, status) {
        const result = await sql `UPDATE subscriptions SET status = ${status} WHERE id = ${id} RETURNING *`;
        return result[0] || null;
    }
}
export class PostRepository {
    static async create(data) {
        const result = await sql `
      INSERT INTO posts (id, title, content, author_id, tags, status, created_at, updated_at)
      VALUES (${data.id}, ${data.title}, ${data.content}, ${data.authorId}, ${JSON.stringify(data.tags || [])}, ${data.status || 'draft'}, NOW(), NOW())
      RETURNING *
    `;
        return result[0];
    }
    static async getAllPublished() {
        const result = await sql `SELECT * FROM posts WHERE status = 'published' ORDER BY created_at DESC`;
        return result;
    }
    static async findById(id) {
        const result = await sql `SELECT * FROM posts WHERE id = ${id}`;
        return result[0] || null;
    }
}
export class EscrowAccountRepository {
    static async create(data) {
        const result = await sql `
      INSERT INTO escrow_accounts (id, transaction_id, buyer_id, seller_id, developer_id, agent_id, amount, currency, status, purpose, release_conditions, conditions_met, deposited_at, released_at, refunded_at, paypal_transaction_id, service_charge_amount, service_charge_paid_to_admin, created_at, updated_at)
      VALUES (${data.id}, ${data.transactionId}, ${data.buyerId}, ${data.sellerId}, ${data.developerId || null}, ${data.agentId || null}, ${data.amount}, ${data.currency || 'PHP'}, ${data.status || 'held'}, ${data.purpose}, ${JSON.stringify(data.releaseConditions || [])}, ${data.conditionsMent !== undefined ? data.conditionsMent : false}, NOW(), ${data.releasedAt || null}, ${data.refundedAt || null}, ${data.paypalTransactionId || null}, ${data.serviceChargeAmount || 0}, ${data.serviceChargePaidToAdmin !== undefined ? data.serviceChargePaidToAdmin : false}, NOW(), NOW())
      RETURNING *
    `;
        return result[0];
    }
    static async findById(id) {
        const result = await sql `SELECT * FROM escrow_accounts WHERE id = ${id}`;
        return result[0] || null;
    }
    static async findByTransactionId(transactionId) {
        const result = await sql `SELECT * FROM escrow_accounts WHERE transaction_id = ${transactionId}`;
        return result[0] || null;
    }
    static async update(id, updates) {
        const fields = Object.keys(updates);
        if (fields.length === 0)
            return null;
        const setParts = fields.map((key) => `${key} = ${updates[key]}`).join(', ');
        const result = (await sql.unsafe(`UPDATE escrow_accounts SET ${setParts}, updated_at = NOW() WHERE id = ${id} RETURNING *`));
        return result[0] || null;
    }
    static async getAll() {
        const result = await sql `SELECT * FROM escrow_accounts ORDER BY created_at DESC`;
        return result;
    }
}
export class BusinessTransactionRepository {
    static async create(data) {
        const result = await sql `
      INSERT INTO business_transactions (id, property_id, property_title, buyer_id, seller_id, developer_id, agent_id, agent_commission_amount, service_charge_amount, total_amount, currency, status, escrow_account_id, paypal_transaction_id, admin_service_charge_paid, agent_commission_paid, created_at, updated_at)
      VALUES (${data.id}, ${data.propertyId}, ${data.propertyTitle}, ${data.buyerId}, ${data.sellerId}, ${data.developerId || null}, ${data.agentId || null}, ${data.agentCommissionAmount || 0}, ${data.serviceChargeAmount || 0}, ${data.totalAmount}, ${data.currency || 'PHP'}, ${data.status || 'pending'}, ${data.escrowAccountId || null}, ${data.paypalTransactionId || null}, ${data.adminServiceChargePaid !== undefined ? data.adminServiceChargePaid : false}, ${data.agentCommissionPaid !== undefined ? data.agentCommissionPaid : false}, NOW(), NOW())
      RETURNING *
    `;
        return result[0];
    }
    static async findById(id) {
        const result = await sql `SELECT * FROM business_transactions WHERE id = ${id}`;
        return result[0] || null;
    }
    static async update(id, updates) {
        const fields = Object.keys(updates);
        if (fields.length === 0)
            return null;
        const setParts = fields.map((key) => `${key} = ${updates[key]}`).join(', ');
        const result = (await sql.unsafe(`UPDATE business_transactions SET ${setParts}, updated_at = NOW() WHERE id = ${id} RETURNING *`));
        return result[0] || null;
    }
    static async getAll() {
        const result = await sql `SELECT * FROM business_transactions ORDER BY created_at DESC`;
        return result;
    }
}
export class AgentDeveloperConnectionRepository {
    static async create(data) {
        const result = await sql `
      INSERT INTO agent_developer_connections (id, agent_id, developer_id, connection_status, commission_rate, total_commission_earned, connected_at, terminated_at)
      VALUES (${data.id}, ${data.agentId}, ${data.developerId}, ${data.connectionStatus || 'pending'}, ${data.commissionRate || 0}, ${data.totalCommissionEarned || 0}, NOW(), ${data.terminatedAt || null})
      RETURNING *
    `;
        return result[0];
    }
    static async findById(id) {
        const result = await sql `SELECT * FROM agent_developer_connections WHERE id = ${id}`;
        return result[0] || null;
    }
    static async getByAgentId(agentId) {
        const result = await sql `SELECT * FROM agent_developer_connections WHERE agent_id = ${agentId}`;
        return result;
    }
    static async getByDeveloperId(developerId) {
        const result = await sql `SELECT * FROM agent_developer_connections WHERE developer_id = ${developerId}`;
        return result;
    }
    static async getAll() {
        const result = await sql `SELECT * FROM agent_developer_connections ORDER BY connected_at DESC`;
        return result;
    }
    static async update(id, updates) {
        const fields = Object.keys(updates);
        if (fields.length === 0)
            return null;
        const setParts = fields.map((key) => `${key} = ${updates[key]}`).join(', ');
        const result = (await sql.unsafe(`UPDATE agent_developer_connections SET ${setParts} WHERE id = ${id} RETURNING *`));
        return result[0] || null;
    }
}
export class MarketingMaterialRepository {
    static async create(data) {
        const result = await sql `
      INSERT INTO marketing_materials (id, developer_id, project_name, material_type, title, description, file_url, file_name, status, uploaded_at, reviewed_at, reviewed_by)
      VALUES (${data.id}, ${data.developerId}, ${data.projectName}, ${data.materialType}, ${data.title}, ${data.description || null}, ${data.fileUrl}, ${data.fileName}, ${data.status || 'pending'}, NOW(), ${data.reviewedAt || null}, ${data.reviewedBy || null})
      RETURNING *
    `;
        return result[0];
    }
    static async findById(id) {
        const result = await sql `SELECT * FROM marketing_materials WHERE id = ${id}`;
        return result[0] || null;
    }
    static async getByDeveloperId(developerId) {
        const result = await sql `SELECT * FROM marketing_materials WHERE developer_id = ${developerId}`;
        return result;
    }
    static async getAll() {
        const result = await sql `SELECT * FROM marketing_materials ORDER BY uploaded_at DESC`;
        return result;
    }
    static async update(id, updates) {
        const fields = Object.keys(updates);
        if (fields.length === 0)
            return null;
        const setParts = fields.map((key) => `${key} = ${updates[key]}`).join(', ');
        const result = (await sql.unsafe(`UPDATE marketing_materials SET ${setParts} WHERE id = ${id} RETURNING *`));
        return result[0] || null;
    }
}
export class UserAppRoleRepository {
    static async create(data) {
        const result = await sql `
      INSERT INTO user_app_roles (id, user_id, app_id, app_role, is_active, created_at, updated_at)
      VALUES (${data.id}, ${data.userId}, ${data.appId}, ${data.appRole || 'member'}, ${data.isActive !== false}, NOW(), NOW())
      RETURNING *
    `;
        return result[0];
    }
    static async findByUserIdAndAppId(userId, appId) {
        const result = await sql `SELECT * FROM user_app_roles WHERE user_id = ${userId} AND app_id = ${appId}`;
        return result[0] || null;
    }
    static async findByUserId(userId) {
        const result = await sql `SELECT * FROM user_app_roles WHERE user_id = ${userId} AND is_active = TRUE`;
        return result;
    }
    static async findByAppId(appId) {
        const result = await sql `SELECT * FROM user_app_roles WHERE app_id = ${appId} AND is_active = TRUE`;
        return result;
    }
    static async update(id, updates) {
        const fields = Object.keys(updates);
        if (fields.length === 0)
            return null;
        const setParts = fields.map((key) => `${key} = ${updates[key]}`).join(', ');
        const result = (await sql.unsafe(`UPDATE user_app_roles SET ${setParts}, updated_at = NOW() WHERE id = ${id} RETURNING *`));
        return result[0] || null;
    }
    static async deactivate(id) {
        const result = (await sql.unsafe(`UPDATE user_app_roles SET is_active = FALSE, updated_at = NOW() WHERE id = ${id} RETURNING *`));
        return result[0] || null;
    }
}
export class OAuthAuthorizationCodeRepository {
    static async create(data) {
        const result = await sql `
      INSERT INTO oauth_authorization_codes (id, code, user_id, client_id, redirect_uri, scope, expires_at, used, created_at)
      VALUES (${data.id}, ${data.code}, ${data.userId}, ${data.clientId}, ${data.redirectUri}, ${data.scope || ''}, ${data.expiresAt}, FALSE, NOW())
      RETURNING *
    `;
        return result[0];
    }
    static async findByCode(code) {
        const result = await sql `SELECT * FROM oauth_authorization_codes WHERE code = ${code} AND used = FALSE`;
        return result[0] || null;
    }
    static async markUsed(code) {
        const result = (await sql.unsafe(`UPDATE oauth_authorization_codes SET used = TRUE WHERE code = ${code} RETURNING *`));
        return result[0] || null;
    }
    static async deleteExpired() {
        await sql.unsafe(`DELETE FROM oauth_authorization_codes WHERE expires_at < NOW()`);
    }
}
export class OAuthSessionRepository {
    static async create(data) {
        const result = await sql `
      INSERT INTO oauth_sessions (id, user_id, app_id, access_token_hash, refresh_token_hash, expires_at, revoked, created_at)
      VALUES (${data.id}, ${data.userId}, ${data.appId}, ${data.accessTokenHash}, ${data.refreshTokenHash || null}, ${data.expiresAt}, FALSE, NOW())
      RETURNING *
    `;
        return result[0];
    }
    static async findByAccessTokenHash(hash) {
        const result = await sql `SELECT * FROM oauth_sessions WHERE access_token_hash = ${hash} AND revoked = FALSE`;
        return result[0] || null;
    }
    static async findByUserId(userId) {
        const result = await sql `SELECT * FROM oauth_sessions WHERE user_id = ${userId} AND revoked = FALSE`;
        return result;
    }
    static async revokeByUserId(userId) {
        await sql.unsafe(`UPDATE oauth_sessions SET revoked = TRUE WHERE user_id = ${userId} AND revoked = FALSE`);
    }
    static async revokeByTokenHash(hash) {
        await sql.unsafe(`UPDATE oauth_sessions SET revoked = TRUE WHERE access_token_hash = ${hash}`);
    }
}
export class OAuthClientRepository {
    static async create(data) {
        const result = await sql `
      INSERT INTO oauth_clients (id, name, client_secret, redirect_uris, scope, is_active, created_at)
      VALUES (${data.id}, ${data.name}, ${data.clientSecret}, ${data.redirectUris || ''}, ${data.scope || ''}, TRUE, NOW())
      RETURNING *
    `;
        return result[0];
    }
    static async findById(clientId) {
        const result = await sql `SELECT * FROM oauth_clients WHERE id = ${clientId} AND is_active = TRUE`;
        return result[0] || null;
    }
    static async getAll() {
        const result = await sql `SELECT * FROM oauth_clients WHERE is_active = TRUE`;
        return result;
    }
}
//# sourceMappingURL=repository.js.map