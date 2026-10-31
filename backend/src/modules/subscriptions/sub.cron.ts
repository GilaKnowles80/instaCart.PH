import { SubscriptionService } from './sub.service.js';

export class SubscriptionCron {
	private static intervalId: NodeJS.Timeout | null = null;

	/**
	 * Evaluates subscription timestamps to automatically revoke expired access windows
	 */
	static startSubscriptionSweeper(intervalMinutes: number = 60): void {
		if (this.intervalId) return;

		console.log(
			`⏳ Subscription Sweeper Routine online. Scanning expirations every ${intervalMinutes} mins.`,
		);

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
			} catch (error) {
				console.error('❌ Error executing Subscription Cron worker step:', error);
			}
		}, intervalMinutes * 60 * 1000);
	}

	static stopSubscriptionSweeper(): void {
		if (this.intervalId) {
			clearInterval(this.intervalId);
			this.intervalId = null;
		}
	}
}
