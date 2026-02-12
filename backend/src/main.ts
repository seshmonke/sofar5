import app from './app';
import { env } from './config/env';
import { logger } from './utils/logger';

const PORT = env.PORT;

const server = app.listen(PORT, () => {
  logger.info(`🚀 Сервер запущен на http://localhost:${PORT}`);
  logger.info(`📝 Окружение: ${env.NODE_ENV}`);
  logger.info(`🔗 API URL: ${env.API_URL}`);
});

// Обработка ошибок
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Необработанное отклонение Promise:', reason);
});

process.on('uncaughtException', (error) => {
  logger.error('Необработанное исключение:', error);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM получен, закрываем сервер...');
  server.close(() => {
    logger.info('Сервер закрыт');
    process.exit(0);
  });
});
