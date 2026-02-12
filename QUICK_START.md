# 🚀 AssortiShop - Быстрый старт

Полный проект с Frontend и Backend для асортиментного магазина.

## 📦 Что создано

### ✅ Frontend (my-app/)
- React 19 + Redux Toolkit
- React Router для навигации
- Bootstrap для стилей
- TypeScript для типизации
- Vite для быстрой разработки

### ✅ Backend (backend/)
- Node.js + Express.js
- TypeScript для типизации
- PostgreSQL + Prisma ORM
- Docker + Docker Compose
- Слоистая архитектура (Controllers → Services → Repositories)
- CORS, обработка ошибок, логи��ование

---

## 🚀 Быстрый старт

### Вариант 1: С Docker (РЕКОМЕНДУЕТСЯ)

#### Шаг 1: Запустите Backend с БД

```bash
cd backend
docker-compose up
```

Это запустит:
- PostgreSQL на порту 5432
- Backend на порту 3000

#### Шаг 2: В другом терминале запустите миграции БД

```bash
cd backend
docker-compose exec backend npm run prisma:migrate
```

#### Шаг 3: Запустите Frontend

```bash
cd my-app
npm install
npm run dev
```

Frontend будет доступен на `http://localhost:5173`

#### Шаг 4: Проверьте, что всё работает

```bash
# Health check Backend
curl http://localhost:3000/api/health

# Должен вернуть:
# {"status":"OK","timestamp":"2026-02-12T10:30:00.000Z"}
```

---

### Вариант 2: Локальная установка

#### Backend

```bash
cd backend

# Установите завис��мости
npm install

# Создайте .env файл
cp .env.example .env

# Отредактируйте .env с вашими данными PostgreSQL
# DATABASE_URL="postgresql://user:password@localhost:5432/assortiShop"

# Запустите миграции
npm run prisma:migrate

# Запустите сервер
npm run dev
```

#### Frontend

```bash
cd my-app

# Установите зависимости
npm install

# Запустите сервер разработки
npm run dev
```

---

## 📁 Структура проекта

```
version-five/
├── my-app/                    # Frontend (React + Redux)
│   ├── src/
│   │   ├── components/        # React компоненты
│   │   ├── pages/             # Страницы приложения
│   │   ├── store/             # Redux store
│   │   ├── types/             # TypeScript типы
│   │   └── data/              # Данные
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                   # Backend (Node.js + Express)
│   ├── src/
│   │   ├── controllers/       # Обработчики запросов
│   │   ├── services/          # Бизнес-логика
│   │   ├── repositories/      # Работа с БД
│   │   ├── routes/            # API маршруты
│   │   ├── middleware/        # Middleware
│   │   ├── config/            # Конфигурация
│   │   ├── types/             # TypeScript типы
│   │   ├── utils/             # Утилиты
│   │   └── errors/            # Кастомные ошибки
│   ├── prisma/
│   │   └── schema.prisma      # Схема БД
│   ├── docker/
│   │   └── Dockerfile
│   ├── docker-compose.yml
│   ├── package.json
│   └── tsconfig.json
│
├── BACKEND_SETUP.md           # Подробное руководство Backend
├── QUICK_START.md             # Этот файл
└── README.md
```

---

## 🔌 API Endpoints

### Health Check
```
GET http://localhost:3000/api/health
```

### Products
```
GET    http://localhost:3000/api/products              # Все продукты
GET    http://localhost:3000/api/products/:id          # Продукт по ID
POST   http://localhost:3000/api/products              # Создать
PUT    http://localhost:3000/api/products/:id          # Обновить
DELETE http://localhost:3000/api/products/:id          # Удалить
```

### Пагинация
```
GET http://localhost:3000/api/products?page=1&limit=10
```

---

## 📝 Полезные команды

### Frontend (my-app/)
```bash
npm run dev              # Запуск в режиме разработки
npm run build            # Сборка для продакшена
npm run preview          # Просмотр собранного приложения
npm run lint             # Проверка кода
```

