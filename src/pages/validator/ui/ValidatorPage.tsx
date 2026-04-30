import { useState } from 'react';
import type { ValidationReport } from '@/entities/validation-report';
import { useLoadTemplate, useValidateSpec } from '@/features/validate-spec';
import { SpecInputPanel } from '@/widgets/spec-input-panel';
import { ValidationResultPanel } from '@/widgets/validation-result-panel';

export const ValidatorPage = () => {
  const [report, setReport] = useState<ValidationReport | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [exampleText, setExampleText] = useState<string | undefined>(undefined);
  const [templateError, setTemplateError] = useState<string | null>(null);

  const validate = useValidateSpec({
    onSuccess: (data) => {
      setReport(data);
      setErrorMessage(null);
    },
    onError: (message) => {
      setReport(null);
      setErrorMessage(message);
    },
  });

  const template = useLoadTemplate({
    onSuccess: (data) => {
      setExampleText(data.markdown);
      setTemplateError(null);
    },
    onError: (message) => {
      setTemplateError(message);
    },
  });

  const handleSubmit = (text: string) => {
    setErrorMessage(null);
    setReport(null);
    validate.mutate({ text });
  };

  const handleLoadExample = () => {
    setTemplateError(null);
    template.mutate();
  };

  return (
    <div className="min-h-full">
      <header className="border-b border-slate-200 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-1 px-6 py-5 sm:px-8">
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
            <h1 className="text-xl font-semibold tracking-tight text-slate-900">
              Валидатор технического задания
            </h1>
          </div>
          <p className="text-sm text-slate-600">
            AI-экспертиза ТЗ на базе Google Gemini: проверка полноты, однозначности и проверяемости
            требований.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-6 sm:px-8 sm:py-8">
        <div className="grid h-[calc(100vh-9.5rem)] min-h-[600px] grid-cols-1 gap-6 lg:grid-cols-2">
          <SpecInputPanel
            onSubmit={handleSubmit}
            isSubmitting={validate.isPending}
            onLoadExample={handleLoadExample}
            isExampleLoading={template.isPending}
            exampleText={exampleText}
            templateError={templateError}
          />
          <ValidationResultPanel
            report={report}
            isLoading={validate.isPending}
            errorMessage={errorMessage}
          />
        </div>
      </main>
    </div>
  );
};
