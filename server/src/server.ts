import { createApp } from './app';
import { config } from './config';
import { logger } from './utils/logger';
import { prisma } from './repositories/ticket.repository';

const startServer = async () => {
  const app = createApp();

  const server = app.listen(config.port, () => {
    logger.info(`🚀 SupportDesk API running in [${config.env}] mode on port ${config.port}`);
    logger.info(`🔗 Local URL: http://localhost:${config.port}`);
    logger.info(`🏥 Health Check: http://localhost:${config.port}/health`);
  });

  // Graceful shutdown handling
  const shutdown = async (signal: string) => {
    logger.info(`Received ${signal}. Shutting down gracefully...`);

    server.close(async () => {
      logger.info('HTTP server closed.');
      await prisma.$disconnect();
      logger.info('Database connection closed.');
      process.exit(0);
    });

    // Force shutdown after 10 seconds if not finished
    setTimeout(() => {
      logger.error('Could not close connections in time, forcefully shutting down');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
};

startServer().catch((error) => {
  logger.error('Failed to start server:', error);
  process.exit(1);
});
