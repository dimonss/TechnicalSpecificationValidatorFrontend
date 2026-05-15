import { apiClient } from '@/shared/api/client';
import type { UsageInfo } from '@/entities/validation-report';

export const getUsage = async (): Promise<UsageInfo> => {
  const { data } = await apiClient.get<UsageInfo>('/api/usage');
  return data;
};
