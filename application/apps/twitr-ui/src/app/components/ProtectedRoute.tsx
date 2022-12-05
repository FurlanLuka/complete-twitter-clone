import { PropsWithChildren } from 'react';
import { Navigate } from 'react-router-dom';
import { SessionState } from '../authentication/session-context';
import { useSession } from '../authentication/use-session';

export const ProtectedRoute: React.FC<PropsWithChildren<unknown>> = ({
  children,
}) => {
  const { sessionState } = useSession();

  if (sessionState === SessionState.INITIALIZING) {
    return <>Loading</>;
  }

  if (sessionState === SessionState.NOT_AUTHENTICATED) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};
