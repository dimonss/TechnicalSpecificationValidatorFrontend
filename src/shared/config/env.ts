// Each `import.meta.env.X` access must stay on its own line — Vite 8 / Rolldown
// corrupts the property identifier when the same env-var name also appears as a
// string literal earlier on the same line (see issue surfaced during dev: the
// compiled `env.ts` ended up reading `import.meta.env.VITE_AVITE_API_BASE_URLPI_BASE_URL`).
const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL;
const rawAuthApiBaseUrl = import.meta.env.VITE_AUTH_API_BASE_URL;
const rawTelegramBotUsername = import.meta.env.VITE_TELEGRAM_BOT_USERNAME;
const rawGoogleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const stripTrailingSlash = (value: string): string => value.replace(/\/$/, '');

const requireString = (value: string | undefined, name: string): string => {
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error(`${name} is not set. Copy .env.example to .env and fill it in.`);
  }
  return stripTrailingSlash(value);
};

const optionalString = (value: string | undefined): string =>
  typeof value === 'string' && value.length > 0 ? stripTrailingSlash(value) : '';

const apiBaseUrlName = 'VITE_API_BASE_URL';
const authApiBaseUrlName = 'VITE_AUTH_API_BASE_URL';

export const env = {
  apiBaseUrl: requireString(rawApiBaseUrl, apiBaseUrlName),
  authApiBaseUrl: requireString(rawAuthApiBaseUrl, authApiBaseUrlName),
  telegramBotUsername: optionalString(rawTelegramBotUsername),
  googleClientId: optionalString(rawGoogleClientId),
} as const;
