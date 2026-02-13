# ⚠️ Стратегия обработки ошибок

## Содержание
1. [Основы обработки ошибок](#основы-обработки-ошибок)
2. [Кастомные классы ошибок](#кастомные-классы-ошибок)
3. [Обработка ошибок в слоях](#обработка-ошибок-в-слоях)
4. [Error Handler Middleware](#error-handler-middleware)
5. [Логирование ошибок](#логирование-ошибок)
6. [Практические примеры](#практические-примеры)

---

## Основы обработки ошибок

### 📖 Что такое обработка ошибок

**Обработка ошибок** - это процесс перехвата, обработки и логирования ошибок, которые могут возникнуть во время выполнения приложения.

### 🎯 Зачем нужна о��работка ошибок

**Без обработки ошибок:**
```typescript
// Приложение падает при ошибке - ПЛОХО!
app.get('/api/products/:id', async (req, res) => {
  const product = await prisma.product.findUnique({
    where: { id: req.params.id }
  });
  res.json(product); // Если product === null, отправляем null
});
```

**С обработкой ошибок:**
```typescript
// Приложение обрабатывает ошибку - ХОРОШО!
app.get('/api/products/:id', async (req, res, next) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id }
    });
    if (!product) {
      throw new NotFoundError(`Продукт с ID ${req.params.id} не найден`);
    }
    res.json({ success: true, data: product });
  } catch (error) {
    next(error); // Передаёт ошибку в error handler
  }
});
```

### ✨ Преимущества обработки ошибок

- **Стабильность** - приложение не падает
- **Информативность** - клиент получает понятное сообщение об ошибке
- **Отладка** - ошибки логируются для анализа
- **Безопасность** - не раскрываем внутренние детали
- **Пользовательский опыт** - пользователь знает, что произошло

---

## Кастомные классы ошибок

### 📖 Что такое кастомные ошибки

**Кастомные ошибки** - это классы, которые расширяют встроенный класс Error и добавляют дополнительную информацию.

### 💻 Структура кастомных ошибок

```typescript
// src/errors/AppError.ts

// Базовый класс ошибки
export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public isOperational: boolean = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

// Ошибка валидации (400)
export class ValidationError extends AppError {
  constructor(message: string) {
    super(400, message);
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

// Ошибка не найдено (404)
export class NotFoundError extends AppError {
  constructor(message: string = 'Ресурс не найден') {
    super(404, message);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

// Ошибка не авторизован (401)
export class UnauthorizedError extends AppError {
  constructor(message: string = 'Не авторизован') {
    super(401, message);
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}

// Ошибка доступ запрещен (403)
export class ForbiddenError extends AppError {
  constructor(message: string = 'Доступ запрещен') {
    super(403, message);
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}

// Ошибка конфликт (409)
export class ConflictError extends AppError {
  constructor(message: string = 'Конфликт') {
    super(409, message);
    Object.setPrototypeOf(this, ConflictError.prototype);
  }
}

// Ошибка внутреннего сервера (500)
export class InternalServerError extends AppError {
  constructor(message: string = 'Внутренняя ошибка сервера') {
    super(500, message);
    Object.setPrototypeOf(this, InternalServerError.prototype);
  }
}
```

### 🔍 Использование кастомных ошибок

```typescript
// Валидация
if (!data.name) {
  throw new ValidationError('Название не может быть пустым');
}

// Проверка существования
const product = await productRepository.findById(id);
if (!product) {
  throw new NotFoundError(`Продукт с ID ${id} не найден`);
}

// Проверка прав доступа
if (user.role !== 'admin') {
  throw new ForbiddenError('Только администраторы могут удалять товары');
}

// Проверка уникальности
const existingCategory = await categoryRepository.findByName(name);
if (existingCategory) {
  throw new ConflictError(`Категория с названием "${name}" уже существует`);
}
```

### 📊 HTTP статус коды и ошибки

| Класс | Код | Значение | Пример |
|-------|-----|----------|--------|
| `ValidationError` | 400 | Bad Request | Неверные параметры |
| `UnauthorizedError` | 401 | Unauthorized | Не авторизован |
| `ForbiddenError` | 403 | Forbidden | Нет прав доступа |
| `NotFoundError` | 404 | Not Found | Ресурс не найден |
| `ConflictError` | 409 | Conflict | Конфликт данных |
| `InternalServerError` | 500 | Server Error | Ошибка сервера |

---

## Обработка ошибок в слоях

### 📖 Как ошибки обрабатываются в каждом слое

### 1️⃣ Repositories слой

```typescript
// src/repositories/productRepository.ts
async findById(id: string) {
  try {
    return await prisma.product.findUnique({
      where: { id },
      include: { category: true }
    });
  } catch (error) {
    // Логируем ошибку БД
    logger.error('Database error in findById:', error);
    // Не выбрасываем ошибку, возвращаем null
    return null;
  }
}
```

### 2️⃣ Services слой

```typescript
// src/services/productService.ts
async getProductById(id: string) {
  // 1. Валидация
  if (!id) {
    throw new ValidationError('ID не может быть пустым');
  }

  // 2. Вызов репозитория
  const product = await productRepository.findById(id);

  // 3. Обработка результата
  if (!product) {
    throw new NotFoundError(`Продукт с ID ${id} не найден`);
  }

  return product;
}
```

### 3️⃣ Controllers слой

```typescript
// src/controllers/productController.ts
async getProductById(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    
    // Валидация параметров
    if (!id) {
      throw new ValidationError('ID не может быть пустым');
    }

    // Вызов сервиса
    const product = await productService.getProductById(id);

    // Формирование ответа
    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: product
    });
  } catch (error) {
    // Передача ошибки в error handler
    next(error);
  }
}
```

### 4️⃣ Error Handler Middleware

```typescript
// src/middleware/errorHandler.ts
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Логирование ошибки
  logger.error('Error occurred:', err);

  // Обработка кастомных ошибок
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
    });
  }

  // Обработка неожиданных ошибок
  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    success: false,
    error: 'Внутренняя ошибка сервера',
  });
};
```

### 📊 Поток ошибки через слои

```
1. REPOSITORIES слой
   Ошибка БД → Логируем → Возвращаем null
   
2. SERVICES слой
   null → Выбрасываем NotFoundError
   
3. CONTROLLERS слой
   NotFoundError → Ловим в try-catch → next(error)
   
4. ERROR HANDLER MIDDLEWARE
   error instanceof AppError → Проверяем тип
   → Отправляем JSON ответ с statusCode
   
5. HTTP Ответ
   HTTP 404
   { "success": false, "error": "Продукт не найден" }
```

---

## Error Handler Middleware

### 📖 Что такое Error Handler

**Error Handler** - это middleware, который ловит все ошибки и преобразует их в JSON ответ.

### 💻 Структура Error Handler

```typescript
// src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';
import { logger } from '../utils/logger';
import { HTTP_STATUS } from '../config/constants';

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // 1. Логирование ошибки
  logger.error('Error occurred:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  // 2. Обработка кастомных ошибок
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
      statusCode: err.statusCode
    });
  }

  // 3. Обработка ошибок валидации (например, от express-validator)
  if (err.name === 'ValidationError') {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      error: 'Ошибка валидации',
      details: err.message
    });
  }

  // 4. Обработка ошибок Prisma
  if (err.name === 'PrismaClientKnownRequestError') {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      error: 'Ошибка базы данных'
    });
  }

  // 5. Обработка неожиданных ошибок
  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    success: false,
    error: 'Внутренняя ошибка сервера',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
};
```

### 🔍 Правила Error Handler

✅ Error handler должен быть **последним** middleware
✅ Должен иметь **4 параметра** (err, req, res, next)
✅ Логируйте все ошибки
✅ Не раскрывайте внутренние детали в production
✅ Возвращайте консистентный формат ответа

### 📋 Добавление Error Handler в приложение

```typescript
// src/app.ts
import express from 'express';
import { errorHandler } from './middleware/errorHandler';
import apiRoutes from './routes/index';

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api', apiRoutes);

// 404 обработчик
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Маршрут не найден',
  });
});

// Error handler (ДОЛЖЕН быть последним!)
app.use(errorHandler);

export default app;
```

---

## Логирование ошибок

### 📖 Что такое логирование

**Логирование** - это процесс записи информации о событиях в приложении для отладки и анализа.

### 💻 Структура логирования

```typescript
// src/utils/logger.ts
export const logger = {
  info: (message: string, data?: any) => {
    console.log(`[INFO] ${new Date().toISOString()} - ${message}`, data || '');
  },

  error: (message: string, error?: any) => {
    console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, error || '');
  },

  warn: (message: string, data?: any) => {
    console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, data || '');
  },

  debug: (message: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[DEBUG] ${new Date().toISOString()} - ${message}`, data || '');
    }
  }
};
```

### 🔍 Использование логирования

```typescript
// Логирование запросов
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// Логирование ошибок
export const errorHandler = (err, req, res, next) => {
  logger.error('Error occurred:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  });
  // ...
};

// Логирование в сервисах
async getProductById(id: string) {
  logger.debug(`Getting product with ID: ${id}`);
  const product = await productRepository.findById(id);
  if (!product) {
    logger.warn(`Product not found: ${id}`);
    throw new NotFoundError(`Продукт с ID ${id} не найден`);
  }
  logger.info(`Product found: ${id}`);
  return product;
}
```

---

## Практические примеры

### Пример 1: Обработка ошибки валидации

```typescript
// REPOSITORIES слой
async create(data: any) {
  return prisma.product.create({
    data,
    include: { category: true }
  });
}

// SERVICES слой
async createProduct(data: any) {
  // Валидация
  if (!data.name) {
    throw new ValidationError('Название не может быть пустым');
  }
  if (!data.price) {
    throw new ValidationError('Цена не может быть пустой');
  }
  if (data.price <= 0) {
    throw new ValidationError('Цена должна быть больше 0');
  }
  if (!data.categoryId) {
    throw new ValidationError('Категория не может быть пустой');
  }

  // Создание
  return productRepository.create(data);
}

// CONTROLLERS слой
async createProduct(req: Request, res: Response, next: NextFunction) {
  try {
    const product = await productService.createProduct(req.body);
    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      data: product,
      message: 'Продукт успешно создан'
    });
  } catch (error) {
    next(error);
  }
}

// HTTP Запрос
POST /api/products
{ "name": "", "price": 100, "categoryId": "cat-123" }

// HTTP Ответ
HTTP 400
{
  "success": false,
  "error": "Название не может быть пустым"
}
```

### Пример 2: Обработка ошибки не найдено

```typescript
// REPOSITORIES слой
async findById(id: string) {
  return prisma.product.findUnique({
    where: { id },
    include: { category: true }
  });
}

// SERVICES слой
async getProductById(id: string) {
  if (!id) {
    throw new ValidationError('ID не может быть пустым');
  }

  const product = await productRepository.findById(id);
  
  if (!product) {
    throw new NotFoundError(`Продукт с ID ${id} не найден`);
  }

  return product;
}

// CONTROLLERS слой
async getProductById(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const product = await productService.getProductById(id);
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
}

// HTTP Запрос
GET /api/products/invalid-id

// HTTP Ответ
HTTP 404
{
  "success": false,
  "error": "Продукт с ID invalid-id не найден"
}
```

### Пример 3: Обработка ошибки конфликта

```typescript
// SERVICES слой
async createCategory(data: any) {
  // Валидация
  if (!data.name) {
    throw new ValidationError('Название не может быть пустым');
  }

  // Проверка уникальности
  const existingCategory = await categoryRepository.findByName(data.name);
  if (existingCategory) {
    throw new ConflictError(`Категория с названием "${data.name}" уже существует`);
  }

  return categoryRepository.create(data);
}

// HTTP Запрос
POST /api/categories
{ "name": "Одежда" }

// Если категория уже существует:
// HTTP Ответ
HTTP 409
{
  "success": false,
  "error": "Категория с названием \"Одежда\" уже существует"
}
```

### Пример 4: Обработка неожиданной ошибки

```typescript
// REPOSITORIES слой
async findAll(skip: number, take: number) {
  try {
    return await prisma.product.findMany({
      skip,
      take,
      include: { category: true }
    });
  } catch (error) {
    // Ошибка БД - логируем и выбрасываем
    logger.error('Database error in findAll:', error);
    throw new InternalServerError('Ошибка при получении товаров');
  }
}

// ERROR HANDLER
export const errorHandler = (err, req, res, next) => {
  logger.error('Error occurred:', err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message
    });
  }

  // Неожиданная ошибка
  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    success: false,
    error: 'Внутренняя ошибка сервера'
  });
};

