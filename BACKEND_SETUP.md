# 🚀 Backend Setup Guide

Полное руководство по настройке и запуску Backend проекта AssortiShop.

## 📋 Содержание

1. [Структура проекта](#структура-проекта)
2. [Быстрый старт с Docker](#быстрый-старт-с-docker)
3. [Локальная установка](#локальная-установка)
4. [Команды для разработки](#команды-для-разработки)
5. [API Endpoints](#api-endpoints)
6. [Архитектура](#архитектура)

---

## 📁 Структура проекта

```
version-five/
├── my-app/                          # Frontend (React + Redux)
│   ├── src/
│   ├── package.json
│   └── ...
│
└── backend/                         # Backend (Node.js + Express + Prisma)
    ├── src/
    │   ├── main.ts                  # Точка входа
    │   ├── app.ts                   # Конфигурация Express
    │   ├── config/                  # Конфигурация
    │   │   ├── env.ts               # Переменные окружения
    │   │   └── constants.ts         # Константы
    │   ├── controllers/             # Обработчики запросов
    │   │   └── productController.ts
    │   ├── services/                # Бизнес-логика
    │   │   └── productService.ts
    │   ├── repositories/            # Работа с БД
    │   │   └── productRepository.ts
    │   ├── routes/                  # API маршруты
    │   │   ├── index.ts
    │   │   └── products.ts
    │   ├── middleware/              # Middleware
    │   │   ├── errorHandler.ts
    │   │   └── cors.ts
    │   ├── types/                   # TypeScript типы
    │   ├── utils/                   # Утилиты
    │   └── errors/                  # Кастомные ошибки
    ├── prisma/
    │   └── schema.prisma            # Схема БД
    ├── docker/
    │   ├── Dockerfile
    │   └── .dockerignore
    ├── docker-compose.yml           # Docker Compose
    ├── .env                         # Переменные окружения
    ├── .env.example                 # Пример .env
    ├── package.json
    ├── tsconfig.json
    ├── eslint.config.js
    └── README.md
```

---

## 🐳 Быстрый старт с Docker (РЕКОМЕНДУЕТСЯ)

### Шаг 1: Перейдите в папку backend

```bash
cd backend
```

### Шаг 2: Убедитесь, что .env файл существует

```bash
# Если файла нет, скопируйте из примера
cp .env.example .env
```

### Шаг 3: Запустите Docker Compose

```bash
docker-compose up
```

Это запустит:
- ✅ PostgreSQL базу данных на порту 5432
- ✅ Backend приложение на порту 3000

### Шаг 4: В другом терминале запустите миграции

```bash
cd backend
docker-compose exec backend npm run prisma:migrate
```

### Шаг 5: Проверьте, что всё работает

```bash
# Health check
curl http://localhost:3000/api/health

# Должен вернуть:
# {"status":"OK","timestamp":"2026-02-12T10:30:00.000Z"}
```

### Остановка Docker

```bash
docker-compose down
```

---

## 💻 Локальная установка

### Требования

- Node.js 18+ ([скачать](https://nodejs.org/))
- PostgreSQL 14+ ([скачать](https://www.postgresql.org/download/))
- npm или yarn

### Шаг 1: Установите зависимости

```bash
cd backend
npm install
```

### Шаг 2: Создайте .env файл

```bash
cp .env.example .env
```

### Шаг 3: Отредактируйте .env

Откройте `.env` и установите правильное подключение к БД:

```env
DATABASE_URL="postgresql://ваш_пользователь:ваш_пароль@localhost:5432/assortiShop"
PORT=3000
NODE_ENV=development
```

### Шаг 4: Запустите миграции Prisma

```bash
npm run prisma:migrate
```

Это создаст таблицы в БД.

### Шаг 5: Запустите сервер

```bash
npm run dev
```

Сервер будет доступен на `http://localhost:3000`

---

## 📝 Команды для разработки

### Разработка

```bash
# Запуск с hot reload (автоперезагрузка при изменении файлов)
npm run dev
```

### Сборка и запуск

```bash
# Компиляция TypeScript в JavaScript
npm run build

# Запуск скомпилированного приложения
npm start
```

### Prisma

```bash
# Генерация Prisma клиента (обычно автоматически)
npm run prisma:generate

# Создание новой миграции и применение её
npm run prisma:migrate

# Открыть Prisma Studio (визуальный редактор БД)
npm run prisma:studio
```

### Качество кода

```bash
# Проверка кода с ESLint
npm run lint
```

---

## 🔌 API Endpoints

### Health Check

```
GET /api/health
```

Ответ:
```json
{
  "status": "OK",
  "timestamp": "2026-02-12T10:30:00.000Z"
}
```

### Products (Продукты)

#### Получить все продукты

```
GET /api/products?page=1&limit=10
```

Параметры:
- `page` - номер страницы (по умолчанию 1)
- `limit` - количество элементов (по умолчанию 10, максимум 100)

Ответ:
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "cuid123",
        "name": "Продукт 1",
        "price": 99.99,
        "stock": 10,
        "category": { "id": "cat1", "name": "Категория" }
      }
    ],
    "total": 50,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

#### Получить продукт по ID

```
GET /api/products/:id
```

#### Создать продукт

```
POST /api/products
Content-Type: application/json

{
  "name": "Новый продукт",
  "price": 99.99,
  "categoryId": "cat123",
  "description": "Описание",
  "stock": 10
}
```

#### Обновить продукт

```
PUT /api/products/:id
Content-Type: application/json

{
  "name": "Обновленное имя",
  "price": 149.99
}
```

#### Удалить продукт

```
DELETE /api/products/:id
```

---

## 🏗️ Архитектура

Проект использует **слоистую архитектуру** для чистоты кода и масштабируемости:

```
HTTP Request
    ↓
[Routes] - определяют маршруты
    ↓
[Controllers] - обрабатывают запросы
    ↓
[Services] - содержат бизнес-логику
    ↓
[Repositories] - работают с БД через Prisma
    ↓
[Database] - PostgreSQL
```

### Слои

1. **Routes** (`src/routes/`)
   - Определяют API endpoints
   - Маршрутизируют запросы к контроллерам

2. **Controllers** (`src/controllers/`)
   - Обрабатывают HTTP запросы
   - Валидируют входные данные
   - Вызывают сервисы

3. **Services** (`src/services/`)
   - Содержат бизнес-логику
   - Обрабатывают ошибки
   - Вызывают репозитории

4. **Repositories** (`src/repositories/`)
   - Работают с БД через Prisma
   - Выполняют CRUD операции
   - Изолируют логику БД

5. **Middleware** (`src/middleware/`)
   - CORS - кросс-доменные запросы
   - Error Handler - обработка ошибок

### Преимущества

✅ **Разделение ответственности** - каждый слой отвечает за свою задачу
✅ **Легкость тестирования** - можно мокировать каждый слой
✅ **Переиспользование кода** - сервисы используются в разных контроллерах
✅ **Масштабируемость** - легко добавлять новые функции
✅ **Чистота кода** - логика разделена по файлам

---

## 🗄️ Структура БД

### Categories (Категории)

```sql
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  image VARCHAR(255),
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);
```

### Products (Продукты)

```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image VARCHAR(255),
  stock INT DEFAULT 0,
  categoryId INT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);
```

### Users (Пользователи)

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);
```

### Carts (Корзины)

```sql
CREATE TABLE carts (
  id SERIAL PRIMARY KEY,
  userId VARCHAR(255) NOT NULL,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);
```

### CartItems (Товары в корзине)

```sql
CREATE TABLE cart_items (
  id SERIAL PRIMARY KEY,
  cartId INT NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
  productId VARCHAR(255) NOT NULL,
  quantity INT NOT NULL,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);
```

---

## 🐛 Обработка ошибок

Приложение использует кастомные классы ошибок:

```typescript
// ValidationError - ошибка валидации (400)
throw new ValidationError('Требуются поля: name, price');

// NotFoundError - ресурс не найден (404)
throw new NotFoundError('Продукт не найден');

// UnauthorizedError - не авторизован (401)
throw new UnauthorizedError('Требуется авторизация');

// ForbiddenError - доступ запрещен (403)
throw new ForbiddenError('Доступ запрещен');
```

---

## 📚 Полезные ссылки

- [Express.js документация](https://expressjs.com/)
- [Prisma документация](https://www.prisma.io/docs/)
- [PostgreSQL документация](https://www.postgresql.org/docs/)
- [TypeScript документация](https://www.typescriptlang.org/docs/)
- [Docker документация](https://docs.docker.com/)

---

## ❓ Часто задаваемые вопросы

### Q: Как подключиться к БД напрямую?

A: Используйте Prisma Studio:
```bash
npm run prisma:studio
```

### Q: Как добавить новый endpoint?

A: 
1. Создайте новый файл в `src/routes/`
2. Создайте контроллер в `src/controllers/`
3. Создайте сервис в `src/services/`
4. Создайте репозиторий в `src/repositories/`
5. Импортируйте маршрут в `src/routes/index.ts`

### Q: Как изменить схему БД?

A:
1. Отредактируйте `prisma/schema.prisma`
2. Запустите `npm run prisma:migrate`
3. Дайте имя миграции

### Q: Как перезагрузить Docker контейнеры?

A:
```bash
docker-compose restart
```

---

## 🎉 Готово!

Ваш Backend полностью настроен и готов к разработке! 

Начните с запуска:
```bash
docker-compose up
```

Удачи в разработке! 🚀
