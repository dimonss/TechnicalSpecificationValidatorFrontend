import { useMutation } from '@tanstack/react-query';
import { validateSpec, type ValidateSpecPayload } from '../api/validateSpec';
import type { ValidationReport } from '@/entities/validation-report';
import { extractErrorMessage } from '@/shared/api/extractError';

export interface UseValidateSpecOptions {
  onSuccess?: (data: ValidationReport) => void;
  onError?: (message: string) => void;
}

export const useValidateSpec = ({ onSuccess, onError }: UseValidateSpecOptions = {}) => {
  return useMutation<ValidationReport, unknown, ValidateSpecPayload>({
    mutationFn: validateSpec,
    onSuccess,
    onError: (error) => {
      onError?.(extractErrorMessage(error));
    },
  });
};
