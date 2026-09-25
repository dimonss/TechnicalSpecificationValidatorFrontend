import { QuotaBadge, useQuota } from '@/features/quota';
import { LogoutButton } from '@/features/auth/logout';
import { useAuth } from '@/shared/auth';

export const Header = () => {
  const { user, isAuthenticated, activeProvider, availableProviders, switchProvider } = useAuth();
  const { data: usage, isPending } = useQuota(isAuthenticated);

  const displayName = user
    ? [user.firstName, user.lastName].filter(Boolean).join(' ') || user.username || 'Пользователь'
    : '';

  const initials = user
    ? [user.firstName?.[0], user.lastName?.[0]]
        .filter(Boolean)
        .join('')
        .toUpperCase() || '?'
    : '?';

  return (
    <header className="border-b border-slate-200 bg-white/70 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 sm:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </svg>
          </div>
          <div className="leading-tight">
            <h1 className="text-base font-semibold tracking-tight text-slate-900">
              Валидатор технического задания
            </h1>
            <p className="text-[11px] text-slate-500">AI-экспертиза на базе Google Gemini</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <QuotaBadge usage={usage} isLoading={isPending} />

          {user && (
            <div className="flex items-center gap-2">
              {activeProvider && (
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${
                    activeProvider === 'google'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'bg-sky-50 text-sky-700 border border-sky-200'
                  }`}
                >
                  <span>{activeProvider === 'google' ? '🔵' : '✈️'}</span>
                  <span className="capitalize">{activeProvider}</span>
                </span>
              )}

              {availableProviders.length > 1 && (
                <button
                  type="button"
                  onClick={() => {
                    const nextProvider = activeProvider === 'google' ? 'telegram' : 'google';
                    switchProvider(nextProvider);
                  }}
                  title={`Переключить на ${activeProvider === 'google' ? 'Telegram' : 'Google'}`}
                  className="rounded border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-600 hover:bg-slate-50 transition-colors shadow-sm"
                >
                  🔄 {activeProvider === 'google' ? 'TG' : 'Google'}
                </button>
              )}

              {user.photoUrl ? (
                <img
                  src={user.photoUrl}
                  alt={displayName}
                  className="h-8 w-8 rounded-full object-cover ring-1 ring-slate-200"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600 ring-1 ring-slate-200">
                  {initials}
                </div>
              )}
              <span className="hidden text-sm text-slate-700 sm:inline">{displayName}</span>
            </div>
          )}

          <LogoutButton />
        </div>
      </div>
    </header>
  );
};
