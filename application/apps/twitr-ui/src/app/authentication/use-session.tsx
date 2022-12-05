import { useContext } from 'react';
import {
  SessionContext,
  SessionContextValues,
} from './session-context';

export type UseSessionResponse = SessionContextValues;

export const useSession = (): UseSessionResponse => {
  return useContext(SessionContext);
};
