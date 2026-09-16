import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { config } from './config';
import { requestLogger } from './middleware/requestLogger';
import { errorHandler } from './middleware/errorHandler';
import { AppError } from './utils/appError';
import ticketRoutes from './routes/ticket.routes';
import healthRoutes from './routes/health.routes';

export const createApp = (): Application => {
  const app: Application = express();

  // CORS Configuration
  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, or Postman)
        if (!origin) return callback(null, true);
        if (config.corsOrigins.includes('*') || config.corsOrigins.includes(origin)) {
          return callback(null, true);
        }
        // In development, allow localhost origins dynamically
        if (!config.isProduction && (origin.includes('localhost') || origin.includes('127.0.0.1'))) {
          return callback(null, true);
        }
        callback(new Error('CORS policy does not allow access from this origin.'));
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    })
  );

  // Body parsers
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));

  // HTTP Request Logging
  app.use(requestLogger);

  // Root welcome endpoint
  app.get('/', (_req: Request, res: Response) => {
    res.json({
      name: 'SupportDesk CRM API',
      version: '1.0.0',
      documentation: '/api/tickets',
      health: '/health',
    });
  });

  // Application Routes
  app.use('/health', healthRoutes);
  app.use('/api/tickets', ticketRoutes);

  // 404 Catch-all for undefined routes
  app.use((req: Request, _res: Response, next: NextFunction) => {
    next(AppError.notFound(`Cannot ${req.method} ${req.originalUrl} - Route not found`));
  });

  // Centralized Error Handling Middleware
  app.use(errorHandler);

  return app;
};
