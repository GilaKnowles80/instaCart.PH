export const paymentGatewayConfig = {
    apiKey: process.env.PAYMENT_GATEWAY_API_KEY,
    environment: process.env.PAYPAL_ENVIRONMENT || (process.env.NODE_ENV === 'production' ? 'live' : 'sandbox'),
    paypalClientId: process.env.PAYPAL_CLIENT_ID,
    paypalClientSecret: process.env.PAYPAL_CLIENT_SECRET,
    paypalMerchantEmail: process.env.PAYPAL_MERCHANT_EMAIL,
    paypalPlatformFeePercent: Number(process.env.PAYPAL_PLATFORM_FEE_PERCENT || 10),
};
export const INSTACART_HQ_WALLETS = {
    gCashEscrow: process.env.HQ_GCASH_NUMBER,
    mayaEscrow: process.env.HQ_MAYA_ID,
    bpiCorporateAccount: process.env.HQ_BPI_ACCOUNT,
    paymongoMerchantId: process.env.HQ_PAYMONGO_ACC,
    payPalMerchantId: process.env.PAYPAL_MERCHANT_EMAIL
};
export const PLATFORM_FEE_RATES = {
    WET_MARKET: 3.5,
    RESTAURANT: 10,
    PHARMACY: 5,
    HARDWARE: 6,
    DRY_GOODS: 4.5,
    DEPARTMENT_STORE: 8
};
const CORPORATE_WALLET_BY_CHANNEL = {
    PAYPAL: INSTACART_HQ_WALLETS.payPalMerchantId,
    BPI_BANK: INSTACART_HQ_WALLETS.bpiCorporateAccount,
    GCASH: INSTACART_HQ_WALLETS.gCashEscrow,
    MAYA: INSTACART_HQ_WALLETS.mayaEscrow,
    PAYMONGO: INSTACART_HQ_WALLETS.paymongoMerchantId
};
const roundCurrency = (amount) => Math.round((amount + Number.EPSILON) * 100) / 100;
export const assertPaymentGatewayConfiguration = () => {
    if (process.env.NODE_ENV !== 'production')
        return;
    const requiredValues = {
        PAYPAL_CLIENT_ID: paymentGatewayConfig.paypalClientId,
        PAYPAL_CLIENT_SECRET: paymentGatewayConfig.paypalClientSecret,
        PAYPAL_MERCHANT_EMAIL: paymentGatewayConfig.paypalMerchantEmail
    };
    const missingValues = Object.entries(requiredValues)
        .filter(([, value]) => !value)
        .map(([name]) => name);
    if (missingValues.length > 0) {
        console.warn(`⚠️ Missing production payment configuration: ${missingValues.join(', ')}`);
    }
    if (paymentGatewayConfig.environment !== 'live') {
        console.warn(`⚠️ PAYPAL_ENVIRONMENT is '${paymentGatewayConfig.environment}', expected 'live' in production.`);
    }
};
export class BackendPaymentSplitter {
    static async executeSplitTransaction(payload) {
        if (!Number.isFinite(payload.amount) || payload.amount <= 0) {
            throw new Error('Transaction amount must be a finite number greater than zero.');
        }
        if (!payload.vendorPayoutAccount.trim()) {
            throw new Error('Vendor payout account is required.');
        }
        const feePercent = PLATFORM_FEE_RATES[payload.vendorCategory];
        const platformEarnings = roundCurrency(payload.amount * (feePercent / 100));
        const vendorDisbursed = roundCurrency(payload.amount - platformEarnings);
        const corporateWallet = CORPORATE_WALLET_BY_CHANNEL[payload.vendorPayoutChannel];
        if (!corporateWallet) {
            throw new Error(`Corporate wallet is not configured for ${payload.vendorPayoutChannel}.`);
        }
        return {
            success: true,
            platformEarnings,
            vendorDisbursed,
            status: 'Settled',
            feePercent,
            corporateWallet,
            payoutChannel: payload.vendorPayoutChannel,
            payoutAccount: payload.vendorPayoutAccount.trim()
        };
    }
}
//# sourceMappingURL=paymentGateway.js.map