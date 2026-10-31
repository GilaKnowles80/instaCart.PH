import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { OAuth2Client } from 'google-auth-library';
import { sendEmail, EMAIL_TEMPLATES } from '../../services/email.service.js';
import {
  UserRepository,
  ProfileRepository,
  RefreshTokenRepository,
  ComplianceRecordRepository,
  ChangeEmailRequestRepository,
  ChangePasswordRequestRepository,
  UserComplaintRepository,
  AdminNotificationRepository,
} from '../../db/repository.js';
import type { UserRole } from './auth.types.js';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || '');

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'instaCart-access-secret-change-in-production';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'instaCart-refresh-secret-change-in-production';
const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';

const ADMIN_WHITELIST = ['gilaknowles80@gmail.com', 'gctravelandtours2021@gmail.com'];

const COMPLIANCE_REQUIRED_ROLES: UserRole[] = [
  'developer',
  'builder',
  'homeowner',
  'buyer',
  'rem_sales_agent',
  'real_estate_agent',
];

export class AuthService {
  static async register(data: {
    email: string;
    password: string;
    role: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    phone: string;
    address?: string;
    kycDocuments?: any[];
  }) {
    const existing = await UserRepository.findByEmail(data.email);
    if (existing) {
      throw new Error('Email already registered.');
    }

    if (data.role === 'admin' && !ADMIN_WHITELIST.includes(data.email.toLowerCase())) {
      throw new Error('Admin registration is restricted to authorized accounts only.');
    }

    const id = `user_${Math.random().toString(36).slice(2, 11)}`;
    const passwordHash = await bcrypt.hash(data.password, 12);
    const fullName = [data.firstName, data.middleName, data.lastName].filter(Boolean).join(' ');

    const user = await UserRepository.create({
      id, email: data.email, passwordHash, role: data.role,
      firstName: data.firstName, middleName: data.middleName, lastName: data.lastName,
      phone: data.phone, address: data.address || '', fullName,
      kycDocuments: data.kycDocuments || [],
    });

    if (COMPLIANCE_REQUIRED_ROLES.includes(data.role as UserRole)) {
      await ComplianceRecordRepository.create({
        id: `comp_${Math.random().toString(36).slice(2, 11)}`,
        userId: id, userRole: data.role as UserRole, email: data.email,
        status: 'pending',
        lockinReason: `Compliance review required for ${data.role} role`,
      });
    }

    await sendEmail(EMAIL_TEMPLATES.welcome(fullName, data.role, data.email));

    if (data.role === 'admin') {
      for (const adminEmail of ADMIN_WHITELIST) {
        if (adminEmail !== data.email) {
          await sendEmail(EMAIL_TEMPLATES.adminNotification(
            'Admin', 'New Admin Registration',
            `A new admin account has been registered: ${data.email} (${fullName})`
          ));
        }
      }
    }

    if (data.role === 'vendor') {
      await ProfileRepository.createVendor({
        id: `vendor_${id}`, userId: id, businessName: '', legalName: fullName,
        contactName: fullName, category: 'WET_MARKET', operationalClass: 'wet-market',
        payoutChannel: 'GCASH', payoutAccountName: '', payoutAccountReference: '',
        paypalCheckoutLink: undefined, platformFeePercent: 2, status: 'pending-review',
      });
    } else if (data.role === 'wholesaler') {
      await ProfileRepository.createWholesaler({
        id: `wholesaler_${id}`, userId: id, businessName: '', legalName: fullName,
        contactName: fullName, payoutChannel: 'GCASH', payoutAccountName: '',
        payoutAccountReference: '', paypalCheckoutLink: undefined, platformFeePercent: 2,
        status: 'pending-review',
      });
    } else if (data.role === 'delivery_driver') {
      await ProfileRepository.createDriver({
        id: `driver_${id}`, userId: id, firstName: data.firstName, lastName: data.lastName,
        email: data.email, phone: data.phone, licenseNumber: '', vehicleType: 'motorcycle',
        ratePerKilometer: 15, isAvailable: true, currentLatitude: null, currentLongitude: null,
        totalDeliveries: 0, totalEarnings: 0, status: 'pending',
      });
    } else if (data.role === 'retailer') {
      await ProfileRepository.createRetailer({
        id: `retailer_${id}`, userId: id, storeName: '', ownerName: fullName,
        contactEmail: data.email, contactPhone: data.phone, address: data.address || '',
        paypalEmail: process.env.PAYPAL_MERCHANT_EMAIL || 'gctravelandtours2021@gmail.com',
        platformFeePercent: 2, status: 'pending-review',
      });
    } else if (data.role === 'customer') {
      await ProfileRepository.createCustomer({
        id: `customer_${id}`, userId: id, firstName: data.firstName, lastName: data.lastName,
        email: data.email, phone: data.phone, address: data.address || '',
        defaultLatitude: null, defaultLongitude: null,
      });
    }

    const tokens = this.generateTokens(id, data.role);
    await RefreshTokenRepository.create(tokens.refreshToken, id);

    const { passwordHash: _, ...userWithoutHash } = user;
    return { user: userWithoutHash, tokens };
  }
  static async login(email: string, password: string, role: string) {
    const user = await UserRepository.findByEmail(email);
    if (!user || user.role !== role) {
      throw new Error('Invalid email, password, or role.');
    }

    if (!user.is_active) {
      throw new Error('Account is deactivated. Please contact support.');
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      throw new Error('Invalid email, password, or role.');
    }

    const tokens = this.generateTokens(user.id, user.role);
    await RefreshTokenRepository.create(tokens.refreshToken, user.id);

    await sendEmail(EMAIL_TEMPLATES.securityAlert(
      user.full_name || user.email,
      user.email,
      'New Login Detected',
      `A new login was detected on your instaCart.PH account from an unknown device. If this was not you, please change your password immediately.`
    ));

    const { password_hash: _, ...userWithoutHash } = user;
    return { user: userWithoutHash, tokens };
  }

