import axios, {
  type AxiosError,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from 'axios';
import { env } from '@/shared/config/env';
import { refreshTokens } from '@/shared/auth/api';
import { tokenStorage } from '@/shared/auth/tokenStorage';
import { emitAuthLogout, emitTokenRefreshed } from '@/shared/auth/events';

export const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 120_000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = tokenStorage.readAccessToken();
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }
  return config;
});

type RetryableConfig = AxiosRequestConfig & { _retry?: boolean };

let refreshPromise: Promise<string | null> | null = null;

const performRefresh = async (): Promise<string | null> => {
  if (refreshPromise) return refreshPromise;

  const refreshToken = tokenStorage.readRefreshToken();
  if (!refreshToken) return null;

  refreshPromise = refreshTokens(refreshToken)
    .then((pair) => {
      tokenStorage.writeTokens(pair);
      emitTokenRefreshed();
      return pair.accessToken;
    })
    .catch(() => {
      tokenStorage.clear();
      emitAuthLogout();
      return null;
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as RetryableConfig | undefined;
    const status = error.response?.status;

    if (status === 401 && original && !original._retry) {
      original._retry = true;
      const newAccessToken = await performRefresh();
      if (newAccessToken) {
        if (!original.headers) original.headers = {};
        (original.headers as Record<string, string>)['Authorization'] = `Bearer ${newAccessToken}`;
        return apiClient.request(original);
      }
    }

    return Promise.reject(error);
  },
);
