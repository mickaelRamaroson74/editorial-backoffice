import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

type ValidateTarget = 'body' | 'params' | 'query';

export function validate(schema: ZodSchema, target: ValidateTarget = 'body') {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[target]);
    if (!result.success) {
      next(result.error);
      return;
    }
    // Replace request data with parsed (and coerced) values
    req[target] = result.data;
    next();
  };
}
