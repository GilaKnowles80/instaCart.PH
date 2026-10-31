import { calculateSplitPayout, type VendorEnrollment } from '../sharedVendorEnrollment';

const platformFeeConfig: Record<VendorEnrollment['category'], number> = {
  WET_MARKET: 3.5,
  RESTAURANT: 10.0,
  PHARMACY: 5.0,
  HARDWARE: 6.0,
  DRY_GOODS: 4.5,
  DEPARTMENT_STORE: 8.0
};

export const handleVendorRegistration = (
  data: Omit<VendorEnrollment, 'basePlatformFeePercentage'>
): VendorEnrollment => {
  const completeProfile: VendorEnrollment = {
    ...data,
    basePlatformFeePercentage: platformFeeConfig[data.category]
  };

  console.log(`Enrolled Business [${completeProfile.businessName}] into payment gateway matrix.`);
  console.log(`Retaining operational service fee: ${completeProfile.basePlatformFeePercentage}% automatically routed to our Platform Wallets.`);

  const testSplit = calculateSplitPayout(1000, completeProfile.basePlatformFeePercentage);
  console.log('Split Fee Payout Simulation for a PHP 1000 Order:', testSplit);

  return completeProfile;
};
