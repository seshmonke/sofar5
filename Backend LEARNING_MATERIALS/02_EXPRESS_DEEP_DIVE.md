# 🚀 Express.js - Полное руководство

## Содержание
1. [Что такое Express.js](#что-такое-expressjs)
2. [Основные концепции](#основные-концепции)
3. [Middleware система](#middleware-система)
4. [Маршруты и обработчики](#маршруты-и-обработчики)
5. [Обработка ошибок](#обработка-ошибок)
6. [CORS и безопасность](#cors-и-безопасность)
7. [Практические примеры](#практические-примеры)

---

## Что такое Express.js

### 📖 Определение

**Express.js** - это минималистичный веб-фреймворк для Node.js, который упрощает создание веб-приложений и API.

### 🎯 Зачем нужен Express

Без Express вам пришлось бы писать:
```javascript
// Без Express - очень сложно
const http = require('http');

const server = http.createServer((req, res) => {
  if (req.url === '/api/products' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ data: [] }));
  } else if (req.url === '/api/products' && req.method === 'POST') {
    // Обработка POST
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

server.listen(3000);
```

С Express это становится просто:
```typescript
// С Express - очень просто
const app = express();

app.get('/api/products', (req, res) => {
  res.json({ data: [] });
});

app.post('/api/products', (req, res) => {
  // Обработка POST
});

app.listen(3000);
```

### ✨ Преимущества Express

- **Простота** - минимум кода
- **Гибкость** - можно добавлять любые middleware
- **Производительность** - быстрый и легкий
- **Экосистема** - много готовых решений
- **Популярность** - большое сообщество

---

## Основные концепции

### 1️⃣ Приложение (App)

**Что это:** Основной объект Express, который управляет всем

```typescript
import express from 'express';

const app = express();

// Теперь можно добавлять middleware и маршруты
app.use(express.json());
app.get('/api/products', (req, res) => {
  res.json({ data: [] });
});

app.listen(3000);
```

**В вашем проекте:**
```typescript
// src/app.ts
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(corsMiddleware);
app.use('/api', apiRoutes);

export default app;
```

### 2️⃣ Запрос (Request)

**Что это:** Объект, содержащий информацию о запросе от клиента

```typescript
app.get('/api/products/:id', (req, res) => {
  // req.params - параметры из URL
  console.log(req.params.id); // "123"
  
  // req.query - параметры из query string
  console.log(req.query.page); // "1"
  
  // req.body - тело запроса (JSON)
  console.log(req.body); // { name: "Product" }
  
  // req.headers - заголовки запроса
  console.log(req.headers['content-type']); // "application/json"
  
  // req.method - HTTP метод
  console.log(req.method); // "GET"
  
  // req.path - путь запроса
  console.log(req.path); // "/api/products/123"
});
```

### 3️⃣ Ответ (Response)

**Что это:** Объект для отправки ответа клиенту

```typescript
app.get('/api/products', (req, res) => {
  // res.json() - отправить JSON
  res.json({ data: [] });
  
  // res.status() - установить статус код
  res.status(200).json({ data: [] });
  
  // res.send() - отправить текст
  res.send('Hello World');
  
  // res.redirect() - перенаправить
  res.redirect('/api/products');
  
  // res.setHeader() - установить заголовок
  res.setHeader('X-Custom-Header', 'value');
  
  // res.end() - завершить ответ
  res.end();
});
```

### 4️⃣ Обработчик (Handler)

**Что это:** Функция, которая обрабатывает запрос

```typescript
// Обработчик - это функция с тремя параметрами
const handler = (req, res, next) => {
  // req - запрос
  // res - ответ
  // next - функция для передачи управления дальше
  
  res.json({ data: [] });
};

app.get('/api/products', handler);
```

---

## Middleware система

### 📖 Что такое Middleware

**Middleware** - это функция, которая обрабатывает запрос и может:
- Обработать запрос
- Изменить запрос или ответ
- Завершить запрос
- Передать управление следующему middleware

### 🔄 Как работает Middleware

```
Запрос приходит
    ↓
Middleware 1 обрабатывает
    ���
Middleware 2 обрабатывает
    ↓
Middleware 3 обрабатывает
    ↓
Обработчик маршрута
    ↓
Ответ отправляется
```

### 💻 Структура Middleware

```typescript
// Middleware - это функция с тремя параметрами
const middleware = (req, res, next) => {
  // Обработка запроса
  console.log(`${req.method} ${req.path}`);
  
  // Передача управления дальше
  next();
};

// Добавление middleware
app.use(middleware);
```

### 📋 Порядок выполнения Middleware

**ВАЖНО:** Middleware выполняются в порядке, в котором они добавлены!

```typescript
// Порядок выполнения: 1 → 2 → 3 → обработчик → ответ

app.use(middleware1); // 1️⃣ Выполнится первым
app.use(middleware2); // 2️⃣ Выполнится вторым
app.use(middleware3); // 3️⃣ Выполнится третьим

app.get('/api/products', (req, res) => {
  // 4️⃣ Выполнится четвёртым
  res.json({ data: [] });
});
```

### 🔍 Примеры Middleware в вашем проекте

#### Middleware 1: JSON парсинг

```typescript
// src/app.ts
app.use(express.json());
```

**Что делает:**
- Парсит JSON из тела запроса
- Заполняет `req.body`

**Пример:**
```typescript
// Клиент отправляет:
// POST /api/products
// Content-Type: application/json
// { "name": "Product", "price": 100 }

app.post('/api/products', (req, res) => {
  console.log(req.body); // { name: "Product", price: 100 }
  res.json({ success: true });
});
```

#### Middleware 2: CORS

```typescript
// src/middleware/cors.ts
export const corsMiddleware = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
};

// src/app.ts
app.use(corsMiddleware);
```

**Что делает:**
- Разрешает запросы с других доменов
- Добавляет необходимые заголовки

**Почему нужен:**
- Фронтенд на `localhost:5173`
- Бэкенд на `localhost:3000`
- Без CORS фронтенд не может отправлять запросы на бэкенд

#### Middleware 3: Логирование

```typescript
// src/app.ts
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});
```

**Что делает:**
- Логирует каждый запрос
- Помогает отладке

**Пример логов:**
```
GET /api/products
POST /api/products
GET /api/products/123
PUT /api/products/123
DELETE /api/products/123
```

#### Middleware 4: Обработка ошибок

```typescript
// src/middleware/errorHandler.ts
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error('Error occurred:', err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
    });
  }

  res.status(500).json({
    success: false,
    error: 'Внутренняя ошибка сервера',
  });
};

// src/app.ts
app.use(errorHandler); // ДОЛЖЕН быть последним!
```

**Что делает:**
- Ловит все ошибки
- Преобразует их в JSON ответ

**ВАЖНО:** Error handler должен быть **последним** middleware!

### ⚠️ Правила Middleware

1. **Порядок имеет значение** - middleware выполняются в порядке добавления
2. **Вызовите next()** - чтобы передать управление дальше
3. **Error handler последний** - должен быть добавлен в конце
4. **Не забывайте next()** - если забыть, запрос зависнет

---

## Маршруты и обработчики

### 📖 Что такое маршрут

**Маршрут** - это связь между URL и обработчиком

```typescript
app.METHOD(PATH, HANDLER);

// Примеры:
app.get('/api/products', handler);      // GET
app.post('/api/products', handler);     // POST
app.put('/api/products/:id', handler);  // PUT
app.delete('/api/products/:id', handler); // DELETE
```

### 🔍 HTTP методы

| Метод | Назначение | Пример |
|-------|-----------|--------|
| **GET** | Получить данные | `GET /api/products` |
| **POST** | Создать данные | `POST /api/products` |
| **PUT** | Обновить данные | `PUT /api/products/123` |
| **DELETE** | Удалить данные | `DELETE /api/products/123` |
| **PATCH** | Частичное обновление | `PATCH /api/products/123` |

### 📍 Параметры маршрута

#### 1. Path параметры (в URL)

```typescript
// Определение маршрута с параметром
app.get('/api/products/:id', (req, res) => {
  const id = req.params.id;
  res.json({ id });
});

// Запрос: GET /api/products/123
// Результат: { "id": "123" }
```

#### 2. Query параметры (после ?)

```typescript
// Определение маршрута
app.get('/api/products', (req, res) => {
  const page = req.query.page;
  const limit = req.query.limit;
  res.json({ page, limit });
});

// Запрос: GET /api/products?page=1&limit=10
// Результат: { "page": "1", "limit": "10" }
```

#### 3. Body параметры (в теле запроса)

```typescript
// Определение маршрута
app.post('/api/products', (req, res) => {
  const name = req.body.name;
  const price = req.body.price;
  res.json({ name, price });
});

// Запрос: POST /api/products
// Body: { "name": "Product", "price": 100 }
// Результат: { "name": "Product", "price": 100 }
```

### 🔗 Маршруты в вашем проекте

```typescript
// src/routes/products.ts
router.get('/', (req, res, next) => productController.getAllProducts(req, res, next));
router.get('/:id', (req, res, next) => productController.getProductById(req, res, next));
router.post('/', (req, res, next) => productController.createProduct(req, res, next));
router.put('/:id', (req, res, next) => productController.updateProduct(req, res, next));
router.delete('/:id', (req, res, next) => productController.deleteProduct(req, res, next));

// src/app.ts
app.use('/api', apiRoutes);

// Итоговые маршруты:
// GET /api/products
// GET /api/products/:id
// POST /api/products
// PUT /api/products/:id
// DELETE /api/products/:id
```

---

## Обработка ошибок

### 📖 Как работает обработка ошибок

```
Обработчик выбрасывает ошибку
    ↓
Ловится в try-catch
    ↓
Передаётся в next(error)
    ↓
Error handler ловит ошибку
    ↓
Отправляет JSON ответ
```

### 💻 Пример обработки ошибок

```typescript
// src/controllers/productController.ts
async getAllProducts(req: Request, res: Response, next: NextFunction) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await productService.getAllProducts(page, limit);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error); // Передаёт ошибку в error handler
  }
}

// src/middleware/errorHandler.ts
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
    });
  }

  res.status(500).json({
    success: false,
    error: 'Внутренняя ошибка сервера',
  });
};
```

### 🎯 Типы ошибок в вашем проекте

```typescript
// src/errors/AppError.ts

// Базовая ошибка
class AppError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
  }
}

// Ошибка валидации (400)
class ValidationError extends AppError {
  constructor(message: string) {
    super(400, message);
  }
}

// Ошибка не найдено (404)
class NotFoundError extends AppError {
  constructor(message: string = 'Ресурс не найден') {
    super(404, message);
  }
}

// Ошибка не авторизован (401)
class UnauthorizedError extends AppError {
  constructor(message: string = 'Не авторизован') {
    super(401, message);
  }
}

// Ошибка доступ запрещен (403)
class ForbiddenError extends AppError {
  constructor(message: string = 'Доступ запрещен') {
    super(403, message);
  }
}
```

### 📊 HTTP статус коды

| Код | Значение | Пример |
|-----|----------|--------|
| **200** | OK | Успешный запрос |
| **201** | Created | Ресурс создан |
| **400** | Bad Request | Ошибка валидации |
| **401** | Unauthorized | Не авторизован |
| **403** | Forbidden | Доступ запрещен |
| **404** | Not Found | Ресурс не найден |
| **500** | Internal Server Error | Ошибка сервера |

---

## CORS и безопасность

### 📖 Что такое CORS

**CORS (Cross-Origin Resource Sharing)** - механизм, который позволяет веб-приложениям на одном домене получать доступ к ресурсам на другом домене.

### 🔒 Проблема CORS

```
Фронтенд: http://localhost:5173
Бэкенд:   http://localhost:3000

Без CORS фронтенд не может отправлять запросы на бэкенд!
```

### ✅ Решение CORS

```typescript
// src/middleware/cors.ts
export const corsMiddleware = (req, res, next) => {
  // Разрешить запросы с любого источника
  res.header('Access-Control-Allow-Origin', '*');
  
  // Разрешить методы
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  
  // Разрешить заголовки
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Обработать preflight запрос
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
};

// src/app.ts
app.use(corsMiddleware);
```

### 🔐 Безопасность

**ВАЖНО:** В production используйте более строгие правила:

```typescript
// Production версия
export const corsMiddleware = (req, res, next) => {
  const allowedOrigins = [
    'https://example.com',
    'https://www.example.com'
  ];
  
  const origin = req.headers.origin;
  
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
};
```

---

## Практические примеры

### Пример 1: Простой GET запрос

```typescript
// Определение маршрута
app.get('/api/products', (req, res) => {
  res.json({
    success: true,
    data: [
      { id: 1, name: 'Product 1', price: 100 },
      { id: 2, name: 'Product 2', price: 200 }
    ]
  });
});

// Запрос: GET /api/products
// Ответ: HTTP 200
// {
//   "success": true,
//   "data": [...]
// }
```

### Пример 2: GET с параметрами

```typescript
// Определение маршрута
app.get('/api/products/:id', (req, res) => {
  const id = req.params.id;
  res.json({
    success: true,
    data: { id, name: 'Product', price: 100 }
  });
});

// Запрос: GET /api/products/123
// Ответ: HTTP 200
// {
//   "success": true,
//   "data": { "id": "123", "name": "Product", "price": 100 }
// }
```

### Пример 3: POST с телом запроса

```typescript
// Определение маршрута
app.post('/api/products', (req, res) => {
  const { name, price } = req.body;
  
  // Валидация
  if (!name || !price) {
    return res.status(400).json({
      success: false,
      error: 'Требуются поля: name, price'
    });
  }
  
  res.status(201).json({
    success: true,
    data: { id: 1, name, price },
    message: 'Продукт создан'
  });
});

// Запрос: POST /api/products
// Body: { "name": "Product", "price": 100 }
// Ответ: HTTP 201
// {
//   "success": true,
//   "data": { "id": 1, "name": "Product", "price": 100 },
//   "message": "Продукт создан"
// }
```

### Пример 4: Обработка ошибок

```typescript
// Определение маршрута
app.get('/api/products/:id', (req, res, next) => {
  try {
    const id = req.params.id;
    
    // Валидация
    if (!id) {
      throw new ValidationError('ID не может быть пустым');
    }
    
    // Поиск продукта
    const product = findProductById(id);
    
    if (!product) {
      throw new NotFoundError(`Продукт с ID ${id} не найден`);
    }
    
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error); // Передаёт ошибку в error handler
  }
});

// Запрос: GET /api/products/999
// Ответ: HTTP 404
// {
//   "success": false,
//   "error": "Продукт с ID 999 не найден"
// }
```

### Пример 5: Middleware для логирования

```typescript
// Создание middleware
const loggingMiddleware = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);
  });
  
  next();
};

// Добавление middleware
app.use(loggingMiddleware);

// Логи:
// GET /api/products - 200 - 45ms
// POST /api/products - 201 - 120ms
// GET /api/products/123 - 404 - 30ms
```

---

## Диаграммы

### Жизненный цикл запроса в Express

```
1. Запрос приходит на сервер
   ↓
2. Express получает запрос
   ↓
3. Middleware 1 обрабатывает (express.json)
   ↓
4. Middleware 2 обрабатывает (corsMiddleware)
   ↓
5. Middleware 3 обрабатывает (логирование)
   ↓
6. Router находит подходящий маршрут
   ↓
7. Обработчик маршрута выполняется
   ↓
8. Если ошибка → next(error)
   ↓
9. Error handler ловит ошибку
   ↓
10. Ответ отправляется клиенту
```

### Структура Express приложения

```
express()
  ├── app.use(middleware1)
  ├── app.use(middleware2)
  ├── app.use(middleware3)
  ├── app.get('/api/products', handler)
  ├── app.post('/api/products', handler)
  ├── app.put('/api/products/:id', handler)
  ├── app.delete('/api/products/:id', handler)
  ├── app.use(errorHandler)
  └── app.listen(3000)
```

---

## Ключевые моменты

✅ Express - это фреймворк для создания веб-приложений
✅ Middleware - функции, которые обрабатывают запросы
✅ Порядок middleware имеет значение
✅ Маршруты связывают URL с обработчиками
✅ Обработка ошибок - важная часть приложения
✅ CORS нужен для кроссдоменных запросов
✅ Error handler должен быть последним middleware

---

## Следующие шаги

1. Прочитайте **LAYERED_ARCHITECTURE_EXPLAINED.md** - разберитесь с каждым слоем
2. Прочитайте **PRISMA_POSTGRESQL_GUIDE.md** - поймите работу с БД
3. Прочитайте **PRACTICAL_EXAMPLES.md** - практикуйтесь с примерами
