# Быстрый старт

## 1. Подготовка окружения

```bash
# Скопируйте .env.example в .env
cp .env.example .env

# Отредактируйте .env с вашими данными:
# - DATABASE_URL: строка подключения к PostgreSQL
# - TELEGRAM_BOT_TOKEN: токен вашего Telegram бота
```

## 2. Инициализация БД

```bash
# Создайте миграции Prisma
npm run prisma:migrate

# (Опционально) Откройте Prisma Studio для управления БД
npm run prisma:studio
```

## 3. Запуск приложения

### Разработка (с автоперезагрузкой)
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

Сервер запустится на `http://localhost:3000`

## 4. Проверка здоровья

```bash
curl http://localhost:3000/api/health
```

Должен вернуть: `{"status":"ok"}`

## Структура API

### Публичные endpoints
- `GET /api/products` - все товары
- `GET /api/products/:id` - товар по ID
- `GET /api/products/category/:categoryId` - товары категории
- `GET /api/categories` - все категории
- `GET /api/categories/:id` - категория по ID

### Защищённые endpoints (требуют Telegram авторизацию)
- `POST /api/orders` - создать заказ
- `GET /api/orders` - заказы пользователя
- `GET /api/orders/:id` - заказ по ID

Передавайте Telegram initData в заголовке: `x-telegram-init-data`

## Полезные команды

```bash
npm run lint          # Проверка кода
npm run build         # Компиляция TypeScript
npm run prisma:studio # Управление БД через UI
```
