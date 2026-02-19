import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { TelegramWebAppData } from '../types';

declare global {
  namespace Express {
    interface Request {
      user?: TelegramWebAppData['user'];
    }
  }
}

export const verifyTelegramAuth = (req: Request, res: Response, next: NextFunction) => {
  const initData = req.headers['x-telegram-init-data'] as string;

  if (!initData) {
    return res.status(401).json({ error: 'Missing Telegram init data' });
  }

  try {
    const params = new URLSearchParams(initData);
    const hash = params.get('hash');
    params.delete('hash');

    const dataCheckString = Array.from(params.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');

    const secretKey = crypto
      .createHmac('sha256', 'WebAppData')
      .update(process.env.TELEGRAM_BOT_TOKEN || '')
      .digest();

    const computedHash = crypto
      .createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');

    if (computedHash !== hash) {
      return res.status(401).json({ error: 'Invalid Telegram signature' });
    }

    const userData = params.get('user');
    if (userData) {
      req.user = JSON.parse(userData);
    }

    next();
  } catch (error) {
    res.status(401).json({ error: 'Auth verification failed' });
  }
};
