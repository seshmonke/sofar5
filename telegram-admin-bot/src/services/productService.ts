import { apiService } from './apiService';
import { qrCodeService } from './qrCodeService';
import { logger } from '../utils/logger';
import { Product, Category, CreateProductData, UpdateProductData } from '../types';

class ProductService {
  /**
   * Получить все товары с форматированием
   */
  async getAllProductsFormatted(): Promise<string> {
    try {
      const products = await apiService.getAllProducts();

      if (products.length === 0) {
        return '📦 Товаров не найдено';
      }

      let message = '📦 <b>Все товары:</b>\n\n';

      for (const product of products) {
        message += `<b>${product.name}</b>\n`;
        message += `💰 Цена: ${product.price} руб.\n`;
        message += `📊 На складе: ${product.stock} шт.\n`;
        if (product.description) {
          message += `📝 ${product.description}\n`;
        }
        message += `ID: <code>${product.id}</code>\n`;
        message += '─────────────────\n';
      }

      return message;
    } catch (error) {
      logger.error('Failed to get formatted products', error);
      throw error;
    }
  }

  /**
   * Получить товар по ID с форматированием
   */
  async getProductFormattedById(id: string): Promise<string | null> {
    try {
      const product = await apiService.getProductById(id);

      if (!product) {
        return null;
      }

      let message = `<b>${product.name}</b>\n\n`;
      message += `💰 Цена: ${product.price} руб.\n`;
      message += `📊 На складе: ${product.stock} шт.\n`;
      if (product.description) {
        message += `📝 Описание: ${product.description}\n`;
      }
      message += `ID: <code>${product.id}</code>\n`;

      return message;
    } catch (error) {
      logger.error('Failed to get formatted product', { id, error });
      throw error;
    }
  }

  /**
   * Получить товар по штрих-коду
   */
  async getProductByBarcode(barcode: string): Promise<Product | null> {
    try {
      return await apiService.getProductByBarcode(barcode);
    } catch (error) {
      logger.error('Failed to get product by barcode', { barcode, error });
      throw error;
    }
  }

  /**
   * Создать товар
   */
  async createProduct(data: CreateProductData): Promise<Product> {
    try {
      const product = await apiService.createProduct(data);
      logger.info('Product created successfully', { productId: product.id });
      return product;
    } catch (error) {
      logger.error('Failed to create product', { data, error });
      throw error;
    }
  }

  /**
   * Обновить товар
   */
  async updateProduct(id: string, data: UpdateProductData): Promise<Product> {
    try {
      const product = await apiService.updateProduct(id, data);
      logger.info('Product updated successfully', { productId: id });
      return product;
    } catch (error) {
      logger.error('Failed to update product', { id, data, error });
      throw error;
    }
  }

  /**
   * Удалить товар
   */
  async deleteProduct(id: string): Promise<void> {
    try {
      await apiService.deleteProduct(id);
      logger.info('Product deleted successfully', { productId: id });
    } catch (error) {
      logger.error('Failed to delete product', { id, error });
      throw error;
    }
  }

  /**
   * Получить все категории с форматированием
   */
  async getAllCategoriesFormatted(): Promise<string> {
    try {
      const categories = await apiService.getAllCategories();

      if (categories.length === 0) {
        return '📂 Категории не найдены';
      }

      let message = '📂 <b>Категории:</b>\n\n';

      for (const category of categories) {
        message += `<b>${category.name}</b>\n`;
        if (category.description) {
          message += `📝 ${category.description}\n`;
        }
        message += `ID: <code>${category.id}</code>\n`;
        message += '─────────────────\n';
      }

      return message;
    } catch (error) {
      logger.error('Failed to get formatted categories', error);
      throw error;
    }
  }

  /**
   * Создать категорию
   */
  async createCategory(name: string, description?: string): Promise<Category> {
    try {
      const category = await apiService.createCategory(name, description);
      logger.info('Category created successfully', { categoryId: category.id });
      return category;
    } catch (error) {
      logger.error('Failed to create category', { name, error });
      throw error;
    }
  }

  /**
   * Обновить категорию
   */
  async updateCategory(id: string, name?: string, description?: string): Promise<Category> {
    try {
      const category = await apiService.updateCategory(id, name, description);
      logger.info('Category updated successfully', { categoryId: id });
      return category;
    } catch (error) {
      logger.error('Failed to update category', { id, error });
      throw error;
    }
  }

  /**
   * Удалить категорию
   */
  async deleteCategory(id: string): Promise<void> {
    try {
      await apiService.deleteCategory(id);
      logger.info('Category deleted successfully', { categoryId: id });
    } catch (error) {
      logger.error('Failed to delete category', { id, error });
      throw error;
    }
  }

  /**
   * Продать товар (уменьшить количество на складе)
   */
  async sellProduct(productId: string, quantity: number): Promise<Product> {
    try {
      const product = await apiService.getProductById(productId);

      if (!product) {
        throw new Error('Product not found');
      }

      if (product.stock < quantity) {
        throw new Error('Insufficient stock');
      }

      // Создаем запись о продаже
      await apiService.createSale({
        productId,
        quantity,
        price: product.price,
      });

      // Обновляем количество товара
      const updatedProduct = await apiService.updateProductStock(
        productId,
        product.stock - quantity
      );

      logger.info('Product sold successfully', { productId, quantity });
      return updatedProduct;
    } catch (error) {
      logger.error('Failed to sell product', { productId, quantity, error });
      throw error;
    }
  }

  /**
   * Генерировать QR-код для товара
   */
  async generateQRCodeForProduct(product: Product): Promise<string> {
    try {
      const qrCodeDataUrl = await qrCodeService.generateProductQRCode(product.id, product.name);
      logger.info('QR code generated for product', { productId: product.id });
      return qrCodeDataUrl;
    } catch (error) {
      logger.error('Failed to generate QR code for product', { productId: product.id, error });
      throw error;
    }
  }
}

export const productService = new ProductService();
