import { useExtendedMutation } from '../../helper-hooks';
import { postTweet } from './post-tweet-api';

export const usePostTweet = () => useExtendedMutation(['tweet'], postTweet);
