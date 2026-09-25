import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import {
  loginWithGoogle,
  loginWithTelegram,
  useAuth,
  type GoogleAuthPayload,
  type TelegramAuthPayload,
} from '@/shared/auth';
import { env } from '@/shared/config/env';
import { extractErrorMessage } from '@/shared/api/extractError';
import { GoogleLoginButton } from '@/features/auth/google-login';
import { TelegramLoginButton } from '@/features/auth/telegram-login';

export const LoginPage = () => {
  const { setSession } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const telegramMutation = useMutation({
    mutationFn: (payload: TelegramAuthPayload) => loginWithTelegram(payload),
    onSuccess: (session) => {
      setSession(session, 'telegram');
      setError(null);
    },
    onError: (err) => setError(extractErrorMessage(err)),
  });

  const googleMutation = useMutation({
    mutationFn: (payload: GoogleAuthPayload) => loginWithGoogle(payload),
    onSuccess: (session) => {
      setSession(session, 'google');
      setError(null);
    },
    onError: (err) => setError(extractErrorMessage(err)),
  });

  const isBusy = telegramMutation.isPending || googleMutation.isPending;

  return (
    <div className="flex min-h-full items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm shadow-slate-200/40">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
              aria-hidden="true"
            >
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-slate-900">
            Валидатор технического задания
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Войдите, чтобы получить доступ к AI-экспертизе ТЗ. Лимит — 10 проверок в сутки.
          </p>
        </div>

        <div className="space-y-3">
          {isBusy && (
            <p className="text-center text-xs text-slate-500">Авторизуемся…</p>
          )}

          <div className="flex justify-center">
            <TelegramLoginButton
              botUsername={env.telegramBotUsername}
              onAuth={(payload) => telegramMutation.mutate(payload)}
            />
          </div>

          <div className="relative my-3">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-3 text-xs uppercase tracking-wide text-slate-400">
                или
              </span>
            </div>
          </div>

          <div className="flex justify-center">
            {env.googleClientId ? (
              <GoogleLoginButton
                onIdToken={(idToken) => googleMutation.mutate({ idToken })}
                onError={() => setError('Не удалось получить ответ от Google. Попробуйте ещё раз.')}
              />
            ) : (
              <div className="w-full rounded-lg border border-dashed border-amber-300 bg-amber-50 px-4 py-3 text-xs text-amber-800">
                Google-логин отключён: переменная <code>VITE_GOOGLE_CLIENT_ID</code> не задана.
              </div>
            )}
          </div>
        </div>

        {error && (
          <p className="mt-5 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
            {error}
          </p>
        )}

        <p className="mt-6 text-center text-[11px] text-slate-400">
          Авторизация выполняется через сервис ChalyshAuth. Мы не получаем ваш пароль.
        </p>
      </div>
    </div>
  );
};
