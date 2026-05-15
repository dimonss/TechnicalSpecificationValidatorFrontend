import { useCallback, useEffect, useRef } from 'react';
import type { TelegramAuthPayload } from '@/shared/auth';

interface TelegramLoginButtonProps {
  botUsername: string;
  onAuth: (payload: TelegramAuthPayload) => void;
  buttonSize?: 'large' | 'medium' | 'small';
  cornerRadius?: number;
  requestAccess?: boolean;
  className?: string;
}

declare global {
  interface Window {
    onTelegramAuth?: (payload: TelegramAuthPayload) => void;
  }
}

const CALLBACK_NAME = '__tsvOnTelegramAuth';

export const TelegramLoginButton = ({
  botUsername,
  onAuth,
  buttonSize = 'large',
  cornerRadius = 8,
  requestAccess = true,
  className,
}: TelegramLoginButtonProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const onAuthRef = useRef(onAuth);

  useEffect(() => {
    onAuthRef.current = onAuth;
  }, [onAuth]);

  const handleAuth = useCallback((payload: TelegramAuthPayload) => {
    onAuthRef.current(payload);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !botUsername) return;

    (window as unknown as Record<string, unknown>)[CALLBACK_NAME] = handleAuth;

    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.async = true;
    script.setAttribute('data-telegram-login', botUsername);
    script.setAttribute('data-size', buttonSize);
    script.setAttribute('data-radius', String(cornerRadius));
    script.setAttribute('data-onauth', `${CALLBACK_NAME}(user)`);
    if (requestAccess) {
      script.setAttribute('data-request-access', 'write');
    }

    container.appendChild(script);

    return () => {
      while (container.firstChild) container.removeChild(container.firstChild);
      delete (window as unknown as Record<string, unknown>)[CALLBACK_NAME];
    };
  }, [botUsername, buttonSize, cornerRadius, requestAccess, handleAuth]);

  if (!botUsername) {
    return (
      <div className="rounded-lg border border-dashed border-amber-300 bg-amber-50 px-4 py-3 text-xs text-amber-800">
        Telegram-логин отключён: переменная <code>VITE_TELEGRAM_BOT_USERNAME</code> не задана.
      </div>
    );
  }

  return <div ref={containerRef} className={className} />;
};
