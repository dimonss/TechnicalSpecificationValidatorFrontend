import axios from 'axios';

export interface ApiErrorPayload {
  error: {
    code: string;
    message: string;
  };
}

export const extractErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError<ApiErrorPayload>(error)) {
    const payload = error.response?.data;
    if (payload && typeof payload === 'object' && 'error' in payload && payload.error?.message) {
      return payload.error.message;
    }
    if (error.code === 'ECONNABORTED') {
      return 'Превышено время ожидания ответа от сервера. Попробуйте ещё раз.';
    }
    if (error.message) {
      return `Ошибка сети: ${error.message}`;
    }
  }
  if (error instanceof Error) return error.message;
  return 'Неизвестная ошибка';
};
