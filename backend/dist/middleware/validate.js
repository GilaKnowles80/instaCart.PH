export const validateBody = (schema) => {
    return (req, res, next) => {
        try {
            schema.parse(req.body);
            next();
        }
        catch (error) {
            if (error instanceof Error && 'issues' in error) {
                const issues = error.issues.map((e) => ({
                    field: e.path.join('.'),
                    message: e.message,
                }));
                return res.status(400).json({ error: 'Validation failed', issues });
            }
            return res.status(400).json({ error: 'Invalid request body' });
        }
    };
};
export const validateParams = (schema) => {
    return (req, res, next) => {
        try {
            schema.parse(req.params);
            next();
        }
        catch (error) {
            if (error instanceof Error && 'issues' in error) {
                const issues = error.issues.map((e) => ({
                    field: e.path.join('.'),
                    message: e.message,
                }));
                return res.status(400).json({ error: 'Validation failed', issues });
            }
            return res.status(400).json({ error: 'Invalid request params' });
        }
    };
};
export const validateQuery = (schema) => {
    return (req, res, next) => {
        try {
            schema.parse(req.query);
            next();
        }
        catch (error) {
            if (error instanceof Error && 'issues' in error) {
                const issues = error.issues.map((e) => ({
                    field: e.path.join('.'),
                    message: e.message,
                }));
                return res.status(400).json({ error: 'Validation failed', issues });
            }
            return res.status(400).json({ error: 'Invalid query parameters' });
        }
    };
};
//# sourceMappingURL=validate.js.map