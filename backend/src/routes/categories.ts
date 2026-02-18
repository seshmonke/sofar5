import { Router } from 'express';
import { categoryController } from '../controllers/categoryController';

const router = Router();

// GET /api/categories - получить все категории
router.get('/', (req, res, next) => categoryController.getAllCategories(req, res, next));

// GET /api/categories/:id - получить категорию по ID
router.get('/:id', (req, res, next) => categoryController.getCategoryById(req, res, next));

// POST /api/categories - создать новую категорию
router.post('/', (req, res, next) => categoryController.createCategory(req, res, next));

// PUT /api/categories/:id - обновить категорию
router.put('/:id', (req, res, next) => categoryController.updateCategory(req, res, next));

// DELETE /api/categories/:id - удалить категорию
router.delete('/:id', (req, res, next) => categoryController.deleteCategory(req, res, next));

export default router;
