import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useAuth, loginWithGoogle, loginWithTelegram } from '@/shared/auth';
import { GoogleLoginButton } from '@/features/auth/google-login';
import { TelegramLoginButton } from '@/features/auth/telegram-login';
import { env } from '@/shared/config/env';
import { Button } from '@/shared/ui/Button';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LogoutModal = ({ isOpen, onClose }: LogoutModalProps) => {
  const { logout, setSession, availableProviders } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isProcessing) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isProcessing, onClose]);

  if (!isOpen) return null;

  const hasGoogle = availableProviders.includes('google');
  const hasTelegram = availableProviders.includes('telegram');

  const handleLogoutAction = async (target: 'google' | 'telegram' | 'all') => {
    setIsProcessing(true);
    try {
      await logout(target);
      onClose();
    } finally {
      setIsProcessing(false);
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div className="flex min-h-full items-center justify-center p-4 sm:p-6 text-center">
        <div
          className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-xl my-8 flex flex-col max-h-[calc(100vh-4rem)]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-900">Выход из аккаунта</h3>
                <p className="text-xs text-slate-500">Управление активными сессиями</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 rounded-lg p-1.5 hover:bg-slate-100 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="6" />
              </svg>
            </button>
          </div>

          {/* Scrollable Content Body */}
          <div className="overflow-y-auto py-2 pr-1 -mr-1 space-y-3.5">
            {/* SSO Warning */}
            <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-3.5 text-xs text-amber-800 flex items-start gap-2.5 leading-relaxed">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              <div>
                <strong className="block font-semibold text-amber-900 mb-0.5">
                  Сквозная авторизация экосистемы chalysh.pro
                </strong>
                Выход будет выполнен во всех веб-приложениях экосистемы (HealthChecker, Брелоки, Ретроспектива, Валидатор ТЗ, Space Shooter, ChalyshAuth).
              </div>
            </div>

        {/* Options */}
        {hasGoogle && hasTelegram ? (
          <div className="space-y-2.5">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Выберите вариант выхода:
            </p>

            <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/50">
              <div>
                <div className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                  <span>🔵</span> Google
                </div>
                <div className="text-xs text-slate-500">
                  Завершить сессию Google. Telegram останется активным.
                </div>
              </div>
              <Button
                variant="secondary"
                disabled={isProcessing}
                className="px-3 py-1.5 text-xs"
                onClick={() => handleLogoutAction('google')}
              >
                Выйти из Google
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/50">
              <div>
                <div className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                  <span>✈️</span> Telegram
                </div>
                <div className="text-xs text-slate-500">
                  Завершить сессию Telegram. Google останется активным.
                </div>
              </div>
              <Button
                variant="secondary"
                disabled={isProcessing}
                className="px-3 py-1.5 text-xs"
                onClick={() => handleLogoutAction('telegram')}
              >
                Выйти из Telegram
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl border border-rose-200 bg-rose-50/50">
              <div>
                <div className="text-sm font-semibold text-rose-700 flex items-center gap-1.5">
                  <span>🚪</span> Выйти со всех сразу
                </div>
                <div className="text-xs text-slate-500">
                  Полный выход из обоих аккаунтов во всех сервисах.
                </div>
              </div>
              <Button
                variant="primary"
                disabled={isProcessing}
                className="bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 text-xs"
                onClick={() => handleLogoutAction('all')}
              >
                Выйти со всех
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
              <div>
                <div className="text-sm font-semibold text-slate-800">
                  {hasGoogle ? '🔵 Google (активен)' : '✈️ Telegram (активен)'}
                </div>
                <div className="text-xs text-slate-500">Текущий аккаунт</div>
              </div>
              <Button
                variant="primary"
                disabled={isProcessing}
                className="bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 text-xs"
                onClick={() => handleLogoutAction('all')}
              >
                Выйти со всех сервисов
              </Button>
            </div>

            {/* Authorize other provider */}
            <div className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-4 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-900">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="8.5" cy="7" r="4" />
                  <line x1="20" y1="8" x2="20" y2="14" />
                  <line x1="23" y1="11" x2="17" y2="11" />
                </svg>
                <span>Войти другим способом</span>
              </div>
              <p className="text-xs text-slate-600">
                {hasGoogle
                  ? 'Вы можете также войти через Telegram, чтобы переключаться между разными учетными записями:'
                  : 'Вы можете также войти через Google, чтобы переключаться между разными учетными записями:'}
              </p>
              <div className="flex justify-center pt-2">
                {hasGoogle ? (
                  <TelegramLoginButton
                    botUsername={env.telegramBotUsername}
                    onAuth={async (payload) => {
                      try {
                        const session = await loginWithTelegram(payload);
                        setSession(session, 'telegram');
                      } catch (err) {
                        console.error('Telegram login failed', err);
                      }
                    }}
                  />
                ) : env.googleClientId ? (
                  <GoogleLoginButton
                    onIdToken={async (idToken) => {
                      try {
                        const session = await loginWithGoogle({ idToken });
                        setSession(session, 'google');
                      } catch (err) {
                        console.error('Google login failed', err);
                      }
                    }}
                  />
                ) : null}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex justify-end pt-3 mt-3 border-t border-slate-100 shrink-0">
        <Button variant="secondary" onClick={onClose} disabled={isProcessing}>
          Отмена
        </Button>
      </div>
    </div>
  </div>
</div>,
document.body
);
};
