// Типы для товаров
export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  image?: string;
  stock: number;
  categoryId: string;
  barcode?: string;
  createdAt: string;
  updatedAt: string;
}

// Типы для категорий
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

// Типы для продаж
export interface Sale {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  saleDate: string;
  createdAt: string;
}

// Типы для QR-кодов
export interface QRCode {
  id: string;
  productId: string;
  code: string;
  createdAt: string;
}

// Контекст пользователя
export interface UserContext {
  userId: number;
  state: string;
  data: Record<string, any>;
}

// Ответ API
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Данные для добавления товара
export interface CreateProductData {
  name: string;
  description?: string;
  price: number;
  categoryId: string;
  stock?: number;
  image?: string;
}

// Данные для редактирования товара
export interface UpdateProductData {
  name?: string;
  description?: string;
  price?: number;
  categoryId?: string;
  stock?: number;
  image?: string;
}

// Данные для продажи
export interface CreateSaleData {
  productId: string;
  quantity: number;
  price: number;
}
