import { useState } from 'react';
import useAsyncEffect from 'use-async-effect';
import { SessionState } from '../../authentication/session-context';
import { useSession } from '../../authentication/use-session';
import { websocketInstance } from './websocket';

export const useWebsocket = () => {
  const { sessionState, getAccessToken } = useSession();
  const [isConnected, setIsConnected] = useState(false);

  useAsyncEffect(async () => {
    if (sessionState === SessionState.AUTHENTICATED) {
      const accessToken: string = await getAccessToken();

      console.log('');

      websocketInstance.connect(
        accessToken,
        () => console.log(''),
        () => console.log('')
      );
    }
  }, [sessionState]);

  return isConnected;
};
