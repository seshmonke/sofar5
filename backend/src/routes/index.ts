import { Router } from 'express';
import productsRouter from './products';

const router = Router();

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Проверка статуса сервера
 *     description: Возвращает статус сервера и текущее время
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *         description: Сервер работает нормально
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthCheck'
 */
// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API маршруты
router.use('/products', productsRouter);

export default router;
