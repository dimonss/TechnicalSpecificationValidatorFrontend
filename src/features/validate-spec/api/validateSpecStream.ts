import { env } from '@/shared/config/env';
import { tokenStorage } from '@/shared/auth/tokenStorage';
import type { ValidationReport } from '@/entities/validation-report';

export interface ValidateSpecStreamOptions {
  text: string;
  signal?: AbortSignal;
  onChunk: (chunk: string) => void;
  onDone: (report: ValidationReport) => void;
  onError: (error: Error) => void;
}

export const validateSpecStream = async ({
  text,
  signal,
  onChunk,
  onDone,
  onError,
}: ValidateSpecStreamOptions): Promise<void> => {
  const url = `${env.apiBaseUrl}/validate/stream`;
  const token = tokenStorage.readAccessToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({ text }),
      signal,
    });

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status} ${response.statusText}`;
      try {
        const errJson = await response.json();
        if (errJson?.error?.message) {
          errorMessage = errJson.error.message;
        }
      } catch {
        // ignore json parse error
      }
      throw new Error(errorMessage);
    }

    if (!response.body) {
      throw new Error('Ответ сервера не содержит данных потока');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';
    let accumulatedMarkdown = '';
    let completed = false;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const parts = buffer.split('\n\n');
      buffer = parts.pop() ?? '';

      for (const part of parts) {
        if (!part.trim()) continue;

        let eventType = 'message';
        let dataStr = '';

        const lines = part.split('\n');
        for (const line of lines) {
          if (line.startsWith('event: ')) {
            eventType = line.slice(7).trim();
          } else if (line.startsWith('data: ')) {
            dataStr = line.slice(6).trim();
          }
        }

        if (!dataStr) continue;

        try {
          const parsed = JSON.parse(dataStr);
          if (eventType === 'chunk') {
            if (typeof parsed.text === 'string') {
              accumulatedMarkdown += parsed.text;
              onChunk(parsed.text);
            }
          } else if (eventType === 'done') {
            completed = true;
            onDone({
              markdown: accumulatedMarkdown,
              meta: parsed.meta,
              usage: parsed.usage,
            });
          } else if (eventType === 'error') {
            const msg = parsed.error?.message || 'Ошибка потоковой генерации';
            throw new Error(msg);
          }
        } catch (parseErr) {
          if (eventType === 'error') {
            throw parseErr;
          }
        }
      }
    }

    if (!completed && !signal?.aborted && accumulatedMarkdown) {
      onDone({
        markdown: accumulatedMarkdown,
        meta: { model: 'gemini', durationMs: 0 },
        usage: { limit: 0, used: 0, remaining: 0, resetsAt: '' },
      });
    }
  } catch (error) {
    if (signal?.aborted) return;
    const err = error instanceof Error ? error : new Error(String(error));
    onError(err);
  }
};
