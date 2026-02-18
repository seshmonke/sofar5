import { Context } from 'grammy';
import { productService } from '../services/productService';
import { Validators } from '../utils/validators';
import { MESSAGES } from '../config/constants';
import { logger } from '../utils/logger';

const userSaleStates = new Map<number, { productId?: string; quantity?: number; step: string }>();

export async function handleSale(ctx: Context): Promise<void> {
  try {
    const userId = ctx.from?.id;
    if (!userId) return;

    userSaleStates.set(userId, { step: 'barcode' });

    await ctx.reply(
      '📱 Отправьте QR-код товара или введите ID товара для продажи:',
      {
        reply_markup: {
          force_reply: true,
        },
      }
    );

    logger.info('Sale started', { userId });
  } catch (error) {
    logger.error('Error in sale handler', { error });
    await ctx.reply(MESSAGES.ERROR);
  }
}

export async function handleSaleFlow(ctx: Context): Promise<void> {
  try {
    const userId = ctx.from?.id;
    if (!userId || !ctx.message?.text) return;

    const state = userSaleStates.get(userId);
    if (!state) return;

    const text = ctx.message.text.trim();

    switch (state.step) {
      case 'barcode':
        // Пытаемся найти товар по ID или штрих-коду
        let product = await productService.getProductByBarcode(text);

        if (!product) {
          // Пытаемся найти по ID
          product = await productService.getProductByBarcode(text);
        }

        if (!product) {
          await ctx.reply('❌ Товар не найден. Проверьте ID или штрих-код.');
          return;
        }

        state.productId = product.id;
        state.step = 'quantity';

        const productInfo = await productService.getProductFormattedById(product.id);
        await ctx.reply(
          `✅ Товар найден:\n\n${productInfo}\n\nВведите количество для продажи:`,
          {
            parse_mode: 'HTML',
            reply_markup: {
              force_reply: true,
            },
          }
        );
        break;

      case 'quantity':
        const quantity = Validators.parseQuantity(text);
        if (quantity === null) {
          await ctx.reply('❌ Введите корректное количество (целое число > 0)');
          return;
        }

        if (!state.productId) {
          await ctx.reply(MESSAGES.ERROR);
          userSaleStates.delete(userId);
          return;
        }

        // Продаем товар
        const soldProduct = await productService.sellProduct(state.productId, quantity);

        await ctx.reply(
          `✅ Товар успешно продан!\n\n<b>${soldProduct.name}</b>\nКоличество: ${quantity}\nОставалось на складе: ${soldProduct.stock}`,
          {
            parse_mode: 'HTML',
          }
        );

        userSaleStates.delete(userId);
        logger.info('Product sold', { userId, productId: state.productId, quantity });
        break;
    }

    userSaleStates.set(userId, state);
  } catch (error) {
    logger.error('Error in sale flow', { error });
    await ctx.reply(MESSAGES.ERROR);
    userSaleStates.delete(ctx.from?.id || 0);
  }
}
