import { Router } from 'express';
import { productController } from '../controllers/productController';

const router = Router();

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Получить все продукты
 *     description: Возвращает список всех продуктов с поддержкой пагинации
 *     tags:
 *       - Products
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Номер страницы
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           maximum: 100
 *         description: Количество элементов на странице
 *     responses:
 *       200:
 *         description: Успешно получены продукты
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/PaginatedProducts'
 *       400:
 *         description: Ошибка валидации параметров
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', (req, res, next) => productController.getAllProducts(req, res, next));

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Получить продукт по ID
 *     description: Возвращает информацию о конкретном продукте
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID продукта
 *     responses:
 *       200:
 *         description: Продукт найден
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       404:
 *         description: Продукт не найд��н
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id', (req, res, next) => productController.getProductById(req, res, next));

// GET /api/products/barcode/:barcode - получить продукт по штрих-коду
router.get('/barcode/:barcode', (req, res, next) => productController.getProductByBarcode(req, res, next));

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Создать новый продукт
 *     description: Создает новый продукт в системе
 *     tags:
 *       - Products
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - categoryId
 *             properties:
 *               name:
 *                 type: string
 *                 description: Название продукта
 *                 example: Смартфон Samsung Galaxy S21
 *               price:
 *                 type: number
 *                 format: float
 *                 description: Цена продукта
 *                 example: 49999.99
 *               categoryId:
 *                 type: string
 *                 description: ID категории
 *                 example: cuid123abc
 *               description:
 *                 type: string
 *                 description: Описание продукта
 *                 example: Мощный смартфон с отличной камерой
 *               image:
 *                 type: string
 *                 description: URL изображения
 *                 example: https://example.com/images/samsung-s21.jpg
 *               stock:
 *                 type: integer
 *                 description: Количество на складе
 *                 example: 15
 *     responses:
 *       201:
 *         description: Продукт успешно создан
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *                 message:
 *                   type: string
 *                   example: Продукт успешно создан
 *       400:
 *         description: Ошибка валидации
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
// POST /api/products - создать новый продукт
router.post('/', (req, res, next) => productController.createProduct(req, res, next));

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Обновить продукт
 *     description: Обновляет информацию о продукте
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID продукта
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Название продукта
 *                 example: Обновленное название
 *               price:
 *                 type: number
 *                 format: float
 *                 description: Цена продукта
 *                 example: 59999.99
 *               description:
 *                 type: string
 *                 description: Описание продукта
 *               image:
 *                 type: string
 *                 description: URL изображения
 *               stock:
 *                 type: integer
 *                 description: Количество на складе
 *     responses:
 *       200:
 *         description: Продукт успешно обновлен
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *                 message:
 *                   type: string
 *                   example: Продукт успешно обновлен
 *       404:
 *         description: Продукт не найден
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/:id', (req, res, next) => productController.updateProduct(req, res, next));

// PUT /api/products/:id/stock - обновить количество товара
router.put('/:id/stock', (req, res, next) => productController.updateProductStock(req, res, next));

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Удалить продукт
 *     description: Удаляет продукт из системы
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID продукта
 *     responses:
 *       200:
 *         description: Продукт успешно удален
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Продукт успешно удален
 *       404:
 *         description: Продукт не найден
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
// DELETE /api/products/:id - удалить продукт
router.delete('/:id', (req, res, next) => productController.deleteProduct(req, res, next));

export default router;
