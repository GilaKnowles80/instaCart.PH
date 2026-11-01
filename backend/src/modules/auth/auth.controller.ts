import { Request, Response } from 'express';
import { AuthService } from './auth.service.js';
import { authenticateToken, authorizeRoles } from './auth.middleware.js';

export const AuthController = {
  async register(req: Request, res: Response) {
    try {
      const {
        email,
        password,
        role,
        firstName,
        middleName,
        lastName,
        phone,
        address,
        kycDocuments,
      } = req.body;
      if (!email || !password || !role || !firstName || !lastName || !phone) {
        return res.status(400).json({ error: 'Email, password, role, first name, last name, and phone are required.' });
      }

      const parsedKyc = kycDocuments ? JSON.parse(kycDocuments) : undefined;
      const result = await AuthService.register({
        email,
        password,
        role,
        firstName,
        middleName,
        lastName,
        phone,
        address,
        kycDocuments: parsedKyc,
      });
      return res.status(201).json({
        message: 'Registration successful. Your account is pending review.',
        user: result.user,
        tokens: result.tokens,
      });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  },

  async login(req: Request, res: Response) {
    try {
      const { email, password, role } = req.body;
      if (!email || !password || !role) {
        return res.status(400).json({ error: 'Email, password, and role are required.' });
      }

      const result = await AuthService.login(email, password, role);
      return res.status(200).json({
        message: 'Login successful.',
        user: result.user,
        tokens: result.tokens,
      });
    } catch (error: any) {
      return res.status(401).json({ error: error.message });
    }
  },

  async googleLogin(req: Request, res: Response) {
    try {
      const { credential, role } = req.body;
      if (!credential || !role) {
        return res.status(400).json({ error: 'Google credential and role are required.' });
      }

      const result = await AuthService.googleLogin(credential, role);
      return res.status(200).json({
        message: 'Google login successful.',
        user: result.user,
        tokens: result.tokens,
      });
    } catch (error: any) {
      return res.status(401).json({ error: error.message });
    }
  },

  async logout(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;
      AuthService.logout(refreshToken);
      return res.status(200).json({ message: 'Logged out successfully.' });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  },

  async refresh(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        return res.status(400).json({ error: 'Refresh token is required.' });
      }

      const result = AuthService.refreshAccessToken(refreshToken);
      return res.status(200).json({ tokens: result.tokens });
    } catch (error: any) {
      return res.status(401).json({ error: error.message });
    }
  },

  async me(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;
      const user = await AuthService.getUserById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }

      let profile: any = null;
      if ((user as any).role === 'vendor') profile = await AuthService.getVendorProfile(userId);
      if ((user as any).role === 'wholesaler') profile = await AuthService.getWholesalerProfile(userId);
      if ((user as any).role === 'delivery_driver') profile = await AuthService.getDriverProfile(userId);
      if ((user as any).role === 'retailer') profile = await AuthService.getRetailerProfile(userId);
      if ((user as any).role === 'customer') profile = await AuthService.getCustomerProfile(userId);

      const { passwordHash: _, ...userWithoutHash } = user as any;
      return res.status(200).json({ user: userWithoutHash, profile });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  },

  async submitKyc(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;
      // upload.fields() populates req.files as { [fieldname]: File[] }, not a flat array.
      const uploadedFiles = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
      const files = uploadedFiles ? Object.values(uploadedFiles).flat() : [];

      if (files.length === 0) {
        return res.status(400).json({ error: 'No documents uploaded.' });
      }

      const documents = files.map((file) => ({
        type: (file.fieldname as any),
        fileUrl: `/uploads/kyc/${file.filename}`,
        fileName: file.originalname,
        uploadedAt: new Date(),
        verified: false,
      }));

      const user = AuthService.updateKycDocuments(userId, documents);
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }

      return res.status(200).json({
        message: 'KYC documents submitted successfully.',
        documents,
      });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  },
  // ==========================================
  // CHANGE EMAIL
  // ==========================================
  async requestChangeEmail(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;
      const { newEmail } = req.body;
      if (!newEmail) {
        return res.status(400).json({ error: 'New email is required.' });
      }
      const result = await AuthService.requestChangeEmail(userId, newEmail);
      return res.status(200).json({
        message: 'Change email request sent. Please check your email to confirm.',
        ...result,
      });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  },

  async confirmChangeEmail(req: Request, res: Response) {
    try {
      const { token } = req.query;
      if (!token) {
        return res.status(400).json({ error: 'Token is required.' });
      }
      const result = await AuthService.confirmChangeEmail(String(token));
      return res.status(200).json({
        message: 'Email changed successfully.',
        ...result,
      });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  },

  // ==========================================
  // CHANGE PASSWORD
  // ==========================================
  async requestChangePassword(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;
      const result = await AuthService.requestChangePassword(userId);
      return res.status(200).json({
        message: 'Password change request sent. Please check your email to confirm.',
        ...result,
      });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  },

  async confirmPasswordChange(req: Request, res: Response) {
    try {
      const { token } = req.query;
      const { newPassword } = req.body;
      if (!token) {
        return res.status(400).json({ error: 'Token is required.' });
      }
      if (!newPassword) {
        return res.status(400).json({ error: 'New password is required.' });
      }
      const result = await AuthService.confirmPasswordChange(String(token), newPassword);
      return res.status(200).json({
        message: 'Password changed successfully.',
        ...result,
      });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  },
  // ==========================================
  // COMPLIANCE RECORDS (Admin only)
  // ==========================================
  async getComplianceRecords(req: Request, res: Response) {
    try {
      const records = AuthService.getComplianceRecords();
      return res.status(200).json({ records });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  },

  async approveCompliance(req: Request, res: Response) {
    try {
      const { id } = req.params as { id: string };
      const adminEmail = (req as any).user?.email;
      const result = await AuthService.approveCompliance(id, adminEmail || '');
      return res.status(200).json({ message: 'Compliance approved.', record: result });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  },

  async rejectCompliance(req: Request, res: Response) {
    try {
      const { id } = req.params as { id: string };
      const adminEmail = (req as any).user?.email;
      const { reason } = req.body;
      const result = await AuthService.rejectCompliance(id, adminEmail || '', reason || 'No reason provided');
      return res.status(200).json({ message: 'Compliance rejected.', record: result });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  },

  // ==========================================
  // USER MONITORING (Admin only)
  // ==========================================
  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await AuthService.getAllUsers();
      return res.status(200).json({ users: users || [] });
    } catch (error: any) {
      return res.status(200).json({ users: [] });
    }
  },

  // ==========================================
  // COMPLAINTS & REPORTS
  // ==========================================
  async submitComplaint(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;
      const { reportedBy, reportedByEmail, type, subject, description } = req.body;
      if (!reportedBy || !reportedByEmail || !type || !subject || !description) {
        return res.status(400).json({ error: 'All complaint fields are required.' });
      }
      const complaint = await AuthService.submitComplaint({
        userId, reportedBy, reportedByEmail, type, subject, description,
      });
      return res.status(201).json({ message: 'Complaint submitted.', complaint });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  },

  async getComplaints(req: Request, res: Response) {
    try {
      const complaints = await AuthService.getComplaints();
      return res.status(200).json({ complaints: complaints || [] });
    } catch (error: any) {
      return res.status(200).json({ complaints: [] });
    }
  },

  async resolveComplaint(req: Request, res: Response) {
    try {
      const { id } = req.params as { id: string };
      const { adminResponse, resolvedBy } = req.body;
      const result = await AuthService.resolveComplaint(id, adminResponse || '', resolvedBy || 'admin');
      return res.status(200).json({ message: 'Complaint resolved.', complaint: result });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  },

  // ==========================================
  // ADMIN NOTIFICATIONS
  // ==========================================
  async getAdminNotifications(req: Request, res: Response) {
    try {
      const adminEmail = (req as any).user?.email;
      const notifications = await AuthService.getAdminNotifications(adminEmail || '');
      return res.status(200).json({ notifications: notifications || [] });
    } catch (error: any) {
      return res.status(200).json({ notifications: [] });
    }
  },

  async createAdminNotification(req: Request, res: Response) {
    try {
      const { adminEmail, subject, message, type } = req.body;
      if (!adminEmail || !subject || !message || !type) {
        return res.status(400).json({ error: 'All notification fields are required.' });
      }
      const result = await AuthService.createAdminNotification({ adminEmail, subject, message, type });
      return res.status(201).json({ message: 'Notification created.', notification: result });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  },

  async markNotificationRead(req: Request, res: Response) {
    try {
      const { id } = req.params as { id: string };
      const result = await AuthService.markNotificationRead(id);
      return res.status(200).json({ message: 'Notification marked as read.', notification: result });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  },
};
