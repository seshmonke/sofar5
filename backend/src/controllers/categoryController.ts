import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { HTTP_STATUS } from '../config/constants';

const prisma = new PrismaClient();

export class CategoryController {
  async getAllCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await prisma.category.findMany({
        include: {
          products: true,
        },
      });

      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: categories,
      });
    } catch (error) {
      next(error);
    }
  }

  async getCategoryById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const category = await prisma.category.findUnique({
        where: { id },
        include: {
          products: true,
        },
      });

      if (!category) {
        res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          error: 'Категория не найдена',
        });
        return;
      }

      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: category,
      });
    } catch (error) {
      next(error);
    }
  }

  async createCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, description } = req.body;

      if (!name) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          error: 'Название категории обязательно',
        });
        return;
      }

      const slug = name.toLowerCase().replace(/\s+/g, '-');

      const category = await prisma.category.create({
        data: {
          name,
          slug,
          description,
        },
      });

      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        data: category,
        message: 'Категория успешно создана',
      });
    } catch (error) {
      next(error);
    }
  }

  async updateCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { name, description } = req.body;

      const category = await prisma.category.update({
        where: { id },
        data: {
          name,
          description,
        },
      });

      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: category,
        message: 'Категория успешно обновлена',
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      await prisma.category.delete({
        where: { id },
      });

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'Категория успешно удалена',
      });
    } catch (error) {
      next(error);
    }
  }
}

export const categoryController = new CategoryController();
