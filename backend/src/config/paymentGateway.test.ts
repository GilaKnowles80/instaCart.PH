import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Set required env vars before importing the module
vi.hoisted(() => {
  process.env.HQ_GCASH_NUMBER = '09123456789';
  process.env.HQ_MAYA_ID = '09123456789';
  process.env.HQ_BPI_ACCOUNT = '0766148079';
  process.env.HQ_PAYMONGO_ACC = '866773508859';
  process.env.PAYPAL_MERCHANT_EMAIL = 'merchant@test.com';
});

vi.resetModules();

import { BackendPaymentSplitter, PLATFORM_FEE_RATES } from './paymentGateway.js';

describe('BackendPaymentSplitter.executeSplitTransaction', () => {
  const basePayload = {
    amount: 1000,
    vendorCategory: 'WET_MARKET' as const,
    vendorPayoutChannel: 'GCASH' as const,
    vendorPayoutAccount: '09123456789',
  };

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should calculate correct split for WET_MARKET with GCASH channel', async () => {
    const result = await BackendPaymentSplitter.executeSplitTransaction(basePayload);

    expect(result.success).toBe(true);
    expect(result.feePercent).toBe(3.5);
    expect(result.platformEarnings).toBe(35);
    expect(result.vendorDisbursed).toBe(965);
    expect(result.status).toBe('Settled');
    expect(result.payoutChannel).toBe('GCASH');
    expect(result.payoutAccount).toBe('09123456789');
    expect(result.corporateWallet).toBe('09123456789');
  });

  it('should calculate correct split for RESTAURANT category', async () => {
    const result = await BackendPaymentSplitter.executeSplitTransaction({
      ...basePayload,
      vendorCategory: 'RESTAURANT',
      amount: 2000,
    });

    expect(result.feePercent).toBe(10);
    expect(result.platformEarnings).toBe(200);
    expect(result.vendorDisbursed).toBe(1800);
  });

  it('should calculate correct split for PHARMACY category', async () => {
    const result = await BackendPaymentSplitter.executeSplitTransaction({
      ...basePayload,
      vendorCategory: 'PHARMACY',
      amount: 500,
    });

    expect(result.feePercent).toBe(5);
    expect(result.platformEarnings).toBe(25);
    expect(result.vendorDisbursed).toBe(475);
  });

  it('should throw on non-positive amount', async () => {
    await expect(
      BackendPaymentSplitter.executeSplitTransaction({ ...basePayload, amount: 0 })
    ).rejects.toThrow('Transaction amount must be a finite number greater than zero.');

    await expect(
      BackendPaymentSplitter.executeSplitTransaction({ ...basePayload, amount: -100 })
    ).rejects.toThrow('Transaction amount must be a finite number greater than zero.');
  });

  it('should throw on empty payout account', async () => {
    await expect(
      BackendPaymentSplitter.executeSplitTransaction({ ...basePayload, vendorPayoutAccount: '' })
    ).rejects.toThrow('Vendor payout account is required.');
  });

  it('should succeed when corporate wallet is configured for channel', async () => {
    const result = await BackendPaymentSplitter.executeSplitTransaction({
      ...basePayload,
      vendorPayoutChannel: 'PAYPAL',
      vendorPayoutAccount: 'test@test.com',
    });

    expect(result.success).toBe(true);
    expect(result.corporateWallet).toBe('merchant@test.com');
  });

  it('should round currency correctly', async () => {
    const result = await BackendPaymentSplitter.executeSplitTransaction({
      ...basePayload,
      vendorCategory: 'DRY_GOODS',
      amount: 100.005,
    });

    expect(result.platformEarnings).toBeCloseTo(4.5, 2);
  });
});

describe('PLATFORM_FEE_RATES', () => {
  it('should have defined rates for all vendor categories', () => {
    expect(PLATFORM_FEE_RATES.WET_MARKET).toBe(3.5);
    expect(PLATFORM_FEE_RATES.RESTAURANT).toBe(10);
    expect(PLATFORM_FEE_RATES.PHARMACY).toBe(5);
    expect(PLATFORM_FEE_RATES.HARDWARE).toBe(6);
    expect(PLATFORM_FEE_RATES.DRY_GOODS).toBe(4.5);
    expect(PLATFORM_FEE_RATES.DEPARTMENT_STORE).toBe(8);
  });
});