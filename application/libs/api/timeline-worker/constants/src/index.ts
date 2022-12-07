import { Event } from '@twitr/api/utils/queue/event';
import {
  RequestTimelineCommandPayload,
  TimelineResponse,
  UpdateTimelineCommandPayload,
} from '@twitr/api/timeline-worker/data-transfer-objects/types';

export const SERVICE_NAME = 'timeline_worker_api';
export const SERVICE_QUEUE_NAME = `${SERVICE_NAME}-queue`;

export const TIMELINE_CACHE = 'TIMELINE_CACHE';
export const TIMELINE_CACHE_PREFIX = 'timeline_';

export const PERSONAL_TIMELINE_CACHE = 'PERSONAL_TIMELINE_CACHE';
export const PERSONAL_TIMELINE_CACHE_PREFIX = 'personal_timeline_';

export const TWEET_CACHE = 'TWEET_CACHE';
export const TWEET_CACHE_PREFIX = 'tweet_';

export enum TimelineWorkerConstants {
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

export const UPDATE_TIMELINE_COMMAND = new Event<UpdateTimelineCommandPayload>(
  'update.timeline.command',
  1
);

export const REQUEST_TIMELINE_COMMAND =
  new Event<RequestTimelineCommandPayload>('get.timeline.command', 1);

export const TIMELINE_EVENT = new Event<TimelineResponse>(
  'get.timeline.response',
  1
);