  static async googleLogin(credential: string, role: string) {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload) {
      throw new Error('Invalid Google credential.');
    }

    const email = payload.email;
    const firstName = payload.given_name || '';
    const lastName = payload.family_name || '';
    if (!email) {
      throw new Error('Google account has no email address.');
    }

    let user = await UserRepository.findByEmail(email);

    if (!user) {
      const id = `user_${Math.random().toString(36).slice(2, 11)}`;
      const fullName = [firstName, lastName].filter(Boolean).join(' ') || email;

      user = await UserRepository.create({
        id, email, passwordHash: '', role, firstName, lastName, phone: '',
        address: '', fullName, kycDocuments: [],
      });

      if (role === 'vendor') {
        await ProfileRepository.createVendor({
          id: `vendor_${id}`, userId: id, businessName: '', legalName: fullName,
          contactName: fullName, category: 'WET_MARKET', operationalClass: 'wet-market',
          payoutChannel: 'GCASH', payoutAccountName: '', payoutAccountReference: '',
          paypalCheckoutLink: undefined, platformFeePercent: 2, status: 'pending-review',
        });
      } else if (role === 'wholesaler') {
        await ProfileRepository.createWholesaler({
          id: `wholesaler_${id}`, userId: id, businessName: '', legalName: fullName,
          contactName: fullName, payoutChannel: 'GCASH', payoutAccountName: '',
          payoutAccountReference: '', paypalCheckoutLink: undefined, platformFeePercent: 2,
          status: 'pending-review',
        });
      } else if (role === 'delivery_driver') {
        await ProfileRepository.createDriver({
          id: `driver_${id}`, userId: id, firstName, lastName, email, phone: '',
          licenseNumber: '', vehicleType: 'motorcycle', ratePerKilometer: 15,
          isAvailable: true, currentLatitude: null, currentLongitude: null,
          totalDeliveries: 0, totalEarnings: 0, status: 'pending',
        });
      } else if (role === 'retailer') {
        await ProfileRepository.createRetailer({
          id: `retailer_${id}`, userId: id, storeName: '', ownerName: fullName,
          contactEmail: email, contactPhone: '', address: '',
          paypalEmail: process.env.PAYPAL_MERCHANT_EMAIL || 'gctravelandtours2021@gmail.com',
          platformFeePercent: 2, status: 'pending-review',
        });
      } else {
        await ProfileRepository.createCustomer({
          id: `customer_${id}`, userId: id, firstName, lastName, email, phone: '',
          address: '', defaultLatitude: null, defaultLongitude: null,
        });
      }

      await sendEmail(EMAIL_TEMPLATES.welcome(fullName, role, email));
    }

    if (!user.is_active) {
      throw new Error('Account is deactivated. Please contact support.');
    }

    const tokens = this.generateTokens(user.id, user.role);
    await RefreshTokenRepository.create(tokens.refreshToken, user.id);

    await sendEmail(EMAIL_TEMPLATES.securityAlert(
      user.full_name || user.email,
      user.email,
      'New Google Login Detected',
      `A new login was detected on your instaCart.PH account via Google Sign-In. If this was not you, please change your password immediately.`
    ));

