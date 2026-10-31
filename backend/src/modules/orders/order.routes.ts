import { Router } from 'express';
import { OrderController } from './order.controller.js';
import { authenticateToken, authorizeRoles } from '../auth/auth.middleware.js';
import { apiRateLimiter } from '../../middleware/rateLimiter.js';
import { validateBody, validateParams } from '../../middleware/validate.js';
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

// Create order (customer) - rate limited
router.post('/', apiRateLimiter, OrderController.createOrder);

// Get order by ID - rate limited
router.get('/:orderId', apiRateLimiter, validateParams(OrderIdSchema), OrderController.getOrder);

// Update order status (vendor/admin)
router.patch(
  '/:orderId/status',
  authenticateToken,
  authorizeRoles('vendor', 'admin', 'delivery_driver'),
  validateParams(OrderIdSchema),
  OrderController.updateOrderStatus
);

// Assign driver to order (admin)
router.post(
  '/:orderId/assign-driver',
  authenticateToken,
  authorizeRoles('admin'),
  validateParams(OrderIdSchema),
  OrderController.assignDriver
);

// Get all orders (admin)
router.get('/', authenticateToken, authorizeRoles('admin'), OrderController.getAllOrders);

// Get customer orders
router.get(
  '/customer/:customerId',
  authenticateToken,
  validateParams(CustomerIdSchema),
  OrderController.getCustomerOrders
);

// Get vendor orders
router.get(
  '/vendor/:vendorId',
  authenticateToken,
  validateParams(VendorIdSchema),
  OrderController.getVendorOrders
);

// Get driver orders
router.get(
  '/driver/:driverId',
  authenticateToken,
  validateParams(DriverIdSchema),
  OrderController.getDriverOrders
);

// Get driver earnings
router.get(
  '/driver/:driverId/earnings',
  authenticateToken,
  validateParams(DriverIdSchema),
  OrderController.getDriverEarnings
);

// Get platform earnings (admin)
router.get(
  '/platform/earnings',
  authenticateToken,
  authorizeRoles('admin'),
  OrderController.getPlatformEarnings
);

export default router;
