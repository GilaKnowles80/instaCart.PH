import { describe, it, expect } from 'vitest';
import { calculateSplitPayout, validateVendorEnrollment, DEFAULT_SPLIT_FEE_MATRIX } from './index.js';

describe('calculateSplitPayout', () => {
  it('should split a PHP 1000 order with 10% vendor fee correctly', () => {
    const result = calculateSplitPayout(1000, 10);

    expect(result.grossTotal).toBe(1000);
    expect(result.platformServiceFeeRetained).toBe(100); // 10% of 1000
    expect(result.vendorNetPayout).toBe(900); // 1000 - 100
  });

  it('should split with zero vendor fee', () => {
    const result = calculateSplitPayout(500, 0);

    expect(result.platformServiceFeeRetained).toBe(0);
    expect(result.vendorNetPayout).toBe(500);
  });

  it('should split with 100% vendor fee', () => {
    const result = calculateSplitPayout(500, 100);

    expect(result.platformServiceFeeRetained).toBe(500);
    expect(result.vendorNetPayout).toBe(0);
  });

  it('should throw on negative total order amount', () => {
    expect(() => calculateSplitPayout(-100, 10)).toThrow(
      'Total order amount must be a finite, non-negative number.'
    );
  });

  it('should throw on invalid vendor fee percentage', () => {
    expect(() => calculateSplitPayout(100, -5)).toThrow(
      'Vendor fee percentage must be between 0 and 100.'
    );
    expect(() => calculateSplitPayout(100, 101)).toThrow(
      'Vendor fee percentage must be between 0 and 100.'
    );
  });

  it('should handle non-finite values', () => {
    expect(() => calculateSplitPayout(Infinity, 10)).toThrow();
    expect(() => calculateSplitPayout(100, NaN)).toThrow();
  });
});

describe('validateVendorEnrollment', () => {
  const validEnrollment = {
    vendor: {
      businessName: 'Test Store',
      legalName: 'Test Legal',
      contactName: 'John Doe',
      email: 'john@test.com',
      phone: '09123456789',
      operationalClass: 'wet-market' as const,
    },
    payout: {
      provider: 'gcash' as const,
      accountName: 'John Doe',
      accountReference: '09123456789',
    },
    fees: {
      platformFeePercent: 10,
      paymentProcessingFeePercent: 2.9,
      vendorPayoutPercent: 87.1,
      deliveryFeePercent: 0,
    },
    status: 'draft' as const,
  };

  it('should validate a correct enrollment record', () => {
    const result = validateVendorEnrollment(validEnrollment);

    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it('should reject missing business name', () => {
    const result = validateVendorEnrollment({
      ...validEnrollment,
      vendor: { ...validEnrollment.vendor, businessName: '' },
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Business name is required.');
  });

  it('should reject invalid email', () => {
    const result = validateVendorEnrollment({
      ...validEnrollment,
      vendor: { ...validEnrollment.vendor, email: 'invalid-email' },
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContain('A valid email is required.');
  });

  it('should reject fees not totaling 100%', () => {
    const result = validateVendorEnrollment({
      ...validEnrollment,
      fees: {
        platformFeePercent: 10,
        paymentProcessingFeePercent: 2.9,
        vendorPayoutPercent: 80,
        deliveryFeePercent: 0,
      },
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContain(
      'Platform, processing, and vendor payout percentages must total 100%.'
    );
  });
});

describe('DEFAULT_SPLIT_FEE_MATRIX', () => {
  it('should have fee matrices for all operational classes', () => {
    const classes = ['department-store', 'dry-goods', 'hardware', 'pharmacy', 'restaurant', 'wet-market'];

    for (const cls of classes) {
      expect(DEFAULT_SPLIT_FEE_MATRIX[cls as keyof typeof DEFAULT_SPLIT_FEE_MATRIX]).toBeDefined();
      const matrix = DEFAULT_SPLIT_FEE_MATRIX[cls as keyof typeof DEFAULT_SPLIT_FEE_MATRIX];
      const total = matrix.platformFeePercent + matrix.paymentProcessingFeePercent + matrix.vendorPayoutPercent;
      expect(total).toBeCloseTo(100, 1);
    }
  });
});