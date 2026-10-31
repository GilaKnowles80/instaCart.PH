import dotenv from 'dotenv';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

/**
 * Public base URL of the instaCart.PH platform.
 *
 * Resolution order: BASE_URL > APP_URL > http://localhost:${PORT}
 *
 * Production example: https://instaCart.PH  (or https://www.instaCart.PH)
 * Development example: http://localhost:5000
 */
export const APP_URL = (process.env.BASE_URL || process.env.APP_URL || `http://localhost:${process.env.PORT || 5000}`).replace(/\/+$/, '');

/**
 * Origin of the frontend application. Used for payment return/cancel URLs.
 * Defaults to APP_URL in production, http://localhost:5173 in development.
 */
export const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || (isProduction ? APP_URL : 'http://localhost:5173');

export const IS_PRODUCTION = isProduction;
