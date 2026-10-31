import { SubscriptionRepository } from '../../db/repository.js';
export class SubscriptionService {
    static async getActiveSubscriptions() {
        const subs = await SubscriptionRepository.getActive();
        return subs;
    }
    static async handleExpiredSubscription(subId) {
        await SubscriptionRepository.updateStatus(subId, 'past_due');
    }
    static async createSubscription(userId, planName) {
        const newSub = await SubscriptionRepository.create({
            id: `sub_${Math.random().toString(36).slice(2, 11)}`,
            userId,
            planName,
            status: 'active',
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        });
        return newSub;
    }
}
//# sourceMappingURL=sub.service.js.map