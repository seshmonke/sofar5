import { Context } from 'grammy';
import { productService } from '../services/productService';
import { MESSAGES } from '../config/constants';
import { logger } from '../utils/logger';

export async function handleAllProducts(ctx: Context): Promise<void> {
  try {
    await ctx.reply('⏳ Загружаю товары...');

    const message = await productService.getAllProductsFormatted();

    await ctx.reply(message, {
      parse_mode: 'HTML',
    });

    logger.info('All products command executed', { userId: ctx.from?.id });
  } catch (error) {
    logger.error('Error in all products command', { error });
    await ctx.reply(MESSAGES.ERROR);
  }
}

export async function handleProductsByCategory(ctx: Context, categoryId: string): Promise<void> {
  try {
    const products = await productService.getAllProductsFormatted();

    await ctx.reply(products, {
      parse_mode: 'HTML',
    });

    logger.info('Products by category command executed', { userId: ctx.from?.id, categoryId });
  } catch (error) {
    logger.error('Error in products by category command', { error });
    await ctx.reply(MESSAGES.ERROR);
  }
}
