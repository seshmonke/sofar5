import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { HTTP_STATUS } from '../config/constants';

const prisma = new PrismaClient();

export class QRCodeController {
  async generateQRCode(req: Request, res: Response, next: NextFunction) {
    try {
      const { productId } = req.body;

      if (!productId) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          error: 'productId обязателен',
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

      // Проверяем, есть ли уже QR-код для этого товара
      let qrCode = await prisma.qRCode.findUnique({
        where: { productId },
      });

      if (!qrCode) {
        // Генерируем уникальный код для QR
        const code = `PRODUCT:${productId}:${product.name}`;

        qrCode = await prisma.qRCode.create({
          data: {
            productId,
            code,
          },
        });
      }

      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: {
          code: qrCode.code,
          productId: qrCode.productId,
        },
        message: 'QR-код успешно сгенерирован',
      });
    } catch (error) {
      next(error);
    }
  }

  async getQRCode(req: Request, res: Response, next: NextFunction) {
    try {
      const { productId } = req.params;

      const qrCode = await prisma.qRCode.findUnique({
        where: { productId },
      });

      if (!qrCode) {
        res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          error: 'QR-код не найден',
        });
        return;
      }

      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: {
          code: qrCode.code,
          productId: qrCode.productId,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllQRCodes(req: Request, res: Response, next: NextFunction) {
    try {
      const qrCodes = await prisma.qRCode.findMany({
        include: {
          product: true,
        },
      });

      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: qrCodes,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const qrCodeController = new QRCodeController();
