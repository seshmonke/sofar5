import { Router } from 'express';
import { saleController } from '../controllers/saleController';

const router = Router();

// GET /api/sales - получить все продажи
router.get('/', (req, res, next) => saleController.getSales(req, res, next));

// GET /api/sales/:id - получить продажу по ID
router.get('/:id', (req, res, next) => saleController.getSaleById(req, res, next));

// POST /api/sales - создать новую продажу
router.post('/', (req, res, next) => saleController.createSale(req, res, next));

export default router;
