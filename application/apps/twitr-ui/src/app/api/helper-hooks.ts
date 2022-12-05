import { QueryKey, useQuery, UseQueryOptions } from '@tanstack/react-query';
import { useSession } from '../authentication/use-session';
import { ApiErrors } from './api-error';
import { QueryResponse, RequestState } from './interface';

export const useExtendedQuery = <TQueryFnData>(
  queryKey: QueryKey,
  queryFn: (accessToken: string) => Promise<TQueryFnData>,
  options?: Omit<
    UseQueryOptions<TQueryFnData, ApiErrors, TQueryFnData, QueryKey>,
    'queryKey' | 'queryFn'
  >
): QueryResponse<TQueryFnData> => {
  const { getAccessToken } = useSession();

  const request = useQuery<TQueryFnData, ApiErrors>(
    queryKey,
    async (): Promise<TQueryFnData> => {
      const accessToken = await getAccessToken();

      return await queryFn(accessToken);
    },
    {
      ...options,
      refetchOnWindowFocus: false,
      cacheTime: 1000 * 60 * 15,
      staleTime: 1000 * 60 * 15,
    }
  );

  if (request.status === 'error') {
    return {
      state: RequestState.ERROR,
      error: request.error,
    };
  }

  if (request.status === 'loading') {
    return {
      state: RequestState.LOADING,
    };
  }

  if (request.status === 'success') {
    return {
      state: RequestState.SUCCESS,
      data: request.data,
    };
  }

  return {
    state: RequestState.IDLE,
  };
};
