import { useState } from 'react';
import { useLoadTemplate, useValidateSpecStream } from '@/features/validate-spec';
import { useInvalidateUsage, useQuota, useSetUsage } from '@/features/quota';
import { useAuth } from '@/shared/auth';
import { Header } from '@/widgets/header';
import { SpecInputPanel } from '@/widgets/spec-input-panel';
import { ValidationResultPanel } from '@/widgets/validation-result-panel';

export const ValidatorPage = () => {
  const { isAuthenticated } = useAuth();
  const [exampleText, setExampleText] = useState<string | undefined>(undefined);
  const [templateError, setTemplateError] = useState<string | null>(null);

  const { data: usage } = useQuota(isAuthenticated);
  const setUsage = useSetUsage();
  const invalidateUsage = useInvalidateUsage();

  const {
    validate,
    abort,
    isStreaming,
    streamingMarkdown,
    report,
    error: streamError,
  } = useValidateSpecStream({
    onSuccess: (data) => {
      setUsage(data.usage);
    },
    onError: () => {
      invalidateUsage();
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

  const [lastSubmittedText, setLastSubmittedText] = useState<string>('');

  const handleSubmit = (text: string) => {
    setLastSubmittedText(text);
    validate(text);
  };

  const handleRetry = () => {
    if (lastSubmittedText) {
      validate(lastSubmittedText);
    }
  };

  const handleLoadExample = () => {
    setTemplateError(null);
    template.mutate();
  };

  const submitDisabledReason =
    usage && usage.remaining === 0
      ? 'Дневной лимит исчерпан. Дождитесь сброса лимита.'
      : null;

  return (
    <div className="min-h-full">
      <Header />

      <main className="mx-auto max-w-7xl px-6 py-6 sm:px-8 sm:py-8">
        <div className="grid h-[calc(100vh-7.5rem)] min-h-[600px] grid-cols-1 gap-6 lg:grid-cols-2">
          <SpecInputPanel
            onSubmit={handleSubmit}
            isSubmitting={isStreaming}
            onAbort={abort}
            onLoadExample={handleLoadExample}
            isExampleLoading={template.isPending}
            exampleText={exampleText}
            templateError={templateError}
            submitDisabledReason={submitDisabledReason}
          />
          <ValidationResultPanel
            report={report}
            isLoading={isStreaming}
            streamingMarkdown={streamingMarkdown}
            errorMessage={streamError}
            onRetry={lastSubmittedText ? handleRetry : undefined}
          />
        </div>
      </main>
    </div>
  );
};

