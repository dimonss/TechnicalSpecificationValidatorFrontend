import axios from 'axios';

export interface ApiErrorPayload {
  error: {
    code: string;
    message: string;
  };
}

export type ErrorCategory =
  | 'overloaded'
  | 'quota'
  | 'validation'
  | 'network'
  | 'auth'
  | 'server'
  | 'unknown';

export interface ParsedAppError {
  title: string;
  description: string;
  category: ErrorCategory;
  isRetryable: boolean;
  code?: string;
  details?: string;
}

const extractInnermostMessage = (raw: string): string => {
  if (!raw) return '';
  const matches = [...raw.matchAll(/"message"\s*:\s*"([^"]+)"/g)];
  if (matches.length > 0) {
    for (let i = matches.length - 1; i >= 0; i--) {
      const match = matches[i];
      const candidate = match?.[1]?.replace(/\\n/g, ' ').replace(/\\"/g, '"').trim();
      if (candidate && !candidate.startsWith('{') && candidate.length > 5) {
        return candidate;
      }
    }
  }
  return raw;
};

export const parseAppError = (error: unknown): ParsedAppError => {
  let rawMessage = '';
  let statusCode: number | undefined;
  let errorCode: string | undefined;

  if (axios.isAxiosError<ApiErrorPayload>(error)) {
    statusCode = error.response?.status;
    const payload = error.response?.data;
    if (payload && typeof payload === 'object' && 'error' in payload && payload.error?.message) {
      rawMessage = payload.error.message;
      errorCode = payload.error.code;
    } else if (error.code === 'ECONNABORTED') {
      rawMessage = 'Превышено время ожидания ответа от сервера';
      errorCode = 'TIMEOUT';
    } else if (error.message) {
      rawMessage = error.message;
    }
  } else if (error instanceof Error) {
    rawMessage = error.message;
  } else if (typeof error === 'string') {
    rawMessage = error;
  } else {
    rawMessage = String(error || 'Неизвестная ошибка');
  }

  const str = rawMessage.trim();
  const lower = str.toLowerCase();

  // 1. Overloaded / 503 / High Demand
  if (
    statusCode === 503 ||
    str.includes('503') ||
    lower.includes('high demand') ||
    lower.includes('spikes in demand') ||
    str.includes('UNAVAILABLE') ||
    lower.includes('service unavailable')
  ) {
    return {
      title: 'Модель AI временно перегружена',
      description:
        'Серверы Google Gemini сейчас испытывают пиковую нагрузку. Это кратковременное явление (обычно проходит за 10–30 секунд). Пожалуйста, повторите попытку.',
      category: 'overloaded',
      isRetryable: true,
      code: errorCode || 'GEMINI_503',
      details: str,
    };
  }

  // 2. Quota / Rate limit
  if (
    statusCode === 429 ||
    str.includes('429') ||
    str.includes('QUOTA_EXCEEDED') ||
    str.includes('RESOURCE_EXHAUSTED') ||
    lower.includes('лимит запросов') ||
    lower.includes('дневной лимит')
  ) {
    return {
      title: 'Лимит запросов исчерпан',
      description:
        'Дневной лимит запросов исчерпан. Пожалуйста, дождитесь автоматического сброса лимита в 00:00 UTC.',
      category: 'quota',
      isRetryable: false,
      code: errorCode || 'QUOTA_EXCEEDED',
      details: str,
    };
  }

  // 3. Validation / Bad request
  if (
    statusCode === 400 ||
    str.includes('VALIDATION_ERROR') ||
    lower.includes('fewer than 1') ||
    lower.includes('пустым') ||
    lower.includes('превышает 50 000')
  ) {
    return {
      title: 'Некорректное техническое задание',
      description:
        'Текст технического задания не должен быть пустым и не может превышать 50 000 символов. Проверьте введённый текст.',
      category: 'validation',
      isRetryable: false,
      code: errorCode || 'VALIDATION_ERROR',
      details: str,
    };
  }

  // 4. Auth error
  if (
    statusCode === 401 ||
    statusCode === 403 ||
    str.includes('401') ||
    str.includes('UNAUTHENTICATED') ||
    str.includes('PERMISSION_DENIED')
  ) {
    return {
      title: 'Требуется повторный вход',
      description:
        'Срок действия вашей сессии истёк или токен недействителен. Пожалуйста, войдите в систему заново.',
      category: 'auth',
      isRetryable: false,
      code: errorCode || 'AUTH_ERROR',
      details: str,
    };
  }

  // 5. Network / Timeout
  if (
    statusCode === 504 ||
    lower.includes('timeout') ||
    lower.includes('failed to fetch') ||
    lower.includes('networkerror') ||
    lower.includes('сеть') ||
    str.includes('ECONNREFUSED')
  ) {
    return {
      title: 'Проблема с подключением',
      description:
        'Не удалось получить ответ от сервера. Проверьте интернет-соединение или повторите попытку через минуту.',
      category: 'network',
      isRetryable: true,
      code: errorCode || 'NETWORK_ERROR',
      details: str,
    };
  }

  // 6. Generic / Fallback
  const cleanMsg = extractInnermostMessage(str);
  return {
    title: 'Не удалось получить экспертизу',
    description: cleanMsg || 'Произошла непредвиденная ошибка при анализе технического задания.',
    category: 'unknown',
    isRetryable: true,
    code: errorCode || 'INTERNAL_ERROR',
    details: str !== cleanMsg ? str : undefined,
  };
};

export const extractErrorMessage = (error: unknown): string => {
  const parsed = parseAppError(error);
  return parsed.description;
};
