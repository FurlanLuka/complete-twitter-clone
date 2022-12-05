import { useMutation } from '@tanstack/react-query';
import { register } from './register-api';

export const useRegister = () => useMutation(['register'], register);
