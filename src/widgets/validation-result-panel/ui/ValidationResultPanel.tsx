import { useState } from 'react';
import { MarkdownReport, type ValidationReport } from '@/entities/validation-report';
import { Card, CardBody, CardFooter, CardHeader } from '@/shared/ui/Card';
import { Spinner } from '@/shared/ui/Spinner';
import { Button } from '@/shared/ui/Button';
import { parseAppError } from '@/shared/api/extractError';

interface ValidationResultPanelProps {
  report: ValidationReport | null;
  isLoading: boolean;
  streamingMarkdown?: string;
  errorMessage: string | null;
  onRetry?: () => void;
}

const formatDuration = (ms: number): string => {
  if (ms < 1000) return `${ms} мс`;
  return `${(ms / 1000).toFixed(1)} с`;
};

export const ValidationResultPanel = ({
  report,
  isLoading,
  streamingMarkdown,
  errorMessage,
  onRetry,
}: ValidationResultPanelProps) => {
  const isStreamingWithContent = Boolean(isLoading && streamingMarkdown);
  const activeMarkdown = report?.markdown ?? (isStreamingWithContent ? streamingMarkdown : null);


  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Результат экспертизы</h2>
            <p className="mt-0.5 text-xs text-slate-500">
              AI-разбор ТЗ по критериям полноты, однозначности и проверяемости
            </p>
          </div>
          {isLoading && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-500"></span>
              </span>
              Генерация...
            </span>
          )}
          {!isLoading && report?.meta && (
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
              {report.meta.model} · {formatDuration(report.meta.durationMs)}
            </span>
          )}
        </div>
      </CardHeader>

      <CardBody className="flex-1 overflow-auto">
        {isLoading && !isStreamingWithContent && <LoadingState />}
        {!isLoading && errorMessage && <ErrorState message={errorMessage} onRetry={onRetry} />}
        {!isLoading && !errorMessage && !activeMarkdown && <EmptyState />}
        {activeMarkdown && (
          <div className="space-y-4">
            <MarkdownReport markdown={activeMarkdown} />
            {isStreamingWithContent && (
              <div className="flex items-center gap-2 rounded-md bg-indigo-50/80 px-3 py-2 text-xs text-indigo-700">
                <Spinner size={14} />
                <span>Печатает отчёт...</span>
              </div>
            )}
          </div>
        )}
      </CardBody>

      {report && !isLoading && !errorMessage && (
        <CardFooter className="bg-slate-50/60 text-xs text-slate-500">
          Сгенерировано Google Gemini. Перепроверяйте ключевые выводы вручную.
        </CardFooter>
      )}
    </Card>
  );
};

const LoadingState = () => (
  <div className="flex h-full min-h-[320px] flex-col items-center justify-center gap-4 text-slate-500">
    <Spinner size={36} />
    <div className="text-center">
      <p className="text-sm font-medium text-slate-700">Анализируем техническое задание</p>
      <p className="mt-1 text-xs">Обычно занимает 5–20 секунд</p>
    </div>
  </div>
);

const ErrorState = ({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [copied, setCopied] = useState(false);
  const parsed = parseAppError(message);

  const isWarning = parsed.category === 'overloaded';

  const handleCopyDetails = () => {
    if (parsed.details) {
      navigator.clipboard.writeText(parsed.details);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex h-full min-h-[340px] flex-col items-center justify-center p-4 text-center">
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-full ${
          isWarning ? 'bg-amber-100 text-amber-600' : 'bg-rose-100 text-rose-600'
        }`}
      >
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
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="13" />
          <line x1="12" y1="16.5" x2="12.01" y2="16.5" />
        </svg>
      </div>

      <div className="mt-3 max-w-md">
        <p className="text-sm font-semibold text-slate-900">{parsed.title}</p>
        <p className="mt-1.5 text-xs leading-relaxed text-slate-600">{parsed.description}</p>
      </div>

      {onRetry && parsed.isRetryable && (
        <div className="mt-4">
          <Button variant="secondary" onClick={onRetry} className="gap-2 text-xs">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-3.5 w-3.5"
            >
              <path
                fillRule="evenodd"
                d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H4.5a.75.75 0 00-.75.75v3.732a.75.75 0 001.5 0v-2.073l.412.413a7 7 0 1010.843-3.076.75.75 0 00-1.193.95z"
                clipRule="evenodd"
              />
            </svg>
            Повторить попытку
          </Button>
        </div>
      )}

      {parsed.details && (
        <div className="mt-4 w-full max-w-md text-left">
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className={`h-3 w-3 transition-transform ${showDetails ? 'rotate-90' : ''}`}
            >
              <path
                fillRule="evenodd"
                d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                clipRule="evenodd"
              />
            </svg>
            {showDetails ? 'Скрыть технические детали' : 'Технические детали ошибки'}
          </button>

          {showDetails && (
            <div className="relative mt-2 rounded-md border border-slate-200 bg-slate-50 p-2.5">
              <div className="flex items-center justify-between pb-1">
                <span className="font-mono text-[10px] text-slate-400">
                  {parsed.code || 'RAW_ERROR'}
                </span>
                <button
                  type="button"
                  onClick={handleCopyDetails}
                  className="text-[10px] font-medium text-indigo-600 hover:text-indigo-800"
                >
                  {copied ? 'Скопировано!' : 'Копировать'}
                </button>
              </div>
              <pre className="max-h-28 overflow-auto whitespace-pre-wrap break-all font-mono text-[10px] leading-tight text-slate-700">
                {parsed.details}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};


const EmptyState = () => (
  <div className="flex h-full min-h-[320px] flex-col items-center justify-center gap-3 text-center">
    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
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
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="9" y1="13" x2="15" y2="13" />
        <line x1="9" y1="17" x2="15" y2="17" />
      </svg>
    </div>
    <div>
      <p className="text-sm font-semibold text-slate-900">Здесь появится отчёт</p>
      <p className="mt-1 max-w-md text-xs text-slate-600">
        Вставьте текст ТЗ слева и нажмите «Проверить ТЗ», чтобы AI разобрал документ по критериям.
      </p>
    </div>
  </div>
);
