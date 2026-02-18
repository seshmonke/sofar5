# 🔗 Интеграция фронтенда и бэкенда

## Содержание
1. [Основы интеграции](#основы-интеграции)
2. [Fetch API](#fetch-api)
3. [Обработка ответов](#обработка-ответов)
4. [Обработка ошибок](#обработка-ошибок)
5. [Практические примеры](#практические-примеры)

---

## Основы интеграции

### 📖 Что такое интеграция фронтенда и бэкенда

**Интеграция** - это процесс связи фронтенда (React) с бэкендом (Express) через HTTP запросы.

### 🎯 Как это работает

```
React компонент
    ↓ Пользователь кликает кнопку
    ↓ Отправляет HTTP запрос
    ↓
Express сервер
    ↓ Получает запрос
    ↓ Обрабатывает
    ↓ Отправляет ответ
    ↓
React компонент
    ↓ Получает ответ
    ↓ Обновляет UI
```

### ✨ Ключевые концепции

- **HTTP методы** - GET, POST, PUT, DELETE
- **URL** - адрес endpoint'а
- **Headers** - метаданные запроса
- **Body** - данные запроса
- **Status код** - код ответа (200, 404, 500 и т.д.)

---

## Fetch API

### 📖 Что такое Fetch API

**Fetch API** - это встроенный в браузер API для отправки HTTP запросов.

### 💻 Базовый синтаксис

```typescript
// Простой GET запрос
const response = await fetch('http://localhost:3000/api/products');
const data = await response.json();
```

### 🔍 Структура Fetch запроса

```typescript
const response = await fetch(url, {
  method: 'GET',              // HTTP метод
  headers: {                  // Заголовки
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(data), // Тело запроса (для POST, PUT)
});

const data = await response.json(); // Парсим JSON ответ
```

### 📋 HTTP методы

| Метод | Назначение | Пример |
|-------|-----------|--------|
| `GET` | Получить данные | Получить список товаров |
| `POST` | Создать данные | Создать новый товар |
| `PUT` | Обновить данные | Обновить товар |
| `DELETE` | Удалить данные | Удалить товар |

### 💻 Примеры Fetch запросов

#### GET запрос

```typescript
// Получить все товары
const response = await fetch('http://localhost:3000/api/products?page=1&limit=10');
const data = await response.json();
console.log(data);
```

#### POST запрос

```typescript
// Создать новый товар
const response = await fetch('http://localhost:3000/api/products', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'New Product',
    price: 100,
    categoryId: 'cat-1',
  }),
});
const data = await response.json();
console.log(data);
```

#### PUT запрос

```typescript
// Обновить товар
const response = await fetch('http://localhost:3000/api/products/prod-1', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'Updated Product',
    price: 150,
  }),
});
const data = await response.json();
console.log(data);
```

#### DELETE запрос

```typescript
// Удалить товар
const response = await fetch('http://localhost:3000/api/products/prod-1', {
  method: 'DELETE',
});
const data = await response.json();
console.log(data);
```

---

## Обработка ответов

### 📖 Что такое обработка ответов

**Обработка ответов** - это процесс получения и обработки данных, которые вернул сервер.

### 💻 Структура ответа

```typescript
const response = await fetch('http://localhost:3000/api/products');

// response.status - HTTP статус код (200, 404, 500 и т.д.)
console.log(response.status); // 200

// response.ok - true если статус 200-299
console.log(response.ok); // true

// response.headers - заголовки ответа
console.log(response.headers.get('content-type')); // application/json

// response.json() - парсит JSON тело
const data = await response.json();
console.log(data);
```

### 🔍 Проверка статуса ответа

```typescript
const response = await fetch('http://localhost:3000/api/products');

if (response.ok) {
  // Статус 200-299
  const data = await response.json();
  console.log('Success:', data);
} else if (response.status === 404) {
  // Статус 404
  console.log('Not found');
} else if (response.status === 500) {
  // Статус 500
  console.log('Server error');
} else {
  // Другой статус
  console.log('Error:', response.status);
}
```

### 📋 Успешный ответ

```json
HTTP 200 OK
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "prod-1",
        "name": "Product 1",
        "price": 100,
        "category": {
          "id": "cat-1",
          "name": "Category 1"
        }
      }
    ],
    "total": 50,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

### 📋 Ошибочный ответ

```json
HTTP 404 Not Found
{
  "success": false,
  "error": "Продукт с ID invalid-id не найден"
}
```

---

## Обработка ошибок

### 📖 Типы ошибок

**Есть два типа ошибок:**

1. **Сетевые ошибки** - нет соединения с сервером
2. **HTTP ошибки** - сервер вернул ошибку (404, 500 и т.д.)

### 💻 Обработка сетевых ошибок

```typescript
try {
  const response = await fetch('http://localhost:3000/api/products');
  const data = await response.json();
  console.log(data);
} catch (error) {
  // Сетевая ошибка
  console.error('Network error:', error.message);
}
```

### 💻 Обработка HTTP ошибок

```typescript
const response = await fetch('http://localhost:3000/api/products/invalid-id');

if (!response.ok) {
  // HTTP ошибка
  const error = await response.json();
  console.error('HTTP error:', error.error);
} else {
  const data = await response.json();
  console.log(data);
}
```

### 💻 Полная обработка ошибок

```typescript
async function fetchProducts() {
  try {
    const response = await fetch('http://localhost:3000/api/products');

    // Проверка сетевой ошибки
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Unknown error');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    // Обработка ошибки
    if (error instanceof TypeError) {
      console.error('Network error:', error.message);
    } else {
      console.error('Error:', error.message);
    }
    throw error;
  }
}
```

---

## Практические примеры

### Пример 1: Получить список товаров

```typescript
// src/api/products.ts
export async function getProducts(page: number = 1, limit: number = 10) {
  try {
    const response = await fetch(
      `http://localhost:3000/api/products?page=${page}&limit=${limit}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

// src/components/ProductList.tsx
import { useEffect, useState } from 'react';
import { getProducts } from '../api/products';

export function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        const data = await getProducts();
        setProducts(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {products.map((product) => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <p>Price: ${product.price}</p>
        </div>
      ))}
    </div>
  );
}
```

### Пример 2: Создать новый товар

```typescript
// src/api/products.ts
export async function createProduct(productData: any) {
  try {
    const response = await fetch('http://localhost:3000/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
}

// src/components/CreateProductForm.tsx
import { useState } from 'react';
import { createProduct } from '../api/products';

export function CreateProductForm() {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    categoryId: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      await createProduct({
        name: formData.name,
        price: parseFloat(formData.price),
        categoryId: formData.categoryId,
      });
      
      setSuccess(true);
      setFormData({ name: '', price: '', categoryId: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      {success && <div className="success">Product created!</div>}
      
      <input
        type="text"
        placeholder="Product name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />
      
      <input
        type="number"
        placeholder="Price"
        value={formData.price}
        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
      />
      
      <input
        type="text"
        placeholder="Category ID"
        value={formData.categoryId}
        onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
      />
      
      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Product'}
      </button>
    </form>
  );
}
```

### Пример 3: Обновить товар

```typescript
// src/api/products.ts
export async function updateProduct(id: string, productData: any) {
  try {
    const response = await fetch(`http://localhost:3000/api/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
}

// src/components/EditProductForm.tsx
import { useState } from 'react';
import { updateProduct } from '../api/products';

export function EditProductForm({ productId, initialData }) {
  const [formData, setFormData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      await updateProduct(productId, formData);
      alert('Product updated!');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      
      <input
        type="text"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />
      
      <input
        type="number"
        value={formData.price}
        onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
      />
      
      <button type="submit" disabled={loading}>
        {loading ? 'Updating...' : 'Update Product'}
      </button>
    </form>
  );
}
```

### Пример 4: Удалить товар

```typescript
// src/api/products.ts
export async function deleteProduct(id: string) {
  try {
    const response = await fetch(`http://localhost:3000/api/products/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error);
    }

    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
}

// src/components/ProductItem.tsx
import { deleteProduct } from '../api/products';

export function ProductItem({ product, onDelete }) {
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm('Are you sure?')) return;
    
    try {
      setLoading(true);
      await deleteProduct(product.id);
      onDelete(product.id);
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h3>{product.name}</h3>
      <p>Price: ${product.price}</p>
      <button onClick={handleDelete} disabled={loading}>
        {loading ? 'Deleting...' : 'Delete'}
      </button>
    </div>
  );
}
```

---

## Ключевые моменты

✅ Используйте Fetch API для HTTP запросов
✅ Проверяйте response.ok перед обработкой
✅ Обрабатывайте ошибки в try-catch
✅ Используйте правильные HTTP методы
✅ Отправляйте JSON в headers
✅ Парсите JSON ответ с response.json()
✅ Показывайте loading и error состояния

---

## Следующие шаги

1. Прочитайте **INDEX.md** - полная навигация по материалам
2. Практикуйтесь с примерами
3. Создавайте свои endpoints
