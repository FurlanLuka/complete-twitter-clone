import { API_URL } from '../../../constants';
import { postRequest } from '../../helpers';

export const ERROR_LIST = new Map<string, string>([]);

export interface TokenResponse {
  exp: number;
  token: string;
  refreshToken: string;
}

export interface LoginPayload {
  handle: string;
  password: string;
}

export const register = async ({
  handle,
  password,
}: LoginPayload): Promise<TokenResponse> => {
  return postRequest<unknown, TokenResponse>(
    `${API_URL}/v1/user`,
    {
      handle,
      password,
    },
    {},
    ERROR_LIST
  );
};
