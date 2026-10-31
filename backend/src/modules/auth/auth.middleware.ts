import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service.js';

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access denied. Token missing.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = AuthService.verifyAccessToken(token);
    (req as any).user = decoded;
    next();
  } catch {
    return res.status(403).json({ error: 'Invalid or expired token.' });
  }
};

export const authorizeRoles = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = (req as any).user?.role;
    if (!userRole || !allowedRoles.includes(userRole)) {
      return res.status(403).json({ error: 'Insufficient permissions.' });
    }
    next();
  };
};
