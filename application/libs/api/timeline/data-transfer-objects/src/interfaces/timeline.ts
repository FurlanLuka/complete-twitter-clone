import { TweetDto } from '@twitr/api/tweet/data-transfer-objects/types';

export interface UpdateTimelineCommandPayload {
  tweet: TweetDto;
  userIds: string[];
}

export interface UpdatePersonalTimelineCommandHandler {
  tweetId: string;
  userId: string;
}

export interface RequestTimelineCommandPayload {
  userId: string;
  page: string;
}

export interface TimelineResponse {
  tweets: TweetDto[];
  userId: string;
}

export interface GetTimelinePageResponse {
  pageName: string;
  tweets: TweetDto[];
}