    const { password_hash: _, ...userWithoutHash } = user;
    return { user: userWithoutHash, tokens };
  }
  static logout(refreshToken: string) {
    RefreshTokenRepository.delete(refreshToken);
    return { success: true };
  }

  static refreshAccessToken(refreshToken: string) {
    try {
      const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as any;
      const tokens = this.generateTokens(decoded.userId, decoded.role);
      RefreshTokenRepository.delete(refreshToken);
      RefreshTokenRepository.create(tokens.refreshToken, decoded.userId);
      return { tokens };
    } catch {
      throw new Error('Invalid or expired refresh token.');
    }
  }

  static generateTokens(userId: string, role: string) {
    const accessToken = jwt.sign({ userId, role }, JWT_ACCESS_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
    const refreshToken = jwt.sign({ userId, role }, JWT_REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });
    return { accessToken, refreshToken, expiresIn: 15 * 60 };
  }

  static verifyAccessToken(token: string) {
    return jwt.verify(token, JWT_ACCESS_SECRET) as any;
  }

  static async getUserById(userId: string) {
    return UserRepository.findById(userId);
  }

  static async getVendorProfile(userId: string) {
    return ProfileRepository.getVendorByUserId(userId);
  }

  static async getWholesalerProfile(userId: string) {
    return ProfileRepository.getWholesalerByUserId(userId);
  }

  static async getDriverProfile(userId: string) {
    return ProfileRepository.getDriverByUserId(userId);
  }

  static async getRetailerProfile(userId: string) {
    return ProfileRepository.getRetailerByUserId(userId);
  }

  static async getCustomerProfile(userId: string) {
    return ProfileRepository.getCustomerByUserId(userId);
  }

  static async updateVendorProfile(userId: string, updates: any) {
    const profile = await ProfileRepository.getVendorByUserId(userId);
    if (!profile) return null;
    return ProfileRepository.createVendor({ ...profile, ...updates, userId });
  }

  static async getAllVendors() {
    const users = await UserRepository.getAll();
    return users.filter((u: any) => u.role === 'vendor');
  }

  static async getAllDrivers() {
    const users = await UserRepository.getAll();
    return users.filter((u: any) => u.role === 'delivery_driver');
  }

  static async getAllRetailers() {
    const users = await UserRepository.getAll();
    return users.filter((u: any) => u.role === 'retailer');
  }

  static async getAllCustomers() {
    const users = await UserRepository.getAll();
    return users.filter((u: any) => u.role === 'customer');
  }

  static async getAllWholesalers() {
    const users = await UserRepository.getAll();
    return users.filter((u: any) => u.role === 'wholesaler');
  }

  static async updateKycDocuments(userId: string, documents: any[]) {
    const user = await UserRepository.findById(userId);
    if (!user) return null;
    await UserRepository.update(userId, { kyc_documents: documents, kyc_verified: true });
    return { ...user, kyc_documents: documents, kyc_verified: true };
  }
  static async requestChangeEmail(userId: string, newEmail: string) {
    const user = await UserRepository.findById(userId);
    if (!user) throw new Error('User not found.');
    const existing = await UserRepository.findByEmail(newEmail);
    if (existing) throw new Error('Email already in use by another account.');
    const token = `ce_${Math.random().toString(36).slice(2, 11)}`;
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const requestId = `cer_${Math.random().toString(36).slice(2, 11)}`;
    await ChangeEmailRequestRepository.create({
      id: requestId, userId, oldEmail: user.email, newEmail, token,
      status: 'pending', expiresAt,
    });
    sendEmail(EMAIL_TEMPLATES.changeEmailRequested(
      user.full_name || user.email, user.email, newEmail, token
    ));
    return { requestId, token, expiresAt };
  }

  static async confirmChangeEmail(token: string) {
    const request = await ChangeEmailRequestRepository.findByToken(token);
    if (!request) throw new Error('Invalid or expired change email token.');
    if (request.status !== 'pending') throw new Error('Change email request already processed.');
    if (request.expires_at < new Date()) {
      await ChangeEmailRequestRepository.update(request.id, { status: 'expired' });
      throw new Error('Change email token has expired.');
    }
    const user = await UserRepository.findById(request.user_id);
    if (!user) throw new Error('User not found.');
    await UserRepository.update(request.user_id, { email: request.new_email });
    await ChangeEmailRequestRepository.update(request.id, { status: 'confirmed' });
    sendEmail(EMAIL_TEMPLATES.changeEmailConfirmed(
      user.full_name || user.email, request.new_email
    ));
    return { success: true, newEmail: request.new_email };
  }

  static async requestChangePassword(userId: string) {
    const user = await UserRepository.findById(userId);
    if (!user) throw new Error('User not found.');
    const token = `cp_${Math.random().toString(36).slice(2, 11)}`;
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const requestId = `cpr_${Math.random().toString(36).slice(2, 11)}`;
    await ChangePasswordRequestRepository.create({
      id: requestId, userId, token, status: 'pending', expiresAt,
    });
    sendEmail(EMAIL_TEMPLATES.changePasswordRequested(
      user.full_name || user.email, user.email, token
    ));
    return { requestId, token, expiresAt };
  }

  static async confirmPasswordChange(token: string, newPassword: string) {
    const request = await ChangePasswordRequestRepository.findByToken(token);
    if (!request) throw new Error('Invalid or expired change password token.');
    if (request.status !== 'pending') throw new Error('Change password request already processed.');
    if (request.expires_at < new Date()) {
      await ChangePasswordRequestRepository.update(request.id, { status: 'expired' });
      throw new Error('Change password token has expired.');
    }
    const passwordHash = await bcrypt.hash(newPassword, 12);
    const user = await UserRepository.findById(request.user_id);
    if (!user) throw new Error('User not found.');
    await UserRepository.update(request.user_id, { password_hash: passwordHash });
    await ChangePasswordRequestRepository.update(request.id, { status: 'confirmed' });
    sendEmail(EMAIL_TEMPLATES.securityAlert(
      user.full_name || user.email, user.email, 'Password Changed',
      'Your instaCart.PH account password has been successfully changed.'
    ));
    return { success: true };
  }
  static async getComplianceRecords() {
    return ComplianceRecordRepository.getAll();
  }

  static async approveCompliance(complianceId: string, adminEmail: string) {
    const record = await ComplianceRecordRepository.findById(complianceId);
    if (!record) throw new Error('Compliance record not found.');
    await ComplianceRecordRepository.update(complianceId, {
      status: 'approved', approved_by: adminEmail, approved_at: new Date(),
    });
    const user = await UserRepository.findById(record.user_id);
    if (user) {
      sendEmail(EMAIL_TEMPLATES.adminApproved(
        user.full_name || user.email, record.user_role, record.email
      ));
    }
    return { ...record, status: 'approved', approved_by: adminEmail, approved_at: new Date() };
  }

  static async rejectCompliance(complianceId: string, adminEmail: string, reason: string) {
    const record = await ComplianceRecordRepository.findById(complianceId);
    if (!record) throw new Error('Compliance record not found.');
    await ComplianceRecordRepository.update(complianceId, {
      status: 'rejected', lockin_reason: reason,
    });
    const user = await UserRepository.findById(record.user_id);
    if (user) {
      sendEmail(EMAIL_TEMPLATES.adminRejected(
        user.full_name || user.email, record.user_role, record.email, reason
      ));
    }
    return { ...record, status: 'rejected', lockin_reason: reason };
  }

  static async getAllUsers() {
    const users = await UserRepository.getAll();
    return users.map((u: any) => {
      const { password_hash: _, ...rest } = u;
      return rest;
    });
  }

  static async submitComplaint(data: {
    userId: string;
    reportedBy: string;
    reportedByEmail: string;
    type: 'disclaimer' | 'complaint' | 'hacker' | 'phishing' | 'abuse';
    subject: string;
    description: string;
  }) {
    const id = `cmp_${Math.random().toString(36).slice(2, 11)}`;
    const complaint = await UserComplaintRepository.create({
      id, userId: data.userId, reportedBy: data.reportedBy,
      reportedByEmail: data.reportedByEmail, type: data.type,
      subject: data.subject, description: data.description, status: 'open',
    });
    for (const adminEmail of ADMIN_WHITELIST) {
      sendEmail(EMAIL_TEMPLATES.adminNotification(
        'Admin', `User Report: ${data.type}`,
        `A new ${data.type} report has been submitted.\nUser: ${data.reportedBy} (${data.reportedByEmail})\nSubject: ${data.subject}\nDescription: ${data.description}`
      ));
    }
    return complaint;
  }

  static async getComplaints() {
    return UserComplaintRepository.getAll();
  }

  static async resolveComplaint(complaintId: string, adminResponse: string, resolvedBy: string) {
    const complaint = await UserComplaintRepository.update(complaintId, {
      status: 'resolved', admin_response: adminResponse, resolved_by: resolvedBy, resolved_at: new Date(),
    });
    if (!complaint) throw new Error('Complaint not found.');
    return complaint;
  }

  static async getAdminNotifications(adminEmail: string) {
    return AdminNotificationRepository.findByAdminEmail(adminEmail);
  }

  static async createAdminNotification(data: {
    adminEmail: string; subject: string; message: string;
    type: 'system' | 'security' | 'compliance' | 'user_report';
  }) {
    const notification = await AdminNotificationRepository.create({
      id: `notif_${Math.random().toString(36).slice(2, 11)}`,
      adminEmail: data.adminEmail, subject: data.subject, message: data.message,
      type: data.type, read: false,
    });
    sendEmail(EMAIL_TEMPLATES.adminNotification('Admin', data.subject, data.message));
    return notification;
  }

  static async markNotificationRead(notificationId: string) {
    const notification = await AdminNotificationRepository.markRead(notificationId);
    if (!notification) throw new Error('Notification not found.');
    return notification;
  }
}