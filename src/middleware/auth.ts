import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';

export const requireAuth = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.session.userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
  }
  next();
};