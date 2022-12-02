import { Event } from '@twitr/api/utils/queue';
import { TweetUpdatedPayload } from '@twitr/api/tweet/data-transfer-objects';

export const SERVICE_NAME = 'tweet_api';
export const SERVICE_QUEUE_NAME = `${SERVICE_NAME}_queue`;

export enum TweetConstants {
  QUEUE_URL = 'QUEUE_URL',
  REDIS_URL = 'REDIS_URL',
  TYPEORM_HOST = 'TYPEORM_HOST',
  TYPEORM_USERNAME = 'TYPEORM_USERNAME',
  TYPEORM_PASSWORD = 'TYPEORM_PASSWORD',
  TYPEORM_DATABASE = 'TYPEORM_DATABASE',
  TYPEORM_PORT = 'TYPEORM_PORT',
  AUTH_AUDIENCE = 'AUTH_AUDIENCE',
  AUTH_ISSUER = 'AUTH_ISSUER',
  AUTH_SECRET = 'AUTH_SECRET',
}

export const TWEET_UPDATED_TOPIC = new Event<TweetUpdatedPayload>(
  'tweet.updated',
  1
);

export const GET_TWEET_IDS_FOR_USER_IDS = 'get.tweet.ids.rpc';
