import { Router } from 'express';
import productsRouter from './products';
import categoriesRouter from './categories';
import salesRouter from './sales';
import qrcodesRouter from './qrcodes';

const router = Router();

// API маршруты
router.use('/products', productsRouter);
router.use('/categories', categoriesRouter);
router.use('/sales', salesRouter);
router.use('/qrcodes', qrcodesRouter);

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

export default router;
