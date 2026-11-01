import { Router } from 'express';
import type { Request, Response } from 'express';

// Import Middleware
import { adminAuth } from '../middleware/adminAuth.js';
import { fraudScanner } from '../middleware/fraudScanner.js';

// Import Module Controllers / Validators / Services
import { handleCheckout, handleCapturePayment } from './checkout/checkout.controller.js';
import { validateCoordinates } from './geolocation/geofence.validator.js';
import { GeofenceService } from './geolocation/geofence.service.js';
import { PostService } from './posts/post.service.js';
import { SubscriptionService } from './subscriptions/sub.service.js';

// New modules
import authRoutes from './auth/auth.routes.js';
import oauthRoutes from './auth/oauth.routes.js';
import paymentsRoutes from './payments/payments.routes.js';
import orderRoutes from './orders/order.routes.js';
import deliveryReceiptRoutes from './orders/deliveryReceipt.routes.js';
import escrowRoutes from './payments/escrow.routes.js';
import withdrawalRoutes from './payments/withdrawal.routes.js';
import productRoutes from './products/product.routes.js';

const apiRouter = Router();

// Health check (under API)
apiRouter.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', message: 'instaCart.PH API is healthy' });
});

// ==========================================
// 0. AUTH ROUTES
// ==========================================
apiRouter.use('/auth', authRoutes);

// ==========================================
// 0b. OAUTH 2.0 / OIDC PROVIDER (Centralized SSO)
// ==========================================
apiRouter.use('/', oauthRoutes);

// ==========================================
// 1. CHECKOUT ROUTES (Protected by Fraud Engine)
// ==========================================
apiRouter.post('/checkout', fraudScanner, handleCheckout);
apiRouter.post('/checkout/capture-payment', fraudScanner, handleCapturePayment);

// ==========================================
// 2. PAYMENTS ROUTES (PayPal integration)
// ==========================================
apiRouter.use('/payments', paymentsRoutes);

// ==========================================
// 2b. ESCROW ROUTES (Split payment distribution)
// ==========================================
apiRouter.use('/escrow', escrowRoutes);

// ==========================================
// 2c. WITHDRAWAL ROUTES (Real-time payouts)
// ==========================================
apiRouter.use('/withdrawals', withdrawalRoutes);

// ==========================================
// 3. ORDER ROUTES
// ==========================================
apiRouter.use('/orders', orderRoutes);

// ==========================================
// 3b. PRODUCT ROUTES (Vendor Catalog)
// ==========================================
apiRouter.use('/products', productRoutes);

// ==========================================
// 3c. DELIVERY RECEIPT ROUTES (Proof of Delivery)
// ==========================================
apiRouter.use('/delivery', deliveryReceiptRoutes);

// ==========================================
// 4. GEOLOCATION ROUTES
// ==========================================
apiRouter.post('/geolocation/verify-zone', validateCoordinates, (req: Request, res: Response) => {
  const { latitude, longitude } = req.body;
  const isDeliverable = GeofenceService.isWithinDeliveryZone(latitude, longitude);
  
  return res.status(200).json({
    coordinates: { latitude, longitude },
    deliverable: isDeliverable,
    message: isDeliverable ? 'Address sits inside service radius.' : 'Outside delivery scope.'
  });
});

// ==========================================
// 5. POSTS ROUTES (Mix of Public & Admin Access)
// ==========================================
apiRouter.get('/posts', async (req: Request, res: Response) => {
  const posts = await PostService.getAllPublishedPosts();
  return res.status(200).json(posts);
});

apiRouter.post('/posts', adminAuth, async (req: Request, res: Response) => {
  try {
    const { title, content, authorId, tags, status } = req.body;
    if (!title || !content || !authorId) {
      return res.status(400).json({ error: 'Title, content, and authorId are required.' });
    }
    const newPost = await PostService.createPost({ title, content, authorId, tags, status: status || 'draft' });
    return res.status(201).json(newPost);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// ==========================================
// 6. SUBSCRIPTION ROUTES
// ==========================================
apiRouter.post('/subscriptions/subscribe', async (req: Request, res: Response) => {
  try {
    const { userId, planName } = req.body;
    if (!userId || !planName) {
      return res.status(400).json({ error: 'userId and planName are required.' });
    }
    const subscription = await SubscriptionService.createSubscription(userId, planName);
    return res.status(201).json({ message: 'Subscription successfully processed!', subscription });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

export default apiRouter;