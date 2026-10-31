import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodIssue } from 'zod';

/**
 * Middleware factory to validate request body against a Zod schema.
 */
export const validateBody = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof Error && 'issues' in error) {
        const issues = (error as { issues: ZodIssue[] }).issues.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        }));
        return res.status(400).json({ error: 'Validation failed', issues });
      }
      return res.status(400).json({ error: 'Invalid request body' });
    }
  };
};

/**
 * Middleware factory to validate request params against a Zod schema.
 */
export const validateParams = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.params);
      next();
    } catch (error) {
      if (error instanceof Error && 'issues' in error) {
        const issues = (error as { issues: ZodIssue[] }).issues.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        }));
        return res.status(400).json({ error: 'Validation failed', issues });
      }
      return res.status(400).json({ error: 'Invalid request params' });
    }
  };
};

/**
 * Middleware factory to validate request query against a Zod schema.
 */
export const validateQuery = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.query);
      next();
    } catch (error) {
      if (error instanceof Error && 'issues' in error) {
        const issues = (error as { issues: ZodIssue[] }).issues.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        }));
        return res.status(400).json({ error: 'Validation failed', issues });
      }
      return res.status(400).json({ error: 'Invalid query parameters' });
    }
  };
};