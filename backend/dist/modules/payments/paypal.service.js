import https from 'https';
import { FRONTEND_ORIGIN } from '../../config/appUrl.js';
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID || '';
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET || '';
const PAYPAL_ENVIRONMENT = process.env.PAYPAL_ENVIRONMENT || 'sandbox';
const PAYPAL_MERCHANT_EMAIL = process.env.PAYPAL_MERCHANT_EMAIL || 'gctravelandtours2021@gmail.com';
const PLATFORM_SERVICE_FEE_PERCENT = Number(process.env.PLATFORM_SERVICE_FEE_PERCENT || 2);
const PAYPAL_RETURN_URL = process.env.PAYPAL_RETURN_URL || `${FRONTEND_ORIGIN}/payment/success`;
const PAYPAL_CANCEL_URL = process.env.PAYPAL_CANCEL_URL || `${FRONTEND_ORIGIN}/payment/cancel`;
const PAYPAL_BASE_URL = PAYPAL_ENVIRONMENT === 'live'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com';
let accessTokenCache = null;
async function getPayPalAccessToken() {
    if (accessTokenCache && Date.now() < accessTokenCache.expiresAt) {
        return accessTokenCache.token;
    }
    const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');
    const paypalHost = new URL(PAYPAL_BASE_URL).hostname;
    return new Promise((resolve, reject) => {
        const options = {
            hostname: paypalHost,
            port: 443,
            path: '/v1/oauth2/token',
            method: 'POST',
            headers: {
                Authorization: `Basic ${auth}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        };
        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    accessTokenCache = {
                        token: parsed.access_token,
                        expiresAt: Date.now() + (parsed.expires_in || 3600) * 1000 - 60000,
                    };
                    resolve(parsed.access_token);
                }
                catch (err) {
                    reject(new Error('Failed to parse PayPal token response.'));
                }
            });
        });
        req.on('error', reject);
        req.write('grant_type=client_credentials');
        req.end();
    });
}
async function payPalRequest(method, path, body) {
    const token = await getPayPalAccessToken();
    return new Promise((resolve, reject) => {
        const url = new URL(path, PAYPAL_BASE_URL);
        const options = {
            hostname: url.hostname,
            port: 443,
            path: url.pathname + url.search,
            method,
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
                'PayPal-Request-Id': `instaCart-${Date.now()}`,
            },
        };
        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    try {
                        resolve(data ? JSON.parse(data) : {});
                    }
                    catch {
                        resolve({});
                    }
                }
                else {
                    reject(new Error(`PayPal API error: ${res.statusCode} ${data}`));
                }
            });
        });
        req.on('error', reject);
        if (body)
            req.write(JSON.stringify(body));
        req.end();
    });
}
export const calculateFeeSplit = (subtotal, deliveryFee, vendorPlatformFeePercent) => {
    const serviceCharge = Math.round((subtotal * (PLATFORM_SERVICE_FEE_PERCENT / 100)) * 100) / 100;
    const vendorPlatformFee = Math.round((subtotal * (vendorPlatformFeePercent / 100)) * 100) / 100;
    const totalPlatformEarnings = serviceCharge + vendorPlatformFee;
    const vendorNet = Math.round((subtotal - vendorPlatformFee) * 100) / 100;
    const grandTotal = Math.round((subtotal + deliveryFee + serviceCharge) * 100) / 100;
    return {
        subtotal,
        deliveryFee,
        serviceCharge,
        vendorPlatformFee,
        totalPlatformEarnings,
        vendorNet,
        grandTotal,
    };
};
export const createPayPalOrder = async (amount, currency = 'PHP', description = 'instaCart.PH Order') => {
    const order = await payPalRequest('POST', '/v2/checkout/orders', {
        intent: 'CAPTURE',
        purchase_units: [{
                amount: {
                    currency_code: currency,
                    value: amount.toFixed(2),
                    breakdown: {
                        item_total: {
                            currency_code: currency,
                            value: amount.toFixed(2),
                        },
                    },
                },
                description,
            }],
        application_context: {
            brand_name: 'instaCart.PH',
            landing_page: 'LOGIN',
            shipping_preference: 'NO_SHIPPING',
            user_action: 'PAY_NOW',
            return_url: PAYPAL_RETURN_URL,
            cancel_url: PAYPAL_CANCEL_URL,
        },
    });
    return order;
};
export const capturePayPalOrder = async (orderId) => {
    return payPalRequest('POST', `/v2/checkout/orders/${orderId}/capture`);
};
export const payPalPayout = async (recipientEmail, amount, currency = 'PHP', description) => {
    return payPalRequest('POST', '/v1/payments/payouts', {
        sender_batch_header: {
            sender_batch_id: `instaCart-payout-${Date.now()}`,
            email_subject: 'instaCart.PH Payout',
            email_message: description,
        },
        items: [{
                recipient_type: 'EMAIL',
                receiver: recipientEmail,
                amount: {
                    value: amount.toFixed(2),
                    currency,
                },
                note: description,
                sender_item_id: `instaCart-${Date.now()}`,
            }],
    });
};
export { PAYPAL_MERCHANT_EMAIL, PLATFORM_SERVICE_FEE_PERCENT };
//# sourceMappingURL=paypal.service.js.map