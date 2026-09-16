import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { AppError } from '../utils/appError';
import { logger } from '../utils/logger';

export const errorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  logger.error(`[Error Handler] ${err.name}: ${err.message}`, {
    stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined,
  });

  // Handle custom AppError
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: {
        message: err.message,
        code: err.code,
        details: err.details,
      },
    });
    return;
  }

  // Handle Prisma Known Errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case 'P2002': {
        const target = (err.meta?.target as string[])?.join(', ') || 'field';
        res.status(409).json({
          success: false,
          error: {
            message: `A record with this ${target} already exists.`,
            code: 'DUPLICATE_RESOURCE',
          },
        });
        return;
      }
      case 'P2025': {
        res.status(404).json({
          success: false,
          error: {
            message: 'The requested resource could not be found.',
            code: 'RESOURCE_NOT_FOUND',
          },
        });
        return;
      }
      default: {
        res.status(400).json({
          success: false,
          error: {
            message: 'Database query error.',
            code: `PRISMA_${err.code}`,
          },
        });
        return;
      }
    }
  }

  // Handle Prisma Validation Errors
  if (err instanceof Prisma.PrismaClientValidationError) {
    res.status(400).json({
      success: false,
      error: {
        message: 'Invalid data format provided to database.',
        code: 'DATABASE_VALIDATION_ERROR',
      },
    });
    return;
  }

  // Generic Catch-all 500
  const isProd = process.env.NODE_ENV === 'production';
  res.status(500).json({
    success: false,
    error: {
      message: isProd ? 'An internal server error occurred. Please try again.' : err.message,
      code: 'INTERNAL_SERVER_ERROR',
      ...(isProd ? {} : { stack: err.stack }),
    },
  });
};
