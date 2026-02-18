import { Context, NextFunction } from 'grammy';
import { logger } from '../utils/logger';

export async function loggingMiddleware(ctx: Context, next: NextFunction): Promise<void> {
  const start = Date.now();
  const update = ctx.update;

  logger.debug('Incoming update', {
    updateId: update.update_id,
    type: update.message ? 'message' : update.callback_query ? 'callback_query' : 'unknown',
  });

  await next();

  const ms = Date.now() - start;
  logger.debug('Update processed', {
    updateId: update.update_id,
    duration: `${ms}ms`,
  });
}
