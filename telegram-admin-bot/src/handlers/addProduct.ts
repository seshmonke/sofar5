import { Context, Composer } from 'grammy';
import { productService } from '../services/productService';
import { apiService } from '../services/apiService';
import { Validators } from '../utils/validators';
import { MESSAGES, PRODUCT_FIELDS } from '../config/constants';
import { logger } from '../utils/logger';
import { CreateProductData } from '../types';

const composer = new Composer();

// Состояние для отслеживания процесса добавления товара
const userStates = new Map<number, Partial<CreateProductData> & { step: string }>();

export async function handleAddProduct(ctx: Context): Promise<void> {
  try {
    const userId = ctx.from?.id;
    if (!userId) return;

    userStates.set(userId, { step: PRODUCT_FIELDS.NAME });

    await ctx.reply('📝 Введите название товара:', {
      reply_markup: {
        force_reply: true,
      },
    });

    logger.info('Add product started', { userId });
  } catch (error) {
    logger.error('Error in add product handler', { error });
    await ctx.reply(MESSAGES.ERROR);
  }
}

export async function handleAddProductFlow(ctx: Context): Promise<void> {
  try {
    const userId = ctx.from?.id;
    if (!userId || !ctx.message?.text) return;

    const state = userStates.get(userId);
    if (!state) return;

    const text = ctx.message.text.trim();

    switch (state.step) {
      case PRODUCT_FIELDS.NAME:
        if (!Validators.isValidProductName(text)) {
          await ctx.reply('❌ Название должно быть от 1 до 255 символов');
          return;
        }
        state.name = text;
        state.step = PRODUCT_FIELDS.DESCRIPTION;
        await ctx.reply('📝 Введите описание товара (или пропустите, отправив "-"):');
        break;

      case PRODUCT_FIELDS.DESCRIPTION:
        if (text !== '-') {
          if (!Validators.isValidDescription(text)) {
            await ctx.reply('❌ Описание не должно превышать 1000 символов');
            return;
          }
          state.description = text;
        }
        state.step = PRODUCT_FIELDS.PRICE;
        await ctx.reply('💰 Введите цену товара (в рублях):');
        break;

      case PRODUCT_FIELDS.PRICE:
        const price = Validators.parsePrice(text);
        if (price === null) {
          await ctx.reply('❌ Введите корректную цену (число больше 0)');
          return;
        }
        state.price = price;
        state.step = PRODUCT_FIELDS.STOCK;
        await ctx.reply('📊 Введите количество товара на складе:');
        break;

      case PRODUCT_FIELDS.STOCK:
        const stock = Validators.parseStock(text);
        if (stock === null) {
          await ctx.reply('❌ Введите корректное количество (целое число >= 0)');
          return;
        }
        state.stock = stock;
        state.step = PRODUCT_FIELDS.CATEGORY;

        // Получаем категории
        const categories = await apiService.getAllCategories();
        if (categories.length === 0) {
          await ctx.reply('❌ Нет доступных категорий. Сначала создайте категорию.');
          userStates.delete(userId);
          return;
        }

        let categoryMessage = '📂 Выберите категорию:\n\n';
        categories.forEach((cat, index) => {
          categoryMessage += `${index + 1}. ${cat.name} (ID: ${cat.id})\n`;
        });
        categoryMessage += '\nВведите номер категории:';

        await ctx.reply(categoryMessage);
        break;

      case PRODUCT_FIELDS.CATEGORY:
        const categoryIndex = parseInt(text, 10) - 1;
        const categories = await apiService.getAllCategories();

        if (isNaN(categoryIndex) || categoryIndex < 0 || categoryIndex >= categories.length) {
          await ctx.reply('❌ Выберите корректный номер категории');
          return;
        }

        state.categoryId = categories[categoryIndex].id;

        // Создаем товар
        const productData: CreateProductData = {
          name: state.name!,
          description: state.description,
          price: state.price!,
          stock: state.stock,
          categoryId: state.categoryId,
        };

        const product = await productService.createProduct(productData);

        await ctx.reply(
          `✅ Товар успешно добавлен!\n\n<b>${product.name}</b>\nID: <code>${product.id}</code>`,
          {
            parse_mode: 'HTML',
          }
        );

        userStates.delete(userId);
        logger.info('Product added successfully', { userId, productId: product.id });
        break;
    }

    userStates.set(userId, state);
  } catch (error) {
    logger.error('Error in add product flow', { error });
    await ctx.reply(MESSAGES.ERROR);
    userStates.delete(ctx.from?.id || 0);
  }
}

export { composer };
