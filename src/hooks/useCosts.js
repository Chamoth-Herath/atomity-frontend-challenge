import { useQuery } from '@tanstack/react-query';
import { costQuery } from '../data/queryClient';

export default function useCosts() {
  return useQuery(costQuery);
}
