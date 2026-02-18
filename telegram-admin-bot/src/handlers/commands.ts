import { Context } from 'grammy';
import { COMMANDS, MESSAGES } from '../config/constants';
import { logger } from '../utils/logger';

export async function handleStart(ctx: Context): Promise<void> {
  try {
    const keyboard = [
      [{ text: COMMANDS.ALL_PRODUCTS }, { text: COMMANDS.ADD_PRODUCT }],
      [{ text: COMMANDS.EDIT_PRODUCT }, { text: COMMANDS.SALE }],
      [{ text: COMMANDS.CATEGORIES }, { text: COMMANDS.GENERATE_QR }],
    ];

    await ctx.reply(MESSAGES.WELCOME, {
      reply_markup: {
        keyboard,
        resize_keyboard: true,
        one_time_keyboard: false,
      },
      parse_mode: 'HTML',
    });

    logger.info('Start command executed', { userId: ctx.from?.id });
  } catch (error) {
    logger.error('Error in start command', { error });
    await ctx.reply(MESSAGES.ERROR);
  }
}

export async function handleHelp(ctx: Context): Promise<void> {
  try {
    await ctx.reply(MESSAGES.HELP, {
      parse_mode: 'HTML',
    });

    logger.info('Help command executed', { userId: ctx.from?.id });
  } catch (error) {
    logger.error('Error in help command', { error });
    await ctx.reply(MESSAGES.ERROR);
  }
}
