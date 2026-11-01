import { Router } from 'express';
import { ProductController } from './product.controller.js';
import { authenticateToken, authorizeRoles } from '../auth/auth.middleware.js';
import { apiRateLimiter } from '../../middleware/rateLimiter.js';
import { uploadProductImages } from '../../config/cloudinary.js';

const router = Router();

// Public - list all products (with optional filters)
router.get('/', apiRateLimiter, ProductController.getAllProducts);

// Public - get single product
router.get('/:id', apiRateLimiter, ProductController.getProduct);

// Vendor - get own products
router.get('/vendor/my', authenticateToken, authorizeRoles('vendor'), ProductController.getVendorProducts);

// Vendor - create product
router.post('/', authenticateToken, authorizeRoles('vendor'), apiRateLimiter, ProductController.createProduct);

// Vendor - upload product image
router.post('/upload-image', authenticateToken, authorizeRoles('vendor'), uploadProductImages.single('image'), ProductController.uploadImage);

// Vendor - update own product
router.put('/:id', authenticateToken, authorizeRoles('vendor'), apiRateLimiter, ProductController.updateProduct);

// Vendor - delete own product
router.delete('/:id', authenticateToken, authorizeRoles('vendor'), apiRateLimiter, ProductController.deleteProduct);

// Vendor - get low stock alerts
router.get('/low-stock', authenticateToken, authorizeRoles('vendor'), ProductController.getLowStock);

export default router;