import { calculateFeeSplit, createPayPalOrder, capturePayPalOrder, payPalPayout, PAYPAL_MERCHANT_EMAIL, PLATFORM_SERVICE_FEE_PERCENT, } from './paypal.service.js';
export const PaymentsController = {
    async calculateCheckout(req, res) {
        try {
            const { subtotal, deliveryFee, vendorPlatformFeePercent } = req.body;
            if (!subtotal || subtotal < 0) {
                return res.status(400).json({ error: 'Valid subtotal is required.' });
            }
            const split = calculateFeeSplit(Number(subtotal), Number(deliveryFee || 0), Number(vendorPlatformFeePercent || 0));
            return res.status(200).json({
                ...split,
                platformServiceFeePercent: PLATFORM_SERVICE_FEE_PERCENT,
                paypalMerchantEmail: PAYPAL_MERCHANT_EMAIL,
            });
        }
        catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },
    async createOrder(req, res) {
        try {
            const { amount, description } = req.body;
            if (!amount || amount <= 0) {
                return res.status(400).json({ error: 'Valid amount is required.' });
            }
            const order = await createPayPalOrder(Number(amount), 'PHP', description || 'instaCart.PH Order');
            const approvalUrl = order.links?.find((l) => l.rel === 'approve')?.href;
            return res.status(200).json({
                orderId: order.id,
                status: order.status,
                approvalUrl,
                amount,
            });
        }
        catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },
    async captureOrder(req, res) {
        try {
            const { orderId } = req.params;
            if (!orderId) {
                return res.status(400).json({ error: 'Order ID is required.' });
            }
            const capture = await capturePayPalOrder(orderId);
            return res.status(200).json({
                success: capture.status === 'COMPLETED',
                transactionId: capture.id,
                status: capture.status,
                amount: capture.purchase_units?.[0]?.payments?.captures?.[0]?.amount?.value,
            });
        }
        catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },
    async payoutToVendor(req, res) {
        try {
            const { recipientEmail, amount, description } = req.body;
            if (!recipientEmail || !amount || amount <= 0) {
                return res.status(400).json({ error: 'Recipient email and valid amount are required.' });
            }
            const payout = await payPalPayout(recipientEmail, Number(amount), 'PHP', description || 'Vendor payout');
            return res.status(200).json({
                success: true,
                payoutBatchId: payout.batch_header?.payout_batch_id,
                status: payout.batch_header?.batch_status,
            });
        }
        catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },
    async getPlatformFeeConfig(_req, res) {
        return res.status(200).json({
            platformServiceFeePercent: PLATFORM_SERVICE_FEE_PERCENT,
            paypalMerchantEmail: PAYPAL_MERCHANT_EMAIL,
            platformPayoutEmail: PAYPAL_MERCHANT_EMAIL,
        });
    },
};
//# sourceMappingURL=payments.controller.js.map