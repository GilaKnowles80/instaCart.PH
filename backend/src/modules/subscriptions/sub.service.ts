import { SubscriptionRepository } from '../../db/repository.js';

export interface ISubscription {
	id: string;
	userId: string;
	planName: 'standard' | 'premium' | 'enterprise';
	status: 'active' | 'past_due' | 'canceled';
	currentPeriodEnd: Date;
}

export class SubscriptionService {
	static async getActiveSubscriptions(): Promise<ISubscription[]> {
		const subs = await SubscriptionRepository.getActive();
		return subs as unknown as ISubscription[];
	}

	static async handleExpiredSubscription(subId: string): Promise<void> {
		await SubscriptionRepository.updateStatus(subId, 'past_due');
	}

	static async createSubscription(
		userId: string,
		planName: 'standard' | 'premium',
	): Promise<ISubscription> {
		const newSub = await SubscriptionRepository.create({
			id: `sub_${Math.random().toString(36).slice(2, 11)}`,
			userId,
			planName,
			status: 'active',
			currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
		});
		return newSub as unknown as ISubscription;
	}
}
