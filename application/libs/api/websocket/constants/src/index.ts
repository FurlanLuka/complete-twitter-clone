export const SERVICE_NAME = 'websocket_api';
export const SERVICE_QUEUE_NAME = `${SERVICE_NAME}_queue`;

export const WEBSOCKET_TOKEN_CACHE = 'WEBSOCKET_TOKEN_CACHE'
export const WEBSOCKET_TOKEN_CACHE_PREFIX = 'websocket_token_'

export enum WebsocketConstants {
  QUEUE_URL = 'QUEUE_URL',
  REDIS_URL = 'REDIS_URL',
  AUTH_AUDIENCE = 'AUTH_AUDIENCE',
  AUTH_ISSUER = 'AUTH_ISSUER',
  AUTH_SECRET = 'AUTH_SECRET',
}
