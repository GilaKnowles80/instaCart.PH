import dotenv from 'dotenv';
dotenv.config();
const isProduction = process.env.NODE_ENV === 'production';
export const APP_URL = (process.env.BASE_URL || process.env.APP_URL || `http://localhost:${process.env.PORT || 5000}`).replace(/\/+$/, '');
export const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || (isProduction ? APP_URL : 'http://localhost:5173');
export const IS_PRODUCTION = isProduction;
//# sourceMappingURL=appUrl.js.map