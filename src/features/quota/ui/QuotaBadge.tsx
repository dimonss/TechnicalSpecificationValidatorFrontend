import { cn } from '@/shared/lib/cn';
import type { UsageInfo } from '@/entities/validation-report';

interface QuotaBadgeProps {
  usage: UsageInfo | undefined;
  isLoading?: boolean;
  className?: string;
}

const formatResetTime = (iso: string): string => {
  try {
    const date = new Date(iso);
    return new Intl.DateTimeFormat('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      timeZone: 'UTC',
    }).format(date) + ' UTC';
  } catch {
    return iso;
  }
};

export const QuotaBadge = ({ usage, isLoading, className }: QuotaBadgeProps) => {
  if (isLoading && !usage) {
    return (
      <span className={cn('text-xs text-slate-400', className)}>Загружаем лимит…</span>
    );
  }

  if (!usage) return null;

  const exhausted = usage.remaining === 0;
  const low = usage.remaining > 0 && usage.remaining <= Math.max(1, Math.floor(usage.limit * 0.2));

  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium',
        exhausted
          ? 'border-rose-200 bg-rose-50 text-rose-700'
          : low
            ? 'border-amber-200 bg-amber-50 text-amber-800'
            : 'border-indigo-200 bg-indigo-50 text-indigo-700',
        className,
      )}
      title={`Сброс лимита в ${formatResetTime(usage.resetsAt)}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-3.5 w-3.5"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="9" />
        <polyline points="12 7 12 12 15 14" />
      </svg>
      {exhausted
        ? `Лимит исчерпан · сброс ${formatResetTime(usage.resetsAt)}`
        : `Осталось ${usage.remaining} из ${usage.limit} запросов`}
    </span>
  );
};
