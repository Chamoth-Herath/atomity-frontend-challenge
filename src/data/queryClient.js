import { QueryClient } from '@tanstack/react-query';
import { fetchCosts } from './costs.js';

export const cacheSettings = {
  staleTime: 5 * 60 * 1000,
  gcTime: 30 * 60 * 1000,
  retry: 1,
  refetchOnWindowFocus: false,
};

export const queryClient = new QueryClient({ defaultOptions: { queries: cacheSettings } });
export const costQuery = { queryKey: ['example-cloud-costs'], queryFn: fetchCosts };
