import { Router } from 'express';
import { OrderController } from './order.controller.js';
import { authenticateToken, authorizeRoles } from '../auth/auth.middleware.js';
import { apiRateLimiter } from '../../middleware/rateLimiter.js';
import { validateParams } from '../../middleware/validate.js';
import { z } from 'zod';
const router = Router();
const OrderIdSchema = z.object({
    orderId: z.string().min(1, 'Order ID is required'),
});
const CustomerIdSchema = z.object({
    customerId: z.string().min(1, 'Customer ID is required'),
});
const VendorIdSchema = z.object({
    vendorId: z.string().min(1, 'Vendor ID is required'),
});
const DriverIdSchema = z.object({
    driverId: z.string().min(1, 'Driver ID is required'),
});
router.post('/', apiRateLimiter, OrderController.createOrder);
router.get('/:orderId', apiRateLimiter, validateParams(OrderIdSchema), OrderController.getOrder);
router.patch('/:orderId/status', authenticateToken, authorizeRoles('vendor', 'admin', 'delivery_driver'), validateParams(OrderIdSchema), OrderController.updateOrderStatus);
router.post('/:orderId/assign-driver', authenticateToken, authorizeRoles('admin'), validateParams(OrderIdSchema), OrderController.assignDriver);
router.get('/', authenticateToken, authorizeRoles('admin'), OrderController.getAllOrders);
router.get('/customer/:customerId', authenticateToken, validateParams(CustomerIdSchema), OrderController.getCustomerOrders);
router.get('/vendor/:vendorId', authenticateToken, validateParams(VendorIdSchema), OrderController.getVendorOrders);
router.get('/driver/:driverId', authenticateToken, validateParams(DriverIdSchema), OrderController.getDriverOrders);
router.get('/driver/:driverId/earnings', authenticateToken, validateParams(DriverIdSchema), OrderController.getDriverEarnings);
router.get('/platform/earnings', authenticateToken, authorizeRoles('admin'), OrderController.getPlatformEarnings);
export default router;
//# sourceMappingURL=order.routes.js.map