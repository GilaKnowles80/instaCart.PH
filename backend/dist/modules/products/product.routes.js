import { Router } from 'express';
import { ProductController } from './product.controller.js';
import { authenticateToken, authorizeRoles } from '../auth/auth.middleware.js';
import { apiRateLimiter } from '../../middleware/rateLimiter.js';
import { uploadProductImages } from '../../config/cloudinary.js';
const router = Router();
router.get('/', apiRateLimiter, ProductController.getAllProducts);
router.get('/:id', apiRateLimiter, ProductController.getProduct);
router.get('/vendor/my', authenticateToken, authorizeRoles('vendor'), ProductController.getVendorProducts);
router.post('/', authenticateToken, authorizeRoles('vendor'), apiRateLimiter, ProductController.createProduct);
router.post('/upload-image', authenticateToken, authorizeRoles('vendor'), uploadProductImages.single('image'), ProductController.uploadImage);
router.put('/:id', authenticateToken, authorizeRoles('vendor'), apiRateLimiter, ProductController.updateProduct);
router.delete('/:id', authenticateToken, authorizeRoles('vendor'), apiRateLimiter, ProductController.deleteProduct);
router.get('/low-stock', authenticateToken, authorizeRoles('vendor'), ProductController.getLowStock);
export default router;
//# sourceMappingURL=product.routes.js.map