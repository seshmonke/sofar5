import express from 'express';
import { corsMiddleware } from './middleware/cors';
import { errorHandler } from './middleware/errorHandler';
import apiRoutes from './routes/index';
import { logger } from './utils/logger';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(corsMiddleware);

// Логирование запросов
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// API маршруты
app.use('/api', apiRoutes);

// 404 обработчик
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Маршрут не найден',
  });
});

// Обработчик ошибок (должен быть последним)
app.use(errorHandler);

export default app;
