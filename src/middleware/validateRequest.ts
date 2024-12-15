import { Request, Response, NextFunction, RequestHandler } from 'express';
import { ValidationChain, validationResult } from 'express-validator';

export const validateRequest = (validations: ValidationChain[]): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    next();
  };
};
