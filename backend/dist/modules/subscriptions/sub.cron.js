import { SubscriptionService } from './sub.service.js';
export class SubscriptionCron {
    static intervalId = null;
    static startSubscriptionSweeper(intervalMinutes = 60) {
        if (this.intervalId)
            return;
        console.log(`⏳ Subscription Sweeper Routine online. Scanning expirations every ${intervalMinutes} mins.`);
        this.intervalId = setInterval(async () => {
            console.log('🔍 Executing Subscription validity sweep...');
            try {
                const activeSubs = await SubscriptionService.getActiveSubscriptions();
                const now = new Date();
                for (const sub of activeSubs) {
                    if (sub.currentPeriodEnd < now) {
                        await SubscriptionService.handleExpiredSubscription(sub.id);
                    }
                }
            }
            catch (error) {
                console.error('❌ Error executing Subscription Cron worker step:', error);
            }
        }, intervalMinutes * 60 * 1000);
    }
    static stopSubscriptionSweeper() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
}
//# sourceMappingURL=sub.cron.js.map