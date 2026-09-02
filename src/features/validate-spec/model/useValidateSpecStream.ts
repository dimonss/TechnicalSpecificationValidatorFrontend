import { useState, useRef, useCallback, useEffect } from 'react';
import type { ValidationReport } from '@/entities/validation-report';
import { validateSpecStream } from '../api/validateSpecStream';

export interface UseValidateSpecStreamOptions {
  onSuccess?: (report: ValidationReport) => void;
  onError?: (message: string) => void;
}

export const useValidateSpecStream = ({
  onSuccess,
  onError,
}: UseValidateSpecStreamOptions = {}) => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingMarkdown, setStreamingMarkdown] = useState('');
  const [report, setReport] = useState<ValidationReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  const abort = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsStreaming(false);
  }, []);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const validate = useCallback(
    async (text: string) => {
      abort();

      const controller = new AbortController();
      abortControllerRef.current = controller;

      setIsStreaming(true);
      setStreamingMarkdown('');
      setReport(null);
      setError(null);

      await validateSpecStream({
        text,
        signal: controller.signal,
        onChunk: (_chunk) => {
          setStreamingMarkdown((prev) => prev + _chunk);
        },
        onDone: (finalReport) => {
          setIsStreaming(false);
          setReport(finalReport);
          setStreamingMarkdown('');
          abortControllerRef.current = null;
          onSuccess?.(finalReport);
        },
        onError: (err) => {
          setIsStreaming(false);
          setError(err.message);
          abortControllerRef.current = null;
          onError?.(err.message);
        },
      });
    },
    [abort, onSuccess, onError],
  );

  const reset = useCallback(() => {
    abort();
    setReport(null);
    setStreamingMarkdown('');
    setError(null);
  }, [abort]);

  return {
    validate,
    abort,
    reset,
    isStreaming,
    streamingMarkdown,
    report,
    error,
    setReport,
    setError,
  };
};