// HTTP Ответ
HTTP 500
{
  "success": false,
  "error": "Внутренняя ошибка сервера"
}
```

---

## Диаграммы

### Поток обработки ошибок

```
Ошибка возникает
    ↓
try-catch ловит ошибку
    ↓
Выбрасываем кастомную ошибку
    ↓
next(error) передает в error handler
    ↓
Error handler проверяет тип ошибки
    ↓
Если AppError → Отправляем JSON с statusCode
Если другая ошибка → Отправляем 500
    ↓
HTTP Ответ отправляется клиенту
```

### Иерархия ошибок

```
Error (встроенный класс)
  ↓
AppError (базовый класс)
  ├── ValidationError (400)
  ├── UnauthorizedError (401)
  ├── ForbiddenError (403)
  ├── NotFoundError (404)
  ├── ConflictError (409)
  └── InternalServerError (500)
```

### Обработка ошибок в слоях

```
REPOSITORIES слой
  ↓ Ошибка БД
  ↓ Логируем, возвращаем null
  
SERVICES слой
  ↓ null → Выбрасываем AppError
  
CONTROLLERS слой
  ↓ Л��вим в try-catch
  ↓ next(error)
  
ERROR HANDLER MIDDLEWARE
  ↓ Проверяем тип ошибки
  ↓ Логируем ошибку
  ↓ Отправляем JSON ответ
  
HTTP Ответ
```

---

## Ключевые моменты

✅ Используйте кастомные классы ошибок
✅ Обрабатывайте ошибки на каждом уровне
✅ Логируйте все ошибки
✅ Error handler должен быть последним middleware
✅ Не раскрывайте внутренние детали в production
✅ Возвращайте консистентный формат ответа
✅ Используйте правильные HTTP статус коды

---

## Следующие шаги

1. Прочитайте **DATA_FLOW_BACKEND.md** - проследите полный путь запроса
2. Прочитайте **PRACTICAL_EXAMPLES.md** - практикуйтесь с примерами
3. Прочитайте **FRONTEND_BACKEND_INTEGRATION.md** - свяжите фронтенд и бэкенд
