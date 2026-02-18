import { Router } from 'express';
import { productController } from '../controllers/productController';

const router = Router();

// GET /api/products - получить все продукты
router.get('/', (req, res, next) => productController.getAllProducts(req, res, next));

// GET /api/products/:id - получить продукт по ID
router.get('/:id', (req, res, next) => productController.getProductById(req, res, next));

// GET /api/products/barcode/:barcode - получить продукт по штрих-коду
router.get('/barcode/:barcode', (req, res, next) => productController.getProductByBarcode(req, res, next));

// POST /api/products - создать новый продукт
router.post('/', (req, res, next) => productController.createProduct(req, res, next));

// PUT /api/products/:id - обновить продукт
router.put('/:id', (req, res, next) => productController.updateProduct(req, res, next));

// PUT /api/products/:id/stock - обновить количество товара
router.put('/:id/stock', (req, res, next) => productController.updateProductStock(req, res, next));

// DELETE /api/products/:id - удалить продукт
router.delete('/:id', (req, res, next) => productController.deleteProduct(req, res, next));

export default router;
