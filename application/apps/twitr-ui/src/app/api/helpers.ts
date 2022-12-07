import {
  ApiError,
  ApiErrors,
  UnauthenticatedApiError,
  UnauthorizedApiError,
} from './api-error';
import { ApiErrorResponse } from './interface';
import axios, { AxiosResponse, AxiosError, AxiosRequestConfig } from 'axios';

export const mapErrorResponse = (
  apiErrorResponse: ApiErrorResponse,
  errorList: Map<string, string>,
): ApiErrors => {
  if (apiErrorResponse.statusCode === 401) {
    return new UnauthenticatedApiError();
  }
  if (apiErrorResponse.statusCode === 403) {
    return new UnauthorizedApiError(
      apiErrorResponse.message,
      apiErrorResponse.requiredScopes,
    );
  }

  const errorName: string = apiErrorResponse.message;

  const errorMessage: string | undefined = errorList.get(errorName);

  if (errorMessage === undefined) {
    if (apiErrorResponse.error === undefined) {
      return new ApiError('Unexpected error, please contact support.', 500);
    }

    return new ApiError('apiErrorResponse.error', apiErrorResponse.statusCode);
  }

  return new ApiError(
    apiErrorResponse.message,
    apiErrorResponse.statusCode,
    errorMessage,
  );
};

export const getRequest = async <Response = any>(
  endpoint: string,
  requestConfig: AxiosRequestConfig,
  errorList: Map<string, string>,
): Promise<Response> => {
  try {
    const response: AxiosResponse<Response> = await axios.get(
      endpoint,
      requestConfig,
    );

    return response.data;
  } catch (error: any) {
    const errorObject: AxiosError<ApiErrorResponse> = error;

    throw mapErrorResponse(
      (errorObject.response as AxiosResponse<ApiErrorResponse>).data,
      errorList,
    );
  }
};

export const deleteRequest = async <Response = any>(
  endpoint: string,
  requestConfig: AxiosRequestConfig,
  errorList: Map<string, string>,
): Promise<Response> => {
  try {
    const response: AxiosResponse<Response> = await axios.delete(
      endpoint,
      requestConfig,
    );

    return response.data;
  } catch (error: any) {
    const errorObject: AxiosError<ApiErrorResponse> = error;

    throw mapErrorResponse(
      (errorObject.response as AxiosResponse<ApiErrorResponse>).data,
      errorList,
    );
  }
};

export const postRequest = async <Payload = any, Response = any>(
  endpoint: string,
  payload: Payload,
  requestConfig: AxiosRequestConfig,
  errorList: Map<string, string>,
): Promise<Response> => {
  try {
    const response: AxiosResponse<Response> = await axios.post(
      endpoint,
      payload,
      requestConfig,
    );

    return response.data;
  } catch (error: any) {
    const errorObject: AxiosError<ApiErrorResponse> = error;

    throw mapErrorResponse(
      (errorObject.response as AxiosResponse<ApiErrorResponse>).data,
      errorList,
    );
  }
};
