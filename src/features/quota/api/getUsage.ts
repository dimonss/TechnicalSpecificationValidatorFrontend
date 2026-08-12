import { apiClient } from '@/shared/api/client';
import type { UsageInfo } from '@/entities/validation-report';

export const getUsage = async (): Promise<UsageInfo> => {
  try {
    const { data } = await apiClient.get<UsageInfo>('/usage');
    return data;
  } catch {
    return {
      used: 0,
      limit: 10,
      remaining: 10,
      resetsAt: new Date(Date.now() + 86400000).toISOString(),
    };
  }
};
