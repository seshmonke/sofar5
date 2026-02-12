import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ProductRepository {
  async findAll(skip: number = 0, take: number = 10) {
    return prisma.product.findMany({
      skip,
      take,
      include: {
        category: true,
      },
    });
  }

  async findById(id: string) {
    return prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });
  }

  async findByCategory(categoryId: string, skip: number = 0, take: number = 10) {
    return prisma.product.findMany({
      where: { categoryId },
      skip,
      take,
      include: {
        category: true,
      },
    });
  }

  async create(data: any) {
    return prisma.product.create({
      data,
      include: {
        category: true,
      },
    });
  }

  async update(id: string, data: any) {
    return prisma.product.update({
      where: { id },
      data,
      include: {
        category: true,
      },
    });
  }

  async delete(id: string) {
    return prisma.product.delete({
      where: { id },
    });
  }

  async count() {
    return prisma.product.count();
  }
}

export const productRepository = new ProductRepository();
