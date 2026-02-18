import axios, { AxiosInstance } from 'axios';
import { env } from '../config/env';
import { logger } from '../utils/logger';
import {
  Product,
  Category,
  Sale,
  CreateProductData,
  UpdateProductData,
  CreateSaleData,
  ApiResponse,
} from '../types';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: env.BACKEND_API_URL,
      timeout: 10000,
    });

    // Обработчик ошибок
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        logger.error('API Error:', {
          status: error.response?.status,
          message: error.message,
          data: error.response?.data,
        });
        throw error;
      }
    );
  }

  // ===== ТОВАРЫ =====
  async getAllProducts(): Promise<Product[]> {
    try {
      const response = await this.api.get<ApiResponse<Product[]>>('/products');
      return response.data.data || [];
    } catch (error) {
      logger.error('Failed to get products', error);
      throw error;
    }
  }

  async getProductById(id: string): Promise<Product | null> {
    try {
      const response = await this.api.get<ApiResponse<Product>>(`/products/${id}`);
      return response.data.data || null;
    } catch (error) {
      logger.error('Failed to get product', { id, error });
      throw error;
    }
  }

  async getProductByBarcode(barcode: string): Promise<Product | null> {
    try {
      const response = await this.api.get<ApiResponse<Product>>(`/products/barcode/${barcode}`);
      return response.data.data || null;
    } catch (error) {
      logger.error('Failed to get product by barcode', { barcode, error });
      throw error;
    }
  }

  async createProduct(data: CreateProductData): Promise<Product> {
    try {
      const response = await this.api.post<ApiResponse<Product>>('/products', data);
      if (!response.data.data) {
        throw new Error('No data returned from server');
      }
      return response.data.data;
    } catch (error) {
      logger.error('Failed to create product', { data, error });
      throw error;
    }
  }

  async updateProduct(id: string, data: UpdateProductData): Promise<Product> {
    try {
      const response = await this.api.put<ApiResponse<Product>>(`/products/${id}`, data);
      if (!response.data.data) {
        throw new Error('No data returned from server');
      }
      return response.data.data;
    } catch (error) {
      logger.error('Failed to update product', { id, data, error });
      throw error;
    }
  }

  async deleteProduct(id: string): Promise<void> {
    try {
      await this.api.delete(`/products/${id}`);
    } catch (error) {
      logger.error('Failed to delete product', { id, error });
      throw error;
    }
  }

  // ===== КАТЕГОРИИ =====
  async getAllCategories(): Promise<Category[]> {
    try {
      const response = await this.api.get<ApiResponse<Category[]>>('/categories');
      return response.data.data || [];
    } catch (error) {
      logger.error('Failed to get categories', error);
      throw error;
    }
  }

  async getCategoryById(id: string): Promise<Category | null> {
    try {
      const response = await this.api.get<ApiResponse<Category>>(`/categories/${id}`);
      return response.data.data || null;
    } catch (error) {
      logger.error('Failed to get category', { id, error });
      throw error;
    }
  }

  async createCategory(name: string, description?: string): Promise<Category> {
    try {
      const response = await this.api.post<ApiResponse<Category>>('/categories', {
        name,
        description,
      });
      if (!response.data.data) {
        throw new Error('No data returned from server');
      }
      return response.data.data;
    } catch (error) {
      logger.error('Failed to create category', { name, error });
      throw error;
    }
  }

  async updateCategory(id: string, name?: string, description?: string): Promise<Category> {
    try {
      const response = await this.api.put<ApiResponse<Category>>(`/categories/${id}`, {
        name,
        description,
      });
      if (!response.data.data) {
        throw new Error('No data returned from server');
      }
      return response.data.data;
    } catch (error) {
      logger.error('Failed to update category', { id, error });
      throw error;
    }
  }

  async deleteCategory(id: string): Promise<void> {
    try {
      await this.api.delete(`/categories/${id}`);
    } catch (error) {
      logger.error('Failed to delete category', { id, error });
      throw error;
    }
  }

  // ===== ПРОДАЖИ =====
  async createSale(data: CreateSaleData): Promise<Sale> {
    try {
      const response = await this.api.post<ApiResponse<Sale>>('/sales', data);
      if (!response.data.data) {
        throw new Error('No data returned from server');
      }
      return response.data.data;
    } catch (error) {
      logger.error('Failed to create sale', { data, error });
      throw error;
    }
  }

  async getSales(): Promise<Sale[]> {
    try {
      const response = await this.api.get<ApiResponse<Sale[]>>('/sales');
      return response.data.data || [];
    } catch (error) {
      logger.error('Failed to get sales', error);
      throw error;
    }
  }

  async updateProductStock(id: string, stock: number): Promise<Product> {
    try {
      const response = await this.api.put<ApiResponse<Product>>(`/products/${id}/stock`, {
        stock,
      });
      if (!response.data.data) {
        throw new Error('No data returned from server');
      }
      return response.data.data;
    } catch (error) {
      logger.error('Failed to update product stock', { id, stock, error });
      throw error;
    }
  }

  // ===== QR-КОДЫ =====
  async generateQRCode(productId: string): Promise<string> {
    try {
      const response = await this.api.post<ApiResponse<{ code: string }>>('/qrcodes/generate', {
        productId,
      });
      if (!response.data.data?.code) {
        throw new Error('No QR code returned from server');
      }
      return response.data.data.code;
    } catch (error) {
      logger.error('Failed to generate QR code', { productId, error });
      throw error;
    }
  }

  async getQRCode(productId: string): Promise<string | null> {
    try {
      const response = await this.api.get<ApiResponse<{ code: string }>>(`/qrcodes/${productId}`);
      return response.data.data?.code || null;
    } catch (error) {
      logger.error('Failed to get QR code', { productId, error });
      throw error;
    }
  }
}

export const apiService = new ApiService();
