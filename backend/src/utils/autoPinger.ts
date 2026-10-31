import http from 'http';
import https from 'https';

export class AutoPinger {
	private static timerId: NodeJS.Timeout | null = null;

	/**
	 * Pings a target API endpoint at a regular interval to prevent system spin-down.
	 * @param url The complete target endpoint address.
	 * @param intervalMinutes How frequently to execute the request loop.
	 */
	static startPingTask(url: string, intervalMinutes: number = 14): void {
		if (this.timerId) {
			console.warn('⚠️ AutoPinger process is already running.');
			return;
		}

		const intervalMs = intervalMinutes * 60 * 1000;
		const clientEngine = url.startsWith('https') ? https : http;

		console.log(
			`⏱️ AutoPinger initialization: Targeting endpoint [${url}] every ${intervalMinutes} minutes.`,
		);

		this.timerId = setInterval(() => {
			clientEngine
				.get(url, (res) => {
					res.resume();
					console.log(
						`📡 AutoPinger keep-alive ping transmitted to ${url}. Target response: ${res.statusCode}`,
					);
				})
				.on('error', (err) => {
					console.error(
						'❌ AutoPinger encountered a connection failure:',
						err.message,
					);
				});
		}, intervalMs);
	}

	static stopPingTask(): void {
		if (this.timerId) {
			clearInterval(this.timerId);
			this.timerId = null;
			console.log('🛑 AutoPinger processing loop successfully disengaged.');
		}
	}
}
