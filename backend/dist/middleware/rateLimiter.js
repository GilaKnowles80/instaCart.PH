import rateLimit from 'express-rate-limit';
const WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS || 900000);
const MAX_REQUESTS = Number(process.env.RATE_LIMIT_MAX_REQUESTS || 100);
const AUTH_WINDOW_MS = Number(process.env.RATE_LIMIT_AUTH_WINDOW_MS || 900000);
const AUTH_MAX_REQUESTS = Number(process.env.RATE_LIMIT_AUTH_MAX_REQUESTS || 10);
export const apiRateLimiter = rateLimit({
    windowMs: WINDOW_MS,
    max: MAX_REQUESTS,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests. Please try again later.' },
});
export const authRateLimiter = rateLimit({
    windowMs: AUTH_WINDOW_MS,
    max: AUTH_MAX_REQUESTS,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many authentication attempts. Please try again later.' },
});
export const passwordRateLimiter = rateLimit({
    windowMs: AUTH_WINDOW_MS,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many password/email change requests. Please try again later.' },
});
export const payoutRateLimiter = rateLimit({
    windowMs: WINDOW_MS,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many payout requests. Please try again later.' },
});
//# sourceMappingURL=rateLimiter.js.map