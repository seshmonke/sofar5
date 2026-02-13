# 🏗️ Слоистая архитектура - Полное руководство

## Содержание
1. [Что такое слоистая архитектура](#что-такое-слоистая-архитектура)
2. [Слой Routes](#слой-routes)
3. [Слой Controllers](#слой-controllers)
4. [Слой Services](#слой-services)
5. [Слой Repositories](#слой-repositories)
6. [Взаимодействие слоев](#взаимодействие-слоев)
7. [Практические примеры](#практические-примеры)

---

## Что такое слоистая архитектура

### 📖 Определение

**Слоистая архитектура (Layered Architecture)** - это паттерн проектирования, который разделяе�� приложение на горизонтальные слои, каждый из которых отвечает за определенную функцию.

### 🎯 Зачем нужна слоистая архитектура

**Без слоистой архитектуры:**
```typescript
// Весь код в одном месте - ПЛОХО!
app.get('/api/products', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    // Валидация
    if (page < 1 || limit < 1) {
      return res.status(400).json({ error: 'Invalid parameters' });
    }
    
    // Бизнес-логика
    const skip = (page - 1) * limit;
    
    // Работа с БД
    const products = await prisma.product.findMany({
      skip,
      take: limit,
      include: { category: true }
    });
    
    const total = await prisma.product.count();
    
    // Формирование ответа
    res.json({
      success: true,
      data: products,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});
```

**Со слоистой архитектурой:**
```typescript
// Каждый слой отвечает за одно - ХОРОШО!
router.get('/', (req, res, next) => 
  productController.getAllProducts(req, res, next)
);
```

### ✨ Преимущества слоистой архитектуры

- **Разделение ответственности** - каждый слой отвечает за одно
- **Тестируемость** - легко писать тесты для каждого слоя
- **Переиспользуемость** - код можно переиспользовать
- **Масштабируемость** - легко добавлять новые функции
- **Поддерживаемость** - легко найти и исправить ошибки
- **Независимость** - слои не зависят друг от друга

---

## Слой Routes

### 📖 Определение

**Routes слой** - это слой, который определяет HTTP endpoints и связывает их с обработчиками.

### 🎯 Ответственность

- Определение HTTP endpoints (GET, POST, PUT, DELETE)
- Связывание URL с контроллерами
- Swagger документация
- Валидация маршрутов

### 💻 Структура

```typescript
// src/routes/products.ts
import { Router } from 'express';
import { productController } from '../controllers/productController';

const router = Router();

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Получить все продукты
 *     tags:
 *       - Products
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 */
router.get('/', (req, res, next) => 
  productController.getAllProducts(req, res, next)
);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Получить продукт по ID
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */
router.get('/:id', (req, res, next) => 
  productController.getProductById(req, res, next)
);

router.post('/', (req, res, next) => 
  productController.createProduct(req, res, next)
);

router.put('/:id', (req, res, next) => 
  productController.updateProduct(req, res, next)
);

router.delete('/:id', (req, res, next) => 
  productController.deleteProduct(req, res, next)
);

export default router;
```

### 🔍 Что происходит в Routes слое

```
1. Клиент отправляет запрос
   GET /api/products?page=1&limit=10
   ↓
2. Express находит подходящий маршрут
   router.get('/', ...)
   ↓
3. Express вызывает обработчик
   productController.getAllProducts(req, res, next)
   ↓
4. Управление передается в Controllers слой
```

### 📋 Правила Routes слоя

✅ Определяйте только маршруты
✅ Не пишите бизнес-логику
✅ Не работайте с БД
✅ Передавайте управление контроллерам
✅ Добавляйте Swagger документацию

---

## Слой Controllers

### 📖 Определение

**Controllers слой** - это слой, который обрабатывает HTTP запросы и формирует ответы.

### 🎯 Ответственность

- Получение параметров из запроса
- Валидация параметров
- Вызов сервиса для обработки
- Формирование HTTP ответа
- Обработка ошибок

### 💻 Структура

```typescript
// src/controllers/productController.ts
import { Request, Response, NextFunction } from 'express';
import { productService } from '../services/productService';
import { HTTP_STATUS } from '../config/constants';

export class ProductController {
  async getAllProducts(req: Request, res: Response, next: NextFunction) {
    try {
      // 1. Получение параметров
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      // 2. Вызов сервиса
      const result = await productService.getAllProducts(page, limit);

      // 3. Формирование ответа
      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: result,
      });
    } catch (error) {
      // 4. Обработка ошибок
      next(error);
    }
  }

  async getProductById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const product = await productService.getProductById(id);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: product,
      });
    } catch (error) {
      next(error);
    }
  }

  async createProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await productService.createProduct(req.body);

      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        data: product,
        message: 'Продукт успешно создан',
      });
    } catch (error) {
      next(error);
    }
  }

  async updateProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const product = await productService.updateProduct(id, req.body);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: product,
        message: 'Продукт успешно обновлен',
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await productService.deleteProduct(id);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'Продукт успешно удален',
      });
    } catch (error) {
      next(error);
    }
  }
}

export const productController = new ProductController();
```

### 🔍 Что происходит в Controllers слое

```
1. Получение параметров из запроса
   req.params, req.query, req.body
   ↓
2. Валидация параметров (опционально)
   if (!id) throw new ValidationError(...)
   ↓
3. Вызов сервиса
   await productService.getAllProducts(page, limit)
   ↓
4. Получение результата от сервиса
   ↓
5. Формирование JSON ответа
   res.json({ success: true, data: result })
   ↓
6. Отправка ответа клиенту
```

### 📋 Правила Controllers слоя

✅ Получайте параметры из запроса
✅ Вызывайте сервисы для обработки
✅ Формируйте HTTP ответы
✅ Обрабатывайте ошибки через next(error)
✅ Не пишите бизнес-логику
✅ Не работайте с БД напрямую

---

## Слой Services

### 📖 Определение

**Services слой** - это слой, который содержит бизнес-логику приложения.

### 🎯 Ответственность

- Бизнес-логика приложения
- Валидация данных
- Координация работы репозиториев
- Обработка ошибок
- Трансформация данных

### 💻 Структура

```typescript
// src/services/productService.ts
import { productRepository } from '../repositories/productRepository';
import { NotFoundError, ValidationError } from '../errors/AppError';
import { LIMITS } from '../config/constants';

export class ProductService {
  async getAllProducts(page: number = 1, limit: number = LIMITS.DEFAULT_PAGE_SIZE) {
    // 1. Валидация
    if (page < 1 || limit < 1) {
      throw new ValidationError('Page и limit должны быть больше 0');
    }

    if (limit > LIMITS.MAX_PAGE_SIZE) {
      limit = LIMITS.MAX_PAGE_SIZE;
    }

    // 2. Бизнес-логика
    const skip = (page - 1) * limit;
    
    // 3. Вызов репозитория
    const [products, total] = await Promise.all([
      productRepository.findAll(skip, limit),
      productRepository.count(),
    ]);

    // 4. Трансформация данных
    return {
      data: products,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getProductById(id: string) {
    // 1. Валидация
    if (!id) {
      throw new ValidationError('ID не может быть пустым');
    }

    // 2. Вызов репозитория
    const product = await productRepository.findById(id);

    // 3. Обработка ошибок
    if (!product) {
      throw new NotFoundError(`Продукт с ID ${id} не найден`);
    }

    return product;
  }

  async createProduct(data: any) {
    // 1. Валидация
    if (!data.name || !data.price || !data.categoryId) {
      throw new ValidationError('Требуются поля: name, price, categoryId');
    }

    if (data.price <= 0) {
      throw new ValidationError('Цена должна быть больше 0');
    }

    // 2. Вызов репозитория
    return productRepository.create(data);
  }

  async updateProduct(id: string, data: any) {
    // 1. Проверка существования
    const product = await this.getProductById(id);

    // 2. Валидация
    if (data.price && data.price <= 0) {
      throw new ValidationError('Цена должна быть больше 0');
    }

    // 3. Вызов репозитория
    return productRepository.update(id, data);
  }

  async deleteProduct(id: string) {
    // 1. Проверка существования
    await this.getProductById(id);

    // 2. Вызов репозитория
    return productRepository.delete(id);
  }
}

export const productService = new ProductService();
```

### 🔍 Что происходит в Services слое

```
1. Получение данных от контроллера
   ↓
2. Валидация данных
   if (!data.name) throw new ValidationError(...)
   ↓
3. Выполнение бизнес-логики
   const skip = (page - 1) * limit
   ↓
4. Вызов репозитория
   await productRepository.findAll(skip, limit)
   ↓
5. Обработка результата
   ↓
6. Возврат результата контроллеру
```

### 📋 Правила Services слоя

✅ Пишите бизнес-логику
✅ Валидируйте данные
✅ Вызывайте репозитории
✅ Обрабатывайте ошибки
✅ Трансформируйте данные
✅ Не работайте с HTTP запросами/ответами
✅ Не работайте с БД напрямую

---

## Слой Repositories

### 📖 Определение

**Repositories слой** - это слой, который работает с базой данных.

### 🎯 Ответственность

- Работа с базой данных
- CRUD операции (Create, Read, Update, Delete)
- Использование Prisma ORM
- Преобразование данных из БД

### 💻 Структура

```typescript
// src/repositories/productRepository.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ProductRepository {
  async findAll(skip: number = 0, take: number = 10) {
    return prisma.product.findMany({
      skip,
      take,
      include: {
        category: true,
      },
    });
  }

  async findById(id: string) {
    return prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });
  }

  async findByCategory(categoryId: string, skip: number = 0, take: number = 10) {
    return prisma.product.findMany({
      where: { categoryId },
      skip,
      take,
      include: {
        category: true,
      },
    });
  }

  async create(data: any) {
    return prisma.product.create({
      data,
      include: {
        category: true,
      },
    });
  }

  async update(id: string, data: any) {
    return prisma.product.update({
      where: { id },
      data,
      include: {
        category: true,
      },
    });
  }

  async delete(id: string) {
    return prisma.product.delete({
      where: { id },
    });
  }

  async count() {
    return prisma.product.count();
  }
}

export const productRepository = new ProductRepository();
```

### 🔍 Что происходит в Repositories слое

```
1. Получение данных от сервиса
   ↓
2. Использование Prisma для работы с БД
   await prisma.product.findMany(...)
   ↓
3. Prisma преобразует в SQL
   SELECT * FROM products LIMIT 10 OFFSET 0
   ↓
4. PostgreSQL выполняет запрос
   ↓
5. Результат возвращается Prisma
   ↓
6. Prisma преобразует в TypeScript объект
   ↓
7. Возврат результата сервису
```

### 📋 Правила Repositories слоя

✅ Работайте только с БД
✅ Используйте Prisma ORM
✅ Пишите CRUD операции
✅ Не пишите бизнес-логику
✅ Не работайте с HTTP запросами/ответами
✅ Возвращайте данные из БД

---

## Взаимодействие слоев

### 📊 Поток данных между слоями

```
HTTP Запрос
    ↓
ROUTES слой
    ↓ Передает управление
CONTROLLERS слой
    ↓ Получает параметры, вызывает сервис
SERVICES слой
    ↓ Валидирует, выполняет логику, вызывает репозиторий
REPOSITORIES слой
    ↓ Работает с БД
DATABASE (PostgreSQL)
    ↓ Возвращает данные
REPOSITORIES слой
    ↓ Возвращает результат
SERVICES слой
    ↓ Трансформирует данные, возвращает результат
CONTROLLERS слой
    ↓ Формирует JSON ответ
ROUTES слой
    ↓ Отправляет ответ
HTTP Ответ
```

### 🔄 Пример: Получение товара по ID

```
1. ROUTES слой
   router.get('/:id', (req, res, next) => 
     productController.getProductById(req, res, next)
   )

2. CONTROLLERS слой
   async getProductById(req, res, next) {
     const { id } = req.params;
     const product = await productService.getProductById(id);
     res.json({ success: true, data: product });
   }

3. SERVICES слой
   async getProductById(id: string) {
     if (!id) throw new ValidationError(...);
     const product = await productRepository.findById(id);
     if (!product) throw new NotFoundError(...);
     return product;
   }

4. REPOSITORIES слой
   async findById(id: string) {
     return prisma.product.findUnique({
       where: { id },
       include: { category: true }
     });
   }

5. DATABASE
   SELECT * FROM products WHERE id = 'prod-123'
   INNER JOIN categories ON products.categoryId = categories.id

6. Результат возвращается обратно через все слои
```

### 📋 Правила взаимодействия слоев

✅ Данные движутся в одном направлении (вниз и вверх)
✅ Каждый слой вызывает только слой ниже
✅ Ошибки обрабатываются на каждом уровне
✅ Слои не зависят друг от друга
✅ Слои можно тестировать независимо

---

## Практические примеры

### Пример 1: Добавление нового endpoint

**Задача:** Добавить endpoint для получения товаров по цене

**Шаг 1: Routes слой**
```typescript
// src/routes/products.ts
router.get('/by-price/:minPrice/:maxPrice', (req, res, next) => 
  productController.getProductsByPrice(req, res, next)
);
```

**Шаг 2: Controllers слой**
```typescript
// src/controllers/productController.ts
async getProductsByPrice(req: Request, res: Response, next: NextFunction) {
  try {
    const { minPrice, maxPrice } = req.params;
    const result = await productService.getProductsByPrice(
      parseFloat(minPrice),
      parseFloat(maxPrice)
    );
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}
```

**Шаг 3: Services слой**
```typescript
// src/services/productService.ts
async getProductsByPrice(minPrice: number, maxPrice: number) {
  if (minPrice < 0 || maxPrice < 0) {
    throw new ValidationError('Цены не могут быть отрицательными');
  }
  if (minPrice > maxPrice) {
    throw new ValidationError('Минимальная цена больше максимальной');
  }
  return productRepository.findByPrice(minPrice, maxPrice);
}
```

**Шаг 4: Repositories слой**
```typescript
// src/repositories/productRepository.ts
async findByPrice(minPrice: number, maxPrice: number) {
  return prisma.product.findMany({
    where: {
      price: {
        gte: minPrice,
        lte: maxPrice
      }
    },
    include: { category: true }
  });
}
```

### Пример 2: Обработка ошибок через слои

```
1. REPOSITORIES слой
   const product = await prisma.product.findUnique({ where: { id } });
   // Если не найден, Prisma вернет null

2. SERVICES слой
   if (!product) {
     throw new NotFoundError(`Продукт с ID ${id} не найден`);
   }

3. CONTROLLERS слой
   try {
     const product = await productService.getProductById(id);
     res.json({ success: true, data: product });
   } catch (error) {
     next(error);  // Передает ошибку в error handler
   }

4. MIDDLEWARE (Error Handler)
   if (err instanceof AppError) {
     return res.status(err.statusCode).json({
       success: false,
       error: err.message
     });
   }

5. HTTP Ответ
   HTTP 404
   { "success": false, "error": "Продукт с ID 123 не найден" }
```

---

## Диаграммы

### Архитектура слоев

```
┌─────────────────────────────────────┐
│         HTTP Запрос                 │
└────────────────┬────────────────────┘
                 │
┌────────────────▼────────────────────┐
│      ROUTES СЛОЙ                    │
│  - Определение endpoints            │
│  - Swagger документация              │
└────────────────┬────────────────────┘
                 │
┌────────────────▼────────────────────┐
│      CONTROLLERS СЛОЙ               │
│  - Получение параметров             │
│  - Вызов сервиса                    │
│  - Формирование ответа              │
└────────────────┬────────────────────┘
                 │
┌────────────────▼────────────────────┐
│      SERVICES СЛОЙ                  │
│  - Бизнес-логика                    │
│  - Валидация данных                 │
│  - Вызов репозитория                │
└────────────────┬────────────────────┘
                 │
┌────────────────▼────────────────────┐
│      REPOSITORIES СЛОЙ              │
│  - Работа с БД                      │
│  - CRUD операции                    │
│  - Prisma ORM                       │
└────────────────┬────────────────────┘
                 │
┌────────────────▼────────────────────┐
│      DATABASE (PostgreSQL)          │
│  - Таблицы, индексы, связи          │
└─────────────────────────────────────┘
```

### Зависимости между слоями

```
Routes
  ↓ зависит от
Controllers
  ↓ зависит от
Services
  ↓ зависит от
Repositories
  ↓ зависит от
Database

Но Database НЕ зависит от Repositories
Repositories НЕ зависит от Services
Services НЕ зависит от Controllers
Controllers НЕ зависит от Routes
```

---

## Ключевые моменты

✅ Слоистая архитектура разделяет ответственность
✅ Каждый слой отвечает за одно
✅ Данные движутся вниз и вверх через слои
✅ Слои можно тестировать независимо
✅ Ошибки обрабатываются на каждом уровне
✅ Код становится модульным и масштабируемым

---

## Следующие шаги

1. Прочитайте **ERROR_HANDLING_STRATEGY.md** - поймите обработку ошибок
2. Прочитайте **DATA_FLOW_BACKEND.md** - проследите полный путь запроса
3. Прочитайте **PRACTICAL_EXAMPLES.md** - практикуйтесь с примерами
