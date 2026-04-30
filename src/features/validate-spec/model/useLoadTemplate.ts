import { useMutation } from '@tanstack/react-query';
import { loadTemplate, type TemplateResponse } from '../api/loadTemplate';
import { extractErrorMessage } from '@/shared/api/extractError';

export interface UseLoadTemplateOptions {
  onSuccess?: (data: TemplateResponse) => void;
  onError?: (message: string) => void;
}

export const useLoadTemplate = ({ onSuccess, onError }: UseLoadTemplateOptions = {}) => {
  return useMutation<TemplateResponse, unknown, void>({
    mutationFn: loadTemplate,
    onSuccess,
    onError: (error) => {
      onError?.(extractErrorMessage(error));
    },
  });
};
