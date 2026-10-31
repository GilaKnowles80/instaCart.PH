import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();
const ADMIN_EMAILS = [
    'gilaknowles80@gmail.com',
    'gctravelandtours2021@gmail.com',
];
export const emailTransport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.GMAIL_USER || 'gilaknowles80@gmail.com',
        pass: process.env.GMAIL_APP_PASSWORD || '',
    },
});
export async function sendEmail(options) {
    try {
        const info = await emailTransport.sendMail({
            from: `"instaCart.PH Admin" <${process.env.GMAIL_USER || 'gilaknowles80@gmail.com'}>`,
            to: options.to,
            subject: options.subject,
            text: options.text,
            html: options.html,
        });
        console.log(`?? Email sent to ${options.to}: ${info.messageId}`);
        return { success: true, messageId: info.messageId };
    }
    catch (error) {
        console.error(`? Failed to send email to ${options.to}:`, error.message);
        return { success: false, error: error.message };
    }
}
export function isAdminEmail(email) {
    return ADMIN_EMAILS.includes(email.toLowerCase());
}
export function isAllowedAdminEmail(email) {
    return ADMIN_EMAILS.includes(email.toLowerCase());
}
export const EMAIL_TEMPLATES = {
    welcome: (name, role, email) => ({
        subject: `Welcome to instaCart.PH — ${role} Account Created`,
        html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;border:1px solid #e6f6ed;border-radius:8px;background:#ffffff;"><h2 style="color:#16834b;text-align:center;">Welcome to instaCart.PH</h2><p>Hello <strong>${name}</strong>,</p><p>Your <strong>${role}</strong> account has been created.</p><p><strong>Email:</strong> ${email}</p><hr style="border:none;border-top:1px solid #e6f6ed;margin:20px 0;" /><p style="font-size:12px;color:#6b7a85;">instaCart.PH — Automated Message</p></div>`,
    }),
    adminApproved: (name, role, email) => ({
        subject: `✅ instaCart.PH — ${role} Account Approved`,
        html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;border:1px solid #2ecc71;border-radius:8px;background:#ffffff;"><h2 style="color:#2ecc71;text-align:center;">Account Approved!</h2><p>Hello <strong>${name}</strong>,</p><p>Your <strong>${role}</strong> account has been <strong>approved</strong>.</p><p><strong>Email:</strong> ${email}</p><hr style="border:none;border-top:1px solid #2ecc71;margin:20px 0;" /><p style="font-size:12px;color:#6b7a85;">Welcome to instaCart.PH!</p></div>`,
    }),
    adminRejected: (name, role, email, reason) => ({
        subject: `❌ instaCart.PH — ${role} Registration Rejected`,
        html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;border:1px solid #e74c3c;border-radius:8px;background:#fdfdfd;"><h2 style="color:#e74c3c;text-align:center;">Registration Rejected</h2><p>Hello <strong>${name}</strong>,</p><p>Your <strong>${role}</strong> registration has been <strong>rejected</strong>.</p><p><strong>Reason:</strong> ${reason}</p><p><strong>Email:</strong> ${email}</p><hr style="border:none;border-top:1px solid #e74c3c;margin:20px 0;" /><p style="font-size:12px;color:#6b7a85;">instaCart.PH — Compliance Team</p></div>`,
    }),
    changeEmailRequested: (name, oldEmail, newEmail, token) => ({
        subject: `🔐 instaCart.PH — Confirm Email Change`,
        html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;border:1px solid #3498db;border-radius:8px;background:#ffffff;"><h2 style="color:#3498db;text-align:center;">Email Change Confirmation</h2><p>Hello <strong>${name}</strong>,</p><p>Change email from <strong>${oldEmail}</strong> to <strong>${newEmail}</strong>.</p><div style="text-align:center;margin:30px 0;"><a href="${process.env.APP_URL || 'http://localhost:5000'}/api/v1/auth/confirm-email-change?token=${token}" style="background:#16834b;color:#ffffff;padding:12px 24px;text-decoration:none;border-radius:6px;font-weight:bold;">Confirm Email Change</a></div><hr style="border:none;border-top:1px solid #3498db;margin:20px 0;" /><p style="font-size:12px;color:#6b7a85;">instaCart.PH — Security Team</p></div>`,
    }),
    changeEmailConfirmed: (name, newEmail) => ({
        subject: `✅ instaCart.PH — Email Change Completed`,
        html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;border:1px solid #2ecc71;border-radius:8px;background:#ffffff;"><h2 style="color:#2ecc71;text-align:center;">Email Changed</h2><p>Hello <strong>${name}</strong>,</p><p>Your email has been updated to <strong>${newEmail}</strong>.</p><hr style="border:none;border-top:1px solid #2ecc71;margin:20px 0;" /><p style="font-size:12px;color:#6b7a85;">instaCart.PH — Account Security</p></div>`,
    }),
    changePasswordRequested: (name, email, token) => ({
        subject: `🔑 instaCart.PH — Confirm Password Change`,
        html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;border:1px solid #3498db;border-radius:8px;background:#ffffff;"><h2 style="color:#3498db;text-align:center;">Password Change</h2><p>Hello <strong>${name}</strong>,</p><p>A password change was requested for your account.</p><p><strong>Email:</strong> ${email}</p><div style="text-align:center;margin:30px 0;"><a href="${process.env.APP_URL || 'http://localhost:5000'}/api/v1/auth/confirm-password-change?token=${token}" style="background:#16834b;color:#ffffff;padding:12px 24px;text-decoration:none;border-radius:6px;font-weight:bold;">Confirm Password Change</a></div><hr style="border:none;border-top:1px solid #3498db;margin:20px 0;" /><p style="font-size:12px;color:#6b7a85;">instaCart.PH — Security Team</p></div>`,
    }),
    securityAlert: (name, email, alertType, details) => ({
        subject: `🚨 instaCart.PH — Security Alert: ${alertType}`,
        html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;border:1px solid #e74c3c;border-radius:8px;background:#fdfdfd;"><h2 style="color:#e74c3c;text-align:center;">Security Alert</h2><p>Hello <strong>${name}</strong>,</p><p><strong>${alertType}</strong> detected on your account.</p><p><strong>Details:</strong> ${details}</p><p><strong>Email:</strong> ${email}</p><hr style="border:none;border-top:1px solid #e74c3c;margin:20px 0;" /><p style="font-size:12px;color:#6b7a85;">instaCart.PH — Security Team</p></div>`,
    }),
    adminNotification: (adminName, subjectLine, message) => ({
        subject: `📢 instaCart.PH Admin Alert — ${subjectLine}`,
        html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;border:1px solid #16834b;border-radius:8px;background:#ffffff;"><h2 style="color:#16834b;text-align:center;">Admin Notification</h2><p>Hello <strong>${adminName}</strong>,</p><p>${message}</p><hr style="border:none;border-top:1px solid #16834b;margin:20px 0;" /><p style="font-size:12px;color:#6b7a85;">instaCart.PH — Platform Monitoring</p></div>`,
    }),
};
//# sourceMappingURL=email.service.js.map