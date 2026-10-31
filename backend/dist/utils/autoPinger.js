import http from 'http';
import https from 'https';
export class AutoPinger {
    static timerId = null;
    static startPingTask(url, intervalMinutes = 14) {
        if (this.timerId) {
            console.warn('⚠️ AutoPinger process is already running.');
            return;
        }
        const intervalMs = intervalMinutes * 60 * 1000;
        const clientEngine = url.startsWith('https') ? https : http;
        console.log(`⏱️ AutoPinger initialization: Targeting endpoint [${url}] every ${intervalMinutes} minutes.`);
        this.timerId = setInterval(() => {
            clientEngine
                .get(url, (res) => {
                res.resume();
                console.log(`📡 AutoPinger keep-alive ping transmitted to ${url}. Target response: ${res.statusCode}`);
            })
                .on('error', (err) => {
                console.error('❌ AutoPinger encountered a connection failure:', err.message);
            });
        }, intervalMs);
    }
    static stopPingTask() {
        if (this.timerId) {
            clearInterval(this.timerId);
            this.timerId = null;
            console.log('🛑 AutoPinger processing loop successfully disengaged.');
        }
    }
}
//# sourceMappingURL=autoPinger.js.map