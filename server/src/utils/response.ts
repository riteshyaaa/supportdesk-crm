import { Response } from 'express';
import { PaginationMeta } from '../types';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  meta?: PaginationMeta;
  error?: {
    message: string;
    code?: string;
    details?: unknown;
  };
}

export const sendSuccess = <T>(
  res: Response,
  data: T,
  statusCode: number = 200,
  meta?: PaginationMeta
): Response => {
  const payload: ApiResponse<T> = {
    success: true,
    data,
    ...(meta ? { meta } : {}),
  };
  return res.status(statusCode).json(payload);
};

export const sendCreated = <T>(res: Response, data: T): Response => {
  return sendSuccess(res, data, 201);
};
