// HTTP статус коды
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// Сообщения об ошибках
export const ERROR_MESSAGES = {
  NOT_FOUND: 'Ресурс не найден',
  UNAUTHORIZED: 'Не авторизован',
  FORBIDDEN: 'Доступ запрещен',
  INTERNAL_ERROR: 'Внутренняя ошибка сервера',
  VALIDATION_ERROR: 'Ошибка валидации',
} as const;

// Лимиты
export const LIMITS = {
  MAX_PAGE_SIZE: 100,
  DEFAULT_PAGE_SIZE: 10,
  DEFAULT_PAGE: 1,
} as const;
