import { apiClient } from '@/shared/api/client';

export interface TemplateResponse {
  markdown: string;
}

export const loadTemplate = async (): Promise<TemplateResponse> => {
  const { data } = await apiClient.get<TemplateResponse>('/template');
  return data;
};
