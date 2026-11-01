import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env'), override: true });
import { connectDatabase } from './config/database.js';
import apiRouter from './modules/routes.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
const app = express();
const PORT = Number(process.env.PORT || 5000);
const isProduction = process.env.NODE_ENV === 'production';
app.use(cors({
    origin: process.env.FRONTEND_ORIGIN || '*',
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'OK', message: 'instaCart.PH backend layer fully functional' });
});
app.use('/api/v1', apiRouter);
app.use(notFound);
app.use(errorHandler);
if (!isProduction) {
    app.listen(PORT, () => {
        console.log(`🚀 Server safely listening on http://localhost:${PORT}`);
    });
}
export default app;
connectDatabase().catch((err) => {
    console.error('❌ Failed to connect to database:', err);
    process.exit(1);
});
//# sourceMappingURL=server.js.map