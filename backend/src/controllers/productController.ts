import { Request, Response, NextFunction } from 'express';
import { productService } from '../services/productService';
import { HTTP_STATUS } from '../config/constants';

export class ProductController {
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
      next(error);
    }
  }

  async getProductById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const product = await productService.getProductById(id);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: product,
      });
    } catch (error) {
      next(error);
    }
  }

  async createProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await productService.createProduct(req.body);

      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        data: product,
        message: 'Продукт успешно создан',
      });
    } catch (error) {
      next(error);
    }
  }

  async updateProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const product = await productService.updateProduct(id, req.body);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: product,
        message: 'Продукт успешно обновлен',
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await productService.deleteProduct(id);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'Продукт успешно удален',
      });
    } catch (error) {
      next(error);
    }
  }
}

export const productController = new ProductController();
