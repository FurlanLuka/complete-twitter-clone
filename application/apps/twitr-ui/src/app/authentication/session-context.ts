import * as React from 'react';

export enum SessionState {
  INITIALIZING,
  REFRESHING,
  AUTHENTICATED,
  NOT_AUTHENTICATED,
}

export interface TokenResponse {
  exp: number;
  token: string;
  refreshToken: string;
}

export interface SessionContextValues {
  getAccessToken: () => Promise<string>;
  setTokenData: (tokenResponse: TokenResponse) => void;
  setSessionState: (state: SessionState) => void;
  sessionState: SessionState;
  logout: () => void;
}

export const defaultSessionContextValue: SessionContextValues = {
  sessionState: undefined as any,
  getAccessToken: undefined as any,
  setSessionState: undefined as any,
  setTokenData: undefined as any,
  logout: undefined as any,
};

export const SessionContext: React.Context<SessionContextValues> =
  React.createContext<SessionContextValues>(defaultSessionContextValue);
