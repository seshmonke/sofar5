import type { ProductCategory } from '../types/categories';

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: ProductCategory;
}

export const products: Product[] = [
  {
    id: 1,
    name: "Футболка базовая",
    price: 1299,
    image: "https://cdn.shuclothes.com/sig/size:8192/q:100/aHR0cHM6Ly9zaHVjbG90aGVzLmNvbS9zdG9yYWdlLzE5NjkyL3NodV8yMC40LjIzOTI2Mi5qcGc",
    category: 'tshirts'
  },
  {
    id: 2,
    name: "Джинсы классические",
    price: 3499,
    image: "https://cdn.shuclothes.com/sig/size:8192/q:100/aHR0cHM6Ly9zaHVjbG90aGVzLmNvbS9zdG9yYWdlLzQxNzcwL3NodV8xOS4yLjI1MzYyNDguanBn",
    category: 'jeans'
  },
  {
    id: 3,
    name: "Пиджак деловой",
    price: 5999,
    image: "https://cdn.shuclothes.com/sig/size:8192/q:100/aHR0cHM6Ly9zaHVjbG90aGVzLmNvbS9zdG9yYWdlLzUwMjg0L3NodV8yMC44LjI1OTQ4MTMuanBn",
    category: 'jackets'
  },
  {
    id: 4,
    name: "Шапка зимняя",
    price: 899,
    image: "https://cdn.shuclothes.com/sig/size:8192/q:100/aHR0cHM6Ly9zaHVjbG90aGVzLmNvbS9zdG9yYWdlLzQxMzQ3L3NodV8xMi4yLjI1MzQ3NzkuanBn",
    category: "hats"
  },
  {
    id: 5,
    name: "Ремень кожаный",
    price: 1599,
    image: "https://cdn.shuclothes.com/sig/size:8192/q:100/aHR0cHM6Ly9zaHVjbG90aGVzLmNvbS9zdG9yYWdlLzI4MTA4L1RyYXZlbF9XYXNoX0JhZ19CbGFja18wMDQuanBlZw",
    category:"belts"
  },
  {
    id: 6,
    name: "Очки солнцезащитные",
    price: 2299,
    image: "https://cdn.shuclothes.com/sig/size:8192/q:100/aHR0cHM6Ly9zaHVjbG90aGVzLmNvbS9zdG9yYWdlLzEwMzQ4LzguanBn",
    category: "glasses"
  },
  {
    id: 7,
    name: "Кроссовки спортивные",
    price: 4499,
    image: "https://cdn.shuclothes.com/sig/size:8192/q:100/aHR0cHM6Ly9zaHVjbG90aGVzLmNvbS9zdG9yYWdlLzM1MDQyL3NodV8yMi44LjI0NzU3MzYuanBn",
    category: "shoes"
  },
  {
    id: 8,
    name: "Рюкзак городской",
    price: 2999,
    image: "https://cdn.shuclothes.com/sig/size:8192/q:100/aHR0cHM6Ly9zaHVjbG90aGVzLmNvbS9zdG9yYWdlLzQ0NzQzL9C60LvQsNGB0YHQuNGHLdGCLdGB0LXRgC5qcGc",
    category: "bags"
  }
];
