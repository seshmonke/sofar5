export interface TelegramUser {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
}

export interface TelegramWebAppData {
  user?: TelegramUser;
  auth_date: number;
  hash: string;
}

export interface AuthRequest {
  initData: string;
}
