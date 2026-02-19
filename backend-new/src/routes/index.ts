import { Router } from 'express';
import * as productController from '../controllers/productController';
import * as categoryController from '../controllers/categoryController';
import * as orderController from '../controllers/orderController';
import { verifyTelegramAuth } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/products', productController.getProducts);
router.get('/products/:id', productController.getProductById);
router.get('/products/category/:categoryId', productController.getProductsByCategory);
router.get('/categories', categoryController.getCategories);
router.get('/categories/:id', categoryController.getCategoryById);

// Protected routes
router.post('/orders', verifyTelegramAuth, orderController.createOrder);
router.get('/orders', verifyTelegramAuth, orderController.getUserOrders);
router.get('/orders/:id', verifyTelegramAuth, orderController.getOrderById);

export default router;
