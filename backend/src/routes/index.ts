import { Router } from 'express';
import productsRouter from './products';

const router = Router();

// API маршруты
router.use('/products', productsRouter);

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

export default router;
