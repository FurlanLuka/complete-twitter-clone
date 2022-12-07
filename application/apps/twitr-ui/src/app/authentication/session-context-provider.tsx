import { PropsWithChildren, useEffect, useState } from 'react';
import { postRequest } from '../api/helpers';
import { SessionContext, SessionState, TokenResponse } from './session-context';

interface SessionProviderProps {
  onLogout: () => void;
  apiUrl: string;
}

export const SessionContextProvider: React.FC<
  PropsWithChildren<SessionProviderProps>
> = (props: PropsWithChildren<SessionProviderProps>) => {
  const [sessionState, setSessionState] = useState(SessionState.INITIALIZING);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [tokenExpiry, setTokenExpiry] = useState<number | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  const refreshAccessToken = async (refToken: string) => {
    const apiResponse = await postRequest<unknown, TokenResponse>(
      `${props.apiUrl}/v1/user/token/refresh`,
      {
        refreshToken: refToken,
      },
      {},
      new Map()
    );

    return apiResponse;
  };

  const getAccessToken = async () => {
    if (tokenExpiry === null || accessToken === null || refreshToken === null) {
      logout();

      throw new Error('Logout');
    }

    const currentTime = Date.now();

    if (currentTime < tokenExpiry) {
      return accessToken;
    }

    try {
      const tokenResponse = await refreshAccessToken(refreshToken);

      setTokenData(tokenResponse);

      return tokenResponse.token;
    } catch {
      logout();

      throw new Error('Logout');
    }
  };

  const setTokenData = (tokenResponse: TokenResponse) => {
    window.localStorage.setItem('refreshToken', tokenResponse.refreshToken);

    setAccessToken(tokenResponse.token);
    setRefreshToken(tokenResponse.refreshToken);
    setTokenExpiry(tokenResponse.exp);
    setSessionState(SessionState.AUTHENTICATED);
  };

  const logout = () => {
    window.localStorage.removeItem('refreshToken');

    setSessionState(SessionState.NOT_AUTHENTICATED);
  };

  useEffect(() => {
    const refToken: string | null = window.localStorage.getItem('refreshToken');

    if (refToken) {
      refreshAccessToken(refToken)
        .then((tokenResponse) => {
          setTokenData(tokenResponse);
        })
        .catch(logout);
    } else {
      setSessionState(SessionState.NOT_AUTHENTICATED);
    }
  }, []);

  return (
    <SessionContext.Provider
      value={{
        getAccessToken,
        setTokenData,
        setSessionState,
        logout,
        sessionState,
      }}
    >
      {props.children}
    </SessionContext.Provider>
  );
};
