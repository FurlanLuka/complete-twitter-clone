import { useMutation } from '@tanstack/react-query';
import { login } from './login-api';

export const useLogin = () => useMutation(['login'], login);
