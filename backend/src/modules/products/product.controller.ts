import { Request, Response } from 'express';
import { ProductRepository } from '../../db/productRepository.js';
import { authenticateToken, authorizeRoles } from '../auth/auth.middleware.js';
import { apiRateLimiter } from '../../middleware/rateLimiter.js';
import { z } from 'zod';
import { uploadProductImages, cloudinary } from '../../config/cloudinary.js';

const ProductSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  price: z.number().positive('Price must be positive'),
  stockQuantity: z.number().int().nonnegative('Stock quantity must be non-negative'),
  minStockAlert: z.number().int().nonnegative().default(5),
  images: z.array(z.string()).default([]),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  weightKg: z.number().positive().optional(),
  dimensionsCm: z.any().optional(),
  sku: z.string().optional(),
});

export const ProductController = {
  async createProduct(req: Request, res: Response) {
    try {
      const vendorId = (req as any).user?.userId;
      const vendorName = (req as any).user?.fullName || (req as any).user?.email || 'Vendor';
      const data = ProductSchema.parse(req.body);

      const product = await ProductRepository.create({
        id: `prod_${Math.random().toString(36).slice(2, 11)}`,
        vendorId,
        vendorName,
        name: data.name,
        description: data.description,
        category: data.category,
        price: data.price,
        stockQuantity: data.stockQuantity,
        minStockAlert: data.minStockAlert,
        images: data.images,
        isActive: data.isActive,
        isFeatured: data.isFeatured,
        weightKg: data.weightKg,
        dimensionsCm: data.dimensionsCm,
        sku: data.sku,
      });

      return res.status(201).json({ message: 'Product created successfully.', product });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  },

  async getProduct(req: Request, res: Response) {
    try {
      const { id } = req.params as { id: string };
      const product = await ProductRepository.findById(id);
      if (!product) {
        return res.status(404).json({ error: 'Product not found.' });
      }
      return res.status(200).json({ product });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  },

  async getVendorProducts(req: Request, res: Response) {
    try {
      const vendorId = (req as any).user?.userId;
      const products = await ProductRepository.getByVendor(vendorId);
      return res.status(200).json({ products, count: products.length });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  },

  async getAllProducts(req: Request, res: Response) {
    try {
      const filters = {
        category: req.query.category as string,
        isActive: req.query.isActive === 'true' ? true : req.query.isActive === 'false' ? false : undefined,
        vendorId: req.query.vendorId as string,
      };
      const products = await ProductRepository.getAll(filters);
      return res.status(200).json({ products, count: products.length });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  },

  async updateProduct(req: Request, res: Response) {
    try {
      const { id } = req.params as { id: string };
      const vendorId = (req as any).user?.userId;
      const data = ProductSchema.partial().parse(req.body);

      // Verify ownership
      const existing = await ProductRepository.findById(id);
      if (!existing) {
        return res.status(404).json({ error: 'Product not found.' });
      }
      if (existing.vendor_id !== vendorId && (req as any).user?.role !== 'admin') {
        return res.status(403).json({ error: 'Not authorized to update this product.' });
      }

      const product = await ProductRepository.update(id, data);
      return res.status(200).json({ message: 'Product updated successfully.', product });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  },

  async deleteProduct(req: Request, res: Response) {
    try {
      const { id } = req.params as { id: string };
      const vendorId = (req as any).user?.userId;

      const existing = await ProductRepository.findById(id);
      if (!existing) {
        return res.status(404).json({ error: 'Product not found.' });
      }
      if (existing.vendor_id !== vendorId && (req as any).user?.role !== 'admin') {
        return res.status(403).json({ error: 'Not authorized to delete this product.' });
      }

      await ProductRepository.delete(id);
      return res.status(200).json({ message: 'Product deleted successfully.' });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  },

  async getLowStock(req: Request, res: Response) {
    try {
      const vendorId = (req as any).user?.userId;
      const products = await ProductRepository.getLowStock(vendorId);
      return res.status(200).json({ products, count: products.length });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  },

  async uploadImage(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No image file provided.' });
      }

      const file = req.file as Express.Multer.File & { path?: string; filename?: string };
      const imageUrl = file.path || file.filename || '';

      return res.status(200).json({
        message: 'Image uploaded successfully.',
        imageUrl,
        publicId: file.filename,
      });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  },
};