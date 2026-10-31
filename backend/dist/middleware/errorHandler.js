export class AppError extends Error {
    statusCode;
    isOperational;
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}
export const catchAsync = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
export const errorHandler = (err, _req, res, _next) => {
    let statusCode = 500;
    let message = 'Internal server error.';
    if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
    }
    else if (err.name === 'ValidationError') {
        statusCode = 400;
        message = err.message;
    }
    else if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Invalid token. Please log in again.';
    }
    else if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Token expired. Please log in again.';
    }
    else if (err.name === 'SyntaxError' && 'body' in err) {
        statusCode = 400;
        message = 'Invalid JSON payload.';
    }
    const isProduction = process.env.NODE_ENV === 'production';
    res.status(statusCode).json({
        success: false,
        error: message,
        ...(!isProduction && { stack: err.stack }),
    });
};
export const notFound = (_req, _res, next) => {
    next(new AppError(`Route ${_req.originalUrl} not found`, 404));
};
//# sourceMappingURL=errorHandler.js.map