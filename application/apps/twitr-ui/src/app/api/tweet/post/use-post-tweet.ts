import { useMutation } from '@tanstack/react-query';
import { postTweet } from './post-tweet-api';

export const usePostTweet = () => useMutation(['tweet'], postTweet);
