import { AuthService } from './auth.service.js';
export const AuthController = {
    async register(req, res) {
        try {
            const { email, password, role, firstName, middleName, lastName, phone, address, kycDocuments, } = req.body;
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
        }
        catch (error) {
            return res.status(400).json({ error: error.message });
        }
    },
    async login(req, res) {
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
        }
        catch (error) {
            return res.status(401).json({ error: error.message });
        }
    },
    async googleLogin(req, res) {
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
        }
        catch (error) {
            return res.status(401).json({ error: error.message });
        }
    },
    async logout(req, res) {
        try {
            const { refreshToken } = req.body;
            AuthService.logout(refreshToken);
            return res.status(200).json({ message: 'Logged out successfully.' });
        }
        catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },
    async refresh(req, res) {
        try {
            const { refreshToken } = req.body;
            if (!refreshToken) {
                return res.status(400).json({ error: 'Refresh token is required.' });
            }
            const result = AuthService.refreshAccessToken(refreshToken);
            return res.status(200).json({ tokens: result.tokens });
        }
        catch (error) {
            return res.status(401).json({ error: error.message });
        }
    },
    async me(req, res) {
        try {
            const userId = req.user?.userId;
            const user = await AuthService.getUserById(userId);
            if (!user) {
                return res.status(404).json({ error: 'User not found.' });
            }
            let profile = null;
            if (user.role === 'vendor')
                profile = await AuthService.getVendorProfile(userId);
            if (user.role === 'wholesaler')
                profile = await AuthService.getWholesalerProfile(userId);
            if (user.role === 'delivery_driver')
                profile = await AuthService.getDriverProfile(userId);
            if (user.role === 'retailer')
                profile = await AuthService.getRetailerProfile(userId);
            if (user.role === 'customer')
                profile = await AuthService.getCustomerProfile(userId);
            const { passwordHash: _, ...userWithoutHash } = user;
            return res.status(200).json({ user: userWithoutHash, profile });
        }
        catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },
    async submitKyc(req, res) {
        try {
            const userId = req.user?.userId;
            const uploadedFiles = req.files;
            const files = uploadedFiles ? Object.values(uploadedFiles).flat() : [];
            if (files.length === 0) {
                return res.status(400).json({ error: 'No documents uploaded.' });
            }
            const documents = files.map((file) => ({
                type: file.fieldname,
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
        }
        catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },
    async requestChangeEmail(req, res) {
        try {
            const userId = req.user?.userId;
            const { newEmail } = req.body;
            if (!newEmail) {
                return res.status(400).json({ error: 'New email is required.' });
            }
            const result = await AuthService.requestChangeEmail(userId, newEmail);
            return res.status(200).json({
                message: 'Change email request sent. Please check your email to confirm.',
                ...result,
            });
        }
        catch (error) {
            return res.status(400).json({ error: error.message });
        }
    },
    async confirmChangeEmail(req, res) {
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
        }
        catch (error) {
            return res.status(400).json({ error: error.message });
        }
    },
    async requestChangePassword(req, res) {
        try {
            const userId = req.user?.userId;
            const result = await AuthService.requestChangePassword(userId);
            return res.status(200).json({
                message: 'Password change request sent. Please check your email to confirm.',
                ...result,
            });
        }
        catch (error) {
            return res.status(400).json({ error: error.message });
        }
    },
    async confirmPasswordChange(req, res) {
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
        }
        catch (error) {
            return res.status(400).json({ error: error.message });
        }
    },
    async getComplianceRecords(req, res) {
        try {
            const records = AuthService.getComplianceRecords();
            return res.status(200).json({ records });
        }
        catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },
    async approveCompliance(req, res) {
        try {
            const { id } = req.params;
            const adminEmail = req.user?.email;
            const result = await AuthService.approveCompliance(id, adminEmail || '');
            return res.status(200).json({ message: 'Compliance approved.', record: result });
        }
        catch (error) {
            return res.status(400).json({ error: error.message });
        }
    },
    async rejectCompliance(req, res) {
        try {
            const { id } = req.params;
            const adminEmail = req.user?.email;
            const { reason } = req.body;
            const result = await AuthService.rejectCompliance(id, adminEmail || '', reason || 'No reason provided');
            return res.status(200).json({ message: 'Compliance rejected.', record: result });
        }
        catch (error) {
            return res.status(400).json({ error: error.message });
        }
    },
    async getAllUsers(req, res) {
        try {
            const users = await AuthService.getAllUsers();
            return res.status(200).json({ users: users || [] });
        }
        catch (error) {
            return res.status(200).json({ users: [] });
        }
    },
    async submitComplaint(req, res) {
        try {
            const userId = req.user?.userId;
            const { reportedBy, reportedByEmail, type, subject, description } = req.body;
            if (!reportedBy || !reportedByEmail || !type || !subject || !description) {
                return res.status(400).json({ error: 'All complaint fields are required.' });
            }
            const complaint = await AuthService.submitComplaint({
                userId, reportedBy, reportedByEmail, type, subject, description,
            });
            return res.status(201).json({ message: 'Complaint submitted.', complaint });
        }
        catch (error) {
            return res.status(400).json({ error: error.message });
        }
    },
    async getComplaints(req, res) {
        try {
            const complaints = await AuthService.getComplaints();
            return res.status(200).json({ complaints: complaints || [] });
        }
        catch (error) {
            return res.status(200).json({ complaints: [] });
        }
    },
    async resolveComplaint(req, res) {
        try {
            const { id } = req.params;
            const { adminResponse, resolvedBy } = req.body;
            const result = await AuthService.resolveComplaint(id, adminResponse || '', resolvedBy || 'admin');
            return res.status(200).json({ message: 'Complaint resolved.', complaint: result });
        }
        catch (error) {
            return res.status(400).json({ error: error.message });
        }
    },
    async getAdminNotifications(req, res) {
        try {
            const adminEmail = req.user?.email;
            const notifications = await AuthService.getAdminNotifications(adminEmail || '');
            return res.status(200).json({ notifications: notifications || [] });
        }
        catch (error) {
            return res.status(200).json({ notifications: [] });
        }
    },
    async createAdminNotification(req, res) {
        try {
            const { adminEmail, subject, message, type } = req.body;
            if (!adminEmail || !subject || !message || !type) {
                return res.status(400).json({ error: 'All notification fields are required.' });
            }
            const result = await AuthService.createAdminNotification({ adminEmail, subject, message, type });
            return res.status(201).json({ message: 'Notification created.', notification: result });
        }
        catch (error) {
            return res.status(400).json({ error: error.message });
        }
    },
    async markNotificationRead(req, res) {
        try {
            const { id } = req.params;
            const result = await AuthService.markNotificationRead(id);
            return res.status(200).json({ message: 'Notification marked as read.', notification: result });
        }
        catch (error) {
            return res.status(400).json({ error: error.message });
        }
    },
};
//# sourceMappingURL=auth.controller.js.map