import { Request, Response } from 'express';
import { CheckoutService } from './checkout.service.js';

export const handleCheckout = async (req: Request, res: Response) => {
	try {
		const { items, userId } = req.body;
		const result = await CheckoutService.processOrder(items, userId);
		return res.status(200).json(result);
	} catch (error: any) {
		return res.status(500).json({ error: error.message });
	}
};
