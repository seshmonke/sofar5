import { Bot, Context } from 'grammy';
import { env } from './config/env';
import { COMMANDS } from './config/constants';
import { logger } from './utils/logger';
import { loggingMiddleware } from './middleware/logger';
import { handleStart, handleHelp } from './handlers/commands';
import { handleAllProducts } from './handlers/products';
import { handleAddProduct, handleAddProductFlow } from './handlers/addProduct';
import { handleSale, handleSaleFlow } from './handlers/sale';
import { handleCategories, handleAddCategory, handleAddCategoryFlow } from './handlers/categories';
import { handleGenerateQR, handleGenerateQRFlow } from './handlers/qrCode';

// Создаем экземпляр бота
export const bot = new Bot(env.BOT_TOKEN);

// Middleware
bot.use(loggingMiddleware);

// Команды
bot.command('start', handleStart);
bot.command('help', handleHelp);

// Обработчики текстовых сообщений (кнопки)
bot.hears(COMMANDS.ALL_PRODUCTS, handleAllProducts);
bot.hears(COMMANDS.ADD_PRODUCT, handleAddProduct);
bot.hears(COMMANDS.SALE, handleSale);
bot.hears(COMMANDS.CATEGORIES, handleCategories);
bot.hears(COMMANDS.GENERATE_QR, handleGenerateQR);

// Обработчики для кнопок в категориях
bot.hears('➕ Добавить категорию', handleAddCategory);

// Обработчики для потоков добавления товара и категории
bot.on('message:text', async (ctx: Context) => {
  try {
    const userId = ctx.from?.id;
    if (!userId) return;

    // Проверяем, находится ли пользователь в процессе добавления товара
    // Это будет обработано в handleAddProductFlow
    await handleAddProductFlow(ctx);

    // Проверяем, находится ли пользователь в процессе добавления категории
    await handleAddCategoryFlow(ctx);

    // Проверяем, находится ли пользователь в процессе продажи
    await handleSaleFlow(ctx);

    // Проверяем, находится ли пользователь в процессе генерации QR
    await handleGenerateQRFlow(ctx);
  } catch (error) {
    logger.error('Error in message handler', { error });
  }
});

// Обработчик ошибок
bot.catch((err) => {
  logger.error('Bot error', {
    error: err.error,
    message: err.message,
  });
});

export async function startBot(): Promise<void> {
  try {
    logger.info('Starting bot...');
    await bot.start();
    logger.info('Bot started successfully');
  } catch (error) {
    logger.error('Failed to start bot', { error });
    throw error;
  }
}
