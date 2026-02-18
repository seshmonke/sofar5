# 💡 Практические примеры

## Содержание
1. [Пример 1: Добавление нового endpoint](#пример-1-добавление-нового-endpoint)
2. [Пример 2: Добавление валидации](#пример-2-добавление-валидации)
3. [Пример 3: Работа с отношениями](#пример-3-работа-с-отношениями)
4. [Пример 4: Фильтрация и поиск](#пример-4-фильтрация-и-поиск)
5. [Пример 5: Обработка сложных ошибок](#пример-5-обработка-сложных-ошибок)

---

## Пример 1: Добавление нового endpoint

### 📋 Задача: Добавить endpoint для получения товаров по цене

**Требование:** Получить товары в диапазоне цен

### 🔧 Решение

#### Шаг 1: Добавить маршрут

```typescript
// src/routes/products.ts
router.get('/by-price/:minPrice/:maxPrice', (req, res, next) => 
  productController.getProductsByPrice(req, res, next)
);
```

#### Шаг 2: Добавить метод в контроллер

```typescript
// src/controllers/productController.ts
async getProductsByPrice(req: Request, res: Response, next: NextFunction) {
  try {
    const { minPrice, maxPrice } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await productService.getProductsByPrice(
      parseFloat(minPrice),
      parseFloat(maxPrice),
      page,
      limit
    );

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}
```

#### Шаг 3: Добавить метод в сервис

```typescript
// src/services/productService.ts
async getProductsByPrice(
  minPrice: number,
  maxPrice: number,
  page: number = 1,
  limit: number = 10
) {
  // Валидация
  if (minPrice < 0 || maxPrice < 0) {
    throw new ValidationError('Цены не могут быть отрицательными');
  }
  if (minPrice > maxPrice) {
    throw new ValidationError('Минимальная цена больше максимальной');
  }
  if (page < 1 || limit < 1) {
    throw new ValidationError('Page и limit должны быть больше 0');
  }

  // Бизнес-логика
  const skip = (page - 1) * limit;

  // Вызов репозитория
  const [products, total] = await Promise.all([
    productRepository.findByPrice(minPrice, maxPrice, skip, limit),
    productRepository.countByPrice(minPrice, maxPrice),
  ]);

  return {
    data: products,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}
```

#### Шаг 4: Добавить методы в репозиторий

```typescript
// src/repositories/productRepository.ts
async findByPrice(minPrice: number, maxPrice: number, skip: number, take: number) {
  return prisma.product.findMany({
    where: {
      price: {
        gte: minPrice,
        lte: maxPrice,
      },
    },
    skip,
    take,
    include: { category: true },
    orderBy: { price: 'asc' },
  });
}

async countByPrice(minPrice: number, maxPrice: number) {
  return prisma.product.count({
    where: {
      price: {
        gte: minPrice,
        lte: maxPrice,
      },
    },
  });
}
```

#### Шаг 5: Тестирование

```bash
# Запрос
GET /api/products/by-price/100/200?page=1&limit=10

# Ответ
HTTP 200 OK
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "prod-1",
        "name": "Product 1",
        "price": 150,
        "category": { ... }
      },
      // ... еще товары в диапазоне 100-200
    ],
    "total": 5,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

---

## Пример 2: Добавление валидации

### 📋 Задача: Добавить валидацию при создании товара

**Требование:** Проверить все поля перед созданием

### 🔧 Решение

#### Шаг 1: Создать класс валидатора

```typescript
// src/utils/validators.ts
export class ProductValidator {
  static validateCreate(data: any) {
    const errors: string[] = [];

    // Проверка названия
    if (!data.name || typeof data.name !== 'string') {
      errors.push('Название должно быть строкой');
    }
    if (data.name && data.name.length < 3) {
      errors.push('Название должно быть минимум 3 символа');
    }
    if (data.name && data.name.length > 255) {
      errors.push('Название не может быть больше 255 символов');
    }

    // Проверка цены
    if (!data.price || typeof data.price !== 'number') {
      errors.push('Цена должна быть числом');
    }
    if (data.price && data.price <= 0) {
      errors.push('Ц��на должна быть больше 0');
    }
    if (data.price && data.price > 1000000) {
      errors.push('Цена не может быть больше 1000000');
    }

    // Проверка категории
    if (!data.categoryId || typeof data.categoryId !== 'string') {
      errors.push('Категория должна быть указана');
    }

    // Проверка описания (опционально)
    if (data.description && typeof data.description !== 'string') {
      errors.push('Описание должно быть строкой');
    }
    if (data.description && data.description.length > 1000) {
      errors.push('Описание не может быть больше 1000 символов');
    }

    if (errors.length > 0) {
      throw new ValidationError(errors.join('; '));
    }
  }
}
```

#### Шаг 2: Использовать валидатор в сервисе

```typescript
// src/services/productService.ts
async createProduct(data: any) {
  // Валидация
  ProductValidator.validateCreate(data);

  // Проверка существования категории
  const category = await categoryRepository.findById(data.categoryId);
  if (!category) {
    throw new NotFoundError(`Категория с ID ${data.categoryId} не найдена`);
  }

  // Создание товара
  return productRepository.create(data);
}
```

#### Шаг 3: Тестирование

```bash
# Запрос с ошибкой
POST /api/products
{
  "name": "AB",
  "price": -100,
  "categoryId": ""
}

# Ответ
HTTP 400 Bad Request
{
  "success": false,
  "error": "На��вание должно быть минимум 3 символа; Цена должна быть больше 0; Категория должна быть указана"
}
```

---

## Пример 3: Работа с отношениями

### 📋 Задача: Получить категорию со всеми товарами

**Требование:** Получить категорию и все её товары с пагинацией

### ��� Решение

#### Шаг 1: Добавить маршрут

```typescript
// src/routes/categories.ts
router.get('/:id/products', (req, res, next) => 
  categoryController.getCategoryWithProducts(req, res, next)
);
```

#### Шаг 2: Добавить метод в контроллер

```typescript
// src/controllers/categoryController.ts
async getCategoryWithProducts(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await categoryService.getCategoryWithProducts(id, page, limit);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}
```

#### Шаг 3: Добавить метод в сервис

```typescript
// src/services/categoryService.ts
async getCategoryWithProducts(categoryId: string, page: number = 1, limit: number = 10) {
  // Валидация
  if (!categoryId) {
    throw new ValidationError('ID категории не может быть пустым');
  }

  // Получение категории
  const category = await categoryRepository.findById(categoryId);
  if (!category) {
    throw new NotFoundError(`Категория с ID ${categoryId} ��е найдена`);
  }

  // Получение товаров
  const skip = (page - 1) * limit;
  const [products, total] = await Promise.all([
    productRepository.findByCategory(categoryId, skip, limit),
    productRepository.countByCategory(categoryId),
  ]);

  return {
    category,
    products: {
      data: products,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}
```

#### Шаг 4: Добавить методы в репозиторий

```typescript
// src/repositories/productRepository.ts
async findByCategory(categoryId: string, skip: number, take: number) {
  return prisma.product.findMany({
    where: { categoryId },
    skip,
    take,
    include: { category: true },
  });
}

async countByCategory(categoryId: string) {
  return prisma.product.count({
    where: { categoryId },
  });
}
```

#### Шаг 5: Тестирование

```bash
# Запрос
GET /api/categories/cat-1/products?page=1&limit=5

# Ответ
HTTP 200 OK
{
  "success": true,
  "data": {
    "category": {
      "id": "cat-1",
      "name": "Category 1"
    },
    "products": {
      "data": [
        {
          "id": "prod-1",
          "name": "Product 1",
          "price": 100,
          "category": { ... }
        },
        // ... еще товары
      ],
      "total": 15,
      "page": 1,
      "limit": 5,
      "totalPages": 3
    }
  }
}
```

---

## Пример 4: Фильтрация и поиск

### 📋 Задача: Добавить поиск товаров по названию

**Требование:** Найти товары, содержащие текст в названии

### 🔧 Решение

#### Шаг 1: Добавить маршрут

```typescript
// src/routes/products.ts
router.get('/search/:query', (req, res, next) => 
  productController.searchProducts(req, res, next)
);
```

#### Шаг 2: Добавить метод в контроллер

```typescript
// src/controllers/productController.ts
async searchProducts(req: Request, res: Response, next: NextFunction) {
  try {
    const { query } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await productService.searchProducts(query, page, limit);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}
```

#### Шаг 3: Добавить метод в сервис

```typescript
// src/services/productService.ts
async searchProducts(query: string, page: number = 1, limit: number = 10) {
  // Валидация
  if (!query || query.trim().length === 0) {
    throw new ValidationError('Поисковый запрос не может быть пустым');
  }

  if (query.length > 100) {
    throw new ValidationError('Поисковый запрос не может быть больше 100 символов');
  }

  // Бизнес-логика
  const skip = (page - 1) * limit;
  const searchQuery = `%${query}%`;

  // Вызов репозитория
  const [products, total] = await Promise.all([
    productRepository.search(searchQuery, skip, limit),
    productRepository.countSearch(searchQuery),
  ]);

  return {
    data: products,
    query,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}
```

#### Шаг 4: Добавить методы в репозиторий

```typescript
// src/repositories/productRepository.ts
async search(query: string, skip: number, take: number) {
  return prisma.product.findMany({
    where: {
      name: {
        contains: query,
        mode: 'insensitive', // Поиск без учета регистра
      },
    },
    skip,
    take,
    include: { category: true },
  });
}

async countSearch(query: string) {
  return prisma.product.count({
    where: {
      name: {
        contains: query,
        mode: 'insensitive',
      },
    },
  });
}
```

#### Шаг 5: Тестирование

```bash
# Запрос
GET /api/products/search/shirt?page=1&limit=10

# Ответ
HTTP 200 OK
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "prod-1",
        "name": "Blue Shirt",
        "price": 50,
        "category": { ... }
      },
      {
        "id": "prod-2",
        "name": "Red Shirt",
        "price": 60,
        "category": { ... }
      }
    ],
    "query": "shirt",
    "total": 2,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

---

## Пример 5: Обработка сложных ошибок

### 📋 Задача: Обработать ошибку при удалении категории с товарами

**Требование:** Нельзя удалить категорию, если в ней есть товары

### 🔧 Решение

#### Шаг 1: Добавить метод в сервис

```typescript
// src/services/categoryService.ts
async deleteCategory(id: string) {
  // Валидация
  if (!id) {
    throw new ValidationError('ID категории не может быть пустым');
  }

  // Проверка существования
  const category = await categoryRepository.findById(id);
  if (!category) {
    throw new NotFoundError(`Категория с ID ${id} не найдена`);
  }

  // Проверка наличия товаров
  const productCount = await productRepository.countByCategory(id);
  if (productCount > 0) {
    throw new ConflictError(
      `Невозможно удалить категорию, так как в ней есть ${productCount} товаров. ` +
      `Сначала удалите или переместите товары.`
    );
  }

  // Удаление
  return categoryRepository.delete(id);
}
```

#### Шаг 2: Добавить метод в контроллер

```typescript
// src/controllers/categoryController.ts
async deleteCategory(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    await categoryService.deleteCategory(id);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Категория успешно удалена',
    });
  } catch (error) {
    next(error);
  }
}
```

#### Шаг 3: Тестирование

```bash
# Запрос
DELETE /api/categories/cat-1

# Если в категории есть товары:
# Ответ
HTTP 409 Conflict
{
  "success": false,
  "error": "Невозможно удалить категорию, так как в ней есть 5 товаров. Сначала удалите или переместите товары."
}

# Если категория пуста:
# Ответ
HTTP 200 OK
{
  "success": true,
  "message": "Категория успешно удалена"
}
```

---

## Ключевые моменты

✅ Следуйте слоистой архитектуре
✅ Валидируйте данные на каждом уровне
✅ Используйте кастомные ошибки
✅ Логируйте важные события
✅ Тестируйте каждый endpoint
✅ Документируйте API с Swagger

---

## Следующие шаги

1. Прочитайте **FRONTEND_BACKEND_INTEGRATION.md** - свяжите фронтенд и бэкенд
2. Прочитайте **INDEX.md** - навигация по всем материалам
