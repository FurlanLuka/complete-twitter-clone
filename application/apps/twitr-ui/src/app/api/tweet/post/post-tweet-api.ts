import { CreateTweetPayload } from '@twitr/api/tweet/data-transfer-objects/types';
import { API_URL } from '../../../constants';
import { postRequest } from '../../helpers';
import { ExtendedMutationPayload } from '../../interface';

export const ERROR_LIST = new Map<string, string>([]);

type Payload = ExtendedMutationPayload<CreateTweetPayload>;

export const postTweet = async ({
  accessToken,
  ...payload
}: Payload): Promise<void> => {
  return postRequest<CreateTweetPayload, void>(
    `${API_URL}/v1/tweet`,
    {
      ...payload,
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    ERROR_LIST
  );
};
