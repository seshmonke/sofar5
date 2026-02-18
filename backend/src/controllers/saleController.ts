import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { HTTP_STATUS } from '../config/constants';

const prisma = new PrismaClient();

export class SaleController {
  async createSale(req: Request, res: Response, next: NextFunction) {
    try {
      const { productId, quantity, price } = req.body;

      if (!productId || !quantity || !price) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          error: 'Требуются поля: productId, quantity, price',
        });
        return;
      }

      // Проверяем, существует ли товар
      const product = await prisma.product.findUnique({
        where: { id: productId },
      });

      if (!product) {
        res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          error: 'Товар не найден',
        });
        return;
      }

      // Проверяем количество на складе
      if (product.stock < quantity) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          error: 'Недостаточно товара на складе',
        });
        return;
      }

      // Создаем запись о продаже
      const sale = await prisma.sale.create({
        data: {
          productId,
          quantity,
          price,
        },
      });

      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        data: sale,
        message: 'Продажа успешно зарегистрирована',
      });
    } catch (error) {
      next(error);
    }
  }

  async getSales(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const skip = (page - 1) * limit;

      const [sales, total] = await Promise.all([
        prisma.sale.findMany({
          skip,
          take: limit,
          include: {
            product: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        }),
        prisma.sale.count(),
      ]);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: sales,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      });
    } catch (error) {
      next(error);
    }
  }

  async getSaleById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const sale = await prisma.sale.findUnique({
        where: { id },
        include: {
          product: true,
        },
      });

      if (!sale) {
        res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          error: 'Продажа не найдена',
        });
        return;
      }

      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: sale,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const saleController = new SaleController();
