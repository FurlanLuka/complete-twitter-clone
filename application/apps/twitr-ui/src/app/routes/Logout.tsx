import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../authentication/use-session';

export const LogoutRoute: React.FC = () => {
  const { logout } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    logout();

    navigate('/login');
  }, []);

  return <></>;
};
