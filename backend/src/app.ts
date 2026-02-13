import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { corsMiddleware } from './middleware/cors';
import { errorHandler } from './middleware/errorHandler';
import apiRoutes from './routes/index';
import { logger } from './utils/logger';
import { swaggerSpec } from './config/swagger';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(corsMiddleware);

// Swagger документация
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  swaggerOptions: {
    url: '/api-docs.json',
  },
}));

// JSON спецификация Swagger
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

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
