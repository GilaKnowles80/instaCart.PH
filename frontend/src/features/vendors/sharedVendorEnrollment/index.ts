export const OPERATIONAL_CLASSES = [
  'department-store',
  'dry-goods',
  'hardware',
  'pharmacy',
  'restaurant',
  'wet-market'
] as const;

export type OperationalClass = (typeof OPERATIONAL_CLASSES)[number];

export const PAYOUT_PROVIDERS = [
  'paypal',
  'bpi',
  'gcash',
  'maya',
  'paymongo'
] as const;

export type PayoutProvider = (typeof PAYOUT_PROVIDERS)[number];

export type PayoutChannel = 'PAYPAL' | 'BPI_BANK' | 'GCASH' | 'MAYA' | 'PAYMONGO';

export type VendorCategory =
  | 'WET_MARKET'
  | 'RESTAURANT'
  | 'PHARMACY'
  | 'HARDWARE'
  | 'DRY_GOODS'
  | 'DEPARTMENT_STORE';

export interface VendorEnrollment {
  businessName: string;
  category: VendorCategory;
  payoutMethod: PayoutChannel;
  payoutAccountDetails: string;
  basePlatformFeePercentage: number;
}

export type VendorEnrollmentStatus = 'draft' | 'pending-review' | 'approved' | 'rejected';

export interface VendorIdentity {
  businessName: string;
  legalName: string;
  contactName: string;
  email: string;
  phone: string;
  operationalClass: OperationalClass;
}

export interface PayoutDestination {
  provider: PayoutProvider;
  accountName: string;
  accountReference: string;
  currency?: 'PHP' | 'USD';
}

export interface SplitFeeMatrix {
  platformFeePercent: number;
  paymentProcessingFeePercent: number;
  vendorPayoutPercent: number;
  deliveryFeePercent: number;
}

export interface VendorEnrollmentRecord {
  id?: string;
  vendor: VendorIdentity;
  payout: PayoutDestination;
  fees: SplitFeeMatrix;
  status: VendorEnrollmentStatus;
  submittedAt?: string;
}

export interface EnrollmentValidationResult {
  valid: boolean;
  errors: string[];
}

export const DEFAULT_SPLIT_FEE_MATRIX: Record<OperationalClass, SplitFeeMatrix> = {
  'department-store': {
    platformFeePercent: 8,
    paymentProcessingFeePercent: 2.9,
    vendorPayoutPercent: 89.1,
    deliveryFeePercent: 0
  },
  'dry-goods': {
    platformFeePercent: 10,
    paymentProcessingFeePercent: 2.9,
    vendorPayoutPercent: 87.1,
    deliveryFeePercent: 0
  },
  hardware: {
    platformFeePercent: 10,
    paymentProcessingFeePercent: 2.9,
    vendorPayoutPercent: 87.1,
    deliveryFeePercent: 0
  },
  pharmacy: {
    platformFeePercent: 7,
    paymentProcessingFeePercent: 2.9,
    vendorPayoutPercent: 90.1,
    deliveryFeePercent: 0
  },
  restaurant: {
    platformFeePercent: 15,
    paymentProcessingFeePercent: 2.9,
    vendorPayoutPercent: 82.1,
    deliveryFeePercent: 0
  },
  'wet-market': {
    platformFeePercent: 12,
    paymentProcessingFeePercent: 2.9,
    vendorPayoutPercent: 85.1,
    deliveryFeePercent: 0
  }
};

export function validateVendorEnrollment(
  enrollment: VendorEnrollmentRecord
): EnrollmentValidationResult {
  const errors: string[] = [];
  const { vendor, payout, fees } = enrollment;

  if (!vendor.businessName.trim()) errors.push('Business name is required.');
  if (!vendor.legalName.trim()) errors.push('Legal name is required.');
  if (!vendor.contactName.trim()) errors.push('Contact name is required.');
  if (!/^\S+@\S+\.\S+$/.test(vendor.email)) errors.push('A valid email is required.');
  if (!vendor.phone.trim()) errors.push('Phone number is required.');
  if (!payout.accountName.trim()) errors.push('Payout account name is required.');
  if (!payout.accountReference.trim()) errors.push('Payout account reference is required.');

  const feeTotal =
    fees.platformFeePercent +
    fees.paymentProcessingFeePercent +
    fees.vendorPayoutPercent;

  if (fees.platformFeePercent < 0) errors.push('Platform fee cannot be negative.');
  if (fees.paymentProcessingFeePercent < 0) errors.push('Processing fee cannot be negative.');
  if (fees.vendorPayoutPercent < 0) errors.push('Vendor payout cannot be negative.');
  if (fees.deliveryFeePercent < 0) errors.push('Delivery fee cannot be negative.');
  if (Math.abs(feeTotal - 100) > 0.01) {
    errors.push('Platform, processing, and vendor payout percentages must total 100%.');
  }

  return { valid: errors.length === 0, errors };
}

/** Splits a cart total between the platform and the vendor. */
export const calculateSplitPayout = (
  totalOrderAmount: number,
  vendorFeePercent: number
) => {
  if (!Number.isFinite(totalOrderAmount) || totalOrderAmount < 0) {
    throw new Error('Total order amount must be a finite, non-negative number.');
  }
  if (!Number.isFinite(vendorFeePercent) || vendorFeePercent < 0 || vendorFeePercent > 100) {
    throw new Error('Vendor fee percentage must be between 0 and 100.');
  }

  const platformCut = totalOrderAmount * (vendorFeePercent / 100);
  const vendorPayout = totalOrderAmount - platformCut;

  return {
    grossTotal: totalOrderAmount,
    platformServiceFeeRetained: platformCut,
    vendorNetPayout: vendorPayout
  };
};
