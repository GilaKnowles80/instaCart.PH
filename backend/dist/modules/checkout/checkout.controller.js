import { CheckoutService } from './checkout.service.js';
export const handleCheckout = async (req, res) => {
    try {
        const { items, customerId, customerName, customerAddress, customerLatitude, customerLongitude, deliveryFee, distanceKm, ratePerKm, paypalOrderId, paypalCaptureId, } = req.body;
        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: 'Items are required.' });
        }
        if (!customerId || !customerName || !customerAddress) {
            return res.status(400).json({ error: 'Customer details are required.' });
        }
        const result = await CheckoutService.processOrder({
            items,
            customerId,
            customerName,
            customerAddress,
            customerLatitude: Number(customerLatitude || 0),
            customerLongitude: Number(customerLongitude || 0),
            deliveryFee: Number(deliveryFee || 0),
            distanceKm: Number(distanceKm || 0),
            ratePerKm: Number(ratePerKm || 0),
            paypalOrderId,
            paypalCaptureId,
        });
        if (!result.success) {
            return res.status(400).json({ error: result.errors.join(', ') });
        }
        return res.status(200).json({
            message: 'Checkout processed successfully.',
            orderId: result.orderId,
            order: result.order,
            vendorSummaries: result.vendorSummaries,
            escrowSplits: result.escrowSplits,
        });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
export const handleCapturePayment = async (req, res) => {
    try {
        const { orderId, paypalOrderId, paypalCaptureId } = req.body;
        if (!orderId || !paypalOrderId || !paypalCaptureId) {
            return res.status(400).json({ error: 'orderId, paypalOrderId, and paypalCaptureId are required.' });
        }
        const result = await CheckoutService.capturePaymentAndFinalize(orderId, paypalOrderId, paypalCaptureId);
        if (!result.success) {
            return res.status(400).json({ error: result.errors.join(', ') });
        }
        return res.status(200).json({
            message: 'Payment captured and order finalized.',
            order: result.order,
        });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
//# sourceMappingURL=checkout.controller.js.map