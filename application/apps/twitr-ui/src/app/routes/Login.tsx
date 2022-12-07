import { LoginForm } from '../components/LoginForm';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../authentication/use-session';
import { useLogin } from '../api/user/login/use-login';
import { SessionState } from '../authentication/session-context';

export const LoginRoute: React.FC = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const { setTokenData, sessionState } = useSession();
  const login = useLogin();

  const onLoginClick = () => {
    login.mutate(
      {
        handle: username,
        password,
      },
      {
        onSuccess(data) {
          setTokenData(data);
          navigate('/');
        },
      }
    );
  };

  const onRegisterClick = () => {
    navigate('/register');
  };

  const onUsernameChange = (username: string) => {
    setUsername(username);
  };

  const onPasswordChange = (password: string) => {
    setPassword(password);
  };

  useEffect(() => {
    if (sessionState === SessionState.AUTHENTICATED) {
      navigate('/');
    }
  }, [sessionState]);

  return (
    <>
      <LoginForm
        onLoginClick={onLoginClick}
        onUsernameChange={onUsernameChange}
        onPasswordChange={onPasswordChange}
        onRegisterClick={onRegisterClick}
      />
    </>
  );
};
