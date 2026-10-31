export type UserRole =
  | 'customer'
  | 'vendor'
  | 'retailer'
  | 'delivery_driver'
  | 'wholesaler'
  | 'admin'
  | 'developer'
  | 'builder'
  | 'homeowner'
  | 'buyer'
  | 'rem_sales_agent'
  | 'real_estate_agent';

export interface IUser {
  id: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  firstName: string;
  middleName?: string;
  lastName: string;
  phone: string;
  address?: string;
  isActive: boolean;
  isEmailVerified: boolean;
  kycVerified: boolean;
  kycDocuments?: IKycDocument[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IKycDocument {
  type: 'businessPermit' | 'dtiPermit' | 'secPermit' | 'birCertificate' | 'nbiClearance' | 'governmentId';
  fileUrl: string;
  fileName: string;
  uploadedAt: Date;
  verified: boolean;
}

export interface IVendorProfile {
  id: string;
  userId: string;
  businessName: string;
  legalName: string;
  contactName: string;
  category: 'WET_MARKET' | 'RESTAURANT' | 'PHARMACY' | 'HARDWARE' | 'DRY_GOODS' | 'DEPARTMENT_STORE';
  operationalClass: 'department-store' | 'dry-goods' | 'hardware' | 'pharmacy' | 'restaurant' | 'wet-market';
  payoutChannel: 'PAYPAL' | 'BPI_BANK' | 'GCASH' | 'MAYA' | 'PAYMONGO';
  payoutAccountName: string;
  payoutAccountReference: string;
  paypalCheckoutLink?: string;
  platformFeePercent: number;
  status: 'draft' | 'pending-review' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

export interface IDeliveryDriverProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  licenseNumber: string;
  vehicleType: 'motorcycle' | 'bicycle' | 'car' | 'tricycle';
  ratePerKilometer: number;
  isAvailable: boolean;
  currentLatitude: number | null;
  currentLongitude: number | null;
  totalDeliveries: number;
  totalEarnings: number;
  status: 'pending' | 'approved' | 'suspended' | 'offline';
  createdAt: Date;
  updatedAt: Date;
}

export interface IRetailerProfile {
  id: string;
  userId: string;
  storeName: string;
  ownerName: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  paypalEmail: string;
  platformFeePercent: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

export interface IWholesalerProfile {
  id: string;
  userId: string;
  businessName: string;
  legalName: string;
  contactName: string;
  payoutChannel: 'PAYPAL' | 'BPI_BANK' | 'GCASH' | 'MAYA' | 'PAYMONGO';
  payoutAccountName: string;
  payoutAccountReference: string;
  paypalCheckoutLink?: string;
  platformFeePercent: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

export interface ICustomerProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  defaultLatitude: number | null;
  defaultLongitude: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginRequest {
  email: string;
  password: string;
  role: UserRole;
}

export interface RegisterRequest {
  email: string;
  password: string;
  role: UserRole;
  firstName: string;
  middleName?: string;
  lastName: string;
  phone: string;
  address?: string;
  kycDocuments?: IKycDocument[];
}

export interface EscrowSplit {
  recipientType: 'admin' | 'vendor' | 'retailer' | 'wholesaler' | 'delivery_driver';
  recipientId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  paypalTransactionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface WithdrawalRequest {
  id: string;
  userId: string;
  userRole: UserRole;
  amount: number;
  currency: string;
  payoutChannel: 'PAYPAL' | 'BPI_BANK' | 'GCASH' | 'MAYA' | 'PAYMONGO';
  payoutAccount: string;
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  paypalPayoutBatchId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type ComplianceStatus = 'pending' | 'approved' | 'rejected' | 'flagged' | 'suspended';

export interface ComplianceRecord {
  id: string;
  userId: string;
  userRole: UserRole;
  email: string;
  status: ComplianceStatus;
  lockinReason?: string;
  requestedBy?: string;
  approvedBy?: string;
  approvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChangeEmailRequest {
  id: string;
  userId: string;
  oldEmail: string;
  newEmail: string;
  token: string;
  status: 'pending' | 'confirmed' | 'expired' | 'cancelled';
  expiresAt: Date;
  createdAt: Date;
}

export interface ChangePasswordRequest {
  id: string;
  userId: string;
  token: string;
  status: 'pending' | 'confirmed' | 'expired' | 'cancelled';
  expiresAt: Date;
  createdAt: Date;
}

export interface UserComplaint {
  id: string;
  userId: string;
  reportedBy: string;
  reportedByEmail: string;
  type: 'disclaimer' | 'complaint' | 'hacker' | 'phishing' | 'abuse';
  subject: string;
  description: string;
  status: 'open' | 'reviewing' | 'resolved' | 'dismissed';
  adminResponse?: string;
  resolvedBy?: string;
  resolvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface AdminNotification {
  id: string;
  adminEmail: string;
  subject: string;
  message: string;
  type: 'system' | 'security' | 'compliance' | 'user_report';
  read: boolean;
  createdAt: Date;
}
