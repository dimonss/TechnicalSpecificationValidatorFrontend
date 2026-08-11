import { apiClient } from '@/shared/api/client';
import type { ValidationReport } from '@/entities/validation-report';

export interface ValidateSpecPayload {
  text: string;
}

export const validateSpec = async (payload: ValidateSpecPayload): Promise<ValidationReport> => {
  const { data } = await apiClient.post<ValidationReport>('/validate', payload);
  return data;
};
