import { z } from 'zod';
export const RegisterSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .max(128, 'Password too long'),
    role: z.string().min(1, 'Role is required'),
    firstName: z.string().min(1, 'First name is required').max(100),
    middleName: z.string().max(100).optional().nullable(),
    lastName: z.string().min(1, 'Last name is required').max(100),
    phone: z.string().min(1, 'Phone is required').max(50),
    address: z.string().max(500).optional(),
    kycDocuments: z.array(z.any()).optional(),
});
export const LoginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
    role: z.string().min(1, 'Role is required'),
});
export const GoogleLoginSchema = z.object({
    credential: z.string().min(1, 'Google credential is required'),
    role: z.string().min(1, 'Role is required'),
});
export const ChangeEmailSchema = z.object({
    newEmail: z.string().email('Invalid email address'),
});
export const ChangePasswordSchema = z.object({
    newPassword: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .max(128, 'Password too long'),
});
export const ComplaintSchema = z.object({
    reportedBy: z.string().min(1, 'Reported by is required'),
    reportedByEmail: z.string().email('Invalid email address'),
    type: z.enum(['disclaimer', 'complaint', 'hacker', 'phishing', 'abuse']),
    subject: z.string().min(1, 'Subject is required').max(255),
    description: z.string().min(1, 'Description is required').max(2000),
});
export const OrderStatusSchema = z.object({
    status: z.enum([
        'pending',
        'paid',
        'preparing',
        'out_for_delivery',
        'delivered',
        'cancelled',
        'refunded',
    ]),
});
export const WithdrawalSchema = z.object({
    amount: z.number().positive('Amount must be positive'),
    currency: z.string().min(3).max(3).default('PHP'),
    payoutChannel: z.enum(['PAYPAL', 'BPI_BANK', 'GCASH', 'MAYA', 'PAYMONGO']),
    payoutAccount: z.string().min(1, 'Payout account is required'),
});
export const WithdrawalProcessSchema = z.object({
    action: z.enum(['approve', 'reject']),
});
export const NotificationSchema = z.object({
    adminEmail: z.string().email('Invalid email address'),
    subject: z.string().min(1, 'Subject is required').max(255),
    message: z.string().min(1, 'Message is required').max(5000),
    type: z.enum(['system', 'security', 'compliance', 'user_report']),
});
export const KYCDocumentSchema = z.object({
    userId: z.string().min(1, 'User ID is required'),
    userRole: z.string().min(1, 'User role is required'),
    documentType: z.string().min(1, 'Document type is required'),
    documentName: z.string().min(1, 'Document name is required'),
    fileUrl: z.string().url('Invalid file URL'),
    fileName: z.string().min(1, 'File name is required'),
    fileSize: z.number().positive('File size must be positive'),
    mimeType: z.string().min(1, 'MIME type is required'),
    isRequired: z.boolean().optional(),
});
//# sourceMappingURL=auth.validation.js.map