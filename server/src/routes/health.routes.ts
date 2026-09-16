import { Router, Request, Response } from 'express';
import { prisma } from '../repositories/ticket.repository';
import { logger } from '../utils/logger';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  try {
    // Ping PostgreSQL
    await prisma.$queryRaw`SELECT 1`;

    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'SupportDesk API',
      database: 'connected',
      uptime: process.uptime(),
    });
  } catch (error) {
    logger.error('Health check database error:', error);
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      service: 'SupportDesk API',
      database: 'disconnected',
      error: error instanceof Error ? error.message : 'Database ping failed',
    });
  }
});

export default router;
