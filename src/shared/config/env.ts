const BASE_PREFIX = import.meta.env.BASE_URL ? import.meta.env.BASE_URL.replace(/\/$/, '') : '';

const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL;
const rawAuthApiBaseUrl = import.meta.env.VITE_AUTH_API_BASE_URL;
const rawTelegramBotUsername = import.meta.env.VITE_TELEGRAM_BOT_USERNAME;
const rawGoogleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const stripTrailingSlash = (value: string): string => value.replace(/\/$/, '');

const optionalString = (value: string | undefined): string =>
  typeof value === 'string' && value.length > 0 ? stripTrailingSlash(value) : '';

export const env = {
  apiBaseUrl: rawApiBaseUrl ? stripTrailingSlash(rawApiBaseUrl) : `${BASE_PREFIX}/api`,
  authApiBaseUrl: rawAuthApiBaseUrl ? stripTrailingSlash(rawAuthApiBaseUrl) : 'https://chalysh.pro/auth/api',
  telegramBotUsername: optionalString(rawTelegramBotUsername),
  googleClientId: optionalString(rawGoogleClientId),
} as const;
