import { Context } from 'grammy';
import { productService } from '../services/productService';
import { apiService } from '../services/apiService';
import { MESSAGES } from '../config/constants';
import { logger } from '../utils/logger';

export async function handleGenerateQR(ctx: Context): Promise<void> {
  try {
    await ctx.reply('⏳ Загружаю товары...');

    const products = await apiService.getAllProducts();

    if (products.length === 0) {
      await ctx.reply('📦 Товаров не найдено');
      return;
    }

    let message = '🎯 <b>Выберите товар для генерации QR-кода:</b>\n\n';

    for (let i = 0; i < Math.min(products.length, 10); i++) {
      const product = products[i];
      message += `${i + 1}. ${product.name}\n`;
    }

    if (products.length > 10) {
      message += `\n... и еще ${products.length - 10} товаров`;
    }

    message += '\n\nВведите номер товара:';

    await ctx.reply(message, {
      parse_mode: 'HTML',
      reply_markup: {
        force_reply: true,
      },
    });

    logger.info('Generate QR started', { userId: ctx.from?.id });
  } catch (error) {
    logger.error('Error in generate QR handler', { error });
    await ctx.reply(MESSAGES.ERROR);
  }
}

export async function handleGenerateQRFlow(ctx: Context): Promise<void> {
  try {
    if (!ctx.message?.text) return;

    const productIndex = parseInt(ctx.message.text.trim(), 10) - 1;
    const products = await apiService.getAllProducts();

    if (isNaN(productIndex) || productIndex < 0 || productIndex >= products.length) {
      await ctx.reply('❌ Выберите корректный номер товара');
      return;
    }

    const product = products[productIndex];

    await ctx.reply('⏳ Генерирую QR-код...');

    const qrCodeDataUrl = await productService.generateQRCodeForProduct(product);

    // Отправляем QR-код как фото
    await ctx.replyWithPhoto(qrCodeDataUrl, {
      caption: `<b>${product.name}</b>\nID: <code>${product.id}</code>`,
      parse_mode: 'HTML',
    });

    logger.info('QR code generated', { userId: ctx.from?.id, productId: product.id });
  } catch (error) {
    logger.error('Error in generate QR flow', { error });
    await ctx.reply(MESSAGES.ERROR);
  }
}
