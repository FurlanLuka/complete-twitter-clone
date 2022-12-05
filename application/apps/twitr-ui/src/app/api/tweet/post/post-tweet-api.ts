import { CreateTweetPayload } from '@twitr/api/tweet/data-transfer-objects/types';
import { API_URL } from '../../../constants';
import { postRequest } from '../../helpers';

export const ERROR_LIST = new Map<string, string>([]);

export const postTweet = async (payload: CreateTweetPayload): Promise<void> => {
  return postRequest<CreateTweetPayload, void>(
    `${API_URL}/v1/tweet`,
    {
      ...payload,
    },
    {},
    ERROR_LIST
  );
};
