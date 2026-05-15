import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getUsage } from '../api/getUsage';
import type { UsageInfo } from '@/entities/validation-report';

const USAGE_QUERY_KEY = ['quota', 'usage'] as const;

export const useQuota = (enabled: boolean) => {
  return useQuery<UsageInfo>({
    queryKey: USAGE_QUERY_KEY,
    queryFn: getUsage,
    enabled,
    staleTime: 30_000,
  });
};

export const useSetUsage = () => {
  const client = useQueryClient();
  return (usage: UsageInfo) => {
    client.setQueryData<UsageInfo>([...USAGE_QUERY_KEY], usage);
  };
};

export const useInvalidateUsage = () => {
  const client = useQueryClient();
  return () => {
    void client.invalidateQueries({ queryKey: USAGE_QUERY_KEY });
  };
};
