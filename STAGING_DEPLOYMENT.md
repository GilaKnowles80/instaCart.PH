# instaCart.PH — Staging / Testing Environment Guide

## Overview

This document describes the staging environment for instaCart.PH, an exact replica of the live online market used for testing before production deployment.

The staging environment corresponds to **Step 3** of the Marketplace Code Deployment Workflow:

```
[ 3. STAGING / TESTING ENVIRONMENT ]
    └── 🎭 Staging Server (Exact replica of the live online market)
         ├── 💳 Mock Payment Gateway (Test transactions with sandbox credit cards)
         ├── 🗄️ Staging Database (Validate schema expansions safely)
         └── 🏋️ Load Testing (Ensure server handles high checkout traffic)
```

## 1. Staging Server Setup

### Infrastructure Requirements

| Component | Staging Value | Notes |
|-----------|---------------|-------|
| Server Type | VPS / Cloud Instance | Match production specs |
| Node.js | v20.x | Same as production |
| Database | Neon PostgreSQL (staging branch) | Separate from production |
| Frontend URL | `https://staging.instacart.ph` | Vercel preview deployment |
| Backend URL | `https://api-staging.instacart.ph` | Separate backend instance |
| SSL/HTTPS | Enabled | Self-signed or Let's Encrypt staging cert |

### Environment Variables (Staging)

Create a `.env.staging` file (never commit to version control):

```env
# Node Environment
NODE_ENV=staging
PORT=5000

# JWT Secrets (use different secrets from production)
JWT_ACCESS_SECRET=your_staging_jwt_access_secret
JWT_REFRESH_SECRET=your_staging_jwt_refresh_secret

# PayPal Sandbox Credentials (MOCK PAYMENT GATEWAY)
PAYPAL_CLIENT_ID=your_paypal_sandbox_client_id
PAYPAL_CLIENT_SECRET=your_paypal_sandbox_client_secret
PAYPAL_ENVIRONMENT=sandbox
PAYPAL_MERCHANT_EMAIL=your_sandbox_merchant_email@example.com
PAYPAL_WEBHOOK_ID=your_paypal_sandbox_webhook_id

# Platform Fees
PLATFORM_SERVICE_FEE_PERCENT=2

# Corporate Payout Destinations (Sandbox)
HQ_GCASH_NUMBER=09123456789
HQ_MAYA_ID=09123456789
HQ_BPI_ACCOUNT=0766148079
HQ_PAYMONGO_ACC=866773508859

# Frontend and Public API Base URL
FRONTEND_ORIGIN=https://staging.instacart.ph
BASE_URL=https://api-staging.instacart.ph
APP_URL=https://api-staging.instacart.ph

# Database (Neon PostgreSQL Staging)
DATABASE_URL="postgresql://staging_user:password@host.aws.neon.tech/staging_db?sslmode=require"

# Gmail SMTP (for test emails)
GMAIL_USER=your_staging_email@gmail.com
GMAIL_APP_PASSWORD=your_staging_app_password

# Google OAuth2
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Admin Whitelist
ADMIN_EMAILS=gilaknowles80@gmail.com,gctravelandtours2021@gmail.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_AUTH_MAX_REQUESTS=10
RATE_LIMIT_AUTH_WINDOW_MS=900000

# Security
ENABLE_CSP=true
ENABLE_HSTS=true
TRUST_PROXY=true
```

## 2. Mock Payment Gateway (Sandbox)

### PayPal Sandbox Configuration

The backend uses PayPal sandbox environment for testing transactions without real money:

**Backend Configuration** (`backend/src/config/paymentGateway.ts`):
```typescript
environment: process.env.PAYPAL_ENVIRONMENT || (process.env.NODE_ENV === 'production' ? 'live' : 'sandbox'),
```

When `NODE_ENV=staging`, `PAYPAL_ENVIRONMENT=sandbox` is used, which routes all PayPal API calls to `https://api-m.sandbox.paypal.com`.

### Sandbox Test Credit Cards

Use these PayPal sandbox test cards for checkout testing:

| Card Type | Card Number | Expiry | CVV |
|-----------|-------------|--------|-----|
| Visa | 4111111111111111 | 12/2030 | 123 |
| MasterCard | 5555555555554444 | 12/2030 | 123 |
| American Express | 378282246310005 | 12/2030 | 1234 |
| Discover | 6011111111111117 | 12/2030 | 123 |

### Testing Payment Flows

1. **Successful Payment**: Use sandbox test card → PayPal returns `COMPLETED`
2. **Failed Payment**: Use expired card → PayPal returns `FAILED`
3. **Pending Payment**: Use specific sandbox trigger → PayPal returns `PENDING`
4. **Refund**: Use sandbox refund API → Verify escrow split completion

### Checkout API Endpoints (Staging)

```http
# Calculate checkout fees
POST https://api-staging.instacart.ph/api/v1/payments/calculate
Content-Type: application/json
{
  "subtotal": 1000,
  "deliveryFee": 50,
  "vendorPlatformFeePercent": 10
}

# Create PayPal order (sandbox)
POST https://api-staging.instacart.ph/api/v1/payments/orders
Content-Type: application/json
{
  "amount": 1070,
  "description": "instaCart.PH Staging Order"
}

# Capture PayPal order
POST https://api-staging.instacart.ph/api/v1/payments/orders/{orderId}/capture

# Payout to vendor (sandbox)
POST https://api-staging.instacart.ph/api/v1/payments/payout
Authorization: Bearer <token>
{
  "recipientEmail": "vendor@sandbox.example.com",
  "amount": 980,
  "description": "Vendor payout - Staging"
}
```

## 3. Staging Database (Neon PostgreSQL)