### Backend (backend/)
```bash
npm run dev              # Запуск в режиме разработки (hot reload)
npm run build            # Компиляция TypeScript
npm start                # Запуск скомпилированного приложения
npm run lint             # Проверка кода
npm run prisma:migrate  # Запуск миграций БД
npm run prisma:studio   # Открыть Prisma Studio (UI для БД)
npm run prisma:generate # Генерация Prisma клиента
```

### Docker
```bash
docker-compose up       # Запуск контейнеров
docker-compose down     # Остановка контейнеров
docker-compose logs -f  # Просмотр логов
docker-compose restart  # Перезагрузка контейнеров
```

---

## 🏗️ Архитектура Backend

```
HTTP Request
    ↓
[Routes] - определяют маршруты
    ↓
[Controllers] - обрабатывают запросы
    ↓
[Services] - содержат бизнес-логику
    ↓
[Repositories] - работают с БД
    ↓
[PostgreSQL Database]
```

### Слои

1. **Routes** (`src/routes/`)
   - Определяют API endpoints
   - Маршрутизируют запросы

2. **Controllers** (`src/controllers/`)
   - Обрабатывают HTTP запросы
   - Валидируют данные

3. **Services** (`src/services/`)
   - Содержат бизнес-логику
   - Обрабатывают ошибки

4. **Repositories** (`src/repositories/`)
   - Работают с БД через Prisma
   - Выполняют CRUD операции

---

## 🗄️ Модели БД

### Category (Категории)
- id, name, slug, description, image, createdAt, updatedAt

### Product (Продукты)
- id, name, slug, description, price, image, stock, categoryId, createdAt, updatedAt

### User (Пользователи)
- id, email, name, password, role, createdAt, updatedAt

### Cart (Корзины)
- id, userId, createdAt, updatedAt

### CartItem (Товары в корзине)
- id, cartId, productId, quantity, createdAt, updatedAt

---

## 🐛 Обработка ошибок

Backend использует кастомные классы ошибок:

```typescript
ValidationError(400)      // Ошибка валидации
NotFoundError(404)        // Ресурс не найден
UnauthorizedError(401)    // Не авторизован
ForbiddenError(403)       // Доступ запрещен
```

---

## 🔧 Переменные окружения

### Backend (.env)
```
DATABASE_URL="postgresql://user:password@localhost:5432/assortiShop"
DB_USER=user
DB_PASSWORD=password
DB_NAME=assortiShop
PORT=3000
NODE_ENV=development
API_URL=http://localhost:3000
FRONTEND_URL=http://localhost:5173
```

---

## 📚 Документация

- **Backend подробно**: см. `backend/README.md` и `BACKEND_SETUP.md`
- **Backend структура**: см. `backend/STRUCTURE.txt`
- **Frontend**: см. `my-app/README.md`

---

## 🎯 Следующие шаги

1. **Запустите проект** с Docker или локально
2. **Откройте Prisma Studio** для управления БД:
   ```bash
   cd backend
   npm run prisma:studio
   ```
3. **Добавьте данные** в БД через Prisma Studio
4. **Проверьте API** через curl или Postman
5. **Подключите Frontend** к Backend API

---

## 🚨 Решение проблем

### Docker не запускается
```bash
# Проверьте, что Docker установлен
docker --version

# Проверьте, что порты свободны
lsof -i :3000
lsof -i :5432
```

### Ошибка подключения к БД
```bash
# Проверьте переменные в .env
cat backend/.env

# Проверьте, что PostgreSQL запущен
docker-compose ps
```

### Миграции не работают
```bash
# Пересоздайте контейнеры
docker-compose down -v
docker-compose up
docker-compose exec backend npm run prisma:migrate
```

---

## 📞 Контакты и поддержка

Если у вас есть вопросы, обратитесь к документации:
- Express.js: https://expressjs.com/
- Prisma: https://www.prisma.io/docs/
- React: https://react.dev/
- Docker: https://docs.docker.com/

---

## 🎉 Готово!

Ваш полный проект асортиментного магазина готов к разработке!

**Начните с:**
```bash
cd backend
docker-compose up
```

Удачи! 🚀
