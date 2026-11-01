import { sql } from '../config/database.js';
import bcrypt from 'bcryptjs';

const TEST_USERS = [
  {
    id: 'user_admin_001',
    email: 'admin@instaCart.PH',
    password: 'Admin123!',
    role: 'admin',
    firstName: 'Admin',
    lastName: 'User',
    phone: '09123456789',
    address: 'instaCart.HQ, Metro Manila',
  },
  {
    id: 'user_vendor_001',
    email: 'vendor@instaCart.PH',
    password: 'Vendor123!',
    role: 'vendor',
    firstName: 'Juan',
    lastName: 'Dela Cruz',
    phone: '09123456788',
    address: 'Quiapo Market, Manila',
  },
  {
    id: 'user_customer_001',
    email: 'customer@instaCart.PH',
    password: 'Customer123!',
    role: 'customer',
    firstName: 'Maria',
    lastName: 'Santos',
    phone: '09123456787',
    address: 'Makati City, Metro Manila',
  },
  {
    id: 'user_driver_001',
    email: 'driver@instaCart.PH',
    password: 'Driver123!',
    role: 'delivery_driver',
    firstName: 'Pedro',
    lastName: 'Reyes',
    phone: '09123456786',
    address: 'Quezon City, Metro Manila',
  },
];

export async function seedTestUsers(): Promise<void> {
  console.log('🌱 Seeding test users...');

  for (const user of TEST_USERS) {
    try {
      // Check if user already exists
      const existing = await sql`SELECT id FROM users WHERE email = ${user.email}`;
      if (existing.length > 0) {
        console.log(`⚠️  ${user.email} already exists, skipping.`);
        continue;
      }

      const passwordHash = await bcrypt.hash(user.password, 12);
      const fullName = `${user.firstName} ${user.lastName}`;

      await sql`
        INSERT INTO users (id, email, password_hash, role, first_name, middle_name, last_name, phone, address, full_name, is_active, is_email_verified, kyc_verified, kyc_documents, created_at, updated_at)
        VALUES (
          ${user.id}, ${user.email}, ${passwordHash}, ${user.role},
          ${user.firstName}, NULL, ${user.lastName}, ${user.phone}, ${user.address}, ${fullName},
          TRUE, TRUE, FALSE, '[]'::jsonb, NOW(), NOW()
        )
      `;

      // Create vendor profile if role is vendor
      if (user.role === 'vendor') {
        await sql`
          INSERT INTO vendor_profiles (id, user_id, business_name, legal_name, contact_name, category, operational_class, payout_channel, payout_account_name, payout_account_reference, paypal_checkout_link, platform_fee_percent, status, created_at, updated_at)
          VALUES (
            'vendor_${user.id}', ${user.id}, 'Juan\'s Wet Market', 'Juan Dela Cruz', 'Juan Dela Cruz',
            'WET_MARKET', 'wet-market', 'GCASH', 'Juan Dela Cruz', '09123456788',
            NULL, 0, 'approved', NOW(), NOW()
          )
        `;
      }

      // Create driver profile if role is delivery_driver
      if (user.role === 'delivery_driver') {
        await sql`
          INSERT INTO driver_profiles (id, user_id, first_name, last_name, email, phone, license_number, vehicle_type, rate_per_kilometer, is_available, current_latitude, current_longitude, total_deliveries, total_earnings, status, created_at, updated_at)
          VALUES (
            'driver_${user.id}', ${user.id}, ${user.firstName}, ${user.lastName}, ${user.email}, ${user.phone},
            'LIC-12345', 'motorcycle', 15.00, TRUE, 14.5995, 120.9842, 0, 0, 'approved', NOW(), NOW()
          )
        `;
      }

      console.log(`✅ Created ${user.role}: ${user.email} (password: ${user.password})`);
    } catch (err: any) {
      console.error(`❌ Failed to create ${user.email}:`, err.message);
    }
  }

  console.log('✅ Test user seeding complete!');
}

export default { seedTestUsers };