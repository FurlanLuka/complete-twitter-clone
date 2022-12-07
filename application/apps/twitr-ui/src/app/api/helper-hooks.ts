import {
  MutationFunction,
  MutationKey,
  QueryKey,
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQuery,
  UseQueryOptions,
} from '@tanstack/react-query';
import { useSession } from '../authentication/use-session';
import { ApiError, ApiErrors } from './api-error';
import {
  DefaultVariables,
  MutationQueryResponse,
  MutationState,
  QueryResponse,
  RequestState,
} from './interface';

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

export const useExtendedMutation = <TData, TVariables extends DefaultVariables>(
  mutationKey: MutationKey,
  mutationFn: MutationFunction<TData, TVariables>,
  options?: Omit<
    UseMutationOptions<TData, ApiErrors, TVariables, unknown>,
    'mutationKey' | 'mutationFn'
  >
): UseMutationResult<TData, ApiError, TVariables> => {
  const { getAccessToken } = useSession();

  const request = useMutation<TData, ApiError, TVariables>(
    mutationKey,
    async (payload: TVariables) => {
      const accessToken = await getAccessToken();

      return await mutationFn({
        ...payload,
        accessToken,
      });
    },
    options
  );

  return request;
};
