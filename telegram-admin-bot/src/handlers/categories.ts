import { Context } from 'grammy';
import { productService } from '../services/productService';
import { Validators } from '../utils/validators';
import { MESSAGES } from '../config/constants';
import { logger } from '../utils/logger';

const userCategoryStates = new Map<number, { step: string; categoryName?: string }>();

export async function handleCategories(ctx: Context): Promise<void> {
  try {
    const categories = await productService.getAllCategoriesFormatted();

    const keyboard = [
      [{ text: '➕ Добавить категорию' }, { text: '✏️ Редактировать' }],
      [{ text: '🗑️ Удалить' }, { text: '⬅️ Назад' }],
    ];

    await ctx.reply(categories, {
      parse_mode: 'HTML',
      reply_markup: {
        keyboard,
        resize_keyboard: true,
      },
    });

    logger.info('Categories command executed', { userId: ctx.from?.id });
  } catch (error) {
    logger.error('Error in categories command', { error });
    await ctx.reply(MESSAGES.ERROR);
  }
}

export async function handleAddCategory(ctx: Context): Promise<void> {
  try {
    const userId = ctx.from?.id;
    if (!userId) return;

    userCategoryStates.set(userId, { step: 'name' });

    await ctx.reply('📝 Введите название новой категории:', {
      reply_markup: {
        force_reply: true,
      },
    });

    logger.info('Add category started', { userId });
  } catch (error) {
    logger.error('Error in add category handler', { error });
    await ctx.reply(MESSAGES.ERROR);
  }
}

export async function handleAddCategoryFlow(ctx: Context): Promise<void> {
  try {
    const userId = ctx.from?.id;
    if (!userId || !ctx.message?.text) return;

    const state = userCategoryStates.get(userId);
    if (!state) return;

    const text = ctx.message.text.trim();

    switch (state.step) {
      case 'name':
        if (!Validators.isValidCategoryName(text)) {
          await ctx.reply('❌ Название должно быть от 1 до 100 символов');
          return;
        }

        state.categoryName = text;
        state.step = 'description';

        await ctx.reply('📝 Введите описание категории (или пропустите, отправив "-"):');
        break;

      case 'description':
        let description: string | undefined;

        if (text !== '-') {
          if (!Validators.isValidDescription(text)) {
            await ctx.reply('❌ Описание не должно превышать 1000 символов');
            return;
          }
          description = text;
        }

        // Создаем категорию
        const category = await productService.createCategory(state.categoryName!, description);

        await ctx.reply(
          `✅ Категория успешно добавлена!\n\n<b>${category.name}</b>\nID: <code>${category.id}</code>`,
          {
            parse_mode: 'HTML',
          }
        );

        userCategoryStates.delete(userId);
        logger.info('Category added successfully', { userId, categoryId: category.id });
        break;
    }

    userCategoryStates.set(userId, state);
  } catch (error) {
    logger.error('Error in add category flow', { error });
    await ctx.reply(MESSAGES.ERROR);
    userCategoryStates.delete(ctx.from?.id || 0);
  }
}
