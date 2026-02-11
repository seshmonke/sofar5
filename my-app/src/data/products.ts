import type { ProductCategory } from '../types/categories';

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: ProductCategory;
  description: string;
  sizes: string[];
  composition: Record<string, number>;
  discount?: number; // Процент скидки (0-100)
}

export const DELIVERY_INFO = "Доставка по России: 2-7 дней. Бесплатная доставка при заказе от 3000 ₽. Возврат в течение 14 дней.";

export const products: Product[] = [
  {
    id: 1,
    name: "Футболка базовая",
    price: 1299,
    image: "https://cdn.shuclothes.com/sig/size:8192/q:100/aHR0cHM6Ly9zaHVjbG90aGVzLmNvbS9zdG9yYWdlLzE5NjkyL3NodV8yMC40LjIzOTI2Mi5qcGc",
    category: 'tshirts',
    description: "Комфортная базовая футболка из качественного хлопка. Идеальна для повседневного ношения. Простой дизайн подходит к любому стилю.",
    sizes: ["XS", "S", "M", "L", "XL"],
    composition: { "Хлопок": 100 }
  },
  {
    id: 2,
    name: "Джинсы классические",
    price: 3499,
    image: "https://cdn.shuclothes.com/sig/size:8192/q:100/aHR0cHM6Ly9zaHVjbG90aGVzLmNvbS9zdG9yYWdlLzQxNzcwL3NodV8xOS4yLjI1MzYyNDguanBn",
    category: 'jeans',
    description: "Классические джинсы прямого кроя. Прочная ткань, удобная посадка. Универсальный вариант для любого случая.",
    sizes: ["28", "30", "32", "34", "36"],
    composition: { "Хлопок": 98, "Эластан": 2 }
  },
  {
    id: 3,
    name: "Пиджак деловой",
    price: 5999,
    image: "https://cdn.shuclothes.com/sig/size:8192/q:100/aHR0cHM6Ly9zaHVjbG90aGVzLmNvbS9zdG9yYWdlLzUwMjg0L3NodV8yMC44LjI1OTQ4MTMuanBn",
    category: 'jackets',
    description: "Элегантный пиджак для деловых встреч и официальных мероприятий. Качественный пошив, идеальная посадка.",
    sizes: ["XS", "S", "M", "L", "XL"],
    composition: { "Шерсть": 70, "Полиэстер": 30 }
  },
  {
    id: 4,
    name: "Шапка зимняя",
    price: 899,
    image: "https://cdn.shuclothes.com/sig/size:8192/q:100/aHR0cHM6Ly9zaHVjbG90aGVzLmNvbS9zdG9yYWdlLzQxMzQ3L3NodV8xMi4yLjI1MzQ3NzkuanBn",
    category: "hats",
    description: "Теплая зимняя шапка, защитит от холода и ветра. Мягкий материал, приятен к коже.",
    sizes: ["One Size"],
    composition: { "Акрил": 100 }
  },
  {
    id: 5,
    name: "Ремень кожаный",
    price: 1599,
    image: "https://cdn.shuclothes.com/sig/size:8192/q:100/aHR0cHM6Ly9zaHVjbG90aGVzLmNvbS9zdG9yYWdlLzI4MTA4L1RyYXZlbF9XYXNoX0JhZ19CbGFja18wMDQuanBlZw",
    category:"belts",
    description: "Классический кожаный ремень. Прочная пряжка, долговечный материал. Подходит к любому образу.",
    sizes: ["One Size"],
    composition: { "Натуральная кожа": 100 }
  },
  {
    id: 6,
    name: "Очки солнцезащитные",
    price: 2299,
    image: "https://cdn.shuclothes.com/sig/size:8192/q:100/aHR0cHM6Ly9zaHVjbG90aGVzLmNvbS9zdG9yYWdlLzEwMzQ4LzguanBn",
    category: "glasses",
    description: "Стильные солнцезащитные очки с UV защитой. Защищают глаза от вредного излучения. Современный дизайн.",
    sizes: ["One Size"],
    composition: { "Пластик": 60, "Стекло": 40 }
  },
  {
    id: 7,
    name: "Кроссовки спортивные",
    price: 4499,
    image: "https://cdn.shuclothes.com/sig/size:8192/q:100/aHR0cHM6Ly9zaHVjbG90aGVzLmNvbS9zdG9yYWdlLzM1MDQyL3NodV8yMi44LjI0NzU3MzYuanBn",
    category: "shoes",
    description: "Удобные спортивные кроссовки для активного образа жизни. Амортизирующая подошва, дышащий материал.",
    sizes: ["36", "37", "38", "39", "40", "41", "42", "43"],
    composition: { "Текстиль": 70, "Резина": 30 }
  },
  {
    id: 8,
    name: "Рюкзак городской",
    price: 2999,
    image: "https://cdn.shuclothes.com/sig/size:8192/q:100/aHR0cHM6Ly9zaHVjbG90aGVzLmNvbS9zdG9yYWdlLzQ0NzQzL9C60LvQsNGB0YHQuNGHLdGCLdGB0LXRgC5qcGc",
    category: "bags",
    description: "Практичный городской рюкзак с несколькими отделениями. Удобные лямки, прочный материал. Идеален для работы и учебы.",
    sizes: ["One Size"],
    composition: { "Полиэстер": 100 }
  },
  {
    id: 9,
    name: "Футболка базовая",
    price: 1299,
    image: "https://cdn.shuclothes.com/sig/size:8192/q:100/aHR0cHM6Ly9zaHVjbG90aGVzLmNvbS9zdG9yYWdlLzE5NjkyL3NodV8yMC40LjIzOTI2Mi5qcGc",
    category: 'sale',
    description: "Комфортная базовая футболка из качественного хлопка. Идеальна для повседневного ношения. Простой дизайн подходит к любому стилю. РАСПРОДАЖА!",
    sizes: ["XS", "S", "M", "L", "XL"],
    composition: { "Хлопок": 100 },
    discount: 30
  },
  {
    id: 10,
    name: "Джинсы классические",
    price: 3499,
    image: "https://cdn.shuclothes.com/sig/size:8192/q:100/aHR0cHM6Ly9zaHVjbG90aGVzLmNvbS9zdG9yYWdlLzQxNzcwL3NodV8xOS4yLjI1MzYyNDguanBn",
    category: 'sale',
    description: "Классические джинсы прямого кроя. Прочная ткань, удобная посадка. Универсальный вариант для любого случая. РАСПРОДАЖА!",
    sizes: ["28", "30", "32", "34", "36"],
    composition: { "Хлопок": 98, "Эластан": 2 },
    discount: 25
  },
  {
    id: 11,
    name: "Кроссовки спортивные",
    price: 4499,
    image: "https://cdn.shuclothes.com/sig/size:8192/q:100/aHR0cHM6Ly9zaHVjbG90aGVzLmNvbS9zdG9yYWdlLzM1MDQyL3NodV8yMi44LjI0NzU3MzYuanBn",
    category: 'sale',
    description: "Удобные спортивные кроссовки для активного образа жизни. Амортизирующая подошва, дышащий материал. РАСПРОДАЖА!",
    sizes: ["36", "37", "38", "39", "40", "41", "42", "43"],
    composition: { "Текстиль": 70, "Резина": 30 },
    discount: 40
  },
  {
    id: 12,
    name: "Пиджак деловой",
    price: 5999,
    image: "https://cdn.shuclothes.com/sig/size:8192/q:100/aHR0cHM6Ly9zaHVjbG90aGVzLmNvbS9zdG9yYWdlLzUwMjg0L3NodV8yMC44LjI1OTQ4MTMuanBn",
    category: 'sale',
    description: "Элегантный пиджак для деловых встреч и официальных мероприятий. Качественный пошив, идеальная посадка. РАСПРОДАЖА!",
    sizes: ["XS", "S", "M", "L", "XL"],
    composition: { "Шерсть": 70, "Полиэстер": 30 },
    discount: 35
  }
];
