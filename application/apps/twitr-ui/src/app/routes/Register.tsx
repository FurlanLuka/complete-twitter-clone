import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegister } from '../api/user/register/use-register';
import { SessionState } from '../authentication/session-context';
import { useSession } from '../authentication/use-session';
import { RegistrationForm } from '../components/RegistrationForm';

export const RegisterRoute: React.FC = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const { setTokenData, sessionState } = useSession();
  const register = useRegister();

  const onRegisterClick = () => {
    register.mutate(
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

  const onLoginClick = () => {
    navigate('/login');
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
      <RegistrationForm
        onLoginClick={onLoginClick}
        onUsernameChange={onUsernameChange}
        onPasswordChange={onPasswordChange}
        onRegisterClick={onRegisterClick}
      />
    </>
  );
};
