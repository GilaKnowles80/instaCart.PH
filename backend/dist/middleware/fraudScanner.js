export const fraudScanner = (req, res, next) => {
    const isSuspicious = false;
    if (isSuspicious) {
        return res.status(403).json({ error: 'Transaction flagged by security system.' });
    }
    next();
};
//# sourceMappingURL=fraudScanner.js.map