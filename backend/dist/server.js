import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import helmet from 'helmet';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import apiRouter from './modules/routes.js';
import { AutoPinger } from './utils/autoPinger.js';
import { SubscriptionCron } from './modules/subscriptions/sub.cron.js';
import { assertPaymentGatewayConfiguration } from './config/paymentGateway.js';
import { connectDatabase } from './config/database.js';
import { APP_URL, FRONTEND_ORIGIN } from './config/appUrl.js';
import { apiRateLimiter } from './middleware/rateLimiter.js';
import { errorHandler, notFound, AppError } from './middleware/errorHandler.js';
dotenv.config({ path: path.resolve(__dirname, '../.env'), override: true });
assertPaymentGatewayConfiguration();
await connectDatabase();
const app = express();
const PORT = Number(process.env.PORT || 5000);
const isProduction = process.env.NODE_ENV === 'production';
const allowedOrigins = (process.env.FRONTEND_ORIGIN || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
if (process.env.TRUST_PROXY === 'true') {
    app.set('trust proxy', 1);
}
app.use(helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: process.env.ENABLE_CSP === 'true'
        ? {
            directives: {
                defaultSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'", 'https:'],
                imgSrc: ["'self'", 'data:', 'https:'],
                scriptSrc: ["'self'", "'unsafe-inline'", 'https:'],
                connectSrc: ["'self'", 'https:'],
                frameSrc: ["'self'", 'https://www.paypal.com'],
                frameAncestors: ["'self'"],
            },
        }
        : false,
    hsts: process.env.ENABLE_HSTS === 'true' ? { maxAge: 31536000, includeSubDomains: true } : false,
}));
app.use(cors({
    origin: isProduction && allowedOrigins.length > 0 ? allowedOrigins : true,
    credentials: true,
}));
app.use('/api/v1', apiRateLimiter);
app.use(express.json({ limit: '10mb' }));
app.use('/uploads', express.static(path.resolve(__dirname, '../uploads')));
app.use('/api/v1', apiRouter);
app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'OK', message: 'instaCart.PH backend layer fully functional' });
});
if (!isProduction) {
    app.get('/', (_req, res) => {
        res.status(200).json({
            service: 'instaCart.PH backend',
            status: 'running',
            frontend: FRONTEND_ORIGIN,
            api: APP_URL,
            health: `http://localhost:${PORT}/health`,
        });
    });
}
if (isProduction) {
    const frontendDist = path.resolve(__dirname, '../../frontend/dist');
    app.use(express.static(frontendDist));
    app.use((req, res, next) => {
        if (req.method === 'GET' && !req.path.startsWith('/api/')) {
            res.sendFile(path.join(frontendDist, 'index.html'), (error) => {
                if (error)
                    next(error);
            });
            return;
        }
        next();
    });
}
app.use(notFound);
app.use(errorHandler);
export { app, AppError };
if (process.env.VERCEL !== '1') {
    app.listen(PORT, () => {
        console.log(`🚀 Server safely listening on http://localhost:${PORT}`);
        SubscriptionCron.startSubscriptionSweeper(60);
        if (process.env.NODE_ENV === 'production' && !process.env.VERCEL) {
            AutoPinger.startPingTask(APP_URL, 14);
        }
    });
}
//# sourceMappingURL=server.js.map