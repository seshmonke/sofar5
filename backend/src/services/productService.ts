import { productRepository } from '../repositories/productRepository';
import { NotFoundError, ValidationError } from '../errors/AppError';
import { LIMITS } from '../config/constants';

export class ProductService {
  async getAllProducts(page: number = 1, limit: number = LIMITS.DEFAULT_PAGE_SIZE) {
    if (page < 1 || limit < 1) {
      throw new ValidationError('Page и limit должны быть больше 0');
    }

    if (limit > LIMITS.MAX_PAGE_SIZE) {
      limit = LIMITS.MAX_PAGE_SIZE;
    }

    const skip = (page - 1) * limit;
    const [products, total] = await Promise.all([
      productRepository.findAll(skip, limit),
      productRepository.count(),
    ]);

    return {
      data: products,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getProductById(id: string) {
    const product = await productRepository.findById(id);
    if (!product) {
      throw new NotFoundError(`Продукт с ID ${id} не найден`);
    }
    return product;
  }

  async getProductsByCategory(categoryId: string, page: number = 1, limit: number = LIMITS.DEFAULT_PAGE_SIZE) {
    const skip = (page - 1) * limit;
    return productRepository.findByCategory(categoryId, skip, limit);
  }

  async createProduct(data: any) {
    if (!data.name || !data.price || !data.categoryId) {
      throw new ValidationError('Требуются поля: name, price, categoryId');
    }

    return productRepository.create(data);
  }

  async updateProduct(id: string, data: any) {
    const product = await this.getProductById(id);
    return productRepository.update(id, data);
  }

  async deleteProduct(id: string) {
    await this.getProductById(id);
    return productRepository.delete(id);
  }
}

export const productService = new ProductService();
