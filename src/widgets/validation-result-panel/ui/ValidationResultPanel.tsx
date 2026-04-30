import { MarkdownReport, type ValidationReport } from '@/entities/validation-report';
import { Card, CardBody, CardFooter, CardHeader } from '@/shared/ui/Card';
import { Spinner } from '@/shared/ui/Spinner';

interface ValidationResultPanelProps {
  report: ValidationReport | null;
  isLoading: boolean;
  errorMessage: string | null;
}

const formatDuration = (ms: number): string => {
  if (ms < 1000) return `${ms} мс`;
  return `${(ms / 1000).toFixed(1)} с`;
};

export const ValidationResultPanel = ({
  report,
  isLoading,
  errorMessage,
}: ValidationResultPanelProps) => {
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
          {report?.meta && (
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
              {report.meta.model} · {formatDuration(report.meta.durationMs)}
            </span>
          )}
        </div>
      </CardHeader>

      <CardBody className="flex-1 overflow-auto">
        {isLoading && <LoadingState />}
        {!isLoading && errorMessage && <ErrorState message={errorMessage} />}
        {!isLoading && !errorMessage && !report && <EmptyState />}
        {!isLoading && !errorMessage && report && <MarkdownReport markdown={report.markdown} />}
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

const ErrorState = ({ message }: { message: string }) => (
  <div className="flex h-full min-h-[320px] flex-col items-center justify-center gap-3 text-center">
    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600">
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
    <div>
      <p className="text-sm font-semibold text-slate-900">Не удалось получить экспертизу</p>
      <p className="mt-1 max-w-md text-xs text-slate-600">{message}</p>
    </div>
  </div>
);

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
