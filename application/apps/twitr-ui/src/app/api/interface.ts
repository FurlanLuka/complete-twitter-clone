import { ApiError } from './api-error';

export interface ApiErrorResponse {
  statusCode: number;
  message: string;
  error?: string;
  requiredScopes?: string[];
}

export enum RequestState {
  LOADING = 'LOADING',
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS',
  IDLE = 'IDLE',
  LOADING_NEXT_PAGE = 'LOADING_NEXT_PAGE',
  ERROR_NEXT_PAGE = 'ERROR_NEXT_PAGE',
}

interface LoadingQueryResponse {
  state: RequestState.LOADING;
}

interface ErrorQueryResponse {
  state: RequestState.ERROR;
  error: ApiError;
}

interface SuccessQueryResponse<T = any> {
  state: RequestState.SUCCESS;
  data: T;
}

interface IdleQueryResponse {
  state: RequestState.IDLE;
}

export type QueryResponse<T> =
  | LoadingQueryResponse
  | ErrorQueryResponse
  | SuccessQueryResponse<T>
  | IdleQueryResponse;
