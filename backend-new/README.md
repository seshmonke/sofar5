# Assorti Shop Backend

Backend для Telegram Mini App интернет-магазина на Express.js и TypeScript.

## Требования

- Node.js 18+
- PostgreSQL 12+
- npm или yarn

## Установка

1. Клонируйте репозиторий и перейдите в папку:
```bash
cd backend-new
```

2. Установите зависимости:
```bash
npm install
```

3. Создайте файл `.env` на основе `.env.example`:
```bash
cp .env.example .env
```

4. Обновите переменные окружения в `.env`:
```
DATABASE_URL=postgresql://user:password@localhost:5432/assorti_shop
TELEGRAM_BOT_TOKEN=your_bot_token
```

5. Создайте базу данных и выполните миграции:
```bash
npm run prisma:migrate
```

## Запуск

### Разработка
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

## API Endpoints

### Публичные маршруты
- `GET /api/products` - Получить все товары
- `GET /api/products/:id` - Получить товар по ID
- `GET /api/products/category/:categoryId` - Получить товары по категории
- `GET /api/categories` - Получить все категории
- `GET /api/categories/:id` - Получить категорию по ID

### Защищённые маршруты (требуют Telegram авторизацию)
- `POST /api/orders` - Создать заказ
- `GET /api/orders` - Получить заказы пользователя
- `GET /api/orders/:id` - Получить заказ по ID

## Структура проекта

```
src/
├── main.ts              # Точка входа
├── app.ts               # Конфигурация Express
├── controllers/         # Бизнес-логика
├── routes/              # API маршруты
├── middleware/          # Middleware функции
└── types/               # TypeScript типы

prisma/
├── schema.prisma        # Схема БД
└── migrations/          # Миграции БД
```

## Разработка

### Линтинг
```bash
npm run lint
```

### Prisma Studio
```bash
npm run prisma:studio
```

## Лицензия

ISC
