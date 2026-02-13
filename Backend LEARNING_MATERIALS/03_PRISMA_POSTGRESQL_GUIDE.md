# 🗄️ Prisma, PostgreSQL и SQL - Полное руководство

## Содержание
1. [Основы SQL](#основы-sql)
2. [PostgreSQL специфика](#postgresql-специфика)
3. [Что такое Prisma ORM](#что-такое-prisma-orm)
4. [Prisma Schema](#prisma-schema)
5. [CRUD операции](#crud-операции)
6. [Отношения между таблицами](#отношения-между-таблицами)
7. [Миграции](#миграции)
8. [Практические примеры](#практические-примеры)

---

## Основы SQL

### 📖 Что такое SQL

**SQL (Structured Query Language)** - язык для работы с базами данных. Позволяет:
- Создавать таблицы
- Добавлять данные
- Получать данные
- Обновлять данные
- Удалять данные

### 🎯 Основные операции SQL

#### 1. SELECT - Получить данные

```sql
-- Получить все товары
SELECT * FROM products;

-- Получить конкретные колонки
SELECT id, name, price FROM products;

-- Получить товары с фильтром
SELECT * FROM products WHERE price > 100;

-- Получить товары с сортировкой
SELECT * FROM products ORDER BY price DESC;

-- Получить первые 10 товаров
SELECT * FROM products LIMIT 10;

-- Получить товары со смещением (пагинация)
SELECT * FROM products LIMIT 10 OFFSET 0;

-- Получить количество товаров
SELECT COUNT(*) FROM products;

-- Получить среднюю цену
SELECT AVG(price) FROM products;

-- Получить максимальную цену
SELECT MAX(price) FROM products;

-- Получить минимальную цену
SELECT MIN(price) FROM products;

-- Получить сумму всех цен
SELECT SUM(price) FROM products;
```

#### 2. INSERT - Добавить данные

```sql
-- Добавить один товар
INSERT INTO products (name, price, categoryId)
VALUES ('Product 1', 100, 'cat-123');

-- Добавить несколько товаров
INSERT INTO products (name, price, categoryId)
VALUES 
  ('Product 1', 100, 'cat-123'),
  ('Product 2', 200, 'cat-123'),
  ('Product 3', 300, 'cat-456');
```

#### 3. UPDATE - Обновить данные

```sql
-- Обновить цену товара
UPDATE products SET price = 150 WHERE id = 'prod-123';

-- Обновить несколько полей
UPDATE products 
SET price = 150, name = 'New Name' 
WHERE id = 'prod-123';

-- Обновить все товары в категории
UPDATE products 
SET price = price * 1.1 
WHERE categoryId = 'cat-123';
```

#### 4. DELETE - Удалить данные

```sql
-- Удалить конкретный товар
DELETE FROM products WHERE id = 'prod-123';

-- Удалить все товары в категории
DELETE FROM products WHERE categoryId = 'cat-123';

-- Удалить все товары (осторожно!)
DELETE FROM products;
```

### 🔗 JOIN - Объединение таблиц

```sql
-- INNER JOIN - получить товары с категориями
SELECT products.id, products.name, categories.name as category
FROM products
INNER JOIN categories ON products.categoryId = categories.id;

-- LEFT JOIN - получить все товары, даже если категория не найдена
SELECT products.id, products.name, categories.name as category
FROM products
LEFT JOIN categories ON products.categoryId = categories.id;

-- Получить товары с категориями и отсортировать
SELECT products.id, products.name, products.price, categories.name as category
FROM products
INNER JOIN categories ON products.categoryId = categories.id
ORDER BY products.price DESC;
```

### 📊 GROUP BY - Группировка данных

```sql
-- Получить количество товаров в каждой категории
SELECT categoryId, COUNT(*) as count
FROM products
GROUP BY categoryId;

-- Получить среднюю цену в каждой категории
SELECT categoryId, AVG(price) as avg_price
FROM products
GROUP BY categoryId;

-- Получить категории с более чем 5 товарами
SELECT categoryId, COUNT(*) as count
FROM products
GROUP BY categoryId
HAVING COUNT(*) > 5;
```

### 🔍 WHERE условия

```sql
-- Равно
SELECT * FROM products WHERE price = 100;

-- Не равно
SELECT * FROM products WHERE price != 100;

-- Больше
SELECT * FROM products WHERE price > 100;

-- Меньше
SELECT * FROM products WHERE price < 100;

-- Больше или равно
SELECT * FROM products WHERE price >= 100;

-- Меньше или равно
SELECT * FROM products WHERE price <= 100;

-- IN - проверка в списке
SELECT * FROM products WHERE categoryId IN ('cat-1', 'cat-2', 'cat-3');

-- LIKE - поиск по шаблону
SELECT * FROM products WHERE name LIKE '%Product%';

-- AND - оба условия
SELECT * FROM products WHERE price > 100 AND categoryId = 'cat-123';

-- OR - одно из условий
SELECT * FROM products WHERE price > 100 OR categoryId = 'cat-123';

-- NOT - отрицание
SELECT * FROM products WHERE NOT categoryId = 'cat-123';

-- IS NULL - проверка на NULL
SELECT * FROM products WHERE description IS NULL;

-- IS NOT NULL - проверка на не NULL
SELECT * FROM products WHERE description IS NOT NULL;
```

---

## PostgreSQL специфика

### 📖 Что такое PostgreSQL

**PostgreSQL** - это мощная, открытая реляционная база данных. Особенности:
- Надежность
- Производительность
- Поддержка сложных типов данных
- Расширяемость

### 🔧 Типы данных в PostgreSQL

```sql
-- Числовые типы
INTEGER          -- целые числа (-2147483648 до 2147483647)
BIGINT           -- большие целые числа
SMALLINT         -- маленькие целые числа
DECIMAL(10, 2)   -- числа с фиксированной точкой
FLOAT            -- числа с плавающей точкой

-- Строковые типы
VARCHAR(255)     -- строка до 255 символов
TEXT             -- строка любой длины
CHAR(10)         -- строка ровно 10 символов

-- Логический тип
BOOLEAN          -- true или false

-- Дата и время
DATE             -- дата (2024-02-13)
TIME             -- время (14:30:00)
TIMESTAMP        -- дата и время (2024-02-13 14:30:00)

-- JSON
JSON             -- JSON объект
JSONB            -- JSON объект (оптимизированный)

-- UUID
UUID             -- уникальный идентификатор
```

### 🔑 Ограничения (Constraints)

```sql
-- PRIMARY KEY - уникальный идентификатор
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL
);

-- NOT NULL - поле не может быть пустым
CREATE TABLE products (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

-- UNIQUE - значение должно быть уникальным
CREATE TABLE categories (
  id UUID PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL
);

-- DEFAULT - значение по умолчанию
CREATE TABLE products (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- FOREIGN KEY - связь с другой таблицей
CREATE TABLE products (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  categoryId UUID NOT NULL,
  FOREIGN KEY (categoryId) REFERENCES categories(id)
);

-- CHECK - проверка значения
CREATE TABLE products (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) CHECK (price > 0)
);
```

### 📋 Индексы

```sql
-- Создать индекс для быстрого поиска
CREATE INDEX idx_products_name ON products(name);

-- Создать уникальный индекс
CREATE UNIQUE INDEX idx_categories_slug ON categories(slug);

-- Создать индекс на нескольких колонках
CREATE INDEX idx_products_category_price ON products(categoryId, price);
```

### 🔄 Транзакции

```sql
-- Начать транзакцию
BEGIN;

-- Выполнить операции
INSERT INTO products (name, price, categoryId) VALUES ('Product', 100, 'cat-123');
UPDATE categories SET productCount = productCount + 1 WHERE id = 'cat-123';

-- Завершить транзакцию (сохранить изменения)
COMMIT;

-- Или откатить (отменить изменения)
ROLLBACK;
```

---

## Что такое Prisma ORM

### 📖 Определение

**Prisma** - это Object-Relational Mapping (ORM) библиотека для Node.js и TypeScript. Она позволяет:
- Работать с БД через JavaScript/TypeScript вместо SQL
- Получить типизацию
- Автоматически генерировать миграции
- Валидировать данные

### 🎯 Зачем нужна Prisma

**Без Prisma:**
```typescript
// Нужно писать SQL вручную
const result = await db.query(
  'SELECT * FROM products WHERE categoryId = $1 LIMIT $2 OFFSET $3',
  [categoryId, limit, skip]
);
```

**С Prisma:**
```typescript
// Просто используем JavaScript
const products = await prisma.product.findMany({
  where: { categoryId },
  take: limit,
  skip
});
```

### ✨ Преимущества Prisma

- **Типизация** - TypeScript автоматически знает типы
- **Безопасность** - защита от SQL injection
- **Удобство** - не нужно писать SQL
- **Миграции** - автоматическое управление схемой БД
- **Валидация** - встроенная валидация данных

---

## Prisma Schema

### 📖 Что такое Schema

**Schema** - это описание структуры вашей базы данных. Файл: `prisma/schema.prisma`

### 💻 Структура Schema

```prisma
// Конфигурация
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Модели (таблицы)
model Product {
  id          String   @id @default(cuid())
  name        String
  price       Float
  category    Category @relation(fields: [categoryId], references: [id])
  categoryId  String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("products")
}

model Category {
  id        String   @id @default(cuid())
  name      String   @unique
  products  Product[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("categories")
}
```

### 🔍 Атрибуты Prisma

| Атрибут | Значение | Пример |
|---------|----------|--------|
| `@id` | Первичный ключ | `id String @id` |
| `@default()` | Значение по умолчанию | `@default(now())` |
| `@unique` | Уникальное значение | `name String @unique` |
| `@updatedAt` | Автоматическое обновление | `updatedAt DateTime @updatedAt` |
| `@relation()` | Связь с другой таблицей | `@relation(fields: [categoryId])` |
| `@@map()` | Имя таблицы в БД | `@@map("products")` |

### 📊 Типы данных в Prisma

```prisma
model Product {
  // Строки
  name        String
  description String?  // Опциональное поле (может быть null)
  
  // Числа
  price       Float
  stock       Int
  
  // Логические
  isActive    Boolean @default(true)
  
  // Дата и время
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // JSON
  metadata    Json?
  
  // Отношения
  category    Category @relation(fields: [categoryId], references: [id])
  categoryId  String
}
```

### 🔗 Отношения в Schema

```prisma
// One-to-Many (Один ко многим)
model Category {
  id       String   @id @default(cuid())
  name     String
  products Product[]  // Категория имеет много товаров
}

model Product {
  id         String   @id @default(cuid())
  name       String
  category   Category @relation(fields: [categoryId], references: [id])
  categoryId String
}

// Many-to-Many (Много ко многим)
model Product {
  id    String   @id @default(cuid())
  name  String
  tags  Tag[]    // Товар имеет много тегов
}

model Tag {
  id       String   @id @default(cuid())
  name     String
  products Product[]  // Тег имеет много товаров
}
```

---

## CRUD операции

### 📖 CRUD - Create, Read, Update, Delete

### 1️⃣ CREATE - Создать

```typescript
// Создать один товар
const product = await prisma.product.create({
  data: {
    name: 'Product 1',
    price: 100,
    categoryId: 'cat-123'
  }
});

// Создать с отношением
const product = await prisma.product.create({
  data: {
    name: 'Product 1',
    price: 100,
    category: {
      connect: { id: 'cat-123' }
    }
  },
  include: { category: true }
});

// Создать несколько товаров
const products = await prisma.product.createMany({
  data: [
    { name: 'Product 1', price: 100, categoryId: 'cat-123' },
    { name: 'Product 2', price: 200, categoryId: 'cat-123' }
  ]
});
```

**Эквивалент SQL:**
```sql
INSERT INTO products (name, price, categoryId)
VALUES ('Product 1', 100, 'cat-123');
```

### 2️⃣ READ - Получить

```typescript
// Получить все товары
const products = await prisma.product.findMany();

// Получить с фильтром
const products = await prisma.product.findMany({
  where: { categoryId: 'cat-123' }
});

// Получить с пагинацией
const products = await prisma.product.findMany({
  skip: 0,
  take: 10
});

// Получить с сортировкой
const products = await prisma.product.findMany({
  orderBy: { price: 'desc' }
});

// Получить с отношениями
const products = await prisma.product.findMany({
  include: { category: true }
});

// Получить один товар по ID
const product = await prisma.product.findUnique({
  where: { id: 'prod-123' }
});

// Получить первый товар, который соответствует условию
const product = await prisma.product.findFirst({
  where: { categoryId: 'cat-123' }
});

// Получить количество товаров
const count = await prisma.product.count();

// Получить количество товаров в категории
const count = await prisma.product.count({
  where: { categoryId: 'cat-123' }
});
```

**Эквивалент SQL:**
```sql
SELECT * FROM products;
SELECT * FROM products WHERE categoryId = 'cat-123';
SELECT * FROM products LIMIT 10 OFFSET 0;
SELECT * FROM products ORDER BY price DESC;
SELECT COUNT(*) FROM products;
```

### 3️⃣ UPDATE - Обновить

```typescript
// Обновить один товар
const product = await prisma.product.update({
  where: { id: 'prod-123' },
  data: { price: 150 }
});

// Обновить несколько полей
const product = await prisma.product.update({
  where: { id: 'prod-123' },
  data: {
    name: 'New Name',
    price: 150
  }
});

// Обновить или создать
const product = await prisma.product.upsert({
  where: { id: 'prod-123' },
  update: { price: 150 },
  create: { name: 'Product', price: 150, categoryId: 'cat-123' }
});

// Обновить много товаров
const result = await prisma.product.updateMany({
  where: { categoryId: 'cat-123' },
  data: { price: 200 }
});
```

**Эквивалент SQL:**
```sql
UPDATE products SET price = 150 WHERE id = 'prod-123';
UPDATE products SET price = 200 WHERE categoryId = 'cat-123';
```

### 4️⃣ DELETE - Удалить

```typescript
// Удалить один товар
const product = await prisma.product.delete({
  where: { id: 'prod-123' }
});

// Удалить много товаров
const result = await prisma.product.deleteMany({
  where: { categoryId: 'cat-123' }
});
```

**Эквивалент SQL:**
```sql
DELETE FROM products WHERE id = 'prod-123';
DELETE FROM products WHERE categoryId = 'cat-123';
```

---

## Отношения между таблицами

### 📖 Типы отношений

#### 1. One-to-Many (Один ко многим)

**Пример:** Категория имеет много товаров

```prisma
model Category {
  id       String   @id @default(cuid())
  name     String
  products Product[]
}

model Product {
  id         String   @id @default(cuid())
  name       String
  category   Category @relation(fields: [categoryId], references: [id])
  categoryId String
}
```

**Использование:**
```typescript
// Получить категорию с товарами
const category = await prisma.category.findUnique({
  where: { id: 'cat-123' },
  include: { products: true }
});

// Получить товар с категорией
const product = await prisma.product.findUnique({
  where: { id: 'prod-123' },
  include: { category: true }
});

// Создать товар с категорией
const product = await prisma.product.create({
  data: {
    name: 'Product',
    price: 100,
    category: {
      connect: { id: 'cat-123' }
    }
  }
});
```

#### 2. Many-to-Many (Много ко многим)

**Пример:** Товар имеет много тегов, тег имеет много товаров

```prisma
model Product {
  id   String @id @default(cuid())
  name String
  tags Tag[]
}

model Tag {
  id       String @id @default(cuid())
  name     String
  products Product[]
}
```

**Использование:**
```typescript
// Получить товар с тегами
const product = await prisma.product.findUnique({
  where: { id: 'prod-123' },
  include: { tags: true }
});

// Создать товар с тегами
const product = await prisma.product.create({
  data: {
    name: 'Product',
    tags: {
      connect: [
        { id: 'tag-1' },
        { id: 'tag-2' }
      ]
    }
  }
});

// Добавить тег к товару
const product = await prisma.product.update({
  where: { id: 'prod-123' },
  data: {
    tags: {
      connect: { id: 'tag-3' }
    }
  }
});
```

---

## Миграции

### 📖 Что такое миграции

**Миграции** - это способ управления изменениями в структуре БД. Они:
- Отслеживают изменения schema
- Позволяют откатывать изменения
- Синхронизируют БД с кодом

### 🔧 Команды миграций

```bash
# Создать миграцию
npx prisma migrate dev --name add_products_table

# Применить миграции
npx prisma migrate deploy

# Откатить последнюю миграцию
npx prisma migrate resolve --rolled-back migration_name

# Просмотреть статус миграций
npx prisma migrate status

# Сгенерировать Prisma Client
npx prisma generate
```

### 📋 Пример миграции

```sql
-- migration.sql
-- CreateTable products
CREATE TABLE "products" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "price" DECIMAL(65,30) NOT NULL,
  "categoryId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "products_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "products_slug_key" ON "products"("slug");
```

---

## Практические примеры

### Пример 1: Получить все товары с категориями

```typescript
// Prisma
const products = await prisma.product.findMany({
  include: { category: true },
  orderBy: { createdAt: 'desc' }
});

// Эквивалент SQL
SELECT p.*, c.* FROM products p
INNER JOIN categories c ON p.categoryId = c.id
ORDER BY p.createdAt DESC;
```

### Пример 2: Получить товары по категории с пагинацией

```typescript
// Prisma
const page = 1;
const limit = 10;
const skip = (page - 1) * limit;

const [products, total] = await Promise.all([
  prisma.product.findMany({
    where: { categoryId: 'cat-123' },
    skip,
    take: limit,
    include: { category: true }
  }),
  prisma.product.count({
    where: { categoryId: 'cat-123' }
  })
]);

// Эквивалент SQL
SELECT * FROM products 
WHERE categoryId = 'cat-123'
LIMIT 10 OFFSET 0;

SELECT COUNT(*) FROM products 
WHERE categoryId = 'cat-123';
```

### Пример 3: Создать товар с категорией

```typescript
// Prisma
const product = await prisma.product.create({
  data: {
    name: 'New Product',
    price: 100,
    category: {
      connect: { id: 'cat-123' }
    }
  },
  include: { category: true }
});

// Эквивалент SQL
INSERT INTO products (name, price, categoryId)
VALUES ('New Product', 100, 'cat-123');
```

### Пример 4: Обновить цену товара

```typescript
// Prisma
const product = await prisma.product.update({
  where: { id: 'prod-123' },
  data: { price: 150 }
});

// Эквивалент SQL
UPDATE products SET price = 150 WHERE id = 'prod-123';
```

### Пример 5: Удалить товар

```typescript
// Prisma
const product = await prisma.product.delete({
  where: { id: 'prod-123' }
});

// Эквивалент SQL
DELETE FROM products WHERE id = 'prod-123';
```

### Пример 6: Получить статистику по категориям

```typescript
// Prisma
const stats = await prisma.category.findMany({
  include: {
    _count: {
      select: { products: true }
    }
  }
});

// Эквивалент SQL
SELECT c.*, COUNT(p.id) as productCount
FROM categories c
LEFT JOIN products p ON c.id = p.categoryId
GROUP BY c.id;
```

---

## Диаграммы

### Архитектура Prisma

```
TypeScript код
    ↓
Prisma Client
    ↓
Prisma Engine
    ↓
SQL запрос
    ↓
PostgreSQL
    ↓
Результат
    ↓
TypeScript объект
```

### Жизненный цикл запроса с Prisma

```
1. Вызов Prisma метода
   prisma.product.findMany()
   ↓
2. Prisma преобразует в SQL
   SELECT * FROM products
   ↓
3. PostgreSQL выполняет запрос
   ↓
4. Результат возвращается
   ↓
5. Prisma преобразует в TypeScript объект
   Product[]
   ↓
6. Возвращается в код
```

### Отношения между таблицами

```
┌──────────────┐
│  Categories  │
├──────────────┤
│ id (PK)      │
│ name         │
│ slug         │
└──────────────┘
       │
       │ One-to-Many
       │
       ▼
┌──────────────┐
│   Products   │
├──────────────┤
│ id (PK)      │
│ name         │
│ price        │
│ categoryId (FK)
└──────────────┘
```

---

## Ключевые моменты

✅ SQL - язык для работы с БД
✅ PostgreSQL - мощная реляционная БД
✅ Prisma - ORM для удобной работы с БД
✅ Schema - описание структуры БД
✅ CRUD - основные операции с данными
✅ Отношения - связи между таблицами
✅ Миграции - управление изменениями БД

---

## Следующие шаги

1. Прочитайте **DOCKER_CONTAINERIZATION.md** - поймите как запускается приложение
2. Прочитайте **LAYERED_ARCHITECTURE_EXPLAINED.md** - разберитесь с каждым слоем
3. Прочитайте **PRACTICAL_EXAMPLES.md** - практикуйтесь с примерами