### Database Setup

The staging environment uses a separate Neon PostgreSQL database branch:

```bash
# Create staging database branch in Neon
# Via Neon Console: Create branch "staging" from production

# Run migrations against staging database
DATABASE_URL="postgresql://staging_user:password@host.aws.neon.tech/staging_db?sslmode=require" \
  npm run build:backend && npm run migrate

# Or directly
cd backend && npx tsx src/config/migrate.ts
```

### Schema Validation

The staging database validates all schema expansions safely:

```sql
-- Core tables (users, orders, payments, escrow splits)
-- Refer to backend/src/db/schema.sql for full schema

-- Validate orders table
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Validate order count
SELECT COUNT(*) FROM orders;

-- Validate escrow splits
SELECT * FROM escrow_splits LIMIT 10;
```

### Database Safety Rules

- ✅ Staging database is isolated from production
- ✅ Schema migrations tested in staging before production
- ✅ No real customer data in staging (use anonymized test data)
- ✅ Database backups configured for staging

## 4. Load Testing

### Load Testing Configuration

Load testing ensures the server handles high checkout traffic. Use tools like **k6**, **Artillery**, or **JMeter**.

### k6 Load Test Script

Create `backend/scripts/load-test.js`:

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 10 },
    { duration: '5m', target: 50 },
    { duration: '10m', target: 100},
    { duration: '5m', target: 50 },
    { duration: '2m', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.01'],
  },
};

const BASE_URL = 'https://api-staging.instacart.ph/api/v1';

export default function () {
  const checkoutPayload = JSON.stringify({
    items: [
      { id: 'item_1', name: 'Fresh Milk', price: 80, quantity: 2 },
      { id: 'item_2', name: 'Bread', price: 45, quantity: 1 },
    ],
    userId: 'user_load_test_' + __VU,
    paymentMethod: 'paypal',
  });

  const checkoutRes = http.post(`${BASE_URL}/checkout`, checkoutPayload, {
    headers: { 'Content-Type': 'application/json' },
  });

  check(checkoutRes, {
    'checkout status is 200': (r) => r.status === 200,
    'checkout has transactionId': (r) => JSON.parse(r.body).transactionId !== undefined,
  });

  sleep(1);
}
```

### Running Load Tests

```bash
# Install k6
# macOS: brew install k6
# Linux: sudo apt-get install k6

# Run load test against staging
k6 run backend/scripts/load-test.js

# Expected results:
# - 100 concurrent users during peak
# - 95% of requests under 500ms
# - Error rate under 1%
# - All checkout transactions complete successfully
```

### Load Testing Checklist

| Test | Target | Status |
|------|--------|--------|
| Concurrent users | 100+ | ⬜ |
| Checkout response time | <500ms (95th percentile) | ⬜ |
| Error rate | <1% | ⬜ |
| Database connection pool | Stable under load | ⬜ |
| PayPal sandbox API | Responds correctly | ⬜ |
| Memory usage | No leaks | ⬜ |
| CPU usage | <80% | ⬜ |

## 5. Staging Deployment Steps

### Step 1: Deploy Backend to Staging

```bash
# Set staging environment variables
cp backend/.env.example backend/.env.staging
# Edit .env.staging with staging values

# Build and deploy
cd backend
npm ci
npx tsc
npm start

# Verify health endpoint
curl https://api-staging.instacart.ph/health
# Expected: {"status":"OK","message":"instaCart.PH backend layer fully functional"}
```

### Step 2: Deploy Frontend to Staging (Vercel)

```bash
# Connect staging branch to Vercel
# Vercel will auto-deploy on push to develop/staging branch

# Configure environment variables in Vercel:
VITE_API_BASE_URL=https://api-staging.instacart.ph/api/v1

# Verify frontend loads
curl https://staging.instacart.ph
```

### Step 3: Run Integration Tests

```bash
# Run all unit tests against staging environment
cd c:\Users\Gila\instaCart.PH
npm test

# Expected: All 39 tests pass (18 backend + 21 frontend)
```

### Step 4: Execute Load Testing

```bash
# Run k6 load test
k6 run backend/scripts/load-test.js

# Verify all thresholds pass
```

### Step 5: UAT (User Acceptance Testing)

| Test Case | Description | Expected Result | Status |
|-----------|-------------|-----------------|--------|
| Add item to cart | Customer adds product to basket | Item appears in cart | ⬜ |
| Checkout with PayPal | Complete PayPal sandbox payment | Transaction succeeds | ⬜ |
| Checkout with GCash QR | Scan QR, pay with GCash | Payment confirmed | ⬜ |
| Order confirmation | Order success page displays | Order details shown | ⬜ |
| Vendor payout | Escrow split to vendor | Vendor receives payout | ⬜ |
| Order history | Customer views past orders | Orders listed correctly | ⬜ |

---

## 6. Staging to Production Promotion Checklist

Before promoting from staging to production:

- [ ] All 39 unit tests pass
- [ ] Security scan shows no critical vulnerabilities
- [ ] PayPal sandbox transactions complete successfully
- [ ] Load testing meets all thresholds (<500ms response, <1% errors)
- [ ] UAT test cases all pass
- [ ] Database migrations tested in staging
- [ ] Environment variables configured for production
- [ ] SSL/HTTPS certificates valid for production domains
- [ ] CORS configured for production frontend domain
- [ ] PayPal live credentials ready (not sandbox)

---

## 7. Related Documentation

- **Production Deployment**: `PRODUCTION_DEPLOYMENT.md` — Step 4 & 5 of the workflow
- **Local Development**: `README.txt` — Step 1 of the workflow
- **CI Pipeline**: `.github/workflows/ci.yml` — Step 2 of the workflow