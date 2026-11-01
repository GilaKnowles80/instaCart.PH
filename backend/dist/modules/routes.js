import { Router } from 'express';
import { adminAuth } from '../middleware/adminAuth.js';
import { fraudScanner } from '../middleware/fraudScanner.js';
import { handleCheckout, handleCapturePayment } from './checkout/checkout.controller.js';
import { validateCoordinates } from './geolocation/geofence.validator.js';
import { GeofenceService } from './geolocation/geofence.service.js';
import { PostService } from './posts/post.service.js';
import { SubscriptionService } from './subscriptions/sub.service.js';
import authRoutes from './auth/auth.routes.js';
import oauthRoutes from './auth/oauth.routes.js';
import paymentsRoutes from './payments/payments.routes.js';
import orderRoutes from './orders/order.routes.js';
import deliveryReceiptRoutes from './orders/deliveryReceipt.routes.js';
import escrowRoutes from './payments/escrow.routes.js';
import withdrawalRoutes from './payments/withdrawal.routes.js';
import productRoutes from './products/product.routes.js';
const apiRouter = Router();
apiRouter.get('/health', (_req, res) => {
    res.status(200).json({ status: 'OK', message: 'instaCart.PH API is healthy' });
});
apiRouter.use('/auth', authRoutes);
apiRouter.use('/', oauthRoutes);
apiRouter.post('/checkout', fraudScanner, handleCheckout);
apiRouter.post('/checkout/capture-payment', fraudScanner, handleCapturePayment);
apiRouter.use('/payments', paymentsRoutes);
apiRouter.use('/escrow', escrowRoutes);
apiRouter.use('/withdrawals', withdrawalRoutes);
apiRouter.use('/orders', orderRoutes);
apiRouter.use('/products', productRoutes);
apiRouter.use('/delivery', deliveryReceiptRoutes);
apiRouter.post('/geolocation/verify-zone', validateCoordinates, (req, res) => {
    const { latitude, longitude } = req.body;
    const isDeliverable = GeofenceService.isWithinDeliveryZone(latitude, longitude);
    return res.status(200).json({
        coordinates: { latitude, longitude },
        deliverable: isDeliverable,
        message: isDeliverable ? 'Address sits inside service radius.' : 'Outside delivery scope.'
    });
});
apiRouter.get('/posts', async (req, res) => {
    const posts = await PostService.getAllPublishedPosts();
    return res.status(200).json(posts);
});
apiRouter.post('/posts', adminAuth, async (req, res) => {
    try {
        const { title, content, authorId, tags, status } = req.body;
        if (!title || !content || !authorId) {
            return res.status(400).json({ error: 'Title, content, and authorId are required.' });
        }
        const newPost = await PostService.createPost({ title, content, authorId, tags, status: status || 'draft' });
        return res.status(201).json(newPost);
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
apiRouter.post('/subscriptions/subscribe', async (req, res) => {
    try {
        const { userId, planName } = req.body;
        if (!userId || !planName) {
            return res.status(400).json({ error: 'userId and planName are required.' });
        }
        const subscription = await SubscriptionService.createSubscription(userId, planName);
        return res.status(201).json({ message: 'Subscription successfully processed!', subscription });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
export default apiRouter;
//# sourceMappingURL=routes.js.map