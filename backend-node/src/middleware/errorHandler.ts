import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import { errorResponse } from '../types';

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void {
  // Zod validation errors
  if (err instanceof ZodError) {
    const messages = err.errors.map((e) => `${e.path.join('.')}: ${e.message}`);
    res.status(400).json(errorResponse('Validation failed', messages));
    return;
  }

  // Custom app errors
  if (err instanceof AppError) {
    res.status(err.statusCode).json(errorResponse(err.message));
    return;
  }

  // Prisma known errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case 'P2002':
        res.status(409).json(errorResponse('A record with this value already exists'));
        return;
      case 'P2025':
        res.status(404).json(errorResponse('Record not found'));
        return;
      default:
        res.status(400).json(errorResponse(`Database error: ${err.code}`));
        return;
    }
  }

  // Unknown errors
  console.error('Unhandled error:', err);
  res.status(500).json(errorResponse('Internal server error'));
}

export function notFoundHandler(_req: Request, res: Response): void {
  res.status(404).json(errorResponse('Route not found'));
}
